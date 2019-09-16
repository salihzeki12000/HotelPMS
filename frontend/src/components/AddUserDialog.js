import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

//icons
import PersonIcon from "@material-ui/icons/Person";

import axios from "axios";
import makeStyles from "@material-ui/styles/makeStyles";

export default class AddUserDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fetching: true,
            selectedUser: null,
            selectedUserIndex: null,
            users: []
        };
    }

    onClose = () => {
        this.setState({
            fetching: true,
            selectedUser: null,
            selectedUserIndex: null
        });
        this.props.handleClose();
    };

    onEntered = async () => {
        try {
            let { data } = await axios.get("/api/user");
            this.setState({
                users: data,
                fetching: false,
                selectedUser: this.props.selectedUser
            });
        } catch (err) {
            console.log(err);
        }
    };

    handleSelectUser = (id, index) =>
        this.setState({ selectedUser: id, selectedUserIndex: index });

    submitUser = () => {
        let user = this.state.users[this.state.selectedUserIndex];
        this.props.setUser(user);
        this.onClose();
    };

    render() {
        let { users } = this.state;
        return (
            <Dialog
                onClose={this.onClose}
                onEntered={this.onEntered}
                aria-labelledby="simple-dialog-title"
                open={this.props.open}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="simple-dialog-title">Select guest</DialogTitle>
                {this.state.fetching ? (
                    <div
                        style={{
                            width: "100%",
                            margin: "10px 0",
                            textAlign: "center"
                        }}
                    >
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <List>
                            {users.map((user, i) => (
                                <Tooltip title={user.email}>
                                    <ListItem
                                        button
                                        // onClick={() => handleListItemClick(email)}
                                        key={user.id}
                                        onClick={() =>
                                            this.handleSelectUser(user.id, i)
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                style={{
                                                    backgroundColor: "#3f51b5"
                                                }}
                                            >
                                                <Icon>
                                                    {user.id ===
                                                    this.state.selectedUser
                                                        ? "check"
                                                        : "person"}
                                                </Icon>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${user.honorific}. ${user.firstname} ${user.lastname}`}
                                        />
                                    </ListItem>
                                </Tooltip>
                            ))}

                            {/* <ListItem
                    button
                    onClick={() => handleListItemClick("addAccount")}
                >
                    <ListItemAvatar>
                        <Avatar>
                            <AddIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="add account" />
                </ListItem> */}
                        </List>
                    </>
                )}
                <DialogActions>
                    <Button color="primary" onClick={this.onClose}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={this.submitUser}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}