$(document).ready(function() {
    retrieve('contacts', displayContacts);
}); 

var host = "localhost";

function displayNewContactForm() {
    var parent = '.all_contacts';
    $(parent).html('<form id="new_contact"></form>');
    $(parent).find('form').append('<p>Name: <input id="name" name="name" placeholder="Enter name" type="text" size="20" maxlength="20"></p>');
    $(parent).find('form').append('<p>Phone: <input id="phone" name="phone" placeholder="Enter phone number" type="text" size="20" maxlength="20"></p>');
    $(parent).find('form').append('<p>Email: <input id="email" name="email" placeholder="Enter email address" type="text" size="20" maxlength="20"></p>');

    $(parent).append('<button class="btn btn-default cancel">Back</button><button class="btn btn-success save">Save contact</button>');
    $('.cancel').click(function() {
        retrieve('contacts', displayContacts);
    });
    $('.save').click(function() {
        add_contact('name='+$('#name').val() + '&phone=' + $('#phone').val() + '&email=' + $('#email').val());
    });
}

function displayContacts(contacts) {
    var parent = '.all_contacts';
    $(parent).html('');
    for (var i = 0; i < contacts.length; i++) {
        $(parent).append('<button id='+contacts[i]._id+' class="btn btn-primary contact">'+contacts[i].name+'</button></br>');
    };
    $('button.contact').click(function() {
        retrieve('contacts/'+this.id, displayContact);
    });

    $(parent).append('<button class="btn btn-success new">New contact</button>');
    $('.new').click(displayNewContactForm);
}

function displayContact(contact) {
    var parent = '.all_contacts';
    $(parent).html('<table><tbody></tbody></table>');
    var properties = Object.keys(contact);
    for (var i = 0; i < properties.length; i++) {
        $(parent).find('table>tbody').append('<tr><td>'+properties[i]+'</td><td>'+contact[properties[i]]+'</td></tr>');
    };
    $(parent).append('<button class="btn btn-default cancel">Back</button><button id="'+contact._id+'" class="btn btn-danger delete">Remove contact</button>');
    $('.cancel').click(function() {
        retrieve('contacts', displayContacts);
    });
    $('.delete').click(function() {
        delete_contact(this.id);
    });
}

function retrieve(request, success_function) {
    $.ajax({
        url: "http://"+host+":8080/"+request,
        type: 'get',
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

function delete_contact(contact_id) {
    $.ajax({
        url: "http://"+host+":8080/contacts/"+contact_id,
        type: 'DELETE',
        cache: false,
        async: true,
        success: function(response) {
            try {
                retrieve('contacts', displayContacts);
            } catch (e) {
            }
        },
        fail: function(response) {
        }
    });
}

function add_contact(data) {
    $.ajax({
        url: "http://"+host+":8080/contacts/",
        type: 'POST',
        data: data,
        cache: false,
        async: true,
        success: function(response) {
            try {
                retrieve('contacts/'+response.id, displayContact);
            } catch (e) {
            }
        },
        fail: function(response) {
        }
    });
}
