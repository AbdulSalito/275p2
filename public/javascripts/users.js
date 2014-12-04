
// userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();


    // Delete user link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteuser);

    // update user link click
    $('#userList table tbody').on('click', 'td a.linkupdateuser', updateuserPopulate);

    // Add user button click
    $('#btnAdduser').on('click', adduser);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.useruser + '</td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);

        // username link click
        $('#userList table tbody').on('click', 'td a.linkshowuser', showuserInfo);
    });
};

// Show user Info
function showuserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisuserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisuserName);
    // Get our user Object
    var thisuserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisuserObject.username);
    $('#userInfoUsername').text(thisuserObject.useruser);
    $('#userInfoDesc').text(thisuserObject.desc);
    $('#userInfoCategory').text(thisuserObject.category);

};



// Add user
function adduser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#adduser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newuser = {
            'username': $('#adduser fieldset input#inputuserName').val(),
            'useruser': $('#adduser fieldset input#inputuserUser').val(),
            'desc': $('#adduser fieldset input#inputuserDesc').val(),
            'category': $('#adduser fieldset input#inputProdutCategory').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newuser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#adduser fieldset input').val('');

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

// Delete user
function deleteuser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
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


// Show user Info
function updateuserPopulate(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisuserID = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisuserID);
    // Get our user Object
    var thisuserObject = userListData[arrayPosition];

    //Populate Info Box
    //console.log(thisuserObject);
    $('#adduser fieldset input#inputuserName').val(thisuserObject.username);
    $('#adduser fieldset input#inputuserUser').val(thisuserObject.useruser);
    $('#adduser fieldset input#inputuserDesc').val(thisuserObject.desc);
    $('#adduser fieldset input#inputProdutCategory').val(thisuserObject.category);

    //$('#adduser fieldset button#btnAdduser').html('update user');
    //$('#adduser fieldset button#btnAdduser').prop('id', '#btnUpdateuser');
    if ($('#btnUpdateuser').length == 0) {
        var $input = $('<input type="button" value="update" id="btnUpdateuser" rel="'+ $(this).attr('rel')+'"/>');
        $input.appendTo($("#adduser fieldset"));
    }
        // Add user button click
    $('#btnUpdateuser').on('click', updateuser);

};


// Update user
function updateuser(event) {

    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#adduser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var edituser = {
            'username': $('#adduser fieldset input#inputuserName').val(),
            'useruser': $('#adduser fieldset input#inputuserUser').val(),
            'desc': $('#adduser fieldset input#inputuserDesc').val(),
            'category': $('#adduser fieldset input#inputProdutCategory').val()
        }

        // Use AJAX to post the object to our updateuser service
        $.ajax({
            type: 'PUT',
            data: edituser,
            url: '/users/updateuser/' + $(this).attr('rel'),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#adduser fieldset input').val('');
                $('#btnUpdateuser').remove();

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
