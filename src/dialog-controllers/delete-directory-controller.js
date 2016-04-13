var React = require('react');
var Modal = require('react-modal');
var $ = require('jquery');

var styles =            require('.././styles.js');
var restDispatcher =    require('.././rest-dispatcher.js');

var DeleteDirModalDialogController = React.createClass({

    getInitialState: function () {
        return {
            open: false,
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
            submitButtonHover: false,
            cancelButtonHover: false
        });
    },

    onControlButtonClickHandle: function ( e ) {
        e.stopPropagation();
        e.preventDefault();
        this.show();
    },

    submitAction: function () {
        var thisComponent = this;
        this.close();
        $.ajax({
            method: 'DELETE',
            url: restDispatcher.composeUrlToDirectory("webpanel", this.props.dirName),
            processData: false,
            cache: false,
            success: function () {
                thisComponent.props.directoryDeleted(thisComponent.props.dirName);
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
            if ( this.state.submitButtonHover ) {
                return styles.dialogButtonStyleHover;
            } else {
                return styles.dialogButtonStyle;
            }
        } else if ( buttonType == "cancel" ) {
            if ( this.state.cancelButtonHover ) {
                return styles.dialogButtonStyleHover;
            } else {
                return styles.dialogButtonStyle;
            }
        }
    },

    render: function () {
        var submitButtonStyle = this.getButtonStyle("submit");
        var cancelButtonStyle = this.getButtonStyle("cancel");
        return (
            <span className="delete-dir-modal-dialog-controller">
                <button type="button"
                        className="directory-bar-button"
                        onClick={this.onControlButtonClickHandle}>
                </button>
                <Modal
                    closeTimeoutMS={0}
                    isOpen={this.state.open}
                    onRequestClose={this.close}
                    shouldCloseOnOverlayClick={false}
                    style={styles.modalDialogStyle} >
                        <label className="form-label">Delete <b>{this.props.dirName}</b> ?</label>
                        <br/>
                        <label className="form-label">All pages in directory will be deleted also.</label>
                        <br/>
                        <div className="dialog-button-pane">
                            <button
                                type="button"
                                style={submitButtonStyle}
                                onClick={this.submitAction}
                                onMouseEnter={this.submitButtonToggle}
                                onMouseLeave={this.submitButtonToggle}>
                                Delete</button>
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

module.exports = DeleteDirModalDialogController;
