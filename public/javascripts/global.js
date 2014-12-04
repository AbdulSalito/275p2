
// Productlist data array for filling in info box
var ProductListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the Product table on initial page load
    populateTable();


    // Delete Product link click
    $('#ProductList table tbody').on('click', 'td a.linkdeleteProduct', deleteProduct);

    // update Product link click
    $('#ProductList table tbody').on('click', 'td a.linkupdateProduct', updateProductPopulate);

    // Add Product button click
    $('#btnAddProduct').on('click', addProduct);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/Products/Productlist', function( data ) {
        // Stick our Product data array into a Productlist variable in the global object
        ProductListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowProduct" rel="' + this.Productname + '" title="Show Details">' + this.Productname + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkupdateProduct" rel="' + this._id + '">update</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteProduct" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#ProductList table tbody').html(tableContent);

        // Productname link click
        $('#ProductList table tbody').on('click', 'td a.linkshowProduct', showProductInfo);
    });
};

// Show Product Info
function showProductInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve Productname from link rel attribute
    var thisProductName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = ProductListData.map(function(arrayItem) { return arrayItem.Productname; }).indexOf(thisProductName);
    // Get our Product Object
    var thisProductObject = ProductListData[arrayPosition];

    //Populate Info Box
    $('#ProductInfoName').text(thisProductObject.fullname);
    $('#ProductInfoAge').text(thisProductObject.age);
    $('#ProductInfoGender').text(thisProductObject.gender);
    $('#ProductInfoLocation').text(thisProductObject.location);

};



// Add Product
function addProduct(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addProduct input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all Product info into one object
        var newProduct = {
            'Productname': $('#addProduct fieldset input#inputProductName').val(),
            'productuser': $('#addProduct fieldset input#inputProductUser').val(),
            'desc': $('#addProduct fieldset input#inputProductDesc').val(),
            'category': $('#addProduct fieldset input#inputProdutCategory').val()
        }

        // Use AJAX to post the object to our addProduct service
        $.ajax({
            type: 'POST',
            data: newProduct,
            url: '/Products/addProduct',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addProduct fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Product
function deleteProduct(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Product?');

    // Check and make sure the Product confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/Products/deleteProduct/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};


// Show Product Info
function updateProductPopulate(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve Productname from link rel attribute
    var thisProductID = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = ProductListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisProductID);
    // Get our Product Object
    var thisProductObject = ProductListData[arrayPosition];

    //Populate Info Box
    //console.log(thisProductObject);
    $('#addProduct fieldset input#inputProductName').val(thisProductObject.Productname);
    $('#addProduct fieldset input#inputProductUser').val(thisProductObject.user);
    $('#addProduct fieldset input#inputProductDesc').val(thisProductObject.desc);
    $('#addProduct fieldset input#inputProdutCategory').val(thisProductObject.category);

    //$('#addProduct fieldset button#btnAddProduct').html('update Product');
    //$('#addProduct fieldset button#btnAddProduct').prop('id', '#btnUpdateProduct');
    if ($('#btnUpdateProduct').length == 0) {
        var $input = $('<input type="button" value="update" id="btnUpdateProduct" rel="'+ $(this).attr('rel')+'"/>');
        $input.appendTo($("#addProduct fieldset"));
    }
        // Add Product button click
    $('#btnUpdateProduct').on('click', updateProduct);

};


// Update Product
function updateProduct(event) {

    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addProduct input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all Product info into one object
        var editProduct = {
            'Productname': $('#addProduct fieldset input#inputProductName').val(),
            'productuser': $('#addProduct fieldset input#inputProductUser').val(),
            'desc': $('#addProduct fieldset input#inputProductDesc').val(),
            'category': $('#addProduct fieldset input#inputProdutCategory').val()
        }

        // Use AJAX to post the object to our updateProduct service
        $.ajax({
            type: 'PUT',
            data: editProduct,
            url: '/Products/updateProduct/' + $(this).attr('rel'),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addProduct fieldset input').val('');
                $('#btnUpdateProduct').remove();

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};
