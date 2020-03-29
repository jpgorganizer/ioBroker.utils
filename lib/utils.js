/**
 * utils for ioBroker
 * Autor:               jpgorganizer (ioBroker) | jpgorganizer (github)
 * Version:             1.0.0 (29. January 2020)
 * SVN:                 $Rev: 1995 $
 * contains some functions for my iobroker adapter's
 */
'use strict';

let adapter;

function init(_adapter) {
	adapter = _adapter;
}


/*
 * sorts array of objects
 * @param: propertyname  name of property to sort for. 
 *                       Preceeding '-' sign in property name to sort in reverse 
 *                        ex. '-firstname'
 */

function arraySort(propertyname) {
    var sortOrder = 1;
    if(propertyname[0] === "-") {
        sortOrder = -1;
        propertyname = propertyname.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[propertyname] < b[propertyname]) ? -1 : (a[propertyname] > b[propertyname]) ? 1 : 0;
        return result * sortOrder;
    }
}

function decrypt(key, value) {
	let result = "";
	for (let i = 0; i < value.length; ++i) {
		result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
	}
	return result;
}

function encrypt(key, value) {
	var result = '';
	for(var i = 0; i < value.length; ++i) {
		result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
	}
	return result;
}


module.exports = {
	init: init,
	arraySort: arraySort,
	decrypt: decrypt
};

