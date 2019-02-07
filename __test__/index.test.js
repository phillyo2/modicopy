import modicopy from '../modicopy'

describe('modicopy', ()=>{
    describe('$push', ()=>{
        it('should push to an array and not mutate th original', ()=>{
            const original = {a: [1]}
            const updatedCopy = modicopy(original).a.$push(2)
            expect(original).toBe(original)
            expect(updatedCopy).toEqual({a: [1, 2]})
        })
    })

    describe('$copy', ()=>{
        it('should return a copy (have a different reference)', ()=>{
            const original = {a: [1]}
            const copy = modicopy(original).$copy()
            expect(original).toBe(original)
            expect(copy).not.toBe(original)
            expect(copy).toEqual(original)
        })
    })
})