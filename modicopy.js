function modicopy(original) {
  const keyChain = []

  var chain = (updateObj) => {
    const $obj = {}
    $obj.$set = w(updateObj)
    $obj.$merge = w(updateObj, {merge: true})
    $obj.$apply = w(updateObj, {apply: true})
    $obj.$remove = w(updateObj, {remove: true})
    if(Array.isArray(updateObj)){
      $obj.$concat = w(updateObj, {concat: true})
      $obj.$push = w(updateObj, {push: true})
    } 

    for (var k in updateObj) {
      Object.defineProperty($obj, k, { get: addToChain(k, updateObj) })
    }

    return $obj
  }

  var addToChain = (key, obj) => () => {
    keyChain.push(key)
    return chain(obj[key])
  }

  var w = (obj, options = {}) => (data) => {
    const {merge, apply, concat, push, remove} = options 
    const updateKey = keyChain[keyChain.length - 1]
    const keyStructure = Array.isArray(original) ? [] : {}
    const isBase = updateKey === undefined
    
    const updateData = (updateObject)=>{
       
        if (merge)
          return Array.isArray(updateObject) ? Object.values({ ...updateObject, ...data }) : { ...updateObject, ...data }
        if (apply) 
          return data( resolveLayer(keyChain, original))
        if (remove){
          const r = {...updateObject}
          data.forEach(key => {
            delete r[key]
          })
          return Array.isArray(updateObject) ? Object.values(r) : r
        }
        if (concat) 
          return [...updateObject, ...data ] 
        if (push) 
          return [...updateObject, data]
      //if (set)
          return data
      
    }

    if (isBase) {
      return updateData(original)
    }else{
      keyChain.reduce( (o, key, i) => { 
        const og =  resolveLayer(keyChain.slice(0, i), original)
        return o[key] = (i === keyChain.length - 1 ? updateData(og[key]) : Array.isArray(og[key]) ? [...og[key]] : {...og[key]}) 
      }, keyStructure);

      return Array.isArray(original) ? Object.values({ ...original, ...keyStructure }) : { ...original, ...keyStructure }
    }
    
  }

  return chain(original)
}

const resolveLayer = (pathArr, obj) => {
    return pathArr.reduce((prev, curr) =>{
      return prev ? prev[curr] : undefined
  }, obj)
}

module.exports = modicopy
