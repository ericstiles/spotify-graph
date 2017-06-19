$(function() { // on dom ready

    /**
     * [url description]
     * @type {String}
     */
    var url = 'http://localhost:8888/cy/artist?id=' + Utilities.getAllUrlParams().id + '&name=' + Utilities.getAllUrlParams().name;

    /**
     * [getMethods description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    var getMethods = function(obj) {
        var res = [];
        for (var m in obj) {
            if (typeof obj[m] == "function") {
                res.push(m)
                console.log(m);
            }
        }
        return res;
    }

    /**
     * [addAlbums description]
     * @param {[type]} ele [description]
     */
    var addAlbums = function (data) {
        console.log("addAlbums artist json:" + JSON.stringify(data));
        console.log("addAlbums:" + data.id); // `ele` holds the reference to the active element

        var url = '/cy/artist/' + data.id + '/albums';

        // $.ajax({
        //     url: url,
        //     type: 'POST',
        //     data: '{ test: \'test\' }',
        //     dataType: 'json',
        //     // contentType: 'application/json',
        //                 contentType: 'application/x-www-form-urlencoded',
        //     success: function(response) {
        //         console.log("search response->" + JSON.stringify(response));
        //         cy.add(response);
        //         cy.layout(layout).run();
        //     }
        // });
                $.post({
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json',
            // contentType: 'application/json',
                        contentType: 'application/x-www-form-urlencoded',
            success: function(response) {
                console.log("search response->" + JSON.stringify(response));
                cy.add(response);
                cy.layout(layout).run();
            },
            error : function (e) {
                console.log("ERROR : ", e);
            }
        });
    };

    /**
     * [addRootNode description]
     */
    var addRootNode = function () {
        $.ajax({
            url: url,
            success: function(response) {
                console.log("search response->" + JSON.stringify(response));
                el.push(response);
                console.log("el: " + JSON.stringify(el));
                console.log("el.data.id " + el[0].data.id);
                cy.add(el);

                console.log(JSON.stringify(cy.style().json()));

                // cy.style().selector("#" + el[0].data.id).style({'background-color': 'yellow'}).update();
                cy.style().selector("#" + el[0].data.id).style({ 'background-image': el[0].data.image }).update();

                console.log("After updating style");
                console.log(JSON.stringify(cy.style().json()));
                cy.layout(layout).run();
            }
        });
    }


    //Node and edge array
    var el = [];

    var layout = {
        name: 'concentric',
        concentric: function(node) {
            return node.degree();
        },
        levelWidth: function(nodes) {
            return 2;
        }
    };

    var style = [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'height': 80,
                'width': 80,
                'background-fit': 'cover',
                'border-color': '#000',
                'border-width': 3,
                'border-opacity': 0.5,
                // 'label': 'data(id)'
                'label': 'data(name)'
            }
        }, {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle'
            }
        }
    ]

    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        style: style,
        elements: el,
        layout: layout
    });

    var selectAllOfTheSameType = function(ele) {
        cy.elements().unselect();
        if (ele.isNode()) {
            cy.nodes().select();
        } else if (ele.isEdge()) {
            cy.edges().select();
        }
    };

    // demo your core ext
    cy.contextMenus({
        menuItems: [{
            id: 'add-ablums',
            content: 'add albums',
            tooltipText: 'add albums',
            selector: 'node',
            onClickFunction: function(event) {
                try {

                    // console.log("EVENT:" + JSON.stringify(event));
                    var target = event.target || event.cyTarget;
                    // getMethods(target);
                    console.log(target.data());
                    addAlbums(target.data());
                    // console.log(JSON.stringify(target));
                    // console.log("TARGET:" + JSON.stringify(target));
                    // target.remove();
                } catch (err) {
                    console.log("ERROR:" + err.message);
                    // console.log(JSON.stringify(err));
                }
            },
            hasTrailingDivider: false
        }, {
            id: 'remove',
            content: 'remove',
            tooltipText: 'remove',
            selector: 'node, edge',
            onClickFunction: function(event) {
                var target = event.target || event.cyTarget;
                target.remove();
            },
            hasTrailingDivider: true
        }, {
            id: 'hide',
            content: 'hide',
            tooltipText: 'hide',
            selector: '*',
            onClickFunction: function(event) {
                var target = event.target || event.cyTarget;
                target.hide();
            },
            disabled: false
        }, {
            id: 'add-node',
            content: 'add node',
            tooltipText: 'add node',
            coreAsWell: true,
            onClickFunction: function(event) {
                var data = {
                    group: 'nodes'
                };

                var pos = event.position || event.cyPosition;

                cy.add({
                    data: data,
                    position: {
                        x: pos.x,
                        y: pos.y
                    }
                });
            }
        }, {
            id: 'remove-selected',
            content: 'remove selected',
            tooltipText: 'remove selected',
            coreAsWell: true,
            onClickFunction: function(event) {
                cy.$(':selected').remove();
            }
        }, {
            id: 'select-all-nodes',
            content: 'select all nodes',
            tooltipText: 'select all nodes',
            selector: 'node',
            onClickFunction: function(event) {
                selectAllOfTheSameType(event.target || event.cyTarget);
            }
        }, {
            id: 'select-all-edges',
            content: 'select all edges',
            tooltipText: 'select all edges',
            selector: 'edge',
            onClickFunction: function(event) {
                selectAllOfTheSameType(event.target || event.cyTarget);
            }
        }],
        menuItemClasses: ['custom-menu-item'],
        contextMenuClasses: ['custom-context-menu']
    });
    addRootNode();

});
