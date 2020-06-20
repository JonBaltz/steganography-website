// A message class that has all the methods needed to prepare it for insertion into the image
class Message {
	constructor(text) {
		this.text = text;
	}

	// Ensures that the message only consists of alphanumeric characters and spaces
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
		const s = [];
		const k = [];
		for (let i = 0; i < 256; i++) {
			s[i] = i;
			k[i] = key.charCodeAt(i % key.length) % 256;
		}
		let j = 0;
		// Randomizes the s array using the k array
		for (let i = 0; i < 256; i++) {
			j = (j + s[i] + k[i]) % 256;
			swap(s, i, j);
		}
		let l = j = 0;
		// Skips the first 256 bytes because similar keys will have similar orders before 256
		for (let i = 0; i < 256; i++) {
			l = (l + 1) % 256;
			j = (j + s[l]) % 256;
			swap(s, l, j);
		}
		// Generates a key-byte, then runs XOR on the message string to encrypt it
		for (let i = 0; i < this.text.length; i++) {
			l = (l + 1) % 256;
			j = (j + s[l]) % 256;
			swap(s, l, j);
			this.text[i] = this.text[i] ^ s[(s[l] + s[j]) % 256];
		}
		return this;
	}

	// This just creates an array of character codes from a string
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
	const m1 = new Message("hello world");
	console.assert(m1.isValid() === true, "a string of only letters is valid", m1.isValid());
	const m2 = new Message("12345");
	console.assert(m2.isValid() === true, "numbers are valid", m2.isValid());
	const m3 = new Message("'\\\"[]");
	console.assert(m3.isValid() === false, "special characters aren't valid", m3.isValid());
	console.assert(m1.str2CharCodes().prepareToHide().afterReveal().charCodes2Str().text === "hello world", "conversion to binary and back works");
	const t1 = new Message("Wazzup world");
	const t2 = new Message("Wazzup world");
	console.assert(JSON.stringify(t1.str2CharCodes().encryption("password").encryption("password").text) === JSON.stringify(t2.str2CharCodes().text), "Running encryption twice with the same key results in the same text");
	// console.log(t1.text, t2.text);
	console.assert(JSON.stringify(t1.encryption("password1234").text) !== JSON.stringify(t2.encryption("1234password")), "running encryption with different keys will not return the same text");
	// console.log(t1.text, t2.text);
	console.assert(m1.str2CharCodes().encryption("Wazzup").prepareToHide().afterReveal().encryption("Wazzup").charCodes2Str().text === "hello world", "the full sequence will not alter the original message by the end");
};
// tester();
