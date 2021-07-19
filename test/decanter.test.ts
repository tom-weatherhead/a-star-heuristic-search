// test/decanter.test.ts

'use strict';

// import * as engine from '..';

import { AStarAlgorithm } from '..';

import { DecanterState, DecanterSuccessorStateGenerator } from '../examples/decanter';

test('Decanter test 1', () => {
	// Arrange
	// const expectedValue = ?;
	const capacity1 = 7;
	const capacity2 = 13;
	const ssg = new DecanterSuccessorStateGenerator(capacity1, capacity2);
	const algorithm = new AStarAlgorithm<DecanterState>(ssg);
	const startState = DecanterState.create(0, 0);
	const goalState = DecanterState.create(0, 1);

	// Act
	const actualValue = algorithm.searchAndReport(startState, goalState);

	console.log('actualValue:', actualValue);

	// if (typeof actualValue !== 'undefined') {
	// 	actualValue.PrintSolution();
	// }

	// Assert
	// expect(actualValue).toEqual(expectedValue);
	expect(actualValue).toBeTruthy();
	expect(actualValue instanceof Array).toBeTruthy();
	expect(actualValue.length).toBe(6);
	expect(actualValue[0]).toBe('Fill jug 1. (7, 0)');
	expect(actualValue[1]).toBe('Pour jug 1 into jug 2. (0, 7)');
	expect(actualValue[2]).toBe('Fill jug 1. (7, 7)');
	expect(actualValue[3]).toBe('Pour jug 1 into jug 2. (1, 13)');
	expect(actualValue[4]).toBe('Empty jug 2. (1, 0)');
	expect(actualValue[5]).toBe('Pour jug 1 into jug 2. (0, 1)');
});
