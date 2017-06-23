$(function() { // on dom ready

    /**
     * [url description]
     * @type {String}
     */
    var url = 'http://localhost:8888/cy/artist?id=' + Utilities.getAllUrlParams().id + '&name=' + Utilities.getAllUrlParams().name;

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

    // var layout = {
    //     name: 'concentric',
    //     concentric: function(node) {
    //         return node.degree();
    //     },
    //     levelWidth: function(nodes) {
    //         return 2;
    //     }
    // };

    var layout = {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20
      };

    var style = [ // the stylesheet for the graph
        {
            selector: 'node[type="artist"]',
            style: {
                'height': 80,
                'width': 80,
                'background-fit': 'cover',
                'border-color': '#76eec6',
                'border-width': 3,
                'border-opacity': 0.5,
                // 'label': 'data(id)'
                'label': 'data(name)'
            }
        },         {
            selector: 'node[type="album"]',
            style: {
                'height': 80,
                'width': 80,
                'background-fit': 'cover',
                'border-color': '#bf3eff',
                'border-width': 3,
                'border-opacity': 0.5,
                // 'label': 'data(id)'
                'label': 'data(name)'
            }
        }, {
            selector: 'node[type="track"]',
            style: {
                'height': 80,
                'width': 80,
                'background-fit': 'cover',
                'border-color': '#76eec6',
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
            id: 'add-albums',
            content: 'add albums',
            tooltipText: 'add albums',
            selector: 'node[type="artist"]',
            onClickFunction: function(event) {
                try {
                    Buttons.addAlbumsEvent(event, cy, layout);
                } catch (err) {
                    console.log("ERROR:" + err.message);
                }
            },
            hasTrailingDivider: false
        }, {
            id: 'add-related-artists',
            content: 'add related artists',
            tooltipText: 'add related artists',
            selector: 'node[type="artist"]',
            onClickFunction: function(event) {
                try {
                    Buttons.addRelatedArtistsEvent(event, cy, layout);
                } catch (err) {
                    console.log("ERROR:" + err.message);
                }
            },
            hasTrailingDivider: false
        }, {
            id: 'add-album-tracks',
            content: 'add album tracks',
            tooltipText: 'add album tracks',
            selector: 'node[type="album"]',
            onClickFunction: function(event) {
                try {
                    Buttons.addTracksEvent(event, cy, layout);
                } catch (err) {
                    console.log("ERROR:" + err.message);
                    // console.log(JSON.stringify(err));
                }
            },
            hasTrailingDivider: false
        }, {
            id: 'add-top-tracks',
            content: 'add top tracks',
            tooltipText: 'add top tracks',
            selector: 'node[type="artist"]',
            onClickFunction: function(event) {
                try {
                    Buttons.addRelatedArtistsEvent(event, cy, layout);
                    // console.log("EVENT:" + JSON.stringify(event));
                    // var target = event.target || event.cyTarget;
                    // getMethods(target);
                    // console.log(target.data());
                    // addAlbums(target.data());
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
