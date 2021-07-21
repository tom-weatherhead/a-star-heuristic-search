import { AStarStateBase } from '../state-base';

export interface ISuccessorStateGenerator<T extends AStarStateBase<T>> {
	stateValidityTest(state: T): void; // This will throw an exception if the given state is invalid.
	// generateSuccessorStates(currentState: T, startState: T, goalState: T): Iterable<T>; // TODO: If possible, do not pass the start state.
	generateSuccessorStates(currentState: T, goalState: T): Iterable<T>;
}
