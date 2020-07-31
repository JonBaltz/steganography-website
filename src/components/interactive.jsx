import React, { useState, useEffect } from "react";

const Interactive = function (props) {
	const [text, setText] = useState("");
	const [password, setPassword] = useState("");

	const handleChange = function (event) {
		switch (event.target.name) {
			case "text":
				setText(event.target.value);
				break;
			case "password":
				setPassword(event.target.value);
				break;
			default:
				break;
		}
	};

	return (
		<div>
			<h5>I am the interactive component</h5>
			<input name="text" type="text" onChange={handleChange}></input>
			{text}
			<input name="password" type="password" onChange={handleChange}></input>
			{password}
		</div>
	);
};

export default Interactive;
