// test/decanter.test.ts

'use strict';

// import * as engine from '..';

import { AStarAlgorithm, findIndexOfStringInSortedList } from '..';

import { EightPuzzleState, EightPuzzleSuccessorStateGenerator } from '../examples/eight-puzzle';

test('findIndexOfStringInSortedList test 1', () => {
	expect(findIndexOfStringInSortedList('a', [])).toBe(0);
	expect(findIndexOfStringInSortedList('a', ['a'])).toBe(0);
	expect(findIndexOfStringInSortedList('a', ['b'])).toBe(0);
	expect(findIndexOfStringInSortedList('b', ['a'])).toBe(1);
	expect(findIndexOfStringInSortedList('b', ['a', 'c'])).toBe(1);
	expect(findIndexOfStringInSortedList('b', ['a', 'b', 'c'])).toBe(1);
	expect(findIndexOfStringInSortedList('a', ['b', 'c', 'd', 'e'])).toBe(0);
	expect(findIndexOfStringInSortedList('b', ['b', 'c', 'd', 'e'])).toBe(0);
	expect(findIndexOfStringInSortedList('c', ['b', 'c', 'd', 'e'])).toBe(1);
	expect(findIndexOfStringInSortedList('d', ['b', 'c', 'd', 'e'])).toBe(2);
	expect(findIndexOfStringInSortedList('e', ['b', 'c', 'd', 'e'])).toBe(3);
	expect(findIndexOfStringInSortedList('f', ['b', 'c', 'd', 'e'])).toBe(4);
	// expect(findIndexOfStringInSortedList('', [])).toBe();
});

test('Eight Puzzle test 1', () => {
	// Arrange
	const ssg = new EightPuzzleSuccessorStateGenerator({ useManhattanDistances: true });
	const algorithm = new AStarAlgorithm<EightPuzzleState>(ssg, { useStringStates: true });
	// const startState = EightPuzzleState.createRandom();
	const startState = EightPuzzleState.create([1, 2, 3, 0, 8, 4, 7, 6, 5]);
	const goalState = EightPuzzleState.createGoal();

	// Act
	const actualValue = algorithm.searchAndReport(startState, goalState);

	// Assert
	// expect(actualValue).toEqual(expectedValue);
	expect(actualValue).toBeTruthy();
	expect(actualValue instanceof Array).toBeTruthy();
	expect(actualValue.length).toBe(1);
	expect(actualValue[0]).toBe('Slide one tile to the left. (1, 2, 3, 8, 0, 4, 7, 6, 5)');
});

test('Eight Puzzle test 2', () => {
	// Arrange
	const ssg = new EightPuzzleSuccessorStateGenerator({ useManhattanDistances: true });
	const algorithm = new AStarAlgorithm<EightPuzzleState>(ssg, { useStringStates: true });
	// const startState = EightPuzzleState.createRandom();
	const startState = EightPuzzleState.create([0, 2, 3, 1, 4, 5, 8, 7, 6]);
	const goalState = EightPuzzleState.createGoal();

	// Act
	const actualValue = algorithm.searchAndReport(startState, goalState);

	// Assert
	// expect(actualValue).toEqual(expectedValue);
	expect(actualValue).toBeTruthy();
	expect(actualValue instanceof Array).toBeTruthy();
	expect(actualValue.length).toBe(4);
	expect(actualValue[0]).toBe('Slide two tiles up. (1, 2, 3, 8, 4, 5, 0, 7, 6)');
	expect(actualValue[1]).toBe('Slide two tiles to the left. (1, 2, 3, 8, 4, 5, 7, 6, 0)');
	expect(actualValue[2]).toBe('Slide one tile down. (1, 2, 3, 8, 4, 0, 7, 6, 5)');
	expect(actualValue[3]).toBe('Slide one tile to the right. (1, 2, 3, 8, 0, 4, 7, 6, 5)');
});

// test('Eight Puzzle test ?', () => {
// 	// Arrange
// 	const ssg = new EightPuzzleSuccessorStateGenerator({ useManhattanDistances: true });
// 	const algorithm = new AStarAlgorithm<EightPuzzleState>(ssg);
// 	// const startState = EightPuzzleState.createRandom();
// 	const startState = EightPuzzleState.create([2, 3, 4, 1, 0, 5, 8, 7, 6]);
// 	const goalState = EightPuzzleState.createGoal();

// 	// Act
// 	const actualValue = algorithm.searchAndReport(startState, goalState);

// 	// Assert
// 	// expect(actualValue).toEqual(expectedValue);
// 	expect(actualValue).toBeTruthy();
// 	expect(actualValue instanceof Array).toBeTruthy();
// 	expect(actualValue.length).toBe(1);
// 	// expect(actualValue[0]).toBe('Slide one tile to the left. (1, 2, 3, 8, 0, 4, 7, 6, 5)');
// });
