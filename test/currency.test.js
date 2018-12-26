const assert = require('chai').assert;
const CurrencyUtils = require("./../").CurrencyUtils;

describe("Test currency utils", () => {
    describe("Normal case", () => {
        it("Normal case", ()=> {
            assert.deepEqual(CurrencyUtils.format(1000000.31, 2, ",", "."), ["1,000,000", "31", "1,000,000.31"], "format a decimal");
            assert.deepEqual(CurrencyUtils.format(100000.31), ["100,000", "", "100,000"], "format a decimal without some argument");
            assert.deepEqual(CurrencyUtils.format(100000, 2, ",", "."), ["100,000", "00", "100,000.00"], "format a integer number");
            assert.deepEqual(CurrencyUtils.format(100000), ["100,000", "", "100,000"], "format a integer number without some argument");
        })
    })

    describe("Border case", () => {
        it("Border case", ()=> {
            assert.deepEqual(CurrencyUtils.format(0, 2, ",", "."), ["0", "00", "0.00"], "format zero");
            assert.deepEqual(CurrencyUtils.format(12345678901234.12345678901234, 3, ",", "."), ["12,345,678,901,234", "123", "12,345,678,901,234.123"], "format a big decimal");
        })
    })

    describe("Abnormal case", () => {
        it("Abnormal case", ()=> {
            assert.throws(() => {CurrencyUtils.format("a string", 2, ",", ".")}, "The first argument expect a number", "format a string");
            assert.throws(() => {CurrencyUtils.format(1234567890123456789012, 2, ",", ".")}, "The first argument expect a number", "format a number over 22 digits");
            assert.throws(() => {CurrencyUtils.format(1234, "a string", ",", ".")}, "The second argument expect a integer", "format with digits argument is a string");
            assert.throws(() => {CurrencyUtils.format(1234, 2.12, ",", ".")}, "The second argument expect a integer", "format with digits argument is a decimal");
            assert.throws(() => {CurrencyUtils.format(1234, 1234567890123456789123, ",", ".")}, "The second argument expect a integer", "format with digits argument is a over 22 digits number");
            assert.throws(() => {CurrencyUtils.format(1234, 101, ",", ".")}, "toFixed() digits argument must be between 0 and 100", "format with digits argument is a over 100");
        })
        
        
    })
})