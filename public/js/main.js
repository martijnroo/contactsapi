$(document).ready(function() {
    retrieve('contacts', displayContacts);
    
    $('button#backToList').click(function(){
		retrieve('contacts', displayContacts);
	});
	//*/
});

function displayContacts(contacts) {
    
    emptyDisplayContact();
    
    for (var i = 0; i < contacts.length; i++) {
        $('.all_contacts').append('<button id='+contacts[i]._id+' class="btn btn-primary">'+contacts[i].name+'</button></br>');
    };
    $('button').click(function() {
        retrieve('contacts/'+this.id, displayContact);
    });
}

function emptyDisplayContact(){
	$('.all_contacts').html('');
}

function displayContact(contact) {

    emptyDisplayContact();
	var div = generateContactDiv(contact);
	$('.all_contacts').append(div);
    
}

function generateContactDiv(contact){
	
	var divElement = $("<div></div>", {class:"contactDisplay", id:contact._id});
	var table = $("<table></table>");
	var properties = Object.keys(contact);

	for(var i = 1; i < 4; i++){
		table.append("<tr><td><b>"+properties[i]+"</b></td><td>"+contact[properties[i]]+"</td></tr>");
	}
	divElement.append(table);
	return divElement;
	//*/
}
function retrieve(request, success_function, data) {

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

function delete_contact(contact_id) {
    $.ajax({
        url: "http://localhost:8080/contacts/"+contact_id,
        type: 'DELETE',
        cache: false,
        async: true,
        success: function(response) {
            try {
                console.log('success');
                retrieve('contacts', displayContacts);
            } catch (e) {
                console.log('catch');
            }
        },
        fail: function(response) {
                console.log('fail');
        }
    });
}
