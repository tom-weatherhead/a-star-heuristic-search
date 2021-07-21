// src/algorithm.ts

import { PriorityQueue, Set } from 'thaw-common-utilities.ts';

import { AStarStateBase } from './state-base';

import { IAStarAlgorithmOptions } from './interfaces/ia-star-algorithm-options';

import { IHeuristicSearchAlgorithm } from './interfaces/iheuristic-search-algorithm';

import { ISuccessorStateGenerator } from './interfaces/isuccessor-state-generator';

export class AStarAlgorithm<T extends AStarStateBase<T>> implements IHeuristicSearchAlgorithm<T> {
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
	) {}

	private refreshPriorityQueue(state: T): void {
		if (
			this.options.useStringStates
				? this.openMap.has(state.toString())
				: this.openQueue.contains(state)
		) {
			this.openQueue.findAndUpHeap(state, (state1: T, state2: T) => state1.equals(state2));
		}

		// TODO: (if this.options.useStringStates)

		// const stateAsString = state.toString();

		// this.openQueue.findAndUpHeap((state2: T) => state2.toString() === stateAsString);
	}

	private findStateInList(state: T, isOpenList: boolean): T | undefined {
		const iterable = isOpenList ? this.openQueue : this.closedSet;
		const map = isOpenList ? this.openMap : this.closedMap;

		if (this.options.useStringStates) {
			return map.get(state.toString());
		}

		return this.findState(iterable, state);
	}

	private propagateImprovedCosts(
		state: T,
		prospectiveParent: T,
		costFromProspectiveParent: number,
		refreshPriorityQueue: boolean
	): void {
		const gProspective = prospectiveParent.g + costFromProspectiveParent;

		// Return if the prospective cost is not better (i.e. is not lower).

		if (gProspective >= state.g) {
			return;
		}

		state.parent = prospectiveParent;
		state.g = gProspective;
		state.f = state.g + state.h;

		if (refreshPriorityQueue) {
			this.refreshPriorityQueue(state);
		}

		for (const successor of state.successors) {
			this.propagateImprovedCosts(successor, state, successor.nodeCost, refreshPriorityQueue);
		}
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

			const possibleSuccessors = this.successorStateGenerator.generateSuccessorStates(
				currentState,
				// startState,
				goalState
			);

			for (const newState of possibleSuccessors) {
				const newStateInOpenList = this.findStateInList(newState, true);

				if (typeof newStateInOpenList !== 'undefined') {
					currentState.successors.push(newStateInOpenList);
					this.propagateImprovedCosts(
						newStateInOpenList,
						currentState,
						newStateInOpenList.nodeCost,
						true
					);

					continue;
				}

				const newStateInClosedList = this.findStateInList(newState, false);

				if (typeof newStateInClosedList !== 'undefined') {
					currentState.successors.push(newStateInClosedList);
					this.propagateImprovedCosts(
						newStateInClosedList,
						currentState,
						newStateInClosedList.nodeCost,
						true
					);
				} else {
					this.propagateImprovedCosts(newState, currentState, newState.nodeCost, false);
					this.openQueue.enqueue(newState);
					// this.openSet.add(newState);

					if (this.options.useStringStates) {
						this.openMap.set(newState.toString(), newState);
					}

					currentState.successors.push(newState);
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
