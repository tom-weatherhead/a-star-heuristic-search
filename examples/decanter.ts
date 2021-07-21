// examples/decanter.ts

import { zeroPadNumber } from 'thaw-common-utilities.ts';

import { AStarStateBase, ISuccessorStateGenerator } from '..';

export class DecanterState extends AStarStateBase {
	public static create(v1: number, v2: number): DecanterState {
		return new DecanterState(v1, v2, undefined, '', 0, 0);
	}

	public readonly volume1: number;
	public readonly volume2: number;
	private readonly stateAsString: string;
	public _successors: AStarStateBase[] = [];

	constructor(
		v1: number,
		v2: number,
		previousState: DecanterState | undefined,
		newStep: string,
		nodeCost: number,
		// gParam: number,
		hParam: number
	) {
		super(previousState, newStep, nodeCost, hParam);

		this.volume1 = v1;
		this.volume2 = v2;
		this.stateAsString = `(1: ${zeroPadNumber(this.volume1, 3)}, 2: ${zeroPadNumber(
			this.volume2,
			3
		)})`;
	}

	public override toString(): string {
		return this.stateAsString;
	}

	public equals(other: unknown): boolean {
		const otherState = other as DecanterState;

		return (
			typeof otherState !== 'undefined' &&
			typeof otherState.volume1 === 'number' &&
			typeof otherState.volume2 === 'number' &&
			otherState.volume1 === this.volume1 &&
			otherState.volume2 === this.volume2
		);
	}

	public get successors(): AStarStateBase[] {
		return this._successors;
	}
}

export class DecanterSuccessorStateGenerator implements ISuccessorStateGenerator<DecanterState> {
	constructor(private readonly capacity1: number, private readonly capacity2: number) {}

	public stateValidityTest(state: DecanterState): void {
		if (state.volume1 < 0) {
			// HeuristicSearchStateException
			throw new Error('Volume 1 must not be less than zero.');
		} else if (state.volume1 > this.capacity1) {
			throw new Error('Volume 1 must not be greater than the capacity of container 1.');
		} else if (state.volume2 < 0) {
			throw new Error('Volume 2 must not be less than zero.');
		} else if (state.volume2 > this.capacity2) {
			throw new Error('Volume 2 must not be greater than the capacity of container 2.');
		}
	}

	public generateSuccessorStates(
		currentState: DecanterState,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		startState: DecanterState,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		goalState: DecanterState
	): DecanterState[] {
		const result: DecanterState[] = [];

		for (let i = 0; i < 6; i++) {
			let nVolume1 = currentState.volume1;
			let nVolume2 = currentState.volume2;
			let nTransfer = 0;
			let StepDescription = '';

			switch (i) {
				case 0: // Empty jug 1.
					nVolume1 = 0;
					StepDescription = 'Empty jug 1.';
					break;

				case 1: // Empty jug 2.
					nVolume2 = 0;
					StepDescription = 'Empty jug 2.';
					break;

				case 2: // Fill jug 1.
					nVolume1 = this.capacity1;
					StepDescription = 'Fill jug 1.';
					break;

				case 3: // Fill jug 2.
					nVolume2 = this.capacity2;
					StepDescription = 'Fill jug 2.';
					break;

				case 4: // Pour jug 1 into jug 2.
					nTransfer = Math.min(nVolume1, this.capacity2 - nVolume2);
					nVolume1 -= nTransfer;
					nVolume2 += nTransfer;
					StepDescription = 'Pour jug 1 into jug 2.';
					break;

				case 5: // Pour jug 2 into jug 1.
					nTransfer = Math.min(nVolume2, this.capacity1 - nVolume1);
					nVolume2 -= nTransfer;
					nVolume1 += nTransfer;
					StepDescription = 'Pour jug 2 into jug 1.';
					break;

				default:
					throw new Error('DecanterAlgorithm.GenerateSuccessorStates() : Internal error');
			}

			StepDescription = StepDescription + ` (${nVolume1}, ${nVolume2})`;

			const newState = new DecanterState(
				nVolume1,
				nVolume2,
				currentState,
				StepDescription,
				1, // currentState.g + 1,
				0 // The value for the heuristic h is always zero. (?!)
			);

			// result.push([newState, 1]);
			result.push(newState);
		}

		return result;
	}
}
