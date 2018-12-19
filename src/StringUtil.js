'use strict';

/*
 * Copyright (c) 2018 by Lưu Hiếu <tronghieu.luu@gmail.com>
 */

/**
 * replace các số trong {} bằng các tham số truyền vào
 * Utils.formatString('{0} {1}: {2}', [method, url, JSON.stringify(data)])
 *
 * @param string
 * @param args
 * @returns string
 *
 */
let normalize = ( string, args ) => {
    return string.replace( /{(\d+)}/g, ( match, number ) => {
        return typeof args[ number ] !== "undefined" ? args[ number ] : match;
    } );
};

module.exports = {normalize};