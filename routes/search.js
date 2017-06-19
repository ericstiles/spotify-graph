var express = require('express');
var rp = require('request-promise');

module.exports = function(cache) {

    var router = express.Router();

    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        console.log('search.js Time: ', Date.now() + ', ' + req.query.q + ', ' + req.url);
        next()
    })

    router.get('/artist', function(req, res) {

        console.log("SEARCHING");
        console.log(req.query.q);
        console.log(req.query.type);

        var authOptions = {
            url: 'https://api.spotify.com/v1/search',
            qs: {
                q: req.query.q,
                type: req.query.type
            },
            headers: {
                'Authorization': 'Bearer ' + cache['access_token'],
                'User-Agent': 'Request-Promise'
            },
            json: true
        };

        rp(authOptions)
            .then(function(response) {
                console.log(JSON.stringify(response));
                res.send(response);
            })
            .catch(function(err) {
                console.log(err);
                res.send(err);
            });

    });


    return router;
}

// module.exports = router
