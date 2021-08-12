function removeBrackets(str) {
	return str.replace(/[[\]\\]/g, '')
}

const urban = require('urban')

function urbanDictionary(str) {
	return new Promise((resolve, reject) => {
		urban(str).first(word => resolve(word));
	});
}

function delay(seconds) {
	return new Promise((resolve, reject) => {
	setTimeout(() => {
			resolve();
		}, seconds * 1000);
	});
}


module.exports = {
	removeBrackets,
	urbanDictionary,
	delay
}
