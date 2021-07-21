import { AStarStateBase } from '../state-base';

export interface IHeuristicSearchAlgorithm<T extends AStarStateBase<T>> {
	search(startState: T, goalState: T): T | undefined;
	searchAndReport(startState: T, goalState: T): string[] | undefined;
	numStatesGenerated: number;
	numStatesExamined: number;
}
