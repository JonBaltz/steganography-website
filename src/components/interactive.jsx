import React, { useState, useEffect } from "react";
import useForm from "./useForm.js";

const Interactive = function (props) {
	const [{ text, password }, handleChange] = useForm({ text: "", password: "" });

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
