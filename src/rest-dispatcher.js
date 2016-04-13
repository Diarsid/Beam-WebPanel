
var restDispatcher = {

    coreUrl: "http://localhost:35001/beam/core/resources/",

    composeUrlToAllDirectoriesInPlacement: function (placement) {
        return this.coreUrl+placement+"/dirs";
    },

    composeUrlToDirectory: function (placement, dirName) {
        return this.coreUrl+placement+"/dirs/"+dirName;
    },

    composeUrlToDirectoryField: function (placement, dirName, fieldName) {
        return this.coreUrl+placement+"/dirs/"+dirName+"/"+fieldName;
    },

    composeUrlToAllPagesInDirectory: function (placement, dirName) {
        return this.coreUrl+placement+"/dirs/"+dirName+"/pages";
    },

    composeUrlToPage: function (placement, dirName, pageName) {
        return this.coreUrl+placement+"/dirs/"+dirName+"/pages/"+pageName;
    },

    composeUrlToPageField: function (placement, dirName, pageName, fieldName) {
        return this.coreUrl+placement+"/dirs/"+dirName+"/pages/"+pageName+"/"+fieldName;
    }
};

module.exports = restDispatcher;