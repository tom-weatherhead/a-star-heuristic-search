// src/algorithm.ts

import { PriorityQueue, Set } from 'thaw-common-utilities.ts';

import { AStarStateBase, IAStarPriorityQueueRefresher } from './state-base';

import { IAStarAlgorithmOptions } from './interfaces/ia-star-algorithm-options';

import { IHeuristicSearchAlgorithm } from './interfaces/iheuristic-search-algorithm';

import { ISuccessorStateGenerator } from './interfaces/isuccessor-state-generator';

// export function findIndexOfStringInSortedList(str: string, sortedList: string[]): number {
// 	// Find i such that sortedList[j] < str for all 0 <= j < i
// 	// and (i === sortedList.length || str <= sortedList[i])
// 	let low = 0;
// 	let high = sortedList.length;
// 	let count = 0;

// 	while (low < high) {
// 		const mid = Math.floor((low + high) / 2);

// 		if (sortedList[mid] < str) {
// 			low = mid + 1;
// 		} else {
// 			high = mid;
// 		}

// 		if (++count > 100) {
// 			return NaN;
// 		}
// 	}

// 	return high;
// }

// export function insertStringIntoSortedList(str: string, sortedList: string[]): void {
// 	const i = findIndexOfStringInSortedList(str, sortedList);

// 	sortedList.splice(i, 0, str);
// }

// export function sortedListContainsString(sortedList: string[], str: string): boolean {
// 	const i = findIndexOfStringInSortedList(str, sortedList);

// 	return i < sortedList.length && sortedList[i] === str;
// }

export class AStarAlgorithm<T extends AStarStateBase>
	implements IHeuristicSearchAlgorithm<T>, IAStarPriorityQueueRefresher
{
	private readonly openQueue = new PriorityQueue<T>(
		(item1: T, item2: T) => item1.compareTo(item2) > 0
	);
	// private readonly openSet = new Set<T>(); // Used to speed up the refreshing of the Open Queue
	private readonly openMap = new Map<string, T>();
	private readonly closedSet = new Set<T>();
	private readonly closedMap = new Map<string, T>();

	constructor(
		private readonly successorStateGenerator: ISuccessorStateGenerator<T>,
		private readonly options: IAStarAlgorithmOptions = {}
	) {
		// this.successorStateGenerator = successorStateGenerator;
	}

	public refreshPriorityQueue(state: AStarStateBase): void {
		const castState = state as T;

		// if (typeof castState !== 'undefined' && this.openSet.contains(castState)) {
		// if (typeof castState !== 'undefined' && this.openQueue.contains(castState)) {
		if (typeof castState === 'undefined') {
			return;
		}

		if (
			this.options.useStringStates
				? this.openMap.has(castState.toString())
				: this.openQueue.contains(castState)
		) {
			this.openQueue.findAndUpHeap(castState, (state1: T, state2: T) =>
				state1.equals(state2)
			);
		}
	}

	private findStateInList(state: T, isOpenList: boolean): T | undefined {
		const iterable = isOpenList ? this.openQueue : this.closedSet;
		const map = isOpenList ? this.openMap : this.closedMap;

		if (this.options.useStringStates) {
			return map.get(state.toString());
		}

		return this.findState(iterable, state);
	}

	public search(startState: T, goalState: T): T | undefined {
		this.successorStateGenerator.stateValidityTest(startState);
		this.successorStateGenerator.stateValidityTest(goalState);

		this.openQueue.clear();
		// this.openSet.clear();
		this.openMap.clear();
		this.closedSet.clear();
		this.closedMap.clear();

		this.openQueue.enqueue(startState);
		// this.openSet.add(startState);

		if (this.options.useStringStates) {
			this.openMap.set(startState.toString(), startState);
		}

		while (!this.openQueue.isEmpty()) {
			const currentState = this.openQueue.dequeue();

			// console.log(`currentState: ${currentState}`);

			// this.openSet.remove(currentState);
			this.openMap.delete(currentState.toString());
			this.closedSet.add(currentState);

			if (this.options.useStringStates) {
				this.closedMap.set(currentState.toString(), currentState);
			}

			if (currentState.equals(goalState)) {
				return currentState;
			}

			const possibleSuccessorStateData = this.successorStateGenerator.generateSuccessorStates(
				currentState,
				startState,
				goalState
			);

			for (const [newState, newStateCost] of possibleSuccessorStateData) {
				const newStateInOpenList = this.findStateInList(newState, true);

				if (typeof newStateInOpenList !== 'undefined') {
					currentState.successors.push([newStateInOpenList, newStateCost]);
					newStateInOpenList.traverseAndOptimizeCosts(currentState, newStateCost, this);

					continue;
				}

				const newStateInClosedList = this.findStateInList(newState, false);

				if (typeof newStateInClosedList !== 'undefined') {
					currentState.successors.push([newStateInClosedList, newStateCost]);
					newStateInClosedList.traverseAndOptimizeCosts(currentState, newStateCost, this);
				} else {
					newState.traverseAndOptimizeCosts(currentState, newStateCost, undefined);
					this.openQueue.enqueue(newState);
					// this.openSet.add(newState);

					if (this.options.useStringStates) {
						this.openMap.set(newState.toString(), newState);
					}

					currentState.successors.push([newState, newStateCost]);
				}
				// #else
				// if (!openQueue.Contains(state) && !closedSet.Contains(state)) {
				// 	openQueue.Enqueue(state);
				// }
				// #endif
			}
		}

		return undefined;
	}

	public get numStatesGenerated(): number {
		return this.openQueue.size + this.numStatesExamined;
	}

	public get numStatesExamined(): number {
		return this.closedSet.size;
	}

	private findState(collection: Iterable<T>, state: T): T | undefined {
		return Array.from(collection).find((stateInCollection: T) =>
			stateInCollection.equals(state)
		);
	}

	public report(solutionState: T | undefined): string[] | undefined {
		if (typeof solutionState === 'undefined') {
			console.log('No solution found.');
			console.log(
				`${this.numStatesGenerated} state(s) generated; ${this.numStatesExamined} state(s) examined.`
			);

			return undefined;
		}

		solutionState.printSolution();
		console.log(
			`${this.numStatesGenerated} state(s) generated; ${this.numStatesExamined} state(s) examined.`
		);

		return solutionState.compileSolution();
	}

	public searchAndReport(startState: T, goalState: T): string[] | undefined {
		return this.report(this.search(startState, goalState));
	}
}
