/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */
'use strict';

let delay = (ms) => {
  return new Promise( ( resolve ) => setTimeout( resolve, ms ) );
};

module.exports = {delay};