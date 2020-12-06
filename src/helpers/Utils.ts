export default class Utils {
    static cloneObject(object: Object) {
        return JSON.parse(JSON.stringify(object));
    }
}
