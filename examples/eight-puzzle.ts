// examples/eight-puzzle.ts

import { generateRange, shuffle } from 'thaw-common-utilities.ts';

import { AStarStateBase, ISuccessorStateGenerator } from '..';

const puzzleWidth = 3;
const puzzleHeight = 3;
const puzzleSize = puzzleWidth * puzzleHeight;

// #define MANHATTAN // This actually finds more expensive solutions for Test2 and Test2_ID.

// #if MANHATTAN
const manA = [0, 0, 1, 2, 3, 4, 3, 2, 1];
const manB = [0, 1, 0, 1, 2, 3, 2, 3, 2];
const manC = [0, 2, 1, 0, 1, 2, 3, 4, 3];
const manD = [0, 1, 2, 3, 2, 3, 2, 1, 0];
const manE = [0, 2, 1, 2, 1, 2, 1, 2, 1];
const manF = [0, 3, 2, 1, 0, 1, 2, 3, 2];
const manG = [0, 2, 3, 4, 3, 2, 1, 0, 1];
const manH = [0, 3, 2, 3, 2, 1, 0, 1, 2];
const manI = [0, 4, 3, 2, 1, 0, 1, 2, 3];
const man = [manA, manB, manC, manD, manE, manF, manG, manH, manI];
const nextInCycle = [1, 2, 5, 0, 4, 8, 3, 6, 7];
// #endif

// TODO: Maintain sorted open and closed lists of stringified states;
// search them via binary search, if the < operator can compare strings.
// This should make it much faster to search for newly created states in
// the open and closed lists.

export class EightPuzzleState extends AStarStateBase<EightPuzzleState> {
	public static create(t: number[]): EightPuzzleState {
		return new EightPuzzleState(t, undefined, '', 0, 0);
	}

	public static createRandom(): EightPuzzleState {
		return EightPuzzleState.create(shuffle(generateRange(0, 8)));
	}

	public static createGoal(): EightPuzzleState {
		return EightPuzzleState.create([1, 2, 3, 8, 0, 4, 7, 6, 5]);
	}

	public readonly tiles: number[];
	public readonly tilesString: string;
	public _successors: AStarStateBase[] = [];

	constructor(
		t: number[],
		previousState: EightPuzzleState,
		newStep: string,
		nodeCost: number,
		// gParam: number,
		hParam: number
	) {
		super(previousState, newStep, nodeCost, hParam);

		if (typeof t === 'undefined') {
			throw new Error('EightPuzzleState constructor: t is undefined.');
		} else if (t.length !== puzzleSize) {
			throw new Error(`EightPuzzleState constructor: t.length is ${t.length} rather than 9.`);
		}

		for (let i = 0; i < puzzleSize; ++i) {
			if (!t.includes(i)) {
				throw new Error(`EightPuzzleState constructor: t does not contain ${i}.`);
			}
		}

		this.tiles = t; // We will consider this List to be immutable after this point.
		this.tilesString = this.tiles.join('');
	}

	public override toString(): string {
		return this.tilesString;
	}

	public equals(other: unknown): boolean {
		const otherState = other as EightPuzzleState;

		return (
			typeof otherState !== 'undefined' &&
			typeof otherState.tiles !== 'undefined' &&
			otherState.tiles instanceof Array &&
			otherState.tiles.length === this.tiles.length &&
			otherState.tiles.every((tile: number, i: number) => tile === this.tiles[i])
		);
	}

	public get successors(): AStarStateBase[] {
		return this._successors;
	}
}

export class EightPuzzleSuccessorStateGenerator
	implements ISuccessorStateGenerator<EightPuzzleState>
{
	constructor(private readonly options: { useManhattanDistances?: boolean } = {}) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public stateValidityTest(state: EightPuzzleState): void {
		// The state validity checks are in the EightPuzzleState constructor.
	}

	// #if MANHATTAN
	// See http://www.csupomona.edu/~jrfisher/www/prolog_tutorial/5_2.html
	// See http://www.improvedoutcomes.com/docs/WebSiteDocs/Clustering/Clustering_Parameters/Manhattan_Distance_Metric.htm

	private manhattanDistanceHeuristic(tiles: number[]): number {
		let sum = 0;

		for (let i = 0; i < puzzleSize; ++i) {
			sum += man[i][tiles[i]];
		}

		return sum;
	}

	private outOfCycleHeuristic(tiles: number[]): number {
		let sum = 0;

		for (let i = 0; i < puzzleSize; ++i) {
			if (i === 4) {
				continue;
			}

			const tile = tiles[i];
			const nextTileInCycle = tiles[nextInCycle[i]];

			if (
				!(tile > 0 && nextTileInCycle === tile + 1) ||
				!(tile === puzzleSize - 1 && nextTileInCycle === 1)
			) {
				sum += 2;
			}
		}

		if (tiles[4] !== 0) {
			++sum;
		}

		return sum;
	}
	// #endif

	public generateSuccessorStates(
		currentState: EightPuzzleState,
		// startState: EightPuzzleState,
		goalState: EightPuzzleState
	): EightPuzzleState[] {
		const result: EightPuzzleState[] = [];

		// Calculate the row and column of the zero tile.
		const indexOfZero = currentState.tiles.indexOf(0);

		if (indexOfZero < 0 || indexOfZero >= puzzleSize) {
			throw new Error(
				`EightPuzzleSuccessorStateGenerator.GenerateSuccessorStates() : indexOfZero is ${indexOfZero}.`
			);
		}

		const rowOfZero = Math.floor(indexOfZero / 3);
		const columnOfZero = indexOfZero - rowOfZero * 3;

		for (let i = 0; i < 8; ++i) {
			const newTiles = currentState.tiles.slice(0);
			let newStep: string | undefined;
			let cost = 0;

			switch (i) {
				case 0: // Try to slide one tile up.
					if (rowOfZero < 2) {
						newTiles[indexOfZero] = newTiles[indexOfZero + 3];
						newTiles[indexOfZero + 3] = 0;
						newStep = 'Slide one tile up.';
						cost = 1;
					}

					break;

				case 1: // Try to slide two tiles up.
					if (rowOfZero == 0) {
						newTiles[indexOfZero] = newTiles[indexOfZero + 3];
						newTiles[indexOfZero + 3] = newTiles[indexOfZero + 6];
						newTiles[indexOfZero + 6] = 0;
						newStep = 'Slide two tiles up.';
						cost = 2;
					}

					break;

				case 2: // Try to slide one tile down.
					if (rowOfZero > 0) {
						newTiles[indexOfZero] = newTiles[indexOfZero - 3];
						newTiles[indexOfZero - 3] = 0;
						newStep = 'Slide one tile down.';
						cost = 1;
					}

					break;

				case 3: // Try to slide two tiles down.
					if (rowOfZero == 2) {
						newTiles[indexOfZero] = newTiles[indexOfZero - 3];
						newTiles[indexOfZero - 3] = newTiles[indexOfZero - 6];
						newTiles[indexOfZero - 6] = 0;
						newStep = 'Slide two tiles down.';
						cost = 2;
					}

					break;

				case 4: // Try to slide one tile to the left.
					if (columnOfZero < 2) {
						newTiles[indexOfZero] = newTiles[indexOfZero + 1];
						newTiles[indexOfZero + 1] = 0;
						newStep = 'Slide one tile to the left.';
						cost = 1;
					}

					break;

				case 5: // Try to slide two tiles to the left.
					if (columnOfZero == 0) {
						newTiles[indexOfZero] = newTiles[indexOfZero + 1];
						newTiles[indexOfZero + 1] = newTiles[indexOfZero + 2];
						newTiles[indexOfZero + 2] = 0;
						newStep = 'Slide two tiles to the left.';
						cost = 2;
					}

					break;

				case 6: // Try to slide one tile to the right.
					if (columnOfZero > 0) {
						newTiles[indexOfZero] = newTiles[indexOfZero - 1];
						newTiles[indexOfZero - 1] = 0;
						newStep = 'Slide one tile to the right.';
						cost = 1;
					}

					break;

				case 7: // Try to slide two tiles to the right.
					if (columnOfZero == 2) {
						newTiles[indexOfZero] = newTiles[indexOfZero - 1];
						newTiles[indexOfZero - 1] = newTiles[indexOfZero - 2];
						newTiles[indexOfZero - 2] = 0;
						newStep = 'Slide two tiles to the right.';
						cost = 2;
					}

					break;

				default:
					break;
			}

			if (typeof newStep === 'undefined') {
				continue;
			}

			newStep = `${newStep} (${newTiles.join(', ')})`;

			let h = 0;

			// #if MANHATTAN
			if (this.options.useManhattanDistances) {
				// Cost multiplier      Steps in sol'n to Test2     Steps in sol'n to Test2_ID
				// 1                    19 (best is 16)             29 (best is 16)
				// 2                    20                          19
				// 3                    16 (matches best sol'n)     16 (matches best sol'n)
				// 4                    16 (matches best sol'n)     16 (matches best sol'n)
				// 5                    16 (matches best sol'n)     16 (matches best sol'n)
				// 10                   16 (matches best sol'n)     16 (matches best sol'n)
				cost *= 3;

				h =
					this.manhattanDistanceHeuristic(newTiles) +
					3 * this.outOfCycleHeuristic(newTiles);
				// #else
			} else {
				for (let j = 0; j < puzzleSize; ++j) {
					if (newTiles[j] != 0 && newTiles[j] !== goalState.tiles[j]) {
						++h;
					}
				}
				// #endif
			}

			const newState = new EightPuzzleState(
				newTiles,
				currentState,
				newStep,
				cost, // currentState.g + cost,
				h
			);

			// result.push([newState, cost]);
			result.push(newState);
		}

		return result;
	}
}
