var express = require('express');
var rp = require('request-promise');
var _ = require('underscore');

module.exports = function(cache) {

    /**
     * [router description]
     * @type {[type]}
     */
    var router = express.Router({ caseSensitive: true });
    /**
     * [timeLog description]
     * @param  {[type]} req   [description]
     * @param  {[type]} res   [description]
     * @param  {[type]} next) {                   console.log('cy.js Time: ', Date.now() + ', ' + req.query.id + ', ' + req.url);        next()    } [description]
     * @return {[type]}       [description]
     */
    router.use(function timeLog(req, res, next) {
            console.log('cy.js Time: ', Date.now() + ', ' + req.query.id + ', ' + req.url);
            next()
        })
        /**
         * [description]
         * @param  {[type]} req   [description]
         * @param  {Object} res)  {                   console.log("RETRIEVING ARTIST");                               console.log('URL:' + 'https:                                  var authOptions [description]
         * @param  {Object} json: true                 };                                     rp(authOptions)                                      .then(function(response) {                                           console.log(JSON.stringify(response));                console.log(JSON.stringify(response.name));                var data [description]
         * @return {[type]}       [description]
         */
    router.get('/artist', function(req, res) {

        console.log("RETRIEVING ARTIST");
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
                var data = { data: { type: 'artist', label: response.name, id: response.id, image: response.images[2].url } };
                res.send(data);
            })
            .catch(function(err) {
                console.log(err);
                res.send(err);
            });
    });
    /**
     * [description]
     * @param  {[type]} req   [description]
     * @param  {Object} res)  {                   console.log("GET: RETRIEVING ALBUMS");                       console.log("PARAMS:" + req.params);        console.log("QUERY:"     +  req.query);        console.log('URL:' + 'https:                                              var authOptions [description]
     * @param  {[type]} json: true                 };                                         rp(authOptions)                                              .then(function(response) {                                                     console.log(JSON.stringify(response));                                                                                           var list [description]
     * @return {[type]}       [description]
     */
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

                var list = _.filter(response.items, function(obj) {
                    return _.contains(obj.available_markets, 'US');
                });

                list = _.chain(response.items).filter(function(obj) {
                        return _.contains(obj.available_markets, 'US');
                    }).map(function(obj) {
                        var tmp = {};
                        tmp.data = { id: obj.name };
                        console.log(JSON.stringify(tmp));
                        return tmp;
                    })
                    .value();

                /**
                 * Created edges for the nodes found
                 * @param  {Object} obj) {                                   var tmp [description]
                 * @return {[type]}      [description]
                 */
                var list2 = _.chain(list).map(
                    function(obj) {
                        var tmp = {};
                        tmp.data = { source: req.query.label, target: obj.data.id, label: 'vertex', image: response.images[2].url };
                        return tmp;
                    }
                ).value();
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
                var list = _.filter(response.items, function(obj) {
                    return _.contains(obj.available_markets, 'US');
                });

                /**
                 * Create nodes from response
                 * @param  {Object} obj) {                                   return _.contains(obj.available_markets, 'US');                    }).map(function(obj) {                        var tmp [description]
                 * @return {[type]}      [description]
                 */
                list = _.chain(response.items).filter(function(obj) {
                        return _.contains(obj.available_markets, 'US');
                    }).map(function(obj) {
                        var tmp = {};
                        tmp.data = { type: 'album', id: obj.id, name: obj.name, image: obj.images[2].url };
                        console.log(JSON.stringify(tmp));
                        return tmp;
                    })
                    .value();
                /**
                 * Create edges from found nodes
                 * @param  {Object} obj) {                                   var tmp [description]
                 * @return {[type]}      [description]
                 */
                var list2 = _.chain(list).map(
                    function(obj) {
                        var tmp = {};
                        tmp.data = { source: sourceNode.id, target: obj.data.id, label: 'vertex' };
                        return tmp;
                    }
                ).value();
                res.send(list.concat(list2));
            })
            .catch(function(err) {
                console.log(err);
                res.send(err);
            });
    });

    router.post('/albums/:id/tracks', function(req, res) {
        console.log("GET: RETRIEVING TRACKS");
        console.log("PARAMS:" + JSON.stringify(req.params));
        console.log("QUERY:" + JSON.stringify(req.query));
        console.log("BODY:" + JSON.stringify(req.body));
        console.log('URL:' + 'https://api.spotify.com/v1/albums/' + req.params.id + '/tracks');

        var sourceNode = req.body;

        var authOptions = {
            url: 'https://api.spotify.com/v1/albums/' + req.params.id + '/tracks',
            headers: {
                'Authorization': 'Bearer ' + cache['access_token'],
                'User-Agent': 'Request-Promise'
            },
            json: true
        };

        rp(authOptions)
            .then(function(response) {
                console.log(JSON.stringify(response));
                var list = _.filter(response.items, function(obj) {
                    return _.contains(obj.available_markets, 'US');
                });

                /**
                 * Create nodes from response
                 * @param  {Object} obj) {                                   return _.contains(obj.available_markets, 'US');                    }).map(function(obj) {                        var tmp [description]
                 * @return {[type]}      [description]
                 */
                list = _.chain(response.items).filter(function(obj) {
                        return _.contains(obj.available_markets, 'US');
                    }).map(function(obj) {
                        var tmp = {};
                        tmp.data = {
                            type: 'track',
                            id: obj.id,
                            name: obj.name,
                            "disc_number": obj.disc_number,
                            "duration_ms": obj.duration_ms,
                            "explicit": obj.explicit
                        };
                        console.log(JSON.stringify(tmp));
                        return tmp;
                    })
                    .value();
                /**
                 * Create edges from found nodes
                 * @param  {Object} obj) {                                   var tmp [description]
                 * @return {[type]}      [description]
                 */
                var list2 = _.chain(list).map(
                    function(obj) {
                        var tmp = {};
                        tmp.data = { source: sourceNode.id, target: obj.data.id, label: 'vertex' };
                        return tmp;
                    }
                ).value();
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
