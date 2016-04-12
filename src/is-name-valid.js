var isWebNameValid = function ( name ) {
    return (new RegExp("^[a-zA-Z0-9-_\\.>\\s]+$")).test(name);
};

module.exports = isWebNameValid;