
var reorderItems = function (currentItems, oldOrder, newOrder) {
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
};

module.exports = reorderItems;
