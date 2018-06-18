"use strict";

module.exports = ( function() {
    let version = "1.0.0";
    let shippo_util = {};

    /**
     * replace các số trong {} bằng các tham số truyền vào
     * Utils.formatString('{0} {1}: {2}', [method, url, JSON.stringify(data)])
     * @param string
     * @param args
     * @returns {void | *}
     */
    shippo_util.stringNormalize = function( string, args ) {
        return string.replace( /{(\d+)}/g, ( match, number ) => {
            return typeof args[ number ] !== "undefined" ? args[ number ] : match;
        } );
    };

    /**
     *
     * @param object
     * @returns {*}
     */
    shippo_util.bindGetProperty = function( object ) {
        object.getProp = function( propName ) {
            if ( object.hasOwnProperty( propName ) && typeof object[ propName ] !== "undefined" ) {
                return object[ propName ];
            }
            return null;
        };
        object.requireProp = function( propName ) {
            if ( object.hasOwnProperty( propName ) && typeof object[ propName ] !== "undefined" ) {
                return object[ propName ];
            }
            throw new Error( `Object's properties [${ propName }] not found ` );
        };
        return object;
    };

    /**
     *
     * @param object
     * @param propName
     * @returns {*}
     */
    shippo_util.getProp = function( object, propName ) {
        if ( object.hasOwnProperty( propName ) && typeof object[ propName ] !== "undefined" ) {
            return object[ propName ];
        }
        return null;
    };

    /**
     *
     * @param object
     * @param propName
     * @returns {*}
     */
    shippo_util.requireProp = function( object, propName ) {
        if ( Utils.getProp( object, propName ) !== null ) {
            return object[ propName ];
        }
        throw new Error( `Object's properties [${ propName }] not found ` );
    };

    /**
     *
     * @param ms
     * @returns {Promise<any>}
     */
    shippo_util.delay = function( ms ) {
        return new Promise( ( resolve ) => setTimeout( resolve, ms ) );
    };

    return shippo_util;
} ());
