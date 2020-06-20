// A message class that has all the methods needed to prepare it for insertion into the image
class Message {
	constructor(text) {
		this.text = text;
	}

	// Ensures that the message only consists of alphanumeric characters and spaces
	isValid() {
		return this.text.match("^[a-zA-Z0-9 ]*$") ? true : false;
	}

	encryption(key) {
		// Implementation of a stream cipher using rc4
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
	str2Binary() {
		this.text = this.text.split("").map((char) => char.charCodeAt(0));
		return this;
	}

	binary2Str() {
		this.text = this.text.split(" ").map((val) => String.fromCharCode(parseInt(val, 2))).join("");
		return this;
	}

	// Removes all spaces from binary message and adds end message flag
	prepareToHide() {
		this.text = this.text.split(" ").join("");
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
	// console.assert(m1.str2Binary().binary2Str().text === "hello world", "conversion to binary and back works");
	const t1 = new Message("Wazzup world");
	const t2 = new Message("Wazzup world");
	console.assert(JSON.stringify(t1.str2Binary().encryption("password").encryption("password").text) === JSON.stringify(t2.str2Binary().text), "Running encryption twice with the same key results in the same text");
	// console.log(t1.text, t2.text);
	console.assert(JSON.stringify(t1.encryption("password1234").text) !== JSON.stringify(t2.encryption("1234password")), "running encryption with different keys will not return the same text");
	// console.log(t1.text, t2.text);
};
tester();
