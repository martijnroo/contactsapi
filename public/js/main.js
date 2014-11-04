$(document).ready(function() {

        $.ajax({
            url: "http://130.233.42.145:8080/contacts",
            type: 'get',
            // data: '',
            cache: false,
            async: true,
            success: function(response) {
                try {
                    displayContacts('.all_contacts', response);
                } catch (e) {

                }
            },
            fail: function(response) {

            }
        });
});

function displayContacts(parent, contacts) {
    $(parent).html('<ul></ul>');
    for (var i = 0; i < contacts.length; i++) {
        // for(property in contacts[i]) {

        // }
        $(parent).append('<li>'+contacts[i].name+'</li>');

    };
}

function displayContact(parent) {

}