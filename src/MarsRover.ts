import {Coordination} from "./types/Coordination";
import {Direction, RoverPosition} from "./types/RoverPosition";

export default class MarsRover {
    readonly rawCommands: string;
    readonly upperRightCoordination: Coordination;

    private _roverPositions: RoverPosition[];

    constructor(rawCommands: string) {
        this.rawCommands = rawCommands;
        const {upperRightCoordination, roverPositions} = this.processCommands();
        this.upperRightCoordination = upperRightCoordination;
        this._roverPositions = roverPositions;
    }

    get roverPositions() {
        return this._roverPositions;
    }

    private processCommands() {
        const commands = this.rawCommands.split('\n');

        if (commands.length === 0) {
            throw new Error('Invalid Commands String')
        }

        const upperRightCoordination = this.processUpperRightCoordination(commands[0])
        let roverPositions: RoverPosition[] = [];

        const roverPositionAndMovementCommands = commands.splice(1);
        for (let commandIndex = 0; commandIndex < Math.ceil(roverPositionAndMovementCommands.length / 2); commandIndex++) {
            const roverPositionIndex = (commandIndex * 2);
            const roverMovementsIndex = roverPositionIndex + 1;
            roverPositions.push(this.processRoverInitialPosition(roverPositionAndMovementCommands[roverPositionIndex]))
        }

        return {
            upperRightCoordination,
            roverPositions
        }
    }

    private processUpperRightCoordination(upperRightCoordination: string): Coordination {
        const compiledUpperRightCoordinates = (/^([1-9]\d*)\s([1-9]\d*)$/.exec(upperRightCoordination));
        if (!compiledUpperRightCoordinates) {
            throw new Error('Invalid Upper Right Coordinates')
        }

        return {
            x: Number(compiledUpperRightCoordinates[1]),
            y: Number(compiledUpperRightCoordinates[2])
        }
    }

    private processRoverInitialPosition(roverInitialPosition: string): RoverPosition {
        const compiledRoverInitialPosition = (/^([1-9]\d*)\s([1-9]\d*)\s[WNESwnes]$/.exec(roverInitialPosition));
        if (!compiledRoverInitialPosition) {
            throw new Error('Invalid Rover Initial Position')
        }

        return {
            coordination: {
                x: Number(compiledRoverInitialPosition[1]),
                y: Number(compiledRoverInitialPosition[2])
            },
            direction: compiledRoverInitialPosition[3] as Direction
        }
    }
}
