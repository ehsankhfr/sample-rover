import {Coordination} from "./types/Coordination";
import {RoverPosition} from "./types/RoverPosition";
import {Direction, LeftDirection, RightDirection} from "./types/Direction";
import Utils from "./helpers/Utils";
import Processors from "./Processors";
import {Movements} from "./types/Movements";

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
        this._grid = this.generateGrid(upperRightCoordination);
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

        const upperRightCoordination = Processors.processUpperRightCoordination(commands[0])
        let roverPositions: RoverPosition[] = [];
        let roverMovements: string[] = [];

        const roverPositionAndMovementCommands = commands.splice(1);
        for (let commandIndex = 0; commandIndex < Math.ceil(roverPositionAndMovementCommands.length / 2); commandIndex++) {
            const roverPositionIndex = (commandIndex * 2);
            const roverMovementsIndex = roverPositionIndex + 1;
            roverPositions.push(Processors.processRoverInitialPosition(roverPositionAndMovementCommands[roverPositionIndex]));
            roverMovements.push(Processors.processRoverMovements(roverPositionAndMovementCommands[roverMovementsIndex]));
        }

        return {
            upperRightCoordination,
            roverPositions,
            roverMovements
        }
    }

    public execute() {
        for (const roverIndex in this._roverPositions) {
            this.placeRover(Number(roverIndex));
            this._roverPositions[roverIndex] = this.moveRover(Number(roverIndex));
        }
    }

    private placeRover(roverIndex: number) {
        this.validateCoordination(this._roverPositions[roverIndex].coordination, roverIndex)
        this.occupyCoordination(this._roverPositions[roverIndex].coordination, roverIndex);
    }

    private moveRover(roverIndex: number): RoverPosition {
        const moveCommands = this._roverMovements[roverIndex].split('');

        let currentPosition: RoverPosition = Utils.cloneObject(this.roverPositions[roverIndex]);
        for (const move of moveCommands) {
            switch (move) {
                case Movements.left:
                    currentPosition.direction = LeftDirection[currentPosition.direction] as unknown as Direction;
                    break;
                case Movements.right:
                    currentPosition.direction = RightDirection[currentPosition.direction] as unknown as Direction;
                    break;
                case Movements.move:
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
        return Utils.getTwoDimensionalNullArray(upperRightCoordination.x + 1, upperRightCoordination.y + 1);
    }
}
