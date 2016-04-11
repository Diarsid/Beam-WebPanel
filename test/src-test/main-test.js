var React = require('react');
var ReactDOM = require('react-dom');
var Sortable = require('react-anything-sortable');
var SortableItemMixin = require('react-anything-sortable').SortableItemMixin;

function handleSort( sortedArray ) {
    console.log(sortedArray);
};

var SortableItem = React.createClass({
    mixins: [SortableItemMixin],

    clickHandle: function () {
        console.log('clicked: ' + this.props.sortData);
    },

    render: function(){
        return this.renderWithSortable(
            <div className="sorted" onClick={this.clickHandle} >item No: {this.props.sortData}</div>
        );
    }
});

var SortableContainer = React.createClass({
    mixins: [SortableItemMixin],

    render: function () {
        return this.renderWithSortable(
            <div>
                <p>{this.props.sortData}</p>
                <Sortable className="region-sort" onSort={handleSort}>
                    <SortableItem sortData="1" />
                    <SortableItem sortData="2" />
                    <SortableItem sortData="3" />
                </Sortable>
            </div>
        );
    }
});

ReactDOM.render(
    <Sortable>
        <SortableContainer sortData="container ONE"/>
        <SortableContainer sortData="container TWO"/>
    </Sortable>
    , document.getElementById('content'));