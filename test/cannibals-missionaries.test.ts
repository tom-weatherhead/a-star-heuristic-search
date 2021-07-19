// test/decanter.test.ts

'use strict';

import { AStarAlgorithm } from '..';

import { CanMissState, CanMissSuccessorStateGenerator } from '../examples/cannibals-missionaries';

test('Cannibals-Missionaries test 1: 2 missionaries', () => {
	// Arrange
	const ssg = new CanMissSuccessorStateGenerator();
	const algorithm = new AStarAlgorithm<CanMissState>(ssg, { useStringStates: true });
	const startState = CanMissState.create(true, 0, 2, 0, 0);
	const goalState = startState.calculateGoalState();

	// Act
	const actualValue = algorithm.searchAndReport(startState, goalState);

	// Assert
	expect(actualValue).toBeTruthy();
	expect(actualValue instanceof Array).toBeTruthy();
	expect(actualValue.length).toBe(1);
	expect(actualValue[0]).toBe(
		'Two missionaries travel from West to East. (Canoe E; W 0, 0; E 0, 2)'
	);
});

test('Cannibals-Missionaries test 2: 2 cannibals', () => {
	// Arrange
	const ssg = new CanMissSuccessorStateGenerator();
	const algorithm = new AStarAlgorithm<CanMissState>(ssg, { useStringStates: true });
	const startState = CanMissState.create(true, 2, 0, 0, 0);
	const goalState = startState.calculateGoalState();

	// Act
	const actualValue = algorithm.searchAndReport(startState, goalState);

	// Assert
	expect(actualValue).toBeTruthy();
	expect(actualValue instanceof Array).toBeTruthy();
	expect(actualValue.length).toBe(1);
	expect(actualValue[0]).toBe(
		'Two cannibals travel from West to East. (Canoe E; W 0, 0; E 2, 0)'
	);
});

test('Cannibals-Missionaries test 3: 1 cannibal and 1 missionary', () => {
	// Arrange
	const ssg = new CanMissSuccessorStateGenerator();
	const algorithm = new AStarAlgorithm<CanMissState>(ssg, { useStringStates: true });
	const startState = CanMissState.create(true, 1, 1, 0, 0);
	const goalState = startState.calculateGoalState();

	// Act
	const actualValue = algorithm.searchAndReport(startState, goalState);

	// Assert
	expect(actualValue).toBeTruthy();
	expect(actualValue instanceof Array).toBeTruthy();
	expect(actualValue.length).toBe(1);
	expect(actualValue[0]).toBe(
		'One cannibal and one missionary travel from West to East. (Canoe E; W 0, 0; E 1, 1)'
	);
});

test('Cannibals-Missionaries test 4: 3 missionaries', () => {
	// Arrange
	const ssg = new CanMissSuccessorStateGenerator();
	const algorithm = new AStarAlgorithm<CanMissState>(ssg, { useStringStates: true });
	const startState = CanMissState.create(true, 0, 3, 0, 0);
	const goalState = startState.calculateGoalState();

	// Act
	const actualValue = algorithm.searchAndReport(startState, goalState);

	// Assert
	expect(actualValue).toBeTruthy();
	expect(actualValue instanceof Array).toBeTruthy();
	expect(actualValue.length).toBe(3);
	expect(actualValue[0]).toBe(
		'Two missionaries travel from West to East. (Canoe E; W 0, 1; E 0, 2)'
	);
	expect(actualValue[1]).toBe(
		'One missionary travels from East to West. (Canoe W; W 0, 2; E 0, 1)'
	);
	expect(actualValue[2]).toBe(
		'Two missionaries travel from West to East. (Canoe E; W 0, 0; E 0, 3)'
	);
});

// test('Cannibals-Missionaries test 2: 1 Cannibal and 2 missionaries', () => {
// 	// Arrange
// 	const ssg = new CanMissSuccessorStateGenerator();
// 	const algorithm = new AStarAlgorithm<CanMissState>(ssg, { useStringStates: true });
// 	const startState = CanMissState.create(true, 1, 2, 0, 0);
// 	const goalState = startState.calculateGoalState();

// 	// Act
// 	const actualValue = algorithm.searchAndReport(startState, goalState);

// 	// Assert
// 	expect(actualValue).toBeTruthy();
// 	expect(actualValue instanceof Array).toBeTruthy();
// 	expect(actualValue.length).toBe(1);
// 	// expect(actualValue[0]).toBe('Two missionaries travel from West to East. (W 0, 0; E 0, 2)');
// });

// test('Cannibals-Missionaries test 2: 2 Cannibals and 2 missionaries', () => {
// 	// Arrange
// 	const ssg = new CanMissSuccessorStateGenerator();
// 	const algorithm = new AStarAlgorithm<CanMissState>(ssg, { useStringStates: true });
// 	const startState = CanMissState.create(true, 2, 2, 0, 0);
// 	const goalState = startState.calculateGoalState();

// 	// Act
// 	const actualValue = algorithm.searchAndReport(startState, goalState);

// 	// Assert
// 	expect(actualValue).toBeTruthy();
// 	expect(actualValue instanceof Array).toBeTruthy();
// 	expect(actualValue.length).toBe(1);
// 	// expect(actualValue[0]).toBe('Two missionaries travel from West to East. (W 0, 0; E 0, 2)');
// });
