import React, { useState } from "react";
import Interactive from "./interactive.jsx";
import Images from "./images.jsx";

const Functionality = function () {
	const [image, setImage] = useState("");
	const [alert, setAlert] = useState("");

	return (
		<div>
			<h4>I am Functionality</h4>
			<Interactive setImage={setImage} alert={alert} setAlert={setAlert} />
			{alert}
			<Images />
		</div>
	);
};

export default Functionality;
