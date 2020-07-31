import React, { useState } from "react";
import Interactive from "./interactive.jsx";

const Functionality = function () {
	const [image, setImage] = useState("");
	const [alert, setAlert] = useState("");

	return (
		<div>
			<h4>I am Functionality</h4>
			<Interactive setImage={setImage} setAlert={setAlert} />
		</div>
	);
};

export default Functionality;
