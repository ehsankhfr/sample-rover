import {Coordination} from "./Coordination";

export enum Direction {
    east = 'E',
    west = 'W',
    north = 'N',
    south = 'S'
}

export interface RoverPosition {
    coordination: Coordination;
    direction: Direction
}
