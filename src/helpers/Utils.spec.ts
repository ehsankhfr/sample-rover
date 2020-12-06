import Utils from "./Utils";

describe('Utils', ()=>{
   describe('cloneObject', ()=>{
      it('should return clone of the given object', ()=>{
         const object = {a:12, b:{c:23}};

         const clonedObject = Utils.cloneObject(object);

         expect(clonedObject).toEqual(object)
      });
   });
});
