"use strict";
const reverse = require("./StringUtil").reverse;

class CurrencyUtils {
    /**
     * convert decimal to currency format
     * @author https://github.com/chelx
     * @param {Number} amount
     * @param {Integer} digits The number of digits to appear after the decimal point. It value between 0 to 100
     * @param {Char} sections_delimeter The delemeter character between sections
     * @param {Char} decimal_delimeter The delemeter character between decimal and fraction
     * 
     * @return {Array} [<left part as string>, <right part as string>, <formated amount as string>]
     */
    static format (amount, digits = 0, sections_delimeter = ",", decimal_delimeter = ".") {
        if(amount === undefined || amount === null) return ["0", "", "0"];

        if(/^\d+(\.\d+|)$/.test(amount) === false) {
            throw "The first argument expect a number";
        }

        if(/^\d+$/.test(digits) === false) {
            throw "The second argument expect a integer";
        }

        let prefix = "";
        if(amount < 0) {
            amount = Math.abs(amount);
            prefix = "-";
        }

        let parts = amount.toFixed(digits).toString().split(".");
        let rightPart = parts.length == 2 ? parts[1] : "";
        let leftPart = reverse(parts[0]);
        leftPart = leftPart.replace(/\d{3}/g, "$&" + sections_delimeter);
        leftPart = leftPart.split(sections_delimeter).pop().length === 0 ? leftPart.substring(0, leftPart.length-1) : leftPart;
        leftPart = prefix + reverse(leftPart);
        let formated = rightPart.length > 0 ? leftPart + decimal_delimeter + rightPart : leftPart;

        return [leftPart, rightPart, formated];
    }
}

module.exports = CurrencyUtils;