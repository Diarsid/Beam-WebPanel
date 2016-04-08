var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-modal');
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


var restDispatcher = {
    coreUrl: "http://localhost:35001/beam/core/resources/",
    composeUrlToAllDirectoriesInPlacement: function (placement) {
        return this.coreUrl
            .concat(placement.toString())
            .concat("/dirs");
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
    var orderedItems = [];
    var length = currentItems.length;
    var movedItems = currentItems[oldOrder-1];
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
        orderedItems.push(movedItems);
        for (i = newOrder; i < length; i++) {
            orderedItems.push(currentItems[i]);
        }
    } else {
        // means oldOrder > newOrder
        for (i = 0; i < newOrder-1; i++) {
            orderedItems.push(currentItems[i]);
        }
        orderedItems.push(movedItems);
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

    return orderedItems;
}

var validNameRegexp = "[a-zA-Z0-9-_\\.>\\s]+";

function isWebNameValid( name ) {
    // TODO validate given name with validNameRegexp
    return true;
}

var TopBar = React.createClass({
    render: function () {
        return (
            <div className="top-bar">
                WebPanel bar
            </div>
        );
    }
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
        console.log('delete page')
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

var PageFrame = React.createClass({

    getInitialState: function () {
        return ({hover: false});
    },

    toggleHover: function () {
        this.setState({hover: !this.state.hover});
    },

    render: function () {
        return (
            <li className="page-frame"
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover} >
                <a href={this.props.url} target="_blank" >
                    <PageImageFrame image="./web-globe-n.png" />
                    <PageTitle text={this.props.name} />
                    <DeletePageButton dir={this.props.name} frameHover={this.state.hover}/>
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
        this.setState({page: e.target.value});
    },

    pageUrlChanged: function ( e ) {
        this.setState({url: e.target.value});
    },

    createAction: function () {
        if ( ! isWebNameValid(this.state.page) ) {
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
        if ( this.state.createButtonHover ) {
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

    render: function() {
        var createButtonStyle = this.getCreateButtonStyle();
        var cancelButtonStyle = this.getCancelButtonStyle();
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
                                   value={this.state.name}
                                   onChange={this.pageNameChanged}/>
                            <br/>
                            <label className="form-label">Page url:</label>
                            <br/>
                            <input type="text"
                                   id="page-url"
                                   placeholder="http://..."
                                   className="form-input"
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
        this.setState({newName: e.target.value});
    },

    editAction: function () {
        console.log('RenameDirectoryController::editAction() > ' + this.state.newName);
        if ( ! isWebNameValid(this.state.newName) ) {
            return;
        }
        var data = {
            "name": this.state.newName
        };
        this.props.directoryRenamed(this.state.newName);
        this.close();
        $.ajax({
            method: 'PUT',
            url: restDispatcher.composeUrlToDirectoryField("webpanel", this.props.dirName, "name"),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
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
        if ( this.state.editButtonHover ) {
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
        var editButtonStyle = this.getEditButtonStyle();
        var cancelButtonStyle = this.getCancelButtonStyle();
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
        this.props.directoryRenamed(newName);
        console.log('DirectoryBar::renamed() > ' + newName);
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
                    directoryRenamed={this.directoryRenamed}/>
                <span className="directory-bar-title">{this.props.dirName}</span>
            </div>
        );
    }
});

var DirectoryContent = React.createClass({

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
        var data = {"order": newOrder};
        $.ajax({
            method: 'PUT',
            url: restDispatcher.composeUrlToPageField("webpanel", this.props.name, movedPageName, 'order'),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    setNewState: function (newPages) {
        this.setState({pages: newPages});
    },

    getCurrentState: function () {
        return this.state.pages;
    },

    componentDidMount: function () {
        var dirContentNode = $(ReactDOM.findDOMNode(this));
        var thisComponent = this;
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
                dirContentNode.sortable( "refreshPositions" );
                dirContentNode.sortable("cancel");
                var sortedPages = [];
                var currentPages = [];
                currentPages = thisComponent.getCurrentState();
                sortedPages = reorderItems(currentPages, oldOrder, newOrder);
                thisComponent.setNewState(sortedPages);
                thisComponent.ajaxPutNewOrder(newOrder, movedPageName);
            }
        }).disableSelection();

        this.ajaxGetPages();

        setInterval(this.ajaxGetPages, (1000*60));
    },

    render: function () {
        console.log('  [render] dir > '+ this.props.name);
        var renderedPages = this.state.pages.map( function(page) {
            console.log('    [render] frame > ' + page.name + ", " + page.order);
            return (
                <PageFrame name={page.name} url={page.url} key={page.order} />
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

    render: function () {
        return (
            <div className="directory-content-wrapper">
                <DirectoryContent name={this.props.name} pages={this.props.pages} />
            </div>
        );
    }
});

var Directory = React.createClass({

    addNewPageOptimistically: function (page) {
        console.log("Directory::addNewPage");
    },

    render: function () {
        return (
            <div className="directory" >
                <DirectoryBar
                    dirName={this.props.name}
                    addNewPageOptimistically={this.addNewPageOptimistically}/>
                <DirectoryContentWrapper name={this.props.name} pages={this.props.pages} />
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

    ajaxPutNewOrder: function ( newOrder, movedDirName) {
        var data = {"order": newOrder};
        $.ajax({
            method: 'PUT',
            url: restDispatcher.composeUrlToDirectoryField("webpanel", movedDirName, "order"),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
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
                var newOrder = ui.item.index();
                var oldOrder = ui.item.oldOrder;
                var movedDirName = ui.item.find('.directory-bar')[0].textContent;
                webPanelNode.sortable( "refreshPositions" );
                webPanelNode.sortable("cancel");
                var sortedDirs = [];
                var currentDirs = [];
                currentDirs = thisComponent.getCurrentState();
                sortedDirs = reorderItems(currentDirs, oldOrder, newOrder);
                thisComponent.setNewState(sortedDirs);
                thisComponent.ajaxPutNewOrder(newOrder, movedDirName);

            }

        }).disableSelection();

        this.ajaxGetDirectories();

        setInterval(this.ajaxGetDirectories, (1000*60));
    },

    reloadPanel: function () {
        this.ajaxGetDirectories();
        console.log('WebPanelContent::reload()')
    },

    render: function () {
        var panelComponent = this;
        var renderedDirs = this.state.dirs.map(function(dir) {
            return (
                <Directory
                    name={dir.name}
                    order={dir.order}
                    key={dir.order}
                    pages={dir.pages}
                    reloadPanel={panelComponent.reloadPanel} />
            );
        });
        return (
            <div className="web-panel-content">
                <div>Web Panel</div>
                {renderedDirs}
            </div>
        );
    }

});

var BeamPage = React.createClass({
    render: function () {
        return(
            <div>
                <TopBar />
                <WebPanelContent />
            </div>
        );
    }
});


ReactDOM.render(
    <BeamPage />,
    document.getElementById('content')
);
