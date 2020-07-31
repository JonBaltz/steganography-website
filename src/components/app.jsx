import React, { Component } from "react";
import Info from "./info.jsx";
import Functionality from "./functionality.jsx";

class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Info />
				<Functionality />
			</div>
		);
	}
}

export default App;
