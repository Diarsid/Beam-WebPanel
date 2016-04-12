var React = require('react');
var Modal = require('react-modal');
var $ = require('jquery');

var styles =            require('.././styles.js');
var restDispatcher =    require('.././rest-dispatcher.js');
var isWebNameValid =    require('.././is-name-valid.js');

var RenameDirModalDialogController = React.createClass({

    getInitialState: function () {
        return {
            open: false,
            newName: "",
            nameValid: false,
            editButtonHover: false,
            cancelButtonHover: false
        };
    },

    show: function () {
        this.setState({open: true});
    },

    close: function () {
        this.setState({
            open: false,
            newName: "",
            nameValid: false,
            editButtonHover: false,
            cancelButtonHover: false
        });
    },

    onEditButtonClickHandle: function ( e ) {
        e.stopPropagation();
        e.preventDefault();
        this.show();
    },

    dirNameChanged: function ( e ) {
        if ( isWebNameValid( e.target.value )) {
            this.setState({
                newName: e.target.value,
                nameValid: true
            });
        } else {
            this.setState({
                newName: e.target.value,
                nameValid: false
            });
        }
    },

    editAction: function () {
        var thisComponent = this;
        if ( ! this.state.nameValid ) {
            return;
        }
        var data = {
            "name": this.state.newName
        };
        var newName = this.state.newName;
        this.close();
        $.ajax({
            method: 'PUT',
            url: restDispatcher.composeUrlToDirectoryField("webpanel", this.props.dirName, "name"),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
            success: function () {
                thisComponent.props.directoryRenamed(newName);
            },
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    editButtonToggle: function () {
        this.setState({editButtonHover: !this.state.editButtonHover});
    },

    cancelButtonToggle: function () {
        this.setState({cancelButtonHover: !this.state.cancelButtonHover});
    },

    getEditButtonStyle: function () {
        if ( this.state.nameValid ) {
            if ( this.state.editButtonHover ) {
                return styles.dialogButtonStyleHover;
            } else {
                return styles.dialogButtonStyle;
            }
        } else {
            return styles.dialogForbiddenButtonStyle
        }
    },

    getCancelButtonStyle: function () {
        if ( this.state.cancelButtonHover ) {
            return styles.dialogButtonStyleHover;
        } else {
            return styles.dialogButtonStyle;
        }
    },

    getInputStyle: function () {
        if (this.state.nameValid) {
            return styles.validInputStyle;
        } else {
            return styles.invalidInputStyle;
        }
    },

    render: function () {
        var editButtonStyle = this.getEditButtonStyle();
        var cancelButtonStyle = this.getCancelButtonStyle();
        var editInputStyle = this.getInputStyle();
        return (
            <span className="rename-dir-modal-dialog-controller">
                <button type="button"
                        className="directory-bar-button"
                        onClick={this.onEditButtonClickHandle}>
                </button>
                <Modal
                    closeTimeoutMS={0}
                    isOpen={this.state.open}
                    onRequestClose={this.close}
                    shouldCloseOnOverlayClick={false}
                    style={styles.modalDialogStyle} >
                    <label className="form-label">Edit <b>{this.props.dirName}</b> name:</label>
                    <br/>
                    <input type="text"
                           id="new-dir-name"
                           placeholder="name..."
                           className="form-input"
                           style={editInputStyle}
                           value={this.state.newName}
                           onChange={this.dirNameChanged}/>
                    <br/>

                    <div className="dialog-button-pane">
                        <button
                            type="button"
                            style={editButtonStyle}
                            onClick={this.editAction}
                            onMouseEnter={this.editButtonToggle}
                            onMouseLeave={this.editButtonToggle}>
                            Edit</button>
                        <button
                            type="button"
                            style={cancelButtonStyle}
                            onClick={this.close}
                            onMouseEnter={this.cancelButtonToggle}
                            onMouseLeave={this.cancelButtonToggle}>
                            Cancel</button>
                        <br/>
                    </div>
                </Modal>
            </span>
        );
    }
});

module.exports = RenameDirModalDialogController;
