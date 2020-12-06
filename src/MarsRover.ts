import {Coordination} from "./types/Coordination";

export default class MarsRover {
    readonly rawCommands: string;
    readonly upperRightCoordination: Coordination;

    constructor(rawCommands: string) {
        this.rawCommands = rawCommands;
        const {upperRightCoordination} = this.processCommands();
        this.upperRightCoordination = upperRightCoordination;
    }

    private processCommands() {
        const commands = this.rawCommands.split('\n');

        if (commands.length === 0) {
            throw new Error('Invalid Commands String')
        }

        const upperRightCoordination = this.processUpperRightCoordination(commands[0])

        for (const command of commands.splice(1)) {

        }

        return {
            upperRightCoordination
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
}
