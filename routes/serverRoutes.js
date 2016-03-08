// Divide all of your modules in different files and
// require them here
module.exports = function(app) {
    require('./homeRoute')(app);
    require('./createProfileRoute')(app);
    require('./mirrorRoute')(app);
    require('./captureFaceRoute')(app);
    //require('./stockRoute')(app); TODO: this is probable not needed. Using mirror router should suffice
};
