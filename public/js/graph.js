$(function() { // on dom ready

    //*******************************************

    url = 'http://localhost:8888/cy/artist?id=' + Utilities.getAllUrlParams().id + '&name=' + Utilities.getAllUrlParams().name;


    var el = [];
    // var el = [ // list of graph elements to start with
    //     { // node a
    //       data: { id: 'a' },

    //     },
    //     { // node b
    //       data: { id: 'b' }
    //     },
    //     { // node c
    //       data: { id: 'c' }
    //     },
    //     { // edge ab
    //       data: { id: 'ab', source: 'a', target: 'b' }
    //     }
    //   ];

    // var layout = {
    //     name: 'grid',
    //     rows: 2
    // };

    // var layout = {
    //     name: 'circle'
    // };

     layout = {
        name: 'concentric',
        concentric: function( node ){
          return node.degree();
        },
        levelWidth: function( nodes ){
          return 2;
        }
      };

    var cy = cytoscape({

        container: document.getElementById('cy'), // container to render in

        elements: el,

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                        'height': 80,
                        'width': 80,
                        'background-fit': 'cover',
                        'border-color': '#000',
                        'border-width': 3,
                        'border-opacity': 0.5,
                        'label': 'data(id)'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'
                }
            }
        ],

        layout: layout

    });

    function addRelatedArtists(ele) {
        console.log(JSON.stringify(ele.json()));
        console.log(ele.id()); // `ele` holds the reference to the active element
        cy.add({
            data: { id: new Date() + "" }
        });
        cy.layout(layout).run();
    }

    function addAlbums(ele) {
        console.log("addAlbums artist json:" + JSON.stringify(ele.json()));
        console.log("addAlbums:" + ele.id()); // `ele` holds the reference to the active element

        var spotifyId = ele.json().data.spotifyId;
        console.log("addAlbums:" + spotifyId);
        // cy.add({
        //     data: { id: new Date() + "" }
        // });
        // cy.layout(layout).run();

        var url = '/cy/artist/' + spotifyId + '/albums?label=' + ele.id();

        $.ajax({
            url: url,
            success: function(response) {
                console.log("search response->" + JSON.stringify(response));

                


                // el.push(response);
                // console.log("el: " + JSON.stringify(el));
                // console.log("el.data.id " + el[0].data.id);
                cy.add(response);
cy.layout(layout).run();
                // console.log(JSON.stringify(cy.style().json()));

                // // cy.style().selector("#" + el[0].data.id).style({'background-color': 'yellow'}).update();
                // cy.style().selector("#" + el[0].data.id).style({ 'background-image': el[0].data.image }).update();

                // console.log("After updating style");
                // console.log(JSON.stringify(cy.style().json()));

                // cy.layout(layout).run();
            }
        });


    }

    function addRootNode() {
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

                // .selector('node')
                //     .css({
                //         'height': 80,
                //         'width': 80,
                //         'background-fit': 'cover',
                //         'border-color': '#000',
                //         'border-width': 3,
                //         'border-opacity': 0.5
                // })

                cy.layout(layout).run();
            }
        });
    }


// ********************************************
// *
// * BEGINNING = circular context menu
// *
// ********************************************

    // the default values of each option are outlined below:
    // var defaults = {
    //     menuRadius: 100, // the radius of the circular menu in pixels
    //     selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
    //     commands: [ // an array of commands to list in the menu or a function that returns the array

    //         { // example command
    //             fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
    //             content: 'Related Artists', // html/text content to be displayed in the menu
    //             select: addRelatedArtists,
    //             enabled: true // whether the command is selectable
    //         }, { // example command
    //             fillColor: 'rgba(255, 255, 0, 0.75)', // optional: custom background color for item
    //             content: 'Albums', // html/text content to be displayed in the menu
    //             select: addAlbums,
    //             enabled: true // whether the command is selectable
    //         }
    //     ], // function( ele ){ return [ /*...*/ ] }, // example function for commands
    //     fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
    //     activeFillColor: 'rgba(92, 194, 237, 0.75)', // the colour used to indicate the selected command
    //     activePadding: 20, // additional size in pixels for the active command
    //     indicatorSize: 24, // the size in pixels of the pointer to the active command
    //     separatorWidth: 3, // the empty spacing in pixels between successive commands
    //     spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
    //     minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
    //     maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
    //     openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
    //     itemColor: 'white', // the colour of text in the command's content
    //     itemTextShadowColor: 'black', // the text shadow colour of the command's content
    //     zIndex: 9999, // the z-index of the ui div
    //     atMouse: false // draw menu at mouse position
    // };

    // var cxtmenuApi = cy.cxtmenu(defaults);

// ********************************************
// *
// * ENDING = circular context menu
// *
// ********************************************
// ********************************************
// *
// * BEGINNING = regular context menu
// *
// ********************************************
var options = {
    // List of initial menu items
    menuItems: [/*
      {
        id: 'remove', // ID of menu item
        content: 'remove', // Display content of menu item
        tooltipText: 'remove', // Tooltip text for menu item
        // Filters the elements to have this menu item on cxttap
        // If the selector is not truthy no elements will have this menu item on cxttap
        selector: 'node, edge', 
        onClickFunction: function () { // The function to be executed on click
          console.log('remove element');
        },
        disabled: false, // Whether the item will be created as disabled
        show: false, // Whether the item will be shown or not
        hasTrailingDivider: true, // Whether the item will have a trailing divider
        coreAsWell: false // Whether core instance have this item on cxttap
      },
      {
        id: 'hide',
        content: 'hide',
        tooltipText: 'hide',
        selector: 'node, edge',
        onClickFunction: function () {
          console.log('hide element');
        },
        disabled: true
      },
      {
        id: 'add-node',
        content: 'add node',
        tooltipText: 'add node',
        selector: 'node',
        coreAsWell: true,
        onClickFunction: function () {
          console.log('add node');
        }
      }*/
    ],
    // css classes that menu items will have
    menuItemClasses: [
      // add class names to this list
    ],
    // css classes that context menu will have
    contextMenuClasses: [
      // add class names to this list
    ]
};
var instance = cy.contextMenus( options );
// ********************************************
// *
// * ENDING = regular context menu
// *
// ********************************************


    addRootNode();
    //*******************************************

    // var cy = cytoscape({

    //     container: document.getElementById('cy'),

    //     boxSelectionEnabled: false,
    //     autounselectify: true,
    //     minZoom: 0.5,

    //     elements: {
    //         nodes: [
    //             { data: { id: 'n', label: 'Tap me' } },
    //             { data: { id: 'o', label: 'Tap me' } }
    //         ]
    //     },

    //     layout: {
    //         name: 'grid',
    //         padding: 100
    //     },

    //     ready: function() {
    //         window.cy = this;
    //     },

    //     style: 'node { content: data(label); }'
    // });

    // // you can use qtip's regular options
    // // see http://qtip2.com/
    // cy.$('#n').qtip({
    //     content: 'Hello!',
    //     position: {
    //         my: 'top center',
    //         at: 'bottom center'
    //     },
    //     style: {
    //         classes: 'qtip-bootstrap',
    //         tip: {
    //             width: 16,
    //             height: 8
    //         }
    //     }
    // });

    // cy.$('#o').qtip({
    //     content: 'Hello O!',
    //     position: {
    //         my: 'top center',
    //         at: 'bottom center'
    //     },
    //     style: {
    //         classes: 'qtip-bootstrap',
    //         tip: {
    //             width: 16,
    //             height: 8
    //         }
    //     }
    // });


    //*************************************


    // var cy = cytoscape({

    //   container: document.getElementById('cy'),

    //   elements: [
    //     { // node n1
    //       group: 'nodes', // 'nodes' for a node, 'edges' for an edge
    //       // NB the group field can be automatically inferred for you but specifying it
    //       // gives you nice debug messages if you mis-init elements


    //       data: { // element data (put json serialisable dev data here)
    //         id: 'n1', // mandatory (string or number) id for each element, assigned automatically on undefined
    //         parent: 'nparent', // indicates the compound node parent id; not defined => no parent
    //       },

    //       // scratchpad data (usually temp or nonserialisable data)
    //       scratch: {
    //         foo: 'bar'
    //       },

    //       position: { // the model position of the node (optional on init, mandatory after)
    //         x: 100,
    //         y: 100
    //       },

    //       selected: false, // whether the element is selected (default false)

    //       selectable: true, // whether the selection state is mutable (default true)

    //       locked: false, // when locked a node's position is immutable (default false)

    //       grabbable: true, // whether the node can be grabbed and moved by the user

    //       classes: 'foo bar' // a space separated list of class names that the element has
    //     },

    //     { // node n2
    //       data: { id: 'n2' },
    //       renderedPosition: { x: 200, y: 200 } // can alternatively specify position in rendered on-screen pixels
    //     },

    //     { // node n3
    //       data: { id: 'n3', parent: 'nparent' },
    //       position: { x: 123, y: 234 }
    //     },

    //     { // node nparent
    //       data: { id: 'nparent', position: { x: 200, y: 100 } }
    //     },

    //     { // edge e1
    //       data: {
    //         id: 'e1',
    //         // inferred as an edge because `source` and `target` are specified:
    //         source: 'n1', // the source node id (edge comes from this node)
    //         target: 'n2'  // the target node id (edge goes to this node)
    //       }
    //     }
    //   ],

    //   layout: {
    //     name: 'preset'
    //   },

    //   // so we can see the ids
    //   style: [
    //     {
    //       selector: 'node',
    //       style: {
    //         'content': 'data(id)'
    //       }
    //     }
    //   ]

    // });


    // }); // on dom ready



    //**************************

    // var cy = cytoscape({

    //   container: document.getElementById('cy'),

    //   boxSelectionEnabled: false,
    //   autounselectify: true,
    //   maxZoom: 2,
    //   minZoom: 0.5,

    //   elements: {
    //     nodes: [
    //       { data: { id: 'n', label: 'Tap me' } }
    //     ]
    //   },

    //   layout: {
    //     name: 'grid',
    //     padding: 100
    //   },

    //   ready: function(){
    //     window.cy = this;
    //   },

    //   style: 'node { content: data(label); }'
    // });

    // // you can use qtip's regular options
    // // see http://qtip2.com/
    // cy.$('#n').qtip({
    //   content: 'Hello!',
    //   position: {
    //     my: 'top center',
    //     at: 'bottom center'
    //   },
    //   style: {
    //     classes: 'qtip-bootstrap',
    //     tip: {
    //       width: 16,
    //       height: 8
    //     }
    //   }
    // });

    //*********************
    //


}); // on dom ready
