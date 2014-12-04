
// offerlist data array for filling in info box
var offerListData = [];
var loggedInUser;
// getLogged in user
$.getJSON( '/users/loggedInUser', function( data ) {
    loggedInUser = data;
});
// DOM Ready =============================================================
$(document).ready(function() {
    var currentLocation = window.location.pathname;
    // Populate the offer table on initial page load
    if (currentLocation.indexOf("makeOffer") >= 0) {
        populateTableMakeOffer();
    } else {
        populateReceivedOffers();
    }

    populateCategory();
    // update offer link click
    $('#offerList table tbody').on('click', 'td a.linkupdateoffer', updateoffer);

    // Add offer button click
    $('#btnAddoffer').on('click', addoffer);
});

// Functions =============================================================
// Fill Category div
function populateCategory() {

    // Empty content string
    var tableContent = '';
    tableContent += '<a href="#" class="ReceivedOffers" rel="Received" title="Show Details">Received Offers</a> | ';
    tableContent += '<a href="#" class="SentOffers" rel="Sent" title="Show Details">Offers Status</a>';

    // Inject the whole content string into our existing HTML table
    $('#category').html(tableContent);

    $('#CatogryInfo').on('click', 'a.ReceivedOffers', populateReceivedOffers);
    $('#CatogryInfo').on('click', 'a.SentOffers', populateSentOffers);
};
// Fill table with data
function populateReceivedOffers() {

    // Empty content string
    var tableContent = '';
        // jQuery AJAX call for JSON
    $.getJSON( '/offers/offersReceived', function( data ) {
        // Stick our Product data array into a Productlist variable in the global object
        ProductListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            if (this.productId.productuser == undefined || this.offeredID.productuser == undefined) {
                tableContent += '';
            } else {
                tableContent += '<tr>';
                tableContent += '<td>' + this.productId.Productname + '</td>';
                tableContent += '<td>' + this.productId.productuser + '</td>';
                tableContent += '<td rowspan="5"><a href="#" class="linkUptateOffer" id="' + this._id + '" rel="Accepted">Accept</a> | ';
                tableContent += '<a href="#" class="linkUptateOffer" id="' + this._id + '" rel="Rejected">Reject</a></td>';
                tableContent += '</tr>';
                tableContent += '</tr>';
                tableContent += '<tr><td colspan="2">';
                tableContent += '<strong>Description:</strong> ';
                tableContent += this.productId.desc;
                tableContent += '<hr>';
                tableContent += '</td></tr>';
                tableContent += '<tr><td><strong> in trade of:</strong>';
                tableContent += '<hr></td></tr>';
                tableContent += '<tr>';
                tableContent += '<td>' + this.offeredID.Productname + '</td>';
                tableContent += '<td>By ' + this.offeredID.productuser + '</td>';
                tableContent += '</tr>';
                tableContent += '</tr>';
                tableContent += '<tr><td colspan="2">';
                tableContent += '<strong>Description:</strong> ';
                tableContent += this.offeredID.desc;
                tableContent += '<hr>';
                tableContent += '</td></tr>';
            }

        });

        // Inject the whole content string into our existing HTML table
        $('#offerList table tbody').html(tableContent);

        // Productname link click
        $('#offerList table tbody').on('click', 'td a.linkUptateOffer', updateoffer);
    });
};

// Fill table with data
function populateSentOffers() {

    // Empty content string
    var tableContent = '';
        // jQuery AJAX call for JSON
    $.getJSON( '/offers/offersSent', function( data ) {
        // Stick our Product data array into a Productlist variable in the global object
        ProductListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            if (this.productId.productuser == undefined || this.offeredID.productuser == undefined) {
                tableContent += '';
            } else {
                tableContent += '<tr>';
                tableContent += '<td>' + this.productId.Productname + '</td>';
                tableContent += '<td>' + this.productId.productuser + '</td>';
                tableContent += '<td rowspan="5">' + this.status + '</td>';
                tableContent += '</tr>';
                tableContent += '</tr>';
                tableContent += '<tr><td colspan="2">';
                tableContent += '<strong>Description:</strong> ';
                tableContent += this.productId.desc;
                tableContent += '<hr>';
                tableContent += '</td></tr>';
                tableContent += '<tr><td><strong> in trade of:</strong>';
                tableContent += '<hr></td></tr>';
                tableContent += '<tr>';
                tableContent += '<td>' + this.offeredID.Productname + '</td>';
                tableContent += '<td>By ' + this.offeredID.productuser + '</td>';
                tableContent += '</tr>';
                tableContent += '</tr>';
                tableContent += '<tr><td colspan="2">';
                tableContent += '<strong>Description:</strong> ';
                tableContent += this.offeredID.desc;
                tableContent += '<hr>';
                tableContent += '</td></tr>';
            }

        });

        // Inject the whole content string into our existing HTML table
        $('#offerList table tbody').html(tableContent);

        // Productname link click
        //$('#offerList table tbody').on('click', 'td a.linkUptateOffer', updateoffer);
    });
};



// Fill table with data
function populateTableMakeOffer() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/offers/offerlist', function( data ) {
        // Stick our offer data array into a offerlist variable in the global object
        offerListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowProduct" rel="' + this.Productname + '" title="Show Details">' + this.Productname + '</a></td>';
            if (loggedInUser === this.productuser) {
                tableContent += '<td><a href="#" class="linkupdateProduct" rel="' + this._id + '">Trade this item</a></td>';
            } else {
                tableContent += '<td><a href="#" class="linkupdateProduct" rel="' + this._id + '">make an offer</a></td>';
            }
            tableContent += '</tr>';
            tableContent += '</tr>';
            tableContent += '<tr><td colspan="3">';
            tableContent += '<strong>Description:</strong> ';
            tableContent += this.desc;
            tableContent += '<hr>';
            tableContent += '</td></tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#offerList table tbody').html(tableContent);

        // offername link click
        $('#offerList table tbody').on('click', 'td a.linkupdateProduct', addoffer);
    });
};

// Add offer
function addoffer(event) {
    event.preventDefault();

    var thisOfferId = $(this).attr('rel');
    var productID = window.location.pathname.substring(18);
    console.log(productID);

    // If it is, compile all offer info into one object
        var newoffer = {
            'productId': productID,
            'offeredID': thisOfferId,
            'status': 'Pending'
        }

        // Use AJAX to post the object to our addoffer service
        $.ajax({
            type: 'POST',
            data: newoffer,
            url: '/offers/addoffer',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
};

// Update offer
function updateoffer(event) {

    event.preventDefault();

        // If it is, compile all offer info into one object
    var editoffer = {
        'status': $(this).attr('rel')
    }

    // Use AJAX to post the object to our updateoffer service
    $.ajax({
        type: 'PUT',
        data: editoffer,
        url: '/offers/offerDecision/' + $(this).attr('id'),
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
            // Update the table
            populateReceivedOffers();

        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response);

        }
    });


};
