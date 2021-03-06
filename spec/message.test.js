const Message = require("../src/helpers/message.js");

describe("Testing Message Functionality", () => {
	let testMessage, otherMessage, numberMessage;
	const chunk = function () {
		const binaryString = this.text;
		let string = "";
		for (let i = 0; i < binaryString.length; i++) {
			string += i % 8 ? binaryString[i] : ` ${binaryString[i]}`;
		}
		this.text = string.substring(1);
		return this;
	};

	beforeEach(() => {
		testMessage = new Message("Hello World");
		otherMessage = new Message("Wazzup World");
		numberMessage = new Message("123FooBar456");
		// testMessage.chunk = chunk;
		// otherMessage.chunk = chunk;
		// numberMessage.chunk = chunk;
	});

	describe("chunk (used for testing)", () => {
		test("should break strings into 8 character chunks seperated by a space", () => {
			const binaryMessage = new Message("00000000111111112222222233333333");
			binaryMessage.chunk = chunk;
			const result = binaryMessage.chunk().getText().split(" ");
			result.forEach((thing) => {
				expect(thing.length).toBe(8);
			});
		});
	});

	describe("isValid", () => {
		test("should return a boolean", () => {
			expect(typeof testMessage.isValid()).toBe("boolean");
		});

		test("should return true for a string entirely made of letters", () => {
			expect(testMessage.isValid()).toBe(true);
		});

		test("should return true for a string that contains numbers", () => {
			expect(numberMessage.isValid()).toBe(true);
		});

		test("should return false is a string contains punctuation or special characters", () => {
			let specialString = "',./?\\[]{}-=_+~!@#$%^&*();:";
			for (let i = 0; i < specialString.length; i++) {
				const specialMessage = new Message(`Hello ${specialString[i]}`);
				expect(specialMessage.isValid()).toBe(false);
			}
		});
	});

	describe("converters", () => {
		test("should not alter the message when converting to char codes and back", () => {
			testMessage.str2CharCodes().charCodes2Str();
			expect(testMessage.getText()).toBe("Hello World");
			otherMessage.str2CharCodes().charCodes2Str();
			expect(otherMessage.getText()).toBe("Wazzup World");
			numberMessage.str2CharCodes().charCodes2Str();
			expect(numberMessage.getText()).toBe("123FooBar456");
		});

		test("should return the correct type", () => {
			testMessage.str2CharCodes();
			const codes = testMessage.getText();
			expect(Array.isArray(codes)).toBe(true);
			for (let i = 0; i < codes.length; i++) {
				expect(typeof codes[i]).toBe("number");
			}
			expect(typeof testMessage.charCodes2Str().getText()).toBe("string");
		});

		test("should not alter the message when converting to binary and back", () => {
			testMessage.chunk = chunk;
			otherMessage.chunk = chunk;
			numberMessage.chunk = chunk;
			testMessage.str2CharCodes().prepareToHide().chunk().afterReveal().charCodes2Str();
			expect(testMessage.getText()).toBe("Hello World");
			otherMessage.str2CharCodes().prepareToHide().chunk().afterReveal().charCodes2Str();
			expect(otherMessage.getText()).toBe("Wazzup World");
			numberMessage.str2CharCodes().prepareToHide().chunk().afterReveal().charCodes2Str();
			expect(numberMessage.getText()).toBe("123FooBar456");
		});
	});

	describe("encryption", () => {
		test("should decrypt the string when using the smae password", () => {
			testMessage.str2CharCodes().encryption("Passw0rd123").encryption("Passw0rd123").charCodes2Str();
			expect(testMessage.getText()).toBe("Hello World");
		});

		test("should not return the string if the password is different", () => {
			testMessage.str2CharCodes().encryption("Passw0rd123").encryption("123Password").charCodes2Str();
			expect(testMessage.getText()).not.toBe("Hello World");
			otherMessage.str2CharCodes().encryption("Password").encryption("PAssword").charCodes2Str();
			expect(otherMessage.getText()).not.toBe("Wazzup World");
		});

		test("should not alter the message when going through the entire sequence", () => {
			const password = "Th1sIsAC0mpl3xPassw0rd";
			testMessage.chunk = chunk;
			testMessage
				.str2CharCodes()
				.encryption(password)
				.prepareToHide()
				.chunk()
				.afterReveal()
				.encryption(password)
				.charCodes2Str();
			expect(testMessage.getText()).toBe("Hello World");
		});
	});
});
