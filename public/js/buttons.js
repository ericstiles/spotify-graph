var Buttons = {

    /**
     * [addAlbumsEvent description]
     * @param {[type]} event [description]
     */
    addAlbumsEvent: function(event, cy, layout) {
        try {
            var target = event.target || event.cyTarget;
            var data = target.data();
            console.log("addAlbums artist json:" + JSON.stringify(data));
            console.log("addAlbums:" + data.id); // `ele` holds the reference to the active element
            var url = '/cy/artist/' + data.id + '/albums';
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
                    //_ chain each response if type album set selector
                    console.log("response length:" + response.length);
                    _.chain(response).each(function(obj){
                        console.log("chain loop:" + JSON.stringify(obj));
                        cy.style().selector("#" + obj.data.id).style({ 'background-image': obj.data.image }).update();
                    })
                    // cy.style().selector("#" + el[0].data.id).style({ 'background-image': el[0].data.image }).update();
                    cy.layout(layout).run();
                },
                error: function(e) {
                    console.log("ERROR : ", e);
                }
            });
        } catch (err) {
            console.log("ERROR:" + err.message);
        }
    },
    /**
     * [addAlbumsEvent description]
     * @param {[type]} event [description]
     */
    addTracksEvent: function(event, cy, layout) {
        try {
            var target = event.target || event.cyTarget;
            var data = target.data();
            console.log("Add Tracks To Albums:" + JSON.stringify(data));
            console.log("Add Tracks To Albums:" + data.id); // `ele` holds the reference to the active element
            var url = '/cy/albums/' + data.id + '/tracks';
            $.post({
                url: url,
                type: 'POST',
                data: data,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                success: function(response) {
                    console.log("search response->" + JSON.stringify(response));
                    cy.add(response);
                    //_ chain each response if type album set selector
                    console.log("response length:" + response.length);
                    _.chain(response).each(function(obj){
                        console.log("chain loop:" + JSON.stringify(obj));
                        cy.style().selector("#" + obj.data.id).style({ 'background-image': obj.data.image }).update();
                    })
                    // cy.style().selector("#" + el[0].data.id).style({ 'background-image': el[0].data.image }).update();
                    cy.layout(layout).run();
                },
                error: function(e) {
                    console.log("ERROR : ", e);
                }
            });
        } catch (err) {
            console.log("ERROR:" + err.message);
        }
    }
};
