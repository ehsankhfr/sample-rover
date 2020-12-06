import {Coordination} from "./types/Coordination";
import {RoverPosition} from "./types/RoverPosition";
import {Direction, LeftDirection, RightDirection} from "./types/Direction";
import Utils from "./helpers/Utils";

export default class MarsRover {
    readonly rawCommands: string;
    readonly upperRightCoordination: Coordination;

    private _roverPositions: RoverPosition[];
    private _roverMovements: string[];
    private _grid: number[][];

    constructor(rawCommands: string) {
        this.rawCommands = rawCommands;
        const {upperRightCoordination, roverPositions, roverMovements} = this.processCommands();
        this.upperRightCoordination = upperRightCoordination;
        this._roverPositions = roverPositions;
        this._roverMovements = roverMovements;
        this._grid = this.generateGrid(upperRightCoordination)
    }

    get roverPositions() {
        return this._roverPositions;
    }

    get roverMovements() {
        return this._roverMovements;
    }

    private processCommands() {
        const commands = this.rawCommands.trim().split('\n');

        if (commands.length === 0) {
            throw new Error('Invalid Commands String')
        }

        const upperRightCoordination = this.processUpperRightCoordination(commands[0])
        let roverPositions: RoverPosition[] = [];
        let roverMovements: string[] = [];

        const roverPositionAndMovementCommands = commands.splice(1);
        for (let commandIndex = 0; commandIndex < Math.ceil(roverPositionAndMovementCommands.length / 2); commandIndex++) {
            const roverPositionIndex = (commandIndex * 2);
            const roverMovementsIndex = roverPositionIndex + 1;
            roverPositions.push(this.processRoverInitialPosition(roverPositionAndMovementCommands[roverPositionIndex]));
            roverMovements.push(this.processRoverMovements(roverPositionAndMovementCommands[roverMovementsIndex]));
        }

        return {
            upperRightCoordination,
            roverPositions,
            roverMovements
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

    private processRoverMovements(roverMovements: string) {
        const compiledRoverInitialPosition = (/^([LRMlrm])+$/.exec(roverMovements));
        if (!compiledRoverInitialPosition) {
            throw new Error('Invalid Rover Movement Command')
        }

        return roverMovements;
    }

    public execute() {
        for (const roverIndex in this._roverPositions) {
            this.placeRover(roverIndex);
            this._roverPositions[roverIndex] = this.moveRover(this._roverMovements[roverIndex], Number(roverIndex));
        }
    }

    private placeRover(roverIndex: string) {
        this.validateCoordination(this._roverPositions[roverIndex].coordination, Number(roverIndex))
        this.occupyCoordination(this._roverPositions[roverIndex].coordination, Number(roverIndex));
    }

    private moveRover(roverMovement: string, roverIndex: number): RoverPosition {
        const moveCommands = roverMovement.split('');

        let currentPosition: RoverPosition = Utils.cloneObject(this.roverPositions[roverIndex]);
        for (const move of moveCommands) {
            switch (move) {
                case 'L':
                    currentPosition.direction = LeftDirection[currentPosition.direction] as unknown as Direction;
                    break;
                case 'R':
                    currentPosition.direction = RightDirection[currentPosition.direction] as unknown as Direction;
                    break;
                case 'M':
                    currentPosition.coordination = this.moveOneStep(currentPosition);
                    this.validateCoordination(currentPosition.coordination, roverIndex)
                    break;
            }
        }

        this.occupyCoordination(currentPosition.coordination, roverIndex);
        if (
            this.roverPositions[roverIndex].coordination.x !== currentPosition.coordination.x ||
            this.roverPositions[roverIndex].coordination.y !== currentPosition.coordination.y
        ) {
            this.releaseCoordination(this.roverPositions[roverIndex].coordination);
        }

        return currentPosition;
    }

    private moveOneStep(roverPosition: RoverPosition): Coordination {
        const nextCoordination = {...roverPosition.coordination};
        switch (roverPosition.direction) {
            case Direction.north:
                nextCoordination.y++;
                break;
            case Direction.east:
                nextCoordination.x++;
                break;
            case Direction.south:
                nextCoordination.y--;
                break;
            case Direction.west:
                nextCoordination.x--;
                break;
        }

        return nextCoordination;
    }

    private occupyCoordination(coordination: Coordination, roverIndex: number) {
        this._grid[coordination.x][coordination.y] = roverIndex;
    }

    private releaseCoordination(coordination: Coordination) {
        this._grid[coordination.x][coordination.y] = null;
    }

    private validateCoordination(coordination: Coordination, roverIndex: number) {
        if (this._grid[coordination.x] === undefined || this._grid[coordination.x][coordination.y] === undefined) {
            throw new Error(`The coordination is outside of grid`);
        }

        if (![roverIndex, null].includes(this._grid[coordination.x][coordination.y])) {
            throw new Error(`The coordination is already occupied`);
        }
    }

    private generateGrid(upperRightCoordination: Coordination) {
        return new Array(upperRightCoordination.x + 1).fill(null).map(
            () => new Array(upperRightCoordination.y + 1).fill(null)
        );
    }
}
