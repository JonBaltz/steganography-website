// A message class that has all the methods needed to prepare it for insertion into the image
module.exports = class Message {
	constructor(text) {
		this.text = text;
	}

	getText() {
		return this.text;
	}

	isValid() {
		return this.text.match("^[a-zA-Z0-9 ]*$") ? true : false;
	}

	// Implementation of a stream cipher using rc4. This will both encrypt and decrypt the message
	encryption(key) {
		const swap = function (array, one, two) {
			let temp = array[one];
			array[one] = array[two];
			array[two] = temp;
		};
		const storage = [];
		const longKey = [];
		for (let i = 0; i < 256; i++) {
			storage[i] = i;
			longKey[i] = key.charCodeAt(i % key.length) % 256;
		}
		let targetIndex = 0;
		// Randomizes the storage array by swapping values according to the longKey array
		for (let i = 0; i < 256; i++) {
			targetIndex = (targetIndex + storage[i] + longKey[i]) % 256;
			swap(storage, i, targetIndex);
		}
		let fromIndex = (targetIndex = 0);
		// Skips the first 256 bytes because similar keys will have similar orders before then
		for (let i = 0; i < 256; i++) {
			fromIndex = (fromIndex + 1) % 256;
			targetIndex = (targetIndex + storage[fromIndex]) % 256;
			swap(storage, fromIndex, targetIndex);
		}
		// Generates a key-byte, then runs XOR on the message string to encrypt it
		for (let i = 0; i < this.text.length; i++) {
			fromIndex = (fromIndex + 1) % 256;
			targetIndex = (targetIndex + storage[fromIndex]) % 256;
			swap(storage, fromIndex, targetIndex);
			this.text[i] = this.text[i] ^ storage[(storage[fromIndex] + storage[targetIndex]) % 256];
		}
		return this;
	}

	str2CharCodes() {
		this.text = this.text.split("").map((char) => char.charCodeAt(0));
		return this;
	}

	charCodes2Str() {
		this.text = this.text.map((code) => String.fromCharCode(code)).join("");
		return this;
	}

	// Converts character codes to 7 size zero padded binary strings, joins into a single string, and adds end-message flag
	prepareToHide() {
		this.text = this.text
			.map((code) => {
				let str = code.toString(2);
				while (str.length < 8) {
					str = "0" + str;
				}
				return str;
			})
			.join("");
		return this;
	}

	// Removes end-message flag, and converts to character codes
	afterReveal() {
		this.text = this.text.split(" ").map((binary) => parseInt(binary, 2));
		return this;
	}
};
