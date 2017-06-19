var express = require('express');
var rp = require('request-promise');

module.exports = function(cache) {

    var router = express.Router({ caseSensitive: true });

    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        console.log('info.js Time: ', Date.now() + ', ' + req.query.q + ', ' + req.url);
        next()
    })

    router.get('/artist', function(req, res) {

        console.log("RETRIEVING");
        console.log(req.query.q);
        console.log('URL:' + 'https://api.spotify.com/v1/artists/' + req.query.q);

        var authOptions = {
            url: 'https://api.spotify.com/v1/artists/' + req.query.q,
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

        router.get('/artist/:id/albums', function(req, res) {

        console.log("RETRIEVING");
        console.log(req.params);
        console.log('URL:' + 'https://api.spotify.com/v1/artists/' + req.params.id + '/albums');

        var authOptions = {
            url: 'https://api.spotify.com/v1/artists/' + req.params.id + '/albums',
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
