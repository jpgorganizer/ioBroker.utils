/**
 * utils for ioBroker
 * Autor:               jpgorganizer (ioBroker) | jpgorganizer (github)
 * Version:             1.2.0 ($Date: 2020-06-13 17:45:16 +0200 (Sa, 13 Jun 2020) $)
 * SVN:                 $Rev: 2165 $
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
		adapter.log.info(configloglevel + '/ ' + val);
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
		console.log(configloglevel + '/ ' + val);
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


/**
 * replace all occurences: replace 'find' by 'replace' in 'str'
 * in original from https://stackoverflow.com/a/1144788
 * @param   {string}    str  source string in which find will be replaced by replace
 * @param   {string}    find string which which gets replaced
 * @param   {string}    replace  replace string
 * @return  {string}    string with replaced parts
 */
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}


/**
 * string compare with wildcard
 * wildcard is '*'
 * in original from https://stackoverflow.com/a/32402438
 * @param   {string}    str  source string 
 * @param   {string}    rule string with wildcard to compare with str
 * @return  {string}    true, if rule matches to str, false otherwise
 * Short code
 */
function matchRuleShort(str, rule) {
  var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}

/**
 * string compare with wildcard
 * wildcard is '*'
 * in original from https://stackoverflow.com/a/32402438
 * @param   {string}    str  source string 
 * @param   {string}    rule string with wildcard to compare with str
 * @return  {string}    true, if rule matches to str, false otherwise
 * Explanation code
 */
function matchRuleExpl(str, rule) {
  // for this solution to work on any string, no matter what characters it has
  var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

  // "."  => Find a single character, except newline or line terminator
  // ".*" => Matches any string that contains zero or more characters
  rule = rule.split("*").map(escapeRegex).join(".*");

  // "^"  => Matches any string with the following at the beginning of it
  // "$"  => Matches any string with that in front at the end of it
  rule = "^" + rule + "$"

  //Create a regular expression object for matching string
  var regex = new RegExp(rule);

  //Returns true if it finds a match, otherwise it returns false
  return regex.test(str);
}

/**
 * checks a date string 
 * @param   {string} dateStr  date string
 * @return  {number}  -2, if its a not a date string
 *                    -1, if its a valid date/time string, 
 *                   >=0, the number of milliseconds, if its a number
 */
function isValidDate(dateStr) {
	if (isNaN(dateStr)) { //Checked for numeric
		let dt = new Date(dateStr);
		if (isNaN(dt.getTime())) { //Checked for date
			return -2; // no date string
		} else {
			return -1; // valid date string
		}
	} else {
		//let dt = new Date(parseInt(dateStr));
		let n = parseInt(dateStr);
		if (isNaN(n)) {
			return -2;
		} else {
			return n; // number
		}
	}
}

/*
 * makes values printable which shouldn't be printed in logs; 
 * keeps number of chars, '.' and '-' are kept, all other chars get X
 * e.g. apikeys or similar
 * @param    value      value string 
 * @param    num        optional start value, if not set 4 is used instead 
 * @return   printable value
 */
function makePrintable(value, num) {
	var result = '';
	let startval = 4;
	let keepchar=['.', '-'];
	let replace = 'X';
	let i;
	
	if (num) {
		num = parseInt(num);
		if (!isNaN(num)) {
			if (num >= 0) {
				startval = num;
			}
		}
	}
	
	for (i=0; i < startval && i < value.length; ++i) {
		result += value[i];
	}
	
	for(i = startval ; i < value.length; ++i) {
		if (keepchar.indexOf(value[i]) === -1) {
			result += replace;
		} else {
			result += value[i];
		}
	}
	return result;
}

module.exports = {
	init: init,
	adapterloginfo: adapterloginfo,
	consolelog: consolelog,
	arraySort: arraySort,
	getRandomInt: getRandomInt,
	curTime: curTime,
	encrypt: encrypt,
	decrypt: decrypt,
	replaceAll: replaceAll,
	matchRuleShort: matchRuleShort,
	isValidDate: isValidDate,
	makePrintable: makePrintable
};

