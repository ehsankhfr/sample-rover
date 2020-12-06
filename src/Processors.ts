import {Coordination} from "./types/Coordination";
import {RoverPosition} from "./types/RoverPosition";
import {Direction} from "./types/Direction";

export default class Processors {
    public static processUpperRightCoordination(upperRightCoordination: string): Coordination {
        const compiledUpperRightCoordinates = (/^([1-9]\d*)\s([1-9]\d*)$/.exec(upperRightCoordination));
        if (!compiledUpperRightCoordinates) {
            throw new Error('Invalid Upper Right Coordinates')
        }

        return {
            x: Number(compiledUpperRightCoordinates[1]),
            y: Number(compiledUpperRightCoordinates[2])
        }
    }

    public static processRoverInitialPosition(roverInitialPosition: string): RoverPosition {
        const compiledRoverInitialPosition = (/^(\d+)\s(\d+)\s([WNESwnes])$/.exec(roverInitialPosition));
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

    public static processRoverMovements(roverMovements: string) {
        const compiledRoverInitialPosition = (/^([LRMlrm])+$/.exec(roverMovements));
        if (!compiledRoverInitialPosition) {
            throw new Error('Invalid Rover Movement Command')
        }

        return roverMovements;
    }
}
