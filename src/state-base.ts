// src/state-base.ts

import { IComparable, IEqualityComparable } from 'thaw-common-utilities.ts';

// T is the type of the problem domain's state information.

// EvaluatedStateType replaces C#'s KeyValuePair<AStarStateBase, int>
// The number in the following line is the cost of going from the current state to the corresponding successor state.
// export type EvaluatedStateType<T extends AStarStateBase> = [T, number];

export interface IAStarPriorityQueueRefresher<T extends AStarStateBase<T>> {
	refreshPriorityQueue(state: T): void;
	// Or: refreshPriorityQueue(state: IAStarState): void;
}

// export interface IAStarState extends IComparable<IAStarState>, IEqualityComparable {
// 	successors: EvaluatedStateType<IAStarState>[]; // get
// 	traverseAndOptimizeCosts(
// 		prospectiveParent: IAStarState,
// 		costFromProspectiveParent: number,
// 		refresher: IAStarPriorityQueueRefresher | undefined
// 	): void;
// 	addSolutionStep(solutionSteps: string[]): void;
// 	compileSolution(): string[];
// 	printSolution(): void;
// 	...
// }

// Or: export abstract class AStarStateBase<T extends AStarStateBase> implements IComparable<AStarStateBase>, IEqualityComparable {
// Or: export abstract class AStarStateBase<T extends IAStarState> implements IComparable<AStarStateBase>, IEqualityComparable {
// where T is the concrete statae type (e.g. DecanterState)
// export abstract class AStarStateBase implements IComparable<AStarStateBase>, IEqualityComparable {
export abstract class AStarStateBase<T extends AStarStateBase<T>>
	implements IComparable<T>, IEqualityComparable
{
	// public parent: AStarStateBase | undefined;
	// public readonly solutionStep: string;
	// public readonly nodeCost: number; // The cost of going from the parent state to this state.
	public f: number; // g + h
	public g: number; // The actual cost to go from the start state to this state.
	// public readonly h: number; // The estimated cost to go from this state to the goal state.

	constructor(
		public parent: T | undefined,
		public readonly solutionStep: string,
		public readonly nodeCost: number,
		// public g: number,
		public readonly h: number
	) {
		// this.parent = previousState;
		// this.solutionStep = newStep;
		// this.g = gParam;
		this.g = this.nodeCost + (typeof parent !== 'undefined' ? parent.g : 0);
		// this.h = hParam;
		this.f = this.g + this.h;
	}

	public toString(): string {
		return '';
	}

	public abstract equals(other: unknown): boolean;

	public abstract get successors(): T[];

	public compareTo(otherState: T): number {
		return otherState.f - this.f; // The state with the smaller f has the higher priority.
	}

	public addSolutionStep(solutionSteps: string[]): void {
		if (typeof this.parent !== 'undefined') {
			this.parent.addSolutionStep(solutionSteps);
		}

		if (this.solutionStep) {
			solutionSteps.push(this.solutionStep);
		}
	}

	public compileSolution(): string[] {
		const solution: string[] = [];

		this.addSolutionStep(solution);

		return solution;
	}

	public printSolution(): void {
		console.log('Solution steps:');

		for (const step of this.compileSolution()) {
			console.log('  ' + step);
		}
	}
}
