/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */

/**
 * recursive function to flatten object
 * @param object
 */
let flatten = function(object) {
  let result = {};

  for (let ii in object) {
    if (!object.hasOwnProperty(ii)) {
      continue;
    }

    if ((typeof object[ii]) === 'object') {
      let flatObject = flatten(object[ii]);
      for (let xx in flatObject) {
        if (!flatObject.hasOwnProperty(xx)){
          continue;
        }
        result[ii + '.' + xx] = flatObject[xx];
      }
    } else {
      result[ii] = object[ii];
    }
  }
  return result;
};

module.exports = {flatten};
