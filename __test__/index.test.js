import modicopy from '../modicopy'

describe('modicopy', ()=>{
    describe('$push', ()=>{
        it('should push to an array and not mutate th original', ()=>{
            const original = {a: [1]}
            const updatedCopy = modicopy(original).a.$push(2)
            expect(original).toEqual({a: [1]})
            expect(updatedCopy).toEqual({a: [1, 2]})
        })
    })
})