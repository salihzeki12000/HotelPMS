import React, { Component } from "react";
import AdminLayout from "../components/AdminLayout";

export default class Booking extends Component {
	render() {
		return (
			<AdminLayout {...this.props}>
				<h1>Home</h1>
			</AdminLayout>
		);
	}
}
