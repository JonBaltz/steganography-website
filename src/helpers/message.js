// A message class that has all the methods needed to prepare it for insertion into the image
class Message {
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
		const swap = function(array, one, two) {
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
		let fromIndex = targetIndex = 0;
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
		this.text = this.text.split("").map(char => char.charCodeAt(0));
		return this;
	}

	charCodes2Str() {
		this.text = this.text.map(code => String.fromCharCode(code)).join("");
		return this;
	}

	// Converts character codes to 8 size zero padded binary strings, joins into a single string, and ends end-message flag
	prepareToHide() {
		// FOR TESTING I USE .join(" ") BUT WHEN FINISHED USE .join("")
		this.text = this.text.map(code => code.toString(2)).join(" ");
		return this;
	}
	
	// Removes end-message flag, and converts to character codes
	afterReveal() {
		this.text = this.text.split(" ").map(binary => parseInt(binary, 2));
		return this;
	}
};


// Uncomment tester function to test code
const tester = function() {
	// -----!!!!!----- Testing the validation function -----!!!!!-----
	const m1 = new Message("hello world");
	console.assert(m1.isValid() === true, "a string of only letters is valid", m1.isValid());
	const m2 = new Message("12345");
	console.assert(m2.isValid() === true, "numbers are valid", m2.isValid());
	const m3 = new Message("'\\\"[]");
	console.assert(m3.isValid() === false, "special characters aren't valid", m3.isValid());
	// -----!!!!!----- Testing the conversion to binary and back works properly -----!!!!!-----
	console.assert(m1.str2CharCodes().prepareToHide().afterReveal().charCodes2Str().getText()=== "hello world", "conversion to binary and back works");
	// -----!!!!!----- Testing the encryption function works -----!!!!!-----
	const t1 = new Message("Wazzup world");
	const t2 = new Message("Wazzup world");
	console.assert(JSON.stringify(t1.str2CharCodes().encryption("password").encryption("password").getText()) === JSON.stringify(t2.str2CharCodes().getText()), "Running encryption twice with the same key results in the same text");
	console.assert(JSON.stringify(t1.encryption("password1234").getText()) !== JSON.stringify(t2.encryption("1234password").getText()), "running encryption with different keys will not return the same text");
	console.assert(m1.str2CharCodes().encryption("Wazzup").prepareToHide().afterReveal().encryption("Wazzup").charCodes2Str().getText()=== "hello world", "the full sequence will not alter the original message by the end");
};
// tester();
