import MarsRover from "./MarsRover";
import {Direction} from "./types/RoverPosition";

describe('MarsRover', () => {
    describe('Initialisation', () => {
        const commands = '5 69\n' + '1 2 N\n' + 'LMLMLMLMM\n' + '3 3 E\n' + 'MMRMMRMRRM';

        it('should accept a string of command as input', () => {
            const rover = new MarsRover(commands);
            expect(rover.rawCommands).toEqual(commands)
        });

        it('should call processCommands', () => {
            const spy = jest.spyOn<any, any>(MarsRover.prototype, 'processCommands');
            new MarsRover(commands);

            expect(spy).toBeCalledTimes(1);
        });

        describe('When processing input string', () => {
            it('should call processUpperRightCoordination', () => {
                const spy = jest.spyOn<any, any>(MarsRover.prototype, 'processUpperRightCoordination');
                new MarsRover(commands);

                expect(spy).toBeCalledTimes(1);
            });

            it('should call processRoverInitialPosition twice', () => {
                const spy = jest.spyOn<any, any>(MarsRover.prototype, 'processRoverInitialPosition');
                new MarsRover(commands);

                expect(spy).toBeCalledTimes(2);
            });

            it('should call processRoverMovements twice', () => {
                const spy = jest.spyOn<any, any>(MarsRover.prototype, 'processRoverMovements');
                new MarsRover(commands);

                expect(spy).toBeCalledTimes(2);
            });

            describe('and input is invalid', () => {
                describe('and upperRightCoordinates is wrong', () => {
                    it('should fail if the values are not following [Num1 Num2] pattern', () => {
                        const commands = '5 A\n';
                        expect(() => new MarsRover(commands)).toThrowError(new Error('Invalid Upper Right Coordinates'))
                    });

                    it('should fail if the numeric values are not positive', () => {
                        const commands = '5 -1\n';
                        expect(() => new MarsRover(commands)).toThrowError(new Error('Invalid Upper Right Coordinates'))
                    });
                });
                describe('and Rover initial position is invalid', () => {
                    const commandPrefix = '5 69\n';
                    const invalidFormattedCommandsArray = [
                        '12 23 3',
                        '12 N 3',
                        '12 23 3',
                        '0 23 3',
                        '0 23 Z',
                        '12 0 3'
                    ];
                    it.each(invalidFormattedCommandsArray)('should fail if the values are not following [Num1 Num2 Direction] pattern', (commands) => {
                        expect(() => new MarsRover(commandPrefix + commands)).toThrowError(new Error('Invalid Rover Initial Position'))
                    });
                });
                describe('and Rover movement command is invalid', () => {
                    const commandPrefix = '5 69\n' + '1 2 N\n' ;
                    const invalidFormattedCommandsArray = [
                        'LMLMLMLMN',
                        'LMLM LM LMM',
                        'LMLMLML123MM',
                        'LLqewqMLMLMM'
                    ];
                    it.each(invalidFormattedCommandsArray)('should fail if the values are not following [Num1 Num2 Direction] pattern', (commands) => {
                        expect(() => new MarsRover(commandPrefix + commands)).toThrowError(new Error('Invalid Rover Movement Command'))
                    });
                });
            });
            describe('and input is valid', () => {
                it('should process upperRightCoordinates successfully', () => {
                    const rover = new MarsRover(commands);
                    expect(rover.upperRightCoordination.x).toEqual(5);
                    expect(rover.upperRightCoordination.y).toEqual(69);
                });

                it('should process rovers initial positions successfully', () => {
                    const rover = new MarsRover(commands);
                    expect(rover.roverPositions[0].coordination.x).toEqual(1);
                    expect(rover.roverPositions[0].coordination.y).toEqual(2);
                    expect(rover.roverPositions[0].direction).toEqual(Direction.north);

                    expect(rover.roverPositions[1].coordination.x).toEqual(3);
                    expect(rover.roverPositions[1].coordination.y).toEqual(3);
                    expect(rover.roverPositions[1].direction).toEqual(Direction.east);
                });

                it('should process rovers movements successfully', () => {
                    const rover = new MarsRover(commands);
                    expect(rover.roverMovements[0]).toEqual('LMLMLMLMM');
                    expect(rover.roverMovements[1]).toEqual('MMRMMRMRRM');
                });
            });
        });
    });
});
