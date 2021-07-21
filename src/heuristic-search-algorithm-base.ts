// src/heuristic-search-algorithm-base.ts

// import { Set } from 'thaw-common-utilities.ts';

// import { AStarStateBase, EvaluatedStateType } from './state-base';

// export enum HeuristicSearchAlgorithmType {
// 	AStar,
// 	IterativeDeepeningAStar
// }

// export interface ISuccessorStateGenerator<T extends AStarStateBase> {
// 	stateValidityTest(state: T): void; // This will throw an exception if the given state is invalid.
// 	generateSuccessorStates(
// 		currentState: T,
// 		startState: T,
// 		goalState: T
// 	): Iterable<EvaluatedStateType<T>>; // TODO: If possible, do not pass the start state.
// }

// export interface IHeuristicSearchAlgorithm<T extends AStarStateBase> {
// 	search(startState: T, goalState: T): T | undefined;
// 	searchAndReport(startState: T, goalState: T): string[] | undefined;
// 	numStatesGenerated: number;
// 	numStatesExamined: number;
// }

// export class HeuristicSearchStateException extends Error {
// 	constructor(message: string) {
// 		super(message);
// 	}
// }

// export abstract class HeuristicSearchAlgorithmBase<T extends AStarStateBase>
// 	implements IHeuristicSearchAlgorithm<T>
// {
// 	protected findState(collection: Iterable<T>, state: T): T | undefined {
// 		return Array.from(collection).find((stateInCollection: T) =>
// 			stateInCollection.equals(state)
// 		);
// 	}

// 	public abstract search(startState: T, goalState: T): T | undefined;

// 	// TODO: We could make OpenListCount and ClosedListCount public, so that they can be used for measuring algorithm efficiency.
// 	//protected abstract int OpenListCount { get; }

// 	public report(solutionState: T | undefined): string[] | undefined {
// 		if (typeof solutionState === 'undefined') {
// 			console.log('No solution found.');
// 			console.log(`${this.numStatesGenerated} state(s) generated and examined.`);

// 			return undefined;
// 		}

// 		solutionState.printSolution();
// 		console.log(
// 			`${this.numStatesGenerated} state(s) generated; ${this.numStatesExamined} state(s) examined.`
// 		);

// 		return solutionState.compileSolution();
// 	}

// 	public searchAndReport(startState: T, goalState: T): string[] | undefined {
// 		return this.report(this.search(startState, goalState));
// 	}

// 	public abstract get numStatesGenerated(): number;
// 	public abstract get numStatesExamined(): number;
// }

// export class HeuristicSearchAlgorithmFactory {
// 	public static Create<T extends AStarStateBase>(algorithmType: HeuristicSearchAlgorithmType, successorStateGenerator: ISuccessorStateGenerator<T>): IHeuristicSearchAlgorithm<T> {

// 		switch (algorithmType) {
// 			case HeuristicSearchAlgorithmType.AStar:
// 				return new AStarAlgorithm<T>(successorStateGenerator);

// 			case HeuristicSearchAlgorithmType.IterativeDeepeningAStar:
// 				return new IDAStarAlgorithm<T>(successorStateGenerator);

// 			default:
// 				throw new Error('Invalid algorithm type');
// 		}
// 	}
// }
