import { AStarStateBase, EvaluatedStateType } from '../state-base';

export interface ISuccessorStateGenerator<T extends AStarStateBase> {
	stateValidityTest(state: T): void; // This will throw an exception if the given state is invalid.
	generateSuccessorStates(
		currentState: T,
		startState: T,
		goalState: T
	): Iterable<EvaluatedStateType<T>>; // TODO: If possible, do not pass the start state.
}
