'use strict';

const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * return a random int
 * @param min
 * @param max
 * @returns {number}
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * return a random float
 * @param min
 * @param max
 * @returns {*}
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * return a random element in array
 * @param array
 * @returns {*}
 */
function randomInArray(array) {
    return array[randomInt(0, array.length - 1)];
}

/**
 * return a random string
 * @param length
 * @returns {string}
 */
function randomString(length) {
    let text = [];

    for( let i=0; i < length; i++ )
        text.push(possible.charAt(randomInt(0, possible.length -1)));

    return text.join('');
}

/**
 * return a random character
 * @returns {*}
 */
function randomCharacter() {
    return randomInArray(possible.split(""));
}

/**
 * Trả về true/false theo xác suất chance sẽ là true
 * @param chance
 * @returns {boolean}
 */
function randomChance(chance) {
    let dice = randomInt(1, 100);
    return dice <= chance;
}

module.exports = { randomInt, randomFloat, randomInArray, randomString, randomCharacter, randomChance};
