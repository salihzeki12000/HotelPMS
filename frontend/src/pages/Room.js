import React, { Component } from "react";
import AdminLayout from "../components/AdminLayout";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import MoreVertIcon from "@material-ui/icons/MoreVert";

import axios from "axios";

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            anchorEl: null,
            selectedRoom: null
        };
    }

    handleClick = (e, id) => {
        this.setState({ anchorEl: e.currentTarget, selectedRoom: id });
    };

    handleClose = e => {
        this.setState({ anchorEl: null, selectedRoom: null });
    };

    componentDidMount() {
        this.getAllRooms();
    }

    getAllRooms = async () => {
        try {
            let { data } = await axios.get("/api/room");
            this.setState({
                rooms: data
            });
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    deleteRoom = async () => {
        try {
            let id = this.state.selectedRoom;
            await axios.delete(`/api/room/${id}`);
            this.handleClose()
            this.getAllRooms();
        } catch (err) {
            console.log(err);
        }
    };

    viewRoom = () =>
        this.props.history.push(`/room/${this.state.selectedRoom}/view`);

    editRoom = () =>
        this.props.history.push(`/room/${this.state.selectedRoom}/edit`);

    render() {
        let { anchorEl } = this.state;
        let open = Boolean(anchorEl);
        return (
            <>
                <div
                    style={{
                        margin: "auto",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}
                >
                    <Paper style={{ backgroundColor: "white", padding: 20 }}>
                        <h1>Room(s)</h1>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">
                                        Room Type
                                    </TableCell>
                                    <TableCell align="left">
                                        Description
                                    </TableCell>
                                    <TableCell align="left">Price</TableCell>
                                    <TableCell align="left">
                                        Room Size
                                    </TableCell>
                                    <TableCell align="left">Quantity</TableCell>
                                    <TableCell align="left">
                                        Max Guest
                                    </TableCell>
                                    <TableCell align="left">
                                        Max Additional Guest
                                    </TableCell>
                                    <TableCell align="left">
                                        Private Bath
                                    </TableCell>
                                    <TableCell align="left">
                                        Free Parking
                                    </TableCell>
                                    <TableCell align="left">
                                        Non-refundable
                                    </TableCell>
                                    <TableCell align="left">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rooms.map((room, i) => {
                                    return (
                                        <TableRow>
                                            <TableCell align="left">
                                                {room.type}
                                            </TableCell>
                                            <TableCell align="left">
                                                {room.description}
                                            </TableCell>
                                            <TableCell align="left">
                                                {room.price}
                                            </TableCell>
                                            <TableCell align="left">
                                                {`${room.room_size} ${room.room_size_unit}`}
                                                <sup>2</sup>
                                            </TableCell>
                                            <TableCell align="left">
                                                {room.quantity}
                                            </TableCell>
                                            <TableCell align="left">
                                                {room.max_guest}
                                            </TableCell>
                                            <TableCell align="left">
                                                {room.max_add_guest}
                                            </TableCell>
                                            <TableCell align="left">
                                                {room.private_bath
                                                    ? "Yes"
                                                    : "NO"}
                                            </TableCell>
                                            <TableCell align="left">
                                                {room.free_parking
                                                    ? "Yes"
                                                    : "NO"}
                                            </TableCell>
                                            <TableCell align="left">
                                                {room.non_refundable
                                                    ? "Yes"
                                                    : "NO"}
                                            </TableCell>
                                            <TableCell align="left">
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={e =>
                                                        this.handleClick(
                                                            e,
                                                            room.id
                                                        )
                                                    }
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={open}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.viewRoom}>View</MenuItem>
                            <MenuItem onClick={this.editRoom}>Edit</MenuItem>
                            <MenuItem onClick={this.deleteRoom}>
                                Delete
                            </MenuItem>
                        </Menu>
                        <Fab
                            style={{
                                position: "absolute",
                                bottom: "50px",
                                right: 50
                            }}
                            size="large"
                            color="primary"
                            aria-label="add"
                            onClick={() => this.props.history.push("/room/add")}
                        >
                            <AddIcon />
                        </Fab>
                    </Paper>
                </div>
            </>
        );
    }
}
