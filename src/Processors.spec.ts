import Processors from "./Processors";
import {Direction} from "./types/Direction";
import {RoverPosition} from "./types/RoverPosition";

describe('Processors', () => {
    describe('processUpperRightCoordination', () => {
        const validUpperRightCoordinations = [
            {x: 5, y: 4},
            {x: 2, y: 5},
            {x: 10000, y: 3},
            {x: 1, y: 200000},
            {x: 10000, y: 200000}
        ];

        it('should fail if the values are not following [Num1 Num2] pattern', () => {
            const commands = '5 A';
            expect(() => Processors.processUpperRightCoordination(commands)).toThrowError(new Error('Invalid Upper Right Coordinates'))
        });

        it('should fail if the numeric values are not positive', () => {
            const commands = '5 -1';
            expect(() => Processors.processUpperRightCoordination(commands)).toThrowError(new Error('Invalid Upper Right Coordinates'))
        });

        it.each(validUpperRightCoordinations)('should return coordination if both are numbers', (coordination) => {
            const result = Processors.processUpperRightCoordination(`${coordination.x} ${coordination.y}`);
            expect(result.x).toEqual(coordination.x);
            expect(result.y).toEqual(coordination.y);
        });
    });

    describe('processRoverInitialPosition', () => {
        const invalidFormattedCommandsArray = [
            '12 23 3',
            '12 N 3',
            '12 23 3',
            '0 23 3',
            '0 23 Z',
            '12 0 3'
        ];

        const validCommands: RoverPosition[] = [
            {coordination: {x:1 , y:200}, direction: Direction.north},
            {coordination: {x:100 , y:20}, direction: Direction.west},
            {coordination: {x:0 , y:1}, direction: Direction.south},
            {coordination: {x:0 , y:0}, direction: Direction.east}
        ];

        it.each(invalidFormattedCommandsArray)('should fail if the values are not following [Num1 Num2 Direction] pattern', (commands) => {
            expect(() => Processors.processRoverInitialPosition(commands)).toThrowError(new Error('Invalid Rover Initial Position'))
        });

        it.each(validCommands)('should return coordination if both are numbers', (command) => {
            const result = Processors.processRoverInitialPosition(`${command.coordination.x} ${command.coordination.y} ${command.direction}`);
            expect(result.coordination.x).toEqual(command.coordination.x);
            expect(result.coordination.y).toEqual(command.coordination.y);
            expect(result.direction).toEqual(command.direction);
        });
    });

    describe('processRoverMovements', () => {
        const invalidFormattedCommands = [
            'LMLMLMLMN',
            'LMLM LM LMM',
            'LMLMLML123MM',
            'LLqewqMLMLMM'
        ];

        const validFormattedCommands = [
            'LMLMLMLMR',
            'L',
            'R',
            'MMMMMMMM',
            'RRRLLLLL'
        ];
        it.each(invalidFormattedCommands)('should fail if the values are not following [Num1 Num2 Direction] pattern', (command) => {
            expect(() => Processors.processRoverMovements(command)).toThrowError(new Error('Invalid Rover Movement Command'))
        });

        it.each(validFormattedCommands)('should fail if the values are not following [Num1 Num2 Direction] pattern', (command) => {
            expect(Processors.processRoverMovements(command)).toEqual(command)
        });
    });
});
