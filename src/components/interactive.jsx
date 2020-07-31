import React, { useEffect } from "react";
import useForm from "./useForm.js";

const Interactive = function ({ alert, setAlert }) {
	const [{ text, password }, handleChange] = useForm({ text: "", password: "" });

	useEffect(() => {
		console.log("alert: ", alert);
	}, [alert]);

	return (
		<div>
			<h5>I am the interactive component</h5>
			<input name="text" type="text" onChange={handleChange}></input>
			{text}
			<input name="password" type="password" onChange={handleChange}></input>
			{password}
			<input name="alert" onChange={(e) => setAlert(e.target.value)}></input>
		</div>
	);
};

export default Interactive;
