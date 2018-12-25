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
let formatWithArray = ( string, args ) => {
    return string.replace( /{(\d+)}/g, ( match, number ) => {
        return typeof args[ number ] !== "undefined" ? args[ number ] : match;
    } );
};

const signed = 'ăâđêôơưàảãạáằẳẵặắầẩẫậấèẻẽẹéềểễệế'
    +'ìỉĩịíòỏõọóồổỗộốờởỡợớùủũụúừửữựứỳỷỹỵý'
    +'ĂÂĐÊÔƠƯÀẢÃẠÁẰẲẴẶẮẦẨẪẬẤÈẺẼẸÉỀỂỄỆẾÌỈĨỊÍ'
    +'ÒỎÕỌÓỒỔỖỘỐỜỞỠỢỚÙỦŨỤÚỪỬỮỰỨỲỶỸỴÝĐÐ';

const unsigned = 'aadeoouaaaaaaaaaaaaaaaeeeeeeeeee'
    +'iiiiiooooooooooooooouuuuuuuuuuyyyyy'
    +'AADEOOUAAAAAAAAAAAAAAAEEEEEEEEEEIIIII'
    +'OOOOOOOOOOOOOOOUUUUUUUUUUYYYYYDD';

let normalize = (str) => {
    return trimDoubleSpace(unsign(str.trim())).toLowerCase();
};

let unsign = (str) => {
    let result = [];
    for (let ii = 0; ii < str.length; ii++) {
        let index = signed.indexOf(str[ii]);
        if (index > -1) {
            result.push(unsigned[index]);
        }
        else {
            result.push(str[ii]);
        }
    }
    return result.join('');
};

let trimDoubleSpace = (str) => {
    while (str.indexOf('  ') > -1) {
        str = str.replace('  ', ' ');
    }
    return str;
};

let keepOnlyCharacter = (str, keepSpace = true) => {
    let result = [];
    for (let ii = 0; ii <str.length; ii++) {
        let char = str[ii];
        if ((char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || (keepSpace && char === ' ')) {
            result.push(char);
        }
    }
    return result.join('');
};


module.exports = {formatWithArray, normalize, unsign, trimDoubleSpace, keepOnlyCharacter};