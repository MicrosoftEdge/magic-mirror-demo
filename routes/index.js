// Divide all of your modules in different files and
// require them here
module.exports = function(app) {
    require('./home')(app);
    require('./create')(app);
    require('./mirror')(app);
    require('./captureFace')(app);
};
