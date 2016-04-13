var React = require('react');
var Modal = require('react-modal');
var $ = require('jquery');

var styles =            require('.././styles.js');
var restDispatcher =    require('.././rest-dispatcher.js');
var isWebNameValid =    require('.././is-name-valid.js');

var CreateDirModalDialogController = React.createClass({

    getInitialState: function () {
        return {
            open: false,
            newName: "",
            nameValid: false,
            submitButtonHover: false,
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
            submitButtonHover: false,
            cancelButtonHover: false
        });
    },

    submitAction: function () {
        if ( ! isWebNameValid(this.state.newName) ) {
            return;
        }
        var thisComponent = this;
        var newDirName = this.state.newName;
        var data = {
            "name": newDirName
        };
        this.close();
        $.ajax({
            method: 'POST',
            url: restDispatcher.composeUrlToAllDirectoriesInPlacement("webpanel"),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
            success: function () {
                thisComponent.props.directoryCreated(newDirName);
            },
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    submitButtonToggle: function () {
        this.setState({submitButtonHover: !this.state.submitButtonHover});
    },

    cancelButtonToggle: function () {
        this.setState({cancelButtonHover: !this.state.cancelButtonHover});
    },

    getButtonStyle: function ( buttonType ) {
        if ( buttonType == "submit" ) {
            if ( this.state.nameValid ) {
                if ( this.state.submitButtonHover ) {
                    return styles.dialogButtonStyleHover;
                } else {
                    return styles.dialogButtonStyle;
                }
            } else {
                return styles.dialogForbiddenButtonStyle;
            }
        } else if ( buttonType == "cancel" ) {
            if ( this.state.cancelButtonHover ) {
                return styles.dialogButtonStyleHover;
            } else {
                return styles.dialogButtonStyle;
            }
        }
    },

    onCreateButtonClickHandle: function ( e ) {
        e.stopPropagation();
        e.preventDefault();
        this.show();
    },

    inputChanged: function ( e ) {
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

    getInputStyle: function () {
        if (this.state.nameValid) {
            return styles.validInputStyle;
        } else {
            return styles.invalidInputStyle;
        }
    },

    render: function () {
        var submitButtonStyle = this.getButtonStyle("submit");
        var cancelButtonStyle = this.getButtonStyle("cancel");
        var inputStyle = this.getInputStyle();
        return (
            <div className="create-directory-modal-dialog-controller">
                <button
                    className="create-directory-bar-button"
                    type="button"
                    onClick={this.onCreateButtonClickHandle}
                >
                </button>
                <Modal
                    closeTimeoutMS={0}
                    isOpen={this.state.open}
                    onRequestClose={this.close}
                    shouldCloseOnOverlayClick={false}
                    style={styles.modalDialogStyle} >
                    <label className="form-label">Create new directory: </label>
                    <br/>
                    <input type="text"
                           id="new-dir-name"
                           placeholder="name..."
                           className="form-input"
                           style={inputStyle}
                           value={this.state.newName}
                           onChange={this.inputChanged}/>
                    <br/>

                    <div className="dialog-button-pane">
                        <button
                            type="button"
                            style={submitButtonStyle}
                            onClick={this.submitAction}
                            onMouseEnter={this.submitButtonToggle}
                            onMouseLeave={this.submitButtonToggle}>
                            Create</button>
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
            </div>
        );
    }
});

module.exports = CreateDirModalDialogController;