"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function modicopy(original) {
  var keyChain = [];

  var chain = function chain(updateObj) {
    var $obj = {};
    $obj.$set = w(updateObj);
    $obj.$merge = w(updateObj, { merge: true });
    $obj.$apply = w(updateObj, { apply: true });
    $obj.$remove = w(updateObj, { remove: true });
    if (Array.isArray(updateObj)) {
      $obj.$concat = w(updateObj, { concat: true });
      $obj.$push = w(updateObj, { push: true });
    }

    for (var k in updateObj) {
      Object.defineProperty($obj, k, { get: addToChain(k, updateObj) });
    }

    return $obj;
  };

  var addToChain = function addToChain(key, obj) {
    return function () {
      keyChain.push(key);
      return chain(obj[key]);
    };
  };

  var w = function w(obj) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function (data) {
      var merge = options.merge,
          apply = options.apply,
          concat = options.concat,
          push = options.push,
          remove = options.remove;

      var updateKey = keyChain[keyChain.length - 1];
      var keyStructure = Array.isArray(original) ? [] : {};
      var isBase = updateKey === undefined;

      var updateData = function updateData(updateObject) {

        if (merge) return Array.isArray(updateObject) ? Object.values(_extends({}, updateObject, data)) : _extends({}, updateObject, data);
        if (apply) return data(resolveLayer(keyChain, original));
        if (remove) {
          r = _extends({}, updateObject);
          data.forEach(function (key) {
            delete r[key];
          });
          return Array.isArray(updateObject) ? Object.values(r) : r;
        }
        if (concat) return [].concat(_toConsumableArray(updateObject), _toConsumableArray(data));
        if (push) return [].concat(_toConsumableArray(updateObject), [data]);
        //if (set)
        return data;
      };

      if (isBase) {
        return updateData(original);
      } else {
        keyChain.reduce(function (o, key, i) {
          var og = resolveLayer(keyChain.slice(0, i), original);
          return o[key] = i === keyChain.length - 1 ? updateData(og[key]) : Array.isArray(og[key]) ? [].concat(_toConsumableArray(og[key])) : _extends({}, og[key]);
        }, keyStructure);

        return Array.isArray(original) ? Object.values(_extends({}, original, keyStructure)) : _extends({}, original, keyStructure);
      }
    };
  };

  return chain(original);
}

var resolveLayer = function resolveLayer(pathArr, obj) {
  return pathArr.reduce(function (prev, curr) {
    return prev ? prev[curr] : undefined;
  }, obj);
};

module.exports = modicopy;
