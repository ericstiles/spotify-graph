var express = require('express');
var path = require('path');

module.exports = function(cache) {

    var router = express.Router();

    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        console.log('page.js Time: ', Date.now() + ', ' + req.query.q + ', ' + req.url);
        next()
    })

    router.get('/', function(req, res) {
        res.sendfile(path.resolve(__dirname + '/../public/index.html'));
    });

    router.get('/artistinfo', function(req, res) {
        res.sendfile(path.resolve(__dirname + '/../public/artistinfo.html'));
    });

    router.get('/searchartist', function(req, res) {
        res.sendfile(path.resolve(__dirname + '/../public/searchartist.html'));
    });
    router.get('/relatedartist', function(req, res) {
        res.sendfile(path.resolve(__dirname + '/../public/relatedartist.html'));
    });

    router.get('/popoto', function(req, res) {
        res.sendfile(path.resolve(__dirname + '/../public/index2.html'));
    });
    router.get('/config', function(req, res) {
        res.sendfile(path.resolve(__dirname + '/../public/configurator.html'));
    });

    router.get('/graph', function(req, res) {
        res.sendfile(path.resolve(__dirname + '/../public/graph.html'));
    });

    router.get('/graph2', function(req, res) {
        res.sendfile(path.resolve(__dirname + '/../public/graph2.html'));
    });

    return router;
}

// module.exports = router
