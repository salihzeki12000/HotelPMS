import React from "react";
import { Switch, Route, Router, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import _ from "lodash";
import qs from "qs";

//pages
import Test from "./pages/Test";
import Component from "./pages/Component";
import Walkin from "./pages/WalkIn";
import Report from "./pages/Report";

import Reservation from "./pages/Reservation";
import Pending from "./pages/Pending";
import CheckIn from "./pages/CheckIn";

import Room from "./pages/Room";
import AddRoom from "./pages/AddRoom";

import Account from "./pages/Account";
import AddAccount from "./pages/AddAccount";

import RoomFacilities from "./pages/RoomFacilities";
import AddFacilities from "./pages/AddFacilities";

//booking
import Booking from "./booking/Booking";
import RoomInfo from "./booking/RoomInfo";
import GuestInfo from "./booking/GuestInfo";
import Confirmation from "./booking/Confirmation";

//Login
import Signin from "./login/Signin";

import "./App.css";
import ViewRoom from "./pages/ViewRoom";
import RoomType from "./pages/RoomType";
import Property from "./pages/Property";
import AddRoomType from "./pages/AddRoomType";
import ViewRoomType from "./pages/ViewRoomType";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";

import axios from "axios";
import requireAuthentication from "./components/auth/requireAuthentication";
import Bookings from "./pages/Bookings";
import ViewBooking from "./pages/ViewBooking";
import YearReport from "./pages/YearReport";
import ViewUser from "./pages/ViewUser";

export const history = createBrowserHistory({
	forceRefresh: false
});


history.location = Object.assign(history.location, { search: qs.parse(history.location.search) });

history.listen((location, action) => {
	location.search = qs.parse(location.search);
});

function App() {
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Router history={history}>
				<Switch>
					{/* Admin */}

					{/* <Route path="/booking" component={Booking} exact /> */}
					<Route path="/calendar" component={requireAuthentication(Component, ["ADMIN", "RECEPTIONIST"])} exact />
					<Route path="/Test" component={requireAuthentication(Test, ["ADMIN"])} exact />
					<Route path="/reports" render={() => <Redirect to="/reports/summary" />} exact />
					<Route path="/reports/summary" component={requireAuthentication(Report, ["ADMIN"])} exact />
					<Route path="/reports/yearly" component={requireAuthentication(YearReport, ["ADMIN"])} exact />
					<Route path="/walkin" component={requireAuthentication(Walkin, ["ADMIN", "RECEPTIONIST"])} exact />
					<Route path="/bookings/view/:id" component={requireAuthentication(ViewBooking, ["ADMIN", "RECEPTIONIST"])} exact />
					<Route path="/bookings" component={requireAuthentication(Bookings, ["ADMIN", "RECEPTIONIST"])} />
					{/* <Route path="/pending" component={Pending} exact />
                    <Route path="/checkIn" component={CheckIn} exact /> */}
					<Route path="/property" component={requireAuthentication(Property, ["ADMIN", "RECEPTIONIST"])} />
					<Route path="/room/:id/edit" component={requireAuthentication(AddRoom, ["ADMIN"])} exact />
					<Route path="/room/:id/view" component={requireAuthentication(ViewRoom, ["ADMIN"])} exact />
					<Route path="/room/add" component={requireAuthentication(AddRoom, ["ADMIN"])} exact />
					<Route path="/roomtype/:id/view" component={requireAuthentication(ViewRoomType, ["ADMIN"])} exact />
					<Route path="/roomtype/add" component={requireAuthentication(AddRoomType, ["ADMIN"])} exact />
					<Route path="/roomtype/:id/edit" component={requireAuthentication(AddRoomType, ["ADMIN"])} exact />
					<Route path="/roomfacilities" component={requireAuthentication(RoomFacilities, ["ADMIN"])} exact />
					<Route path="/roomfacilities/:id" component={requireAuthentication(AddFacilities, ["ADMIN"])} exact />
					<Route path="/addfacilities" component={requireAuthentication(AddFacilities, ["ADMIN"])} exact />
					<Route path="/account" component={requireAuthentication(Account, ["ADMIN"])} exact />
					<Route path="/edit/account/:id" component={requireAuthentication(AddAccount, ["ADMIN"])} exact />
					<Route path="/add/account" component={requireAuthentication(AddAccount, ["ADMIN"])} exact />
					{/* Booking */}
					<Route path="/booking" component={Booking} exact />
					<Route path="/roominfo" component={RoomInfo} exact />
					<Route path="/guestinfo" component={GuestInfo} exact />
					<Route path="/confirmation" component={Confirmation} exact />
					<Route path="/viewuser" component={ViewUser} exact />
					{/* Log-in */}
					<Route path="/sign-in" component={Signin} exact />

					<Route path="/" render={() => <Redirect to="/sign-in" />} exact />
				</Switch>
			</Router>
		</MuiPickersUtilsProvider>
	);
}

export default App;
