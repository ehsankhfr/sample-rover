import Utils from "./Utils";

describe('Utils', () => {
    describe('cloneObject', () => {
        it('should return clone of the given object', () => {
            const object = {a: 12, b: {c: 23}};

            const clonedObject = Utils.cloneObject(object);

            expect(clonedObject).toEqual(object)
        });
    });

    describe('getTwoDimensionalNullArray', () => {
        const dimensionsArray = [
            [10, 10],
            [10000, 1],
            [2, 3333],
            [1, 1]
        ]
        it.each(dimensionsArray)('should return array with expected size', (dimensionA, dimensionB) => {
            const result = Utils.getTwoDimensionalNullArray(dimensionA, dimensionB);

            expect(result.length).toEqual(dimensionA);
            for (let index = 0; index < result.length; index++) {
                expect(result[index].length).toEqual(dimensionB);

                result[index].forEach(value => {
                    expect(value).toBeNull();
                })
            }
        });

        describe('When first dimension is 0', () => {
            it('should return zero length array', () => {
                const result = Utils.getTwoDimensionalNullArray(0, 100);

                expect(result.length).toEqual(0);
            });
        });

        describe('When second dimension is 0', () => {
            it('should return one dimensional array', () => {
                const result = Utils.getTwoDimensionalNullArray(100, 0);

                expect(result.length).toEqual(100);
                for (let index = 0; index < result.length; index++) {
                    expect(result[index].length).toEqual(0);
                }
            });
        })
    });
});
