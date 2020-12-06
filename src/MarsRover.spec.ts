import MarsRover from "./MarsRover";

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
                it('Should fail on the invalid Rover initial position', () => {

                });
                it('Should fail on the invalid Rover movements', () => {

                });
            });
            describe('and input is valid', () => {
                it('should process upperRightCoordinates successfully', () => {
                    const rover  = new MarsRover(commands);
                    expect(rover.upperRightCoordination.x).toEqual(5);
                    expect(rover.upperRightCoordination.y).toEqual(69);
                });
            });
        });
    });
});
