// src/state-base.ts

import { IComparable, IEqualityComparable } from 'thaw-common-utilities.ts';

// T is the type of the problem domain's state information.

// export interface IAStarState extends IComparable<IAStarState>, IEqualityComparable {
// 	successors: IAStarState[]; // get
// 	addSolutionStep(solutionSteps: string[]): void;
// 	compileSolution(): string[];
// 	printSolution(): void;
// 	...
// }

export abstract class AStarStateBase<T extends AStarStateBase<T>>
	implements IComparable<T>, IEqualityComparable
{
	public f: number; // g + h
	public g: number; // The actual cost to go from the start state to this state.

	constructor(
		public parent: T | undefined,
		public readonly solutionStep: string,
		public readonly nodeCost: number,
		public readonly h: number
	) {
		this.g = this.nodeCost + (typeof parent !== 'undefined' ? parent.g : 0);
		this.f = this.g + this.h;
	}

	public toString(): string {
		// Or public abstract toString(): string; ?
		return '';
	}

	public abstract equals(other: unknown): boolean;

	public abstract get successors(): T[];

	public compareTo(otherState: T): number {
		return otherState.f - this.f; // The state with the smaller f has the higher priority.
	}

	// TODO: Replace ISuccessorStateGenerator with these two methods:

	// public abstract isValid(): boolean;

	// public abstract generateSuccessorStates(goalState: T): Iterable<T>;

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
