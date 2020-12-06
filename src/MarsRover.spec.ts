import MarsRover from "./MarsRover";
import {Direction} from "./types/Direction";
import Processors from "./Processors";

describe('MarsRover', () => {
    const successfulCommands = '5 69\n' + '1 2 N\n' + 'LMLMLMLMM\n' + '3 3 E\n' + 'MMRMMRMRRM';

    describe('Initialisation', () => {
        it('should accept a string of command as input', () => {
            const rover = new MarsRover(successfulCommands);
            expect(rover.rawCommands).toEqual(successfulCommands)
        });

        it('should call processCommands', () => {
            const spy = jest.spyOn<any, any>(MarsRover.prototype, 'processCommands');
            new MarsRover(successfulCommands);

            expect(spy).toBeCalledTimes(1);
        });

        describe('When processing input string', () => {
            it('should call processUpperRightCoordination', () => {
                const spy = jest.spyOn<any, any>(Processors, 'processUpperRightCoordination');
                new MarsRover(successfulCommands);

                expect(spy).toBeCalledTimes(1);
            });

            it('should call processRoverInitialPosition twice', () => {
                const spy = jest.spyOn<any, any>(Processors, 'processRoverInitialPosition');
                new MarsRover(successfulCommands);

                expect(spy).toBeCalledTimes(2);
            });

            it('should call processRoverMovements twice', () => {
                const spy = jest.spyOn<any, any>(Processors, 'processRoverMovements');
                new MarsRover(successfulCommands);

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
                    const commandPrefix = '5 69\n' + '1 2 N\n';
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
                    const rover = new MarsRover(successfulCommands);
                    expect(rover.upperRightCoordination.x).toEqual(5);
                    expect(rover.upperRightCoordination.y).toEqual(69);
                });

                it('should process rovers initial positions successfully', () => {
                    const rover = new MarsRover(successfulCommands);
                    expect(rover.roverPositions[0].coordination.x).toEqual(1);
                    expect(rover.roverPositions[0].coordination.y).toEqual(2);
                    expect(rover.roverPositions[0].direction).toEqual(Direction.north);

                    expect(rover.roverPositions[1].coordination.x).toEqual(3);
                    expect(rover.roverPositions[1].coordination.y).toEqual(3);
                    expect(rover.roverPositions[1].direction).toEqual(Direction.east);
                });

                it('should process rovers movements successfully', () => {
                    const rover = new MarsRover(successfulCommands);
                    expect(rover.roverMovements[0]).toEqual('LMLMLMLMM');
                    expect(rover.roverMovements[1]).toEqual('MMRMMRMRRM');
                });
            });
        });
    });

    describe('Execute', () => {
        it('should call placeRover twice', () => {
            const rover = new MarsRover(successfulCommands);
            const spy = jest.spyOn<any, any>(MarsRover.prototype, 'placeRover');
            rover.execute();

            expect(spy).toBeCalledTimes(2);
        });

        it('should call moveRover twice', () => {
            const rover = new MarsRover(successfulCommands);
            const spy = jest.spyOn<any, any>(MarsRover.prototype, 'moveRover');
            rover.execute();

            expect(spy).toBeCalledTimes(2);
        });

        describe('When executing invalid command', () => {
            describe('When the rover is going to be initialised in an occupied coordination', () => {
                const commandsArray = [
                    '5 69\n' + '1 2 N\n' + 'LR\n' + '1 2 E\n' + 'LR\n',
                    '5 69\n' + '1 69 N\n' + 'LR\n' + '1 69 E\n' + 'LR\n',
                    '5 69\n' + '0 2 N\n' + 'LR\n' + '0 2 E\n' + 'LR\n'
                ];
                it.each(commandsArray)('Should error', (command) => {
                    const rover = new MarsRover(command);

                    expect(() => rover.execute()).toThrowError(new Error(`The coordination is already occupied`));
                });
            });

            describe('When the rover is going to move through an occupied coordination', () => {
                const commandsArray = [
                    '5 69\n' + '1 2 N\n' + 'MMMLMLMRL\n' + '0 5 N\n' + 'LLMM\n',
                    '5 69\n' + '1 2 N\n' + 'LM\n' + '0 1 N\n' + 'MMMMMM\n',
                    '5 69\n' + '1 2 N\n' + 'LR\n' + '2 2 E\n' + 'RMLLMLM\n'
                ];
                it.each(commandsArray)('Should error', (command) => {
                    const rover = new MarsRover(command);

                    expect(() => rover.execute()).toThrowError(new Error(`The coordination is already occupied`));
                });
            });

            describe('When the rover is going to be initialised outside of grid', () => {
                const commandsArray = [
                    '5 69\n' + '10 2 N\n' + 'LR\n' + '0 2 E\n' + 'RR\n',
                    '5 69\n' + '0 2 N\n' + 'LR\n' + '10 2 E\n' + 'RR\n',
                    '5 6\n' + '1 20 N\n' + 'LR\n' + '0 2 E\n' + 'RR\n',
                    '5 6\n' + '1 2 N\n' + 'LR\n' + '0 20 E\n' + 'RR\n'
                ];
                it.each(commandsArray)('Should error', (command) => {
                    const rover = new MarsRover(command);

                    expect(() => rover.execute()).toThrowError(new Error(`The coordination is outside of grid`));
                });
            });
        });
    });
});
