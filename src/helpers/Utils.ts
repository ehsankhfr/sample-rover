export default class Utils {
    static cloneObject(object: Object) {
        return JSON.parse(JSON.stringify(object));
    }

    static getTwoDimensionalNullArray(dimensionA: number, dimensionB: number) {
        return new Array(dimensionA).fill(null).map(
            () => new Array(dimensionB).fill(null)
        );
    }
}
