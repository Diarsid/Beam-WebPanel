
var CreatePageDialog = React.createClass({

    getInitialState: function () {
        return {
            pageName: "",
            pageUrl: ""
        };
    },

    thisDialog : {},

    show: function () {
        this.thisDialog.dialog("open");
    },

    isNameValid: function ( name ) {
        // TODO regexp name validation
        return true;
    },

    createNewPage: function ( name, url ) {
        if ( ! this.isNameValid(name) ) {
            return;
        }
        var data = {
            name: name,
            url: url
        };
        $.ajax({
            method: 'POST',
            url: restDispatcher.composeUrlToAllPagesInDirectory("webpanel", this.props.dir),
            processData: false,
            data: JSON.stringify(data),
            cache: false,
            error: function(xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });

    },

    componentDidMount: function () {
        var thisDialogNode = $(ReactDOM.findDOMNode(this));
        var thisComponent = this;
        var $dialog = thisDialogNode.dialog({
            resizable: false,
            draggable: false,
            autoOpen: false,
            width: 350,
            modal: true,
            buttons: [
                {
                    text: "Create",
                    class: "create-page-dialog-button",
                    click: function() {
                        var name = $dialog.find('#page-name')[0].value;
                        var url = $dialog.find("#page-url")[0].value;
                        thisComponent.createNewPage(name, url);
                        $dialog.dialog( "close" );
                    }
                },
                {
                    text: "Cancel",
                    class: "create-page-dialog-button",
                    click: function() {
                        $dialog.dialog( "close" );
                    }
                }
            ]
        });
        this.thisDialog = $dialog;
    },

    render: function () {
        return (
            <form className="create-page-dialog">
                <fieldset>
                    <legend>Create new page in {this.props.dir}:</legend>
                    <label className="form-label">Page name:</label>
                    <input type="text"
                           id="page-name"
                           placeholder="name..."
                           className="form-input"
                           onChange={this.handlePageNameChange}/>
                    <br/>
                    <label className="form-label">Page url:</label>
                    <input type="text"
                           id="page-url"
                           placeholder="http://..."
                           className="form-input"
                           onChange={this.handlePageUrlChange}/>
                </fieldset>
            </form>
        );
    }
});

<CreatePageDialog dir={this.props.dirName} ref={(dialogComp) => this.createDialog = dialogComp} />