var React = require('react');
var Modal = require('react-modal');
var $ = require('jquery');

var styles = require('.././styles.js');

var DeletePageModalDialog = React.createClass({

    getInitialState: function () {
        return {
            open: false,
            deleteButtonHover: false,
            cancelButtonHover: false
        };
    },

    show: function () {
        this.setState({open: true});
    },

    close: function () {
        this.setState({
            open: false,
            deleteButtonHover: false,
            cancelButtonHover: false
        });
    },

    deleteAction: function () {
        this.close();
        this.props.pageDeletedCallback(this.props.page);
    },

    askDeletePage: function () {
        this.show();
    },

    deleteButtonToggle: function () {
        this.setState({deleteButtonHover: !this.state.deleteButtonHover});
    },

    cancelButtonToggle: function () {
        this.setState({cancelButtonHover: !this.state.cancelButtonHover});
    },

    getDeleteButtonStyle: function () {
        if ( this.state.deleteButtonHover ) {
            return styles.dialogButtonStyleHover;
        } else {
            return styles.dialogButtonStyle;
        }
    },

    getCancelButtonStyle: function () {
        if ( this.state.cancelButtonHover ) {
            return styles.dialogButtonStyleHover;
        } else {
            return styles.dialogButtonStyle;
        }
    },

    render: function () {
        var deleteButtonStyle = this.getDeleteButtonStyle();
        var cancelButtonStyle = this.getCancelButtonStyle();
        return (
            <div className="delete-page-modal-dialog">
                <Modal
                    closeTimeoutMS={0}
                    isOpen={this.state.open}
                    onRequestClose={this.close}
                    shouldCloseOnOverlayClick={false}
                    style={styles.modalDialogStyle} >
                    <label className="form-label">Delete <b>{this.props.page}</b> ?</label>
                    <br/>

                    <div className="dialog-button-pane">
                        <button
                            type="button"
                            style={deleteButtonStyle}
                            onClick={this.deleteAction}
                            onMouseEnter={this.deleteButtonToggle}
                            onMouseLeave={this.deleteButtonToggle}>
                            Yes
                        </button>
                        <button
                            type="button"
                            style={cancelButtonStyle}
                            onClick={this.close}
                            onMouseEnter={this.cancelButtonToggle}
                            onMouseLeave={this.cancelButtonToggle}>
                            No
                        </button>
                        <br/>
                    </div>
                </Modal>
            </div>
        );
    }
});

module.exports = DeletePageModalDialog;