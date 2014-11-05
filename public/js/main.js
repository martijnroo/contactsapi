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
		alert("4");
        $('.all_contacts').append('<button class="contactButton" id='+contacts[i]._id+'>'+contacts[i].name+'</button></br>');
    };
    $('button.contactButton').click(function() {
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
