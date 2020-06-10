// A message class that has all the methods needed to prepare it for insertion into the image
class Message {
	constructor(text) {
		this.text = text;
	}

	// Ensures that the message only consists of alphanumeric characters and spaces
	isValid() {
		return this.text.match("^[a-zA-Z0-9 ]*$") ? true : false;
	}

	encrypt(key) {
		//
	}

	decrypt(key) {
		//
	}

	str2Binary() {
		this.text = this.text.split("").map((char) => char.charCodeAt(0).toString(2)).join(" ");
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
	console.assert(m1.str2Binary().binary2Str().text === "hello world", "conversion to binary and back works");
};
tester();
