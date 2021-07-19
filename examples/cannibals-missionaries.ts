// The cannibals and missionaries problem.
// The goal is to transfer all of the cannibals and missionaries across a river, from west to east, using a two-person canoe.

// If, at any time, on either side of the river there is at least one missionary and the cannibals outnumber the missionaries,
// Then the cannibals eat the missionaries, and the state is invalid.

import { AStarStateBase, EvaluatedStateType, ISuccessorStateGenerator } from '..';

export class CanMissState extends AStarStateBase {
	public static create(
		canoeWest: boolean,
		cw: number,
		mw: number,
		ce: number,
		me: number
	): CanMissState {
		return new CanMissState(canoeWest, cw, mw, ce, me, undefined, '', 0, 0);
	}

	public static calculateStartState(c: number, m: number): CanMissState {
		return CanMissState.create(true, c, m, 0, 0);
	}

	public readonly canoeIsOnWestSide: boolean;
	public readonly numCannibalsOnWestSide: number;
	public readonly numMissionariesOnWestSide: number;
	public readonly numCannibalsOnEastSide: number;
	public readonly numMissionariesOnEastSide: number;
	private readonly stateAsString: string;
	public _successors: EvaluatedStateType<AStarStateBase>[] = [];

	constructor(
		canoeWest: boolean,
		cw: number,
		mw: number,
		ce: number,
		me: number,
		previousState: CanMissState,
		newStep: string,
		gParam: number,
		hParam: number
	) {
		super(previousState, newStep, gParam, hParam);
		this.canoeIsOnWestSide = canoeWest;
		this.numCannibalsOnWestSide = cw;
		this.numMissionariesOnWestSide = mw;
		this.numCannibalsOnEastSide = ce;
		this.numMissionariesOnEastSide = me;
		this.stateAsString = `${canoeWest},${cw},${mw},${ce},${me}`;
	}

	public isValid(): boolean {
		if (
			this.numCannibalsOnWestSide < 0 ||
			this.numMissionariesOnWestSide < 0 ||
			this.numCannibalsOnEastSide < 0 ||
			this.numMissionariesOnEastSide < 0
		) {
			return false;
		}

		if (
			this.numMissionariesOnWestSide > 0 &&
			this.numCannibalsOnWestSide > this.numMissionariesOnWestSide
		) {
			return false;
		}

		if (
			this.numMissionariesOnEastSide > 0 &&
			this.numCannibalsOnEastSide > this.numMissionariesOnEastSide
		) {
			return false;
		}

		return true;
	}

	public override toString(): string {
		return this.stateAsString;
	}

	public equals(other: unknown): boolean {
		const otherState = other as CanMissState;

		return (
			typeof otherState !== 'undefined' &&
			this.canoeIsOnWestSide === otherState.canoeIsOnWestSide &&
			this.numCannibalsOnWestSide === otherState.numCannibalsOnWestSide &&
			this.numMissionariesOnWestSide === otherState.numMissionariesOnWestSide &&
			this.numCannibalsOnEastSide === otherState.numCannibalsOnEastSide &&
			this.numMissionariesOnEastSide === otherState.numMissionariesOnEastSide
		);
	}

	public calculateGoalState(): CanMissState {
		// The goal is to get everyone to the east side of the river.
		return CanMissState.create(
			false,
			0,
			0,
			this.numCannibalsOnWestSide + this.numCannibalsOnEastSide,
			this.numMissionariesOnWestSide + this.numMissionariesOnEastSide
		);
	}

	public get successors(): EvaluatedStateType<AStarStateBase>[] {
		return this._successors;
	}
}

export class CanMissSuccessorStateGenerator implements ISuccessorStateGenerator<CanMissState> {
	public stateValidityTest(state: CanMissState): void {
		// if (state == null || !state.IsValid()) {
		if (!state.isValid()) {
			// HeuristicSearchStateException
			throw new Error('The state is invalid.');
		}
	}

	public generateSuccessorStates(
		currentState: CanMissState,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		startState: CanMissState,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		goalState: CanMissState
	): Iterable<EvaluatedStateType<CanMissState>> {
		const result: EvaluatedStateType<CanMissState>[] = [];

		for (let i = 0; i < 5; ++i) {
			const numCannibalsOnSide = currentState.canoeIsOnWestSide
				? currentState.numCannibalsOnWestSide
				: currentState.numCannibalsOnEastSide;
			const numMissionariesOnSide = currentState.canoeIsOnWestSide
				? currentState.numMissionariesOnWestSide
				: currentState.numMissionariesOnEastSide;
			let numCannibalsInCanoe = 0;
			let numMissionariesInCanoe = 0;
			const srcSide = currentState.canoeIsOnWestSide ? 'West' : 'East';
			const dstSide = currentState.canoeIsOnWestSide ? 'East' : 'West';
			const newStepSuffix = ` from ${srcSide} to ${dstSide}.`;
			let newStep = '';

			console.log(`generateSuccessorStates() : currentState is ${currentState}`);

			switch (i) {
				case 0: // The canoe contains one cannibal.
					if (numCannibalsOnSide >= 1) {
						numCannibalsInCanoe = 1;
						newStep = 'One cannibal travels' + newStepSuffix;
					}

					break;

				case 1: // The canoe contains one missionary.
					if (numMissionariesOnSide >= 1) {
						numMissionariesInCanoe = 1;
						newStep = 'One missionary travels' + newStepSuffix;
					}

					break;

				case 2: // The canoe contains two cannibals.
					if (numCannibalsOnSide >= 2) {
						numCannibalsInCanoe = 2;
						newStep = 'Two cannibals travel' + newStepSuffix;
					}

					break;

				case 3: // The canoe contains two missionaries.
					if (numMissionariesOnSide >= 2) {
						numMissionariesInCanoe = 2;
						newStep = 'Two missionaries travel' + newStepSuffix;
					}

					break;

				case 4: // The canoe contains one cannibal and one missionary.
					if (numCannibalsOnSide >= 1 && numMissionariesOnSide >= 1) {
						numCannibalsInCanoe = 1;
						numMissionariesInCanoe = 1;
						newStep = 'One cannibal and one missionary travel' + newStepSuffix;
					}

					break;

				default:
					throw new Error('CanMissAlgorithm.GenerateSuccessorStates() : Internal error');
			}

			if (!newStep) {
				continue;
			}

			let isCOnW: string;
			let new_cw: number;
			let new_mw: number;
			let new_ce: number;
			let new_me: number;

			if (currentState.canoeIsOnWestSide) {
				isCOnW = 'E';
				new_cw = currentState.numCannibalsOnWestSide - numCannibalsInCanoe;
				new_mw = currentState.numMissionariesOnWestSide - numMissionariesInCanoe;
				new_ce = currentState.numCannibalsOnEastSide + numCannibalsInCanoe;
				new_me = currentState.numMissionariesOnEastSide + numMissionariesInCanoe;
			} else {
				isCOnW = 'W';
				new_cw = currentState.numCannibalsOnWestSide + numCannibalsInCanoe;
				new_mw = currentState.numMissionariesOnWestSide + numMissionariesInCanoe;
				new_ce = currentState.numCannibalsOnEastSide - numCannibalsInCanoe;
				new_me = currentState.numMissionariesOnEastSide - numMissionariesInCanoe;
			}

			newStep =
				newStep + ` (Canoe ${isCOnW}; W ${new_cw}, ${new_mw}; E ${new_ce}, ${new_me})`;

			const newState = new CanMissState(
				!currentState.canoeIsOnWestSide,
				new_cw,
				new_mw,
				new_ce,
				new_me,
				currentState,
				newStep,
				currentState.g + 1,
				new_cw + new_mw // h is the number of people on the west side of the river.
			);

			if (newState.isValid()) {
				result.push([newState, 1]);
				console.log(`+++ Valid new state: ${newState}`);
				console.log(newStep);
				console.log('newState has canoe on west side:', newState.canoeIsOnWestSide);
			} else {
				console.log(`--- Invalid new state: ${newState}`);
			}
		}

		return result;
	}
}
