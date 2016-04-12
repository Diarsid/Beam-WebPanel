var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var cloneDeep = require('lodash.clonedeep');
var $ = require('jquery');
require('jquery-ui');

const modalDialogStyle = {
    overlay : {
        backgroundColor   : 'rgba(0, 0, 0, 0.5)'
    },
    content : {
        border: '1px solid darkgray',
        borderRadius: '6px',
        backgroundColor: '#fafafa',
        boxShadow: 'inset 0px 0px 10px 0px lightgrey',
        WebkitBoxShadow: 'inset 0px 0px 10px 0px lightgrey',
        MozBoxShadow: 'inset 0px 0px 10px 0px lightgrey',
        OBoxShadow: 'inset 0px 0px 10px 0px lightgrey',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

var dialogButtonStyle = {
    color: '#1C1C1C',
        height: '30px',
        width: '90px',
        boxSizing: 'border-box',
        opacity: '0.85',
        fontFamily: 'Verdana',
        fontSize: '15px',
        borderRadius: '6px',
        border: '1px solid lightgrey',
        backgroundColor: '#fafafa',
        boxShadow: 'inset 0px 0px 5px 0px lightgrey',
        WebkitBoxShadow: 'inset 0px 0px 5px 0px lightgrey',
        MozBoxShadow: 'inset 0px 0px 5px 0px lightgrey',
        OBoxShadow: 'inset 0px 0px 5px 0px lightgrey',
        margin: '0 15px 0 0'
};

var dialogForbiddenButtonStyle = {
    color: '#D5D5D5',
    height: '30px',
    width: '90px',
    boxSizing: 'border-box',
    opacity: '0.85',
    fontFamily: 'Verdana',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid lightgrey',
    backgroundColor: '#fafafa',
    boxShadow: 'inset 0px 0px 5px 0px lightgrey',
    WebkitBoxShadow: 'inset 0px 0px 5px 0px lightgrey',
    MozBoxShadow: 'inset 0px 0px 5px 0px lightgrey',
    OBoxShadow: 'inset 0px 0px 5px 0px lightgrey',
    margin: '0 15px 0 0'
};

var dialogButtonStyleHover = {
    color: '#1C1C1C',
    height: '30px',
    width: '90px',
    boxSizing: 'border-box',
    opacity: '1',
    fontFamily: 'Verdana',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid lightgrey',
    backgroundColor: 'white',
    boxShadow: '0px 0px 10px 0px white, inset 0px 0px 3px 0px lightgrey',
    WebkitBoxShadow: '0px 0px 10px 0px white, inset 0px 0px 3px 0px lightgrey',
    MozBoxShadow: '0px 0px 10px 0px white, inset 0px 0px 3px 0px lightgrey',
    OBoxShadow: '0px 0px 10px 0px white, inset 0px 0px 3px 0px lightgrey',
    margin: '0 15px 0 0'
};

var invalidInputStyle = {
    backgroundColor: '#FFF8F6',
    boxShadow: 'inset 0px 0px 5px 0px #FFD7CE',
    WebkitBoxShadow: 'inset 0px 0px 5px 0px #FFD7CE ',
    MozBoxShadow: 'inset 0px 0px 5px 0px #FFD7CE ',
    OBoxShadow: 'inset 0px 0px 5px 0px #FFD7CE '
};

var validInputStyle = {
    backgroundColor: 'white',
    boxShadow: 'inset 0px 0px 5px 0px lightgrey',
    WebkitBoxShadow: 'inset 0px 0px 5px 0px lightgrey',
    MozBoxShadow: 'inset 0px 0px 5px 0px lightgrey',
    OBoxShadow: 'inset 0px 0px 5px 0px lightgrey'
};

var restDispatcher = {
    coreUrl: "http://localhost:35001/beam/core/resources/",
    composeUrlToAllDirectoriesInPlacement: function (placement) {
        return this.coreUrl
            .concat(placement.toString())
            .concat("/dirs");
    },
    composeUrlToDirectory: function (placement, dirName) {
        return this.coreUrl
            .concat(placement.toString())
            .concat("/dirs/")
            .concat(dirName.toString());
    },
    composeUrlToDirectoryField: function (placement, dirName, fieldName) {
        return this.coreUrl
            .concat(placement.toString())
            .concat("/dirs/")
            .concat(dirName.toString())
            .concat("/")
            .concat(fieldName.toString());
    },
    composeUrlToAllPagesInDirectory: function (placement, dirName) {
        return this.coreUrl
            .concat(placement.toString())
            .concat("/dirs/")
            .concat(dirName.toString())
            .concat("/pages");
    },
    composeUrlToPage: function (placement, dirName, pageName) {
        return this.coreUrl
            .concat(placement.toString())
            .concat("/dirs/")
            .concat(dirName.toString())
            .concat("/pages/")
            .concat(pageName.toString());
    },
    composeUrlToPageField: function (placement, dirName, pageName, fieldName) {
        return this.coreUrl
            .concat(placement.toString())
            .concat("/dirs/")
            .concat(dirName.toString())
            .concat("/pages/")
            .concat(pageName.toString())
            .concat("/")
            .concat(fieldName.toString());
    }
};

function reorderItems (currentItems, oldOrder, newOrder) {
    console.log("old order" + oldOrder);
    console.log('new order' + newOrder);
    var orderedItems = [];
    var length = currentItems.length;
    var movedItem = currentItems[oldOrder-1];
    console.log('moved item: ');
    console.log(movedItem);

    var i = 0;
    if ( oldOrder == newOrder ) {
        orderedItems = orderedItems.concat(currentItems);
    } else if (oldOrder < newOrder) {
        for (i = 0; i < oldOrder-1; i++) {
            orderedItems.push(currentItems[i]);
        }
        for (i = oldOrder-1; i < newOrder-1; i++) {
            orderedItems.push(currentItems[i+1]);
        }
        orderedItems.push(movedItem);
        for (i = newOrder; i < length; i++) {
            orderedItems.push(currentItems[i]);
        }
    } else {
        // means oldOrder > newOrder
        for (i = 0; i < newOrder-1; i++) {
            orderedItems.push(currentItems[i]);
        }
        orderedItems.push(movedItem);
        for (i = newOrder-1; i < oldOrder-1; i++) {
            orderedItems.push(currentItems[i]);
        }
        for (i = oldOrder; i < length; i++) {
            orderedItems.push(currentItems[i]);
        }
    }
    for (i = 0; i < length; i++) {
        orderedItems[i].order = i+1;
    }
    console.log('ordered items');
    console.log(orderedItems);

    return orderedItems;
}

function isWebNameValid( name ) {
    return (new RegExp("^[a-zA-Z0-9-_\\.>\\s]+$")).test(name);
}

var Bar = React.createClass({
    render: function () {
        return (
            <div className="bar">
                <div className="bar-panel">

                </div>
            </div>
        );
    }
});

var CreateDirectoryModalDialogController = React.createClass({

});

var PageImageFrame = React.createClass({
    render: function () {
        return (
            <div className="page-image-frame">
                <img className="page-image" src={this.props.image} style={this.props.style} />
            </div>
        );
    }
});

var PageTitle = React.createClass({
    render: function () {
        return (
            <div className="page-title">
                <div className="title-text">{this.props.text}</div>
            </div>
        );
    }
});

var DeletePageButton = React.createClass({

    deleteAction: function ( e ) {
        e.preventDefault();
        e.stopPropagation();
        this.props.deletePage();
    },

    render: function () {
        if (this.props.frameHover) {
            return (
                <button type="button" className="delete-page-button" onClick={this.deleteAction}></button>
            );
        } else {
            return null;
        }
    }
});

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
            return dialogButtonStyleHover;
        } else {
            return dialogButtonStyle;
        }
    },

    getCancelButtonStyle: function () {
        if ( this.state.cancelButtonHover ) {
            return dialogButtonStyleHover;
        } else {
            return dialogButtonStyle;
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
                    style={modalDialogStyle} >
                    <label className="form-label">Delete <b>{this.props.page}</b> ?</label>
                    <br/>

                    <div className="dialog-button-pane">
                        <button
                            type="button"
                            style={deleteButtonStyle}
                            onClick={this.deleteAction}
                            onMouseEnter={this.deleteButtonToggle}
                            onMouseLeave={this.deleteButtonToggle}>
                            Yes</button>
                        <button
                            type="button"
                            style={cancelButtonStyle}
                            onClick={this.close}
                            onMouseEnter={this.cancelButtonToggle}
                            onMouseLeave={this.cancelButtonToggle}>
                            No</button>
                        <br/>
                    </div>
                </Modal>
            </div>
        );
    }
});

var PageFrame = React.createClass({

    modalDialog: {},

    getInitialState: function () {
        return ({
            hover: false,
            framestyle: {}
            });
    },

    mouseEnter: function () {
        this.setState({hover: true});
        // set style to opacity: 1 as a duplicate of external :hover part.
        // this duplicate is necessary because a jQuery UI Sortable
        // widget sets style of dropped element to Sortable default opacity:1.
        // That's why it is needed to do a manual transition between opacity 1 and 0.9
        this.setState({framestyle: {opacity: '1'}});
    },

    mouseLeave: function () {
        this.setState({hover: false});
        // css trick to revert a jQuery forced style {opacity: 1}
        // that is always set on element that have been jus dropped
        this.setState({framestyle: {opacity: '0.9'}});
    },

    deletePageInvoked: function () {
        this.modalDialog.askDeletePage();
    },

    pageDeleted: function (pageToDelete) {
        this.props.performPageDelete(pageToDelete);
    },

    render: function () {
        return (
            <li className="page-frame" style={this.state.framestyle}
                onMouseEnter={this.mouseEnter}
                onMouseOver={this.mouseEnter}
                onMouseLeave={this.mouseLeave} >
                <a href={this.props.url} target="_blank" >
                    <PageImageFrame image="./web-globe-n.png" />
                    <PageTitle text={this.props.name} />
                    <DeletePageButton
                        dir={this.props.name}
                        frameHover={this.state.hover}
                        deletePage={this.deletePageInvoked}
                    />
                    <DeletePageModalDialog
                        page={this.props.name}
                        ref={(c) => this.modalDialog = c}
                        pageDeletedCallback={this.pageDeleted}
                    />
                </a>
            </li>
        );
    }
});

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
                pageNameValid: true,
            });
        } else {
            this.setState({
                page: e.target.value,
                pageNameValid: false,
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
                return dialogButtonStyleHover;
            } else {
                return dialogButtonStyle;
            }
        } else {
            return dialogForbiddenButtonStyle;
        }
    },

    getCancelButtonStyle: function () {
        if ( this.state.cancelButtonHover ) {
            return dialogButtonStyleHover;
        } else {
            return dialogButtonStyle;
        }
    },

    getNameInputStyle: function () {
        if ( this.state.pageNameValid ) {
            return validInputStyle;
        } else {
            return invalidInputStyle;
        }
    },

    getUrlInputStyle: function () {
        if ( this.state.url.length > 0 ) {
            return validInputStyle;
        } else {
            return invalidInputStyle;
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
                    style={modalDialogStyle} >

                    <form className="create-page-dialog">
                        <fieldset>
                            <legend>Create new page in {this.props.dirName}:</legend>
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
                return dialogButtonStyleHover;
            } else {
                return dialogButtonStyle;
            }
        } else {
            return dialogForbiddenButtonStyle
        }
    },

    getCancelButtonStyle: function () {
        if ( this.state.cancelButtonHover ) {
            return dialogButtonStyleHover;
        } else {
            return dialogButtonStyle;
        }
    },

    getInputStyle: function () {
        if (this.state.nameValid) {
            return validInputStyle;
        } else {
            return invalidInputStyle;
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
                    style={modalDialogStyle} >
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

var DeleteDirModalDialogController = React.createClass({

    render: function () {
        return (
            <span></span>
        );
    }
});

var DirectoryBar = React.createClass({

    onClickHandle: function ( e ) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onHideClick( (! this.props.isDirHide ));
    },

    pageAdded: function ( page ) {
        this.props.addNewPageOptimistically(page);
    },

    directoryRenamed: function (newName) {
        this.props.reloadPanel();
        console.log('DirectoryBar::renamed() > ' + newName);
    },

    directoryDeleted: function () {
        this.props.directoryDeleted();
        console.log('DirectoryBar::deleted() > ' + this.props.name);
    },

    render: function () {
        return (
            <div className="directory-bar" onClick={this.onClickHandle} >
                <CreatePageModalDialogController
                    key='create-page'
                    dirName={this.props.dirName}
                    pageAdded={this.pageAdded}/>
                <RenameDirModalDialogController
                    key='rename-dir'
                    dirName={this.props.dirName}
                    directoryRenamed={this.directoryRenamed} />
                <span className="directory-bar-title">
                    {this.props.dirName}
                </span>
                <DeleteDirModalDialogController
                    key="delete-dir"
                    dirName={this.props.dirName}
                    directoryDeleted={this.directoryDeleted} />
            </div>
        );
    }
});

var DirectoryContent = React.createClass({

    deletePageOptimistically: function (pageName) {
        var currentPages = cloneDeep(this.state.pages);
        var newPages = [];
        var length = currentPages.length;
        var newOrderCounter = 1;
        for (var i = 0; i < length; i++) {
            if ( currentPages[i].name == pageName ) {
                // do not push it back
            } else {
                currentPages[i].order = newOrderCounter;
                newOrderCounter++;
                newPages.push(currentPages[i]);
            }
        }
        this.setState({pages: newPages});
        this.ajaxDeletePage(pageName);
        console.log(newPages);
    },

    ajaxDeletePage: function (pageName) {
        var thisComponent = this;
        $.ajax({
            method: 'DELETE',
            url: restDispatcher.composeUrlToPage("webpanel", this.props.name, pageName),
            processData: false,
            cache: false,
            success: function () {
                thisComponent.props.reloadPanel();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    addNewPageOptimistically: function (page) {
        var currentPages = cloneDeep(this.state.pages);
        page.order = currentPages.length + 1;
        currentPages.push(page);
        this.setState({pages: currentPages});
        console.log(currentPages);
    },

    getInitialState: function () {
        return {pages: this.props.pages};
    },

    componentWillReceiveProps: function ( nextProps ) {
        this.setState({pages: nextProps.pages});
        $.ajax({
            method: 'GET',
            url: restDispatcher.composeUrlToAllPagesInDirectory("webpanel", nextProps.name),
            dataType: 'json',
            cache: false,
            success: function(responsePages) {
                this.setState({pages: responsePages});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    ajaxGetPages: function () {
        $.ajax({
            method: 'GET',
            url: restDispatcher.composeUrlToAllPagesInDirectory("webpanel", this.props.name),
            dataType: 'json',
            cache: false,
            success: function(responsePages) {
                this.setState({pages: responsePages});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    ajaxPutNewOrder: function (newOrder, movedPageName) {
        var thisComponent = this;
        var data = {"order": newOrder};
        $.ajax({
            method: 'PUT',
            url: restDispatcher.composeUrlToPageField("webpanel", this.props.name, movedPageName, 'order'),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
            success: function() {
                thisComponent.ajaxGetPages();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    reorderPages: function (oldOrder, newOrder) {
        console.log('state:')
        console.log(this.state.pages);
        var pagesCopy = cloneDeep(this.state.pages);
        var reorderedPages = reorderItems(pagesCopy, oldOrder, newOrder);
        this.setState({pages: reorderedPages});
    },

    componentDidMount: function () {
        var dirContentNode = $(ReactDOM.findDOMNode(this));
        var thisComponent = this;
        var oldPages = [];
        dirContentNode.sortable({
            items: '.page-frame',
            opacity: 0.5,
            tolerance: "pointer",
            start: function ( event, ui ) {
                ui.item.oldOrder = ui.item.index();
            },
            update: function ( event, ui ) {
                var newOrder = ui.item.index() + 1;
                var oldOrder = ui.item.oldOrder + 1;
                var movedPageName = ui.item.context.textContent;
                dirContentNode.sortable('cancel');
                thisComponent.reorderPages(oldOrder, newOrder);
                thisComponent.ajaxPutNewOrder(newOrder, movedPageName);
            }
        }).disableSelection();

        this.ajaxGetPages();

        setInterval(this.ajaxGetPages, (1000*60));
    },

    render: function () {
        //console.log('  [render] dir > '+ this.props.name);
        var thisComponent = this;
        var renderedPages = this.state.pages.map( function(page) {
            //console.log('    [render] frame > ' + page.name + ", " + page.order);
            return (
                <PageFrame
                    name={page.name}
                    url={page.url}
                    key={page.name}
                    performPageDelete={thisComponent.deletePageOptimistically}
                />
            );
        });
        return (
            <ul className="directory-content">
                {renderedPages}
            </ul>
        );
    }

});

var DirectoryContentWrapper = React.createClass({

    dirContent: {},

    addNewPageOptimistically: function (page) {
        this.dirContent.addNewPageOptimistically(page);
    },

    reloadPanel: function () {
        this.props.reloadPanel();
    },

    render: function () {
        return (
            <div className="directory-content-wrapper">
                <DirectoryContent
                    name={this.props.name}
                    pages={this.props.pages}
                    reloadPanel={this.reloadPanel}
                    ref={(c) => this.dirContent = c} />
            </div>
        );
    }
});

var Directory = React.createClass({

    directoryWrapper: {},

    addNewPageOptimistically: function (page) {
        this.directoryWrapper.addNewPageOptimistically(page);
    },

    reloadPanel: function () {
        this.props.reloadPanel();
    },

    directoryDeleted: function () {
        this.props.deleteDirectoryAndReloadPanel(this.props.name);
    },

    render: function () {
        return (
            <div className="directory" >
                <DirectoryBar
                    dirName={this.props.name}
                    addNewPageOptimistically={this.addNewPageOptimistically}
                    reloadPanel={this.reloadPanel}
                    directoryDeleted={this.directoryDeleted}
                />
                <DirectoryContentWrapper
                    name={this.props.name}
                    pages={this.props.pages}
                    reloadPanel={this.reloadPanel}
                    ref={(c) => this.directoryWrapper = c} />
                <br />
            </div>
        );
    }
});

var WebPanelContent = React.createClass({

    getInitialState: function () {
        return {dirs: []};
    },

    ajaxGetDirectories: function () {
        $.ajax({
            url: restDispatcher.composeUrlToAllDirectoriesInPlacement("webpanel"),
            dataType: 'json',
            cache: false,
            success: function( obtainedDirs ) {
                this.setState({dirs: obtainedDirs });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    ajaxDeleteDir: function (dirToDelete) {
        $.ajax({
            method: 'DELETE',
            url: restDispatcher.composeUrlToDirectory('webpanel', dirToDelete),
            cache: false,
            success: function() {
                this.ajaxGetDirectories();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    ajaxPutNewOrder: function ( newOrder, movedDirName) {
        var data = {"order": newOrder};
        $.ajax({
            method: 'PUT',
            url: restDispatcher.composeUrlToDirectoryField("webpanel", movedDirName, "order"),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
            success: function( obtainedDirs ) {
                this.ajaxGetDirectories();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    getCurrentState: function () {
        return this.state.dirs;
    },

    setNewState: function ( newDirs ) {
        this.setState({ dirs: newDirs });
    },

    reorderDirs: function ( oldOrder, newOrder ) {
        //console.log('state:')
        //console.log(this.state.dirs);
        var dirsCopy = cloneDeep(this.state.dirs);
        var reorderedDirs = reorderItems(dirsCopy, oldOrder, newOrder);
        this.setState({dirs: reorderedDirs});
    },

    componentDidMount: function () {
        var webPanelNode = $(ReactDOM.findDOMNode(this));
        var thisComponent = this;
        webPanelNode.sortable({
            items: '.directory',
            opacity: 0.5,
            tolerance: "pointer",
            start: function ( event, ui ) {
                ui.item.oldOrder = ui.item.index();
            },
            update: function ( event, ui ) {
                var newOrder = ui.item.index() + 1;
                var oldOrder = ui.item.oldOrder + 1;
                var movedDirName = ui.item.find('.directory-bar')[0].textContent;
                webPanelNode.sortable('cancel');
                thisComponent.reorderDirs(oldOrder, newOrder);
                thisComponent.ajaxPutNewOrder(newOrder, movedDirName);
            }

        }).disableSelection();

        this.ajaxGetDirectories();

        setInterval(this.ajaxGetDirectories, (1000*60));
    },

    reloadPanel: function () {
        this.ajaxGetDirectories();
        //console.log('WebPanelContent::reload()')
    },

    deleteDirOptimistically: function (dirToDelete ) {
        var currentDirs = cloneDeep(this.state.dirs);
        var newDirs = [];
        var length = currentDirs.length;
        var newOrderCounter = 1;
        for (var i = 0; i < length; i++) {
            if ( currentDirs[i].name == dirToDelete ) {
                // do not push it back
            } else {
                currentDirs[i].order = newOrderCounter;
                newOrderCounter++;
                newDirs.push(currentDirs[i]);
            }
        }
        this.setState({dirs: newDirs});
        this.ajaxDeleteDir(dirToDelete);
        console.log(newDirs);
    },

    render: function () {
        var panelComponent = this;
        var renderedDirs = this.state.dirs.map(function(dir) {
            //console.log('[render] panel > ' + dir.name);
            return (
                <Directory
                    name={dir.name}
                    order={dir.order}
                    key={dir.order}
                    pages={dir.pages}
                    reloadPanel={panelComponent.reloadPanel}
                    deleteDirectoryAndReloadPanel={panelComponent.deleteDirOptimistically}/>
            );
        });
        return (
            <div className="web-panel-content">
                {renderedDirs}
            </div>
        );
    }
});

var WebPanel = React.createClass({
    render: function () {
        return (
            <div className="web-panel">
                <WebPanelContent />
            </div>
        );
    }
});

var BeamPage = React.createClass({
    render: function () {
        return(
            <div>
                <Bar />
                <WebPanel />
            </div>
        );
    }
});


ReactDOM.render(
    <BeamPage />,
    document.getElementById('content')
);
