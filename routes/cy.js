
// http://www.xnxx.com/video-gubwn81/tushy_eva_lovias_anal_adventure
var express = require('express');
var rp = require('request-promise');
var _ = require('underscore');

module.exports = function(cache) {

    var router = express.Router({ caseSensitive: true });

    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        console.log('cy.js Time: ', Date.now() + ', ' + req.query.id + ', ' + req.url);
        next()
    })

    router.get('/artist', function(req, res) {

        console.log("RETRIEVING ARTIST");
        // console.log(req.query.q);
        console.log('URL:' + 'https://api.spotify.com/v1/artists/' + req.query.id);

        var authOptions = {
            url: 'https://api.spotify.com/v1/artists/' + req.query.id,
            headers: {
                'Authorization': 'Bearer ' + cache['access_token'],
                'User-Agent': 'Request-Promise'
            },
            json: true
        };

        rp(authOptions)
            .then(function(response) {
                console.log(JSON.stringify(response));
                console.log(JSON.stringify(response.name));
                var data = { data: { label: response.name, id: response.id, image: response.images[2].url } };
                res.send(data);


            })
            .catch(function(err) {
                console.log(err);
                res.send(err);
            });

    });

    router.get('/artist/:id/albums', function(req, res) {

        console.log("GET: RETRIEVING ALBUMS");
        console.log("PARAMS:" + req.params);
        console.log("QUERY:" + req.query);
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

                // console.log(_.each(response.items, function(obj){
                //      return _.contains(obj.available_markets, 'US');
                //  }));
                var list = _.filter(response.items, function(obj) {
                    return _.contains(obj.available_markets, 'US');
                });

                console.log("1. filtering:" + list);

                list = _.chain(response.items).filter(function(obj) {
                        return _.contains(obj.available_markets, 'US');
                    }).map(function(obj) {
                        var tmp = {};
                        // tmp.data = _.pick(obj, "name");
                        tmp.data = { id: obj.name };
                        console.log(JSON.stringify(tmp));
                        return tmp;
                    })
                    .value();

                var list2 = _.chain(list).map(
                    function(obj) {

                        var tmp = {};
                        tmp.data = { source: req.query.label, target: obj.data.id, label: 'vertex' };
                        if (req.query.label == obj.data.id) {
                            console.log('--------------------');
                            console.log('found a node with ' + req.query.label + ' in it');
                            console.log('--------------------');


                        }
                        console.log(tmp);
                        return tmp;
                    }
                ).value();

                console.log("2. filtering:" + JSON.stringify(list2));



                console.log("3. filtering:" + JSON.stringify(list.concat(list2)));


                res.send(list.concat(list2));
            })
            .catch(function(err) {
                console.log(err);
                res.send(err);
            });

    });

    router.post('/artist/:id/albums', function(req, res) {

        console.log("POST: RETRIEVING ALBUMS");
        console.log("PARAMS:" + JSON.stringify(req.params));
        console.log("QUERY:" + JSON.stringify(req.query));
        console.log("BODY:" + JSON.stringify(req.body));
        // console.log(JSON.stringify(req));
        console.log('URL:' + 'https://api.spotify.com/v1/artists/' + req.params.id + '/albums');

        var sourceNode = req.body;

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

                // console.log(_.each(response.items, function(obj){
                //      return _.contains(obj.available_markets, 'US');
                //  }));
                var list = _.filter(response.items, function(obj) {
                    return _.contains(obj.available_markets, 'US');
                });

                console.log("1. filtering:" + list);

                list = _.chain(response.items).filter(function(obj) {
                        return _.contains(obj.available_markets, 'US');
                    }).map(function(obj) {
                        var tmp = {};
                        // tmp.data = _.pick(obj, "name");
                        tmp.data = { id: obj.name };
                        console.log(JSON.stringify(tmp));
                        return tmp;
                    })
                    .value();

                var list2 = _.chain(list).map(
                    function(obj) {

                        var tmp = {};
                        tmp.data = { source: sourceNode.id, target: obj.data.id, label: 'vertex' };
                        if (req.query.label == obj.data.id) {
                            console.log('--------------------');
                            console.log('found a node with ' + req.query.label + ' in it');
                            console.log('--------------------');


                        }
                        console.log(tmp);
                        return tmp;
                    }
                ).value();

                console.log("2. filtering:" + JSON.stringify(list2));



                console.log("3. filtering:" + JSON.stringify(list.concat(list2)));


                res.send(list.concat(list2));
            })
            .catch(function(err) {
                console.log(err);
                res.send(err);
            });

    });

    return router;
}

// module.exports = router
