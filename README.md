# modicopy
Provides a simple way to get a modified copy of standard JavaScript Object { } or Array [ ] without modifying the original. No more are the days of nasty nested spreads or Object.assign()s in your reducers or anywhere else!

## Installing

```
npm install modicopy
```

## Before using modicopy

First off i need to explain what i mean when i say *"copy"*

**copy:** `to create an object with a new reference in memory that contains the same values of a provided object`

Also i should note that it only creates a new reference for the layer being updated or copied not the entire passed in object.
 

## Using modicopy

To use modicopy you will first have to import it into your file

```
import modicopy from 'modicopy'
```
or
```
const modicopy = require('modicopy')
```

by doing this you are import a function that takes any standard JavaScript Object { } or Array [ ] and outputs a set of functions that allows you to return an updated object
that matches the original but does so without modifying the original

It looks something like this

```
import modicopy from 'modicopy'

const original = {a: [1]}
const updatedCopy = modicopy(original).a.$push(2)

console.log(original) // {a: [1]}
console.log(updatedCopy) // {a: [1, 2]}
```

But where the true power lies with modicopy is the ability to dig down into any layer of you passed in object and copy and update a specific piece deep in your object. This is what helps eliminate constant spreading in reducers.

That looks something like this:
```
import modicopy from 'modicopy'

const original = {a: {b: {c:{d:[1]}}}}
const updatedCopy = modicopy(original).a.b.c.d.$push(2)

console.log(original) // {a: {b: {c: {d: [1] } } } }
console.log(updatedCopy) // {a: {b: {c: {d: [1, 2] } } } }
```

The Object returned from the modicopy function looks like this

```
// Standard JS Objects {}
{ 
  $set:,
  $merge:,
  $apply:,
  $remove:
}

// Standard JS Arrays []
{ 
  $set:,
  $merge:,
  $apply:,
  $remove:,
  $concat:,
  $push:
}
```
**$set**: `updates the entire layer that the function is called on to the provided value`
```
const original = {a: {b: "hello"}}
const updatedCopy = modicopy(original).a.$set("goodbye") //{a: {b: "goodbye"}}
```
**$merge**: `updates the layer that the functions is called on by perfomring the functionality of that of {...original, ...copy} / Object.assign({}, original, copy)` *(only run this if the layer is an array or object otherwise weird things can happen)*
```
const original = {a: {b: {c:"hello"}}
const updatedCopy = modicopy(original).a.$merge({d: "goodbye"}) //{a: {b: {c: "hello", d:"goodbye"}}
```
**$apply**: `updates the layer by providing a callback that recieves the layer as an argument`
```
const original = {a: 10}
const updatedCopy = modicopy(original).a.$apply((original)=>original * 2) //{a: 20}
```
**$remove**: `removes the provided keys from the layer that it is called on`
```
const original = {a: {b: "hello"}}
const updatedCopy = modicopy(original).a.$remove(['b']) //{a: {}}
```
**$copy**: `copies the entire layer that it is called on and gives it a new reference in memory` *(only run this if the layer is an array or object otherwise weird things can happen)*
```
const original = {a: {b: "hello"}}
const updatedCopy = modicopy(original).a.$copy("goodbye") //{a: {b: "goodbye"}}
```
**$concat**: `concats the provided array to the original at the layer the function is called on` *(arrays only)*
```
const original = {a: ["hello"]}
const updatedCopy = modicopy(original).a.$concat(["goodbye"]) //{a: ["hello", "goodbye"]}
```
**$push**: `pushes the provide value to the layer that the function is called on` *(arrays only)*
```
const original = {a: ["hello"]}
const updatedCopy = modicopy(original).a.$push("goodbye") //{a: ["hello", "goodbye"]}
```

## **modicopy internally uses heavy use of the `...`(spread) operator and in doing so _only the layer you run the function on will get a new refernce_**