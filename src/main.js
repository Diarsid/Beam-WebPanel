var React = require('react');
var ReactDOM = require('react-dom');
var cloneDeep = require('lodash.clonedeep');
var $ = require('jquery');
require('jquery-ui');

// plain JS functions and objects
var restDispatcher =    require('./rest-dispatcher.js');
var reorderItems =      require('./reorder-items.js');
var styles =            require('./styles');

// React components
var DeletePageModalDialog =             require('./dialogs/delete-page-dialog.js');
var CreateDirModalDialogController =    require('./dialog-controllers/create-directory-controller.js');
var DeleteDirModalDialogController =    require('./dialog-controllers/delete-directory-controller.js');
var RenameDirModalDialogController =    require('./dialog-controllers/rename-directory-controller.js');
var CreatePageModalDialogController =   require('./dialog-controllers/create-page-controller.js');

// Main React components
var Bar = React.createClass({

    render: function () {
        return (
            <div className="bar">
                <div className="bar-panel">
                    <CreateDirModalDialogController
                        directoryCreated={this.props.directoryCreated} />
                </div>
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
                <button
                    type="button"
                    className="delete-page-button"
                    id="page-frame-delete-page-button"
                    onClick={this.deleteAction}
                ></button>
            );
        } else {
            return null;
        }
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
        return {
            pages: this.props.pages,
            intervalReloading: {}
        };
    },

    propsAreNotEqual: function (oldProps, nextProps) {
        if ( oldProps.name != nextProps.name ) {
            console.log('props are different: dir names are not equal');
            return true;
        }
        if ( oldProps.pages.length != nextProps.pages.length ) {
            console.log('props are different: page arrays lengths are not equal');
            return true;
        }
        var length = oldProps.pages.length;
        for (var i = 0; i < length; i++) {
            if (oldProps.pages[i].name != nextProps.pages[i].name) {
                console.log('props are different: page name in array is not equal');
                return true;
            }
        }
        return false;
    },

    componentWillReceiveProps: function ( nextProps ) {
        this.setState({pages: nextProps.pages});
        if ( this.propsAreNotEqual(this.props, nextProps) ) {
            console.log('Directory should update its pages -> props are not equal');
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
        }
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

        var interval = setInterval(this.ajaxGetPages, (1000*60));
        this.setState({intervalReloading: interval});
    },

    componentWillUnmount: function () {
        clearInterval(this.state.intervalReloading);
        console.log('DirectoryContent::UNMOUNT > ' + this.props.name);
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
        return {
            dirs: [],
            intervalReloading: {}
        };
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

        var interval = setInterval(this.ajaxGetDirectories, (1000*60));
        this.setState({intervalReloading: interval});
    },

    componentWillUnmount: function () {
        clearInterval(this.state.intervalReloading);
    },

    reloadPanel: function () {
        this.ajaxGetDirectories();
        //console.log('WebPanelContent::reload()')
    },

    addNewDirOptimistically: function (newDirName) {
        var currentDirs = cloneDeep(this.state.dirs);
        var newOrder = currentDirs.length + 1;
        var newDirPages = [];
        currentDirs.push({
            name: newDirName,
            order: newOrder,
            pages: newDirPages
        });
        this.setState({dirs: currentDirs});
        console.log('dirs after add new dir:');
        console.log(currentDirs);
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
        this.ajaxGetDirectories();
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

    panelContent : {},

    addNewDirOptimisticallyAndReload: function ( newDirName ) {
        this.panelContent.addNewDirOptimistically(newDirName);
        this.panelContent.reloadPanel();
    },

    render: function () {
        return (
            <div className="web-panel">
                <WebPanelContent
                    ref={(component) => this.panelContent = component}/>
            </div>
        );
    }
});

var BeamPage = React.createClass({

    contentComponent: {},

    directoryCreated: function( newDirName ) {
        this.contentComponent.addNewDirOptimisticallyAndReload(newDirName);
    },

    render: function () {
        return(
            <div>
                <Bar
                    directoryCreated={this.directoryCreated} />
                <WebPanel
                    ref={(component) => this.contentComponent = component}/>
            </div>
        );
    }
});


ReactDOM.render(
    <BeamPage />,
    document.getElementById('content')
);
