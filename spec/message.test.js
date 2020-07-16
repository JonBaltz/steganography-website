const Message = require("../src/helpers/message.js");

describe("Testing Message Functionality", () => {
	let testMessage;
	let otherMessage;

	beforeEach(() => {
		testMessage = new Message("Hello World");
		otherMessage = new Message("Wazzup world");
	});

	describe("The isValid method works", () => {
		test("isValid returns a boolean", () => {
			expect(typeof testMessage.isValid()).toBe("boolean");
		});

		test("A string of only letters is valid", () => {
			expect(testMessage.isValid()).toBe(true);
		});

		test("A string with numbers is valid", () => {
			const numberMessage = new Message("12345");
			expect(numberMessage.isValid()).toBe(true);
		});

		test("A string with special characters and punctuation is not valid", () => {
			let specialString = "',./?\\[]{}-=_+~!@#$%^&*();:";
			for (let i = 0; i < specialString.length; i++) {
				const specialMessage = new Message(`Hello ${specialString[i]}`);
				expect(specialMessage.isValid()).toBe(false);
			}
		});
	});

	describe("Converters", () => {
		test("Converting to Character Codes and Back Doesn't Alter Message", () => {
			testMessage.str2CharCodes().charCodes2Str();
			expect(testMessage.getText()).toBe("Hello World");
		});

		test("str2CharCodes Returns an Array of Numbers", () => {
			testMessage.str2CharCodes();
			const codes = testMessage.getText();
			expect(Array.isArray(codes)).toBe(true);
			for (let i = 0; i < codes.length; i++) {
				expect(typeof codes[i]).toBe("number");
			}
		});
	});
});
