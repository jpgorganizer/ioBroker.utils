/**
 * utils for ioBroker
 * Autor:               jpgorganizer (ioBroker) | jpgorganizer (github)
 * Version:             1.0.0 (29. January 2020)
 * SVN:                 $Rev: 2004 $
 * contains some functions for my iobroker adapter's
 */
'use strict';

let adapter;
let configloglevel;

function init(_adapter) {
	adapter = _adapter;
	configloglevel = adapter.config.logLevel; 
}

/*
 * writes string val to adapter.log.info if level is lower or equal to global level 
 * @param    level    log integer 1..3, level for this string val
 * @param    val      val string 
 * @return   random integer from 0 to max-1 
 */
function adapterloginfo(level, val) {
	if (level >=1 && level <=3 && level <= configloglevel) {
		adapter.log.info(val);
	}
}

/*
 * writes string val to console if level is lower or equal to global level 
 * @param    level    log integer 1..3, level for this string val
 * @param    val      val string 
 * @return   random integer from 0 to max-1 
 */
function consolelog(level, val) {
	if (level >=1 && level <=3 && level <= configloglevel) {
		console.log(val);
	}
}

/*
 * returns a random integer
 * @param    max    max number
 * @return   random integer from 0 to max-1 
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


/*
 * sorts array of objects
 * @param: propertyname  name of property to sort for. 
 *                       Preceeding '-' sign in propertyname to sort in reverse order
 *                       ex. '-firstname'
 * from https://stackoverflow.com/a/4760279
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

/*
 * decrypts value with key
 * @param key      the key
 * @param value    the value to decrypt
 * @return         decrypted value
 */
function decrypt(key, value) {
	let result = "";
	for (let i = 0; i < value.length; ++i) {
		result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
	}
	return result;
}

/*
 * encrypts value with key
 * @param key      the key
 * @param value    the value to encrypt
 * @return         encrypted value
 */
function encrypt(key, value) {
	var result = '';
	for(var i = 0; i < value.length; ++i) {
		result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
	}
	return result;
}

/**
 * Fügt Vornullen zu einer Zahl hinzu, macht also z.B. aus 7 eine "007". 
 * Akzeptiert sowohl Datentyp number und string als Eingabe.
 * from https://forum.iobroker.net/topic/24179/vorlage-hilfreiche-javascript-funktionen/2
 * zeroPad(5, 4);    // wird "0005"
 * zeroPad('5', 6);  // wird "000005"
 * zeroPad(1234, 2); // wird "1234" :)
 * @param  {string|number}  num     Zahl, die Vornull(en) bekommen soll
 * @param  {number}         places  Anzahl Stellen.
 * @return {string}         Zahl mit Vornullen wie gewünscht.
 */
function zeroPad(num, places) {
    let zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;        
} 

/**
 * Converts a given date datatype into European time. E.g. '9:03pm and 17 seconds, 234 milliseconds' -> '21:03:17,234'
 * Requires function zeroPad().
 * in original from https://forum.iobroker.net/topic/24179/vorlage-hilfreiche-javascript-funktionen/2
 * @param   {object}    inputDate   Date 
 * @return  {string}    time in European time as String
 */
function timeToEuroString(inputDate) {
    return zeroPad(inputDate.getHours(), 2) + ':' + 
	       zeroPad(inputDate.getMinutes(), 2) + ':' + 
		   zeroPad(inputDate.getSeconds(), 2) + ',' +
		   zeroPad(inputDate.getMilliseconds(), 3);
}

/**
 * Returns current time in European time format. E.g. '9:03pm and 17 seconds, 234 milliseconds' -> '21:03:17,234'
 * Requires function timeToEuroString().
 * @return  {string}    Time as String
 */
function curTime() {
	let d = new Date();
	return timeToEuroString(d);
}

module.exports = {
	init: init,
	adapterloginfo: adapterloginfo,
	consolelog: consolelog,
	arraySort: arraySort,
	getRandomInt: getRandomInt,
	curTime: curTime,
	encrypt: encrypt,
	decrypt: decrypt
};

