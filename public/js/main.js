$(document).ready(function() {
    retrieve('contacts', displayContacts);
});

function displayContacts(contacts) {
    var parent = '.all_contacts';
    $(parent).html('');
    for (var i = 0; i < contacts.length; i++) {
        $(parent).append('<button id='+contacts[i]._id+'>'+contacts[i].name+'</button></br>');
    };
    $('button').click(function() {
        retrieve('contacts/'+this.id, displayContact);
    });
}

function displayContact(contact) {
    var parent = '.all_contacts';
    $(parent).html('');
    var properties = Object.keys(contact);
    for (var i = 0; i < properties.length; i++) {
        $(parent).append('<tr><td>'+properties[i]+'</td><td>'+contact[properties[i]]+'</td></tr>');
    };
    
}

function retrieve(request, success_function, data) {
    $.ajax({
        url: "http://130.233.42.145:8080/"+request,
        type: 'get',
        data: '',
        cache: false,
        async: true,
        success: function(response) {
            try {
                success_function(response);
            } catch (e) {
            }
        },
        fail: function(response) {
        }
    });
}