
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

module.exports = restDispatcher;