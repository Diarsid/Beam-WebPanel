var React = require('react');
var Modal = require('react-modal');
var $ = require('jquery');

var styles =            require('.././styles.js');
var restDispatcher =    require('.././rest-dispatcher.js');
var isWebNameValid =    require('.././is-name-valid.js');

var CreatePageModalDialogController = React.createClass({

    getInitialState: function () {
        return {
            open: false,
            page: "",
            pageNameValid: false,
            url: "",
            createButtonHover: false,
            cancelButtonHover: false
        };
    },

    show: function () {
        this.setState({open: true});
    },

    close: function () {
        this.setState({
            open: false,
            page: "",
            pageNameValid: false,
            url: "",
            createButtonHover: false,
            cancelButtonHover: false
        });
    },

    onCreateButtonClickHandle: function ( e ) {
        e.stopPropagation();
        e.preventDefault();
        this.show();
    },

    pageNameChanged: function ( e ) {
        if (isWebNameValid(e.target.value)) {
            this.setState({
                page: e.target.value,
                pageNameValid: true
            });
        } else {
            this.setState({
                page: e.target.value,
                pageNameValid: false
            });
        }

    },

    pageUrlChanged: function ( e ) {
        this.setState({url: e.target.value});
    },

    createAction: function () {
        if ( ! this.state.pageNameValid || this.state.url.length < 1 ) {
            return;
        }
        var data = {
            "name": this.state.page,
            "url": this.state.url
        };
        var newPage = {
            name: this.state.page,
            url: this.state.url
        };
        this.props.pageAdded(newPage);
        this.close();
        $.ajax({
            method: 'POST',
            url: restDispatcher.composeUrlToAllPagesInDirectory("webpanel", this.props.dirName),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    createButtonToggle: function () {
        this.setState({createButtonHover: !this.state.createButtonHover});
    },

    cancelButtonToggle: function () {
        this.setState({cancelButtonHover: !this.state.cancelButtonHover});
    },

    getCreateButtonStyle: function () {
        if ( this.state.pageNameValid && this.state.url.length > 0 ) {
            if ( this.state.createButtonHover ) {
                return styles.dialogButtonStyleHover;
            } else {
                return styles.dialogButtonStyle;
            }
        } else {
            return styles.dialogForbiddenButtonStyle;
        }
    },

    getCancelButtonStyle: function () {
        if ( this.state.cancelButtonHover ) {
            return styles.dialogButtonStyleHover;
        } else {
            return styles.dialogButtonStyle;
        }
    },

    getNameInputStyle: function () {
        if ( this.state.pageNameValid ) {
            return styles.validInputStyle;
        } else {
            return styles.invalidInputStyle;
        }
    },

    getUrlInputStyle: function () {
        if ( this.state.url.length > 0 ) {
            return styles.validInputStyle;
        } else {
            return styles.invalidInputStyle;
        }
    },

    render: function() {
        var createButtonStyle = this.getCreateButtonStyle();
        var cancelButtonStyle = this.getCancelButtonStyle();
        var nameInputStyle = this.getNameInputStyle();
        var urlInputStyle = this.getUrlInputStyle();
        return (
            <span className="create-page-modal-dialog-controller">
                <button type="button"
                        className="directory-bar-button"
                        onClick={this.onCreateButtonClickHandle}>
                </button>
                <Modal
                    closeTimeoutMS={0}
                    isOpen={this.state.open}
                    onRequestClose={this.close}
                    shouldCloseOnOverlayClick={false}
                    style={styles.modalDialogStyle} >

                    <form className="create-page-dialog">
                        <fieldset>
                            <legend>Create new page in <b>{this.props.dirName}</b>:</legend>
                            <label className="form-label">Page name:</label>
                            <br/>
                            <input type="text"
                                   id="page-name"
                                   placeholder="name..."
                                   className="form-input"
                                   style={nameInputStyle}
                                   value={this.state.name}
                                   onChange={this.pageNameChanged}/>
                            <br/>
                            <label className="form-label">Page url:</label>
                            <br/>
                            <input type="text"
                                   id="page-url"
                                   placeholder="http://..."
                                   className="form-input"
                                   style={urlInputStyle}
                                   value={this.state.url}
                                   onChange={this.pageUrlChanged}/>
                        </fieldset>
                    </form>
                    <div className="dialog-button-pane">
                        <button
                            type="button"
                            style={createButtonStyle}
                            onClick={this.createAction}
                            onMouseEnter={this.createButtonToggle}
                            onMouseLeave={this.createButtonToggle}>
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
            </span>
        );
    }
});

module.exports = CreatePageModalDialogController;