let assert = require('chai').assert;
const { randomInt, randomFloat, randomInArray, randomString, randomCharacter, randomChance} = require('./../src/Randomizer');

describe('Randomizer', () => {
    it('Random int', () => {
        let min = 0, max = 20, randomInteger = null;
        let isRandomInteger = false;

        for (let ii = 0; ii < 10; ii++) {
            let num = randomInt(min, max);
            assert.equal(num <= max, true, 'is less than or equal to max');
            assert.equal(num >= min, true, 'is greater than or equal to min');

            randomInteger = randomInteger === null ? num : randomInteger;
            isRandomInteger = (randomInteger !== num) ? true : isRandomInteger;
        }

        assert.equal(isRandomInteger, true, 'always return a random integer');
    });

    it('Random float', () => {
        let min = 0, max = 20, randomNum = null;
        let isRandomFloat = false;

        for (let ii = 0; ii < 10; ii++) {
            let num = randomFloat(min, max);
            assert.equal(num <= max, true, 'is less than or equal to max');
            assert.equal(num >= min, true, 'is greater than or equal to min');

            randomNum = randomNum === null ? num : randomNum;
            isRandomFloat = (randomNum !== num) ? true : isRandomFloat;
        }

        assert.equal(isRandomFloat, true, 'always return a random integer');
    });

    it('Random in array', () => {
        let arrInt = [], isRandomElement = false, randomElement = null;
        for (let ii = 0; ii < 20; ii++) {
            arrInt.push(randomInt(100, 200));
        }

        for (let ii = 0; ii < 10; ii++) {
            let element = randomInArray(arrInt);
            assert.equal(arrInt.indexOf(element) >= 0, true, 'belong to array');

            randomElement = randomElement === null ? element : randomElement;
            isRandomElement = (randomElement !== element) ? true : isRandomElement;
        }

        assert.equal(isRandomElement, true, 'always return a random element');
    });

    it('Random string', () => {
        let length = randomInt(10, 100), isRandomString = false, randomStr = null;

        for (let ii = 0; ii < 10; ii++) {
            let str = randomString(length);

            randomStr = randomStr === null ? str : randomStr;
            isRandomString = (randomStr !== str) ? true : isRandomString;
        }

        assert.equal(isRandomString, true, 'always return a random string');
    });

    it('Random character', () => {
        let isRandomCharacter = false, randomChar = null;

        for (let ii = 0; ii < 10; ii++) {
            let character = randomCharacter();

            randomChar = randomChar === null ? character : randomChar;
            isRandomCharacter = (randomChar !== character) ? true : isRandomCharacter;
        }

        assert.equal(isRandomCharacter, true, 'always return a random character');
    });
});
