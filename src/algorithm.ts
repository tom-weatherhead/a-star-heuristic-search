// src/algorithm.ts

import { PriorityQueue, Set } from 'thaw-common-utilities.ts';

import { AStarStateBase, EvaluatedStateType, IAStarPriorityQueueRefresher } from './state-base';

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

export interface AStarAlgorithmOptions {
	useStringStates?: boolean;
}

export interface ISuccessorStateGenerator<T extends AStarStateBase> {
	stateValidityTest(state: T): void; // This will throw an exception if the given state is invalid.
	generateSuccessorStates(
		currentState: T,
		startState: T,
		goalState: T
	): Iterable<EvaluatedStateType<T>>; // TODO: If possible, do not pass the start state.
}

export interface IHeuristicSearchAlgorithm<T extends AStarStateBase> {
	search(startState: T, goalState: T): T | undefined;
	searchAndReport(startState: T, goalState: T): string[] | undefined;
	numStatesGenerated: number;
	numStatesExamined: number;
}

export class HeuristicSearchStateException extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class AStarAlgorithm<T extends AStarStateBase>
	implements IHeuristicSearchAlgorithm<T>, IAStarPriorityQueueRefresher
{
	private readonly openQueue = new PriorityQueue<T>(
		(item1: T, item2: T) => item1.compareTo(item2) > 0
	);
	private readonly openSet = new Set<T>(); // Used to speed up the refreshing of the Open Queue
	// private openSetStrings: string[] = [];
	private readonly openMap = new Map<string, T>();
	private readonly closedSet = new Set<T>();
	// private closedSetStrings: string[] = [];
	private readonly closedMap = new Map<string, T>();
	private readonly successorStateGenerator: ISuccessorStateGenerator<T>;

	constructor(
		successorStateGenerator: ISuccessorStateGenerator<T>,
		private readonly options: AStarAlgorithmOptions = {}
	) {
		this.successorStateGenerator = successorStateGenerator;
	}

	public refreshPriorityQueue(state: AStarStateBase): void {
		const castState = state as T;

		if (typeof castState !== 'undefined' && this.openSet.contains(castState)) {
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
		this.openSet.clear();
		// this.openSetStrings = [];
		this.openMap.clear();
		this.closedSet.clear();
		// this.closedSetStrings = [];
		this.closedMap.clear();

		this.openQueue.enqueue(startState);
		this.openSet.add(startState);

		if (this.options.useStringStates) {
			// insertStringIntoSortedList(startState.toString(), this.openSetStrings);
			this.openMap.set(startState.toString(), startState);
		}

		while (!this.openQueue.isEmpty()) {
			const currentState = this.openQueue.dequeue();

			// console.log(`currentState: ${currentState}`);

			this.openSet.remove(currentState);
			this.openMap.delete(currentState.toString());
			this.closedSet.add(currentState);

			if (this.options.useStringStates) {
				// insertStringIntoSortedList(currentState.toString(), this.closedSetStrings);
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
					this.openSet.add(newState);

					if (this.options.useStringStates) {
						// insertStringIntoSortedList(newState.toString(), this.openSetStrings);
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
			console.log(`${this.numStatesGenerated} state(s) generated and examined.`);

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
