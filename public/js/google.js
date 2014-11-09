$(document).ready(function() {
    
    
    $('.js-google_contacts_get').click(function(){
		auth(fetch);
	});
    $('.js-google_contacts_set').click(function(){
		auth(syncToGoogle);
	});
    
}); 





function auth(func) {
	var config = {
		'client_id': '834560503457-3j727nfs1hs0k91f2vbf0tuhb9dpqg71.apps.googleusercontent.com',
		'scope': 'https://www.google.com/m8/feeds'
	};
	gapi.auth.authorize(config, func(gapi.auth.getToken()));
}
 
function fetch(token) {
	$.ajax({
		url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json',
		dataType: 'jsonp',
		data: token
	}).done(function(data) {
		var contactsArray = [];
		
		for(var i = 0; i < data["feed"]["entry"].length; i++){
			
			var name;
			var phone;
			var email;
			try{
				name  = data["feed"]["entry"][i]["title"]["$t"];
				phone = data["feed"]["entry"][i]["gd$phoneNumber"][0]["$t"];
				email = data["feed"]["entry"][i]["gd$email"][0]["address"];
			} catch(err){
				email = "";
			}
			var contact = {
				"name" : name,
				"phone": phone,
				"email": email
			};
			
			if(name != ""){
				contactsArray.push(contact);
			}
		}
		
		// Getting all the contacts from the mongo and deleting them
		retrieve('contacts', deleteContacts);
		
		// Adding all the contacts from contactsArray
		for(var i = 0; i < contactsArray.length; i++){
			var c = contactsArray[i];
			add_contact('name='+c.name + '&phone=' +c.phone + '&email=' +c.email);
		}
		//*/
		
	});
}

function deleteContacts(contacts){

	for (var i = 0; i < contacts.length; i++) {
		delete_contact(contacts[i]._id);
	};
	
}


function syncToGoogle(token) {
	// Getting each google contacts
	$.ajax({
		url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json',
		dataType: 'jsonp',
		data: token
	}).done(function(data) {
		
		// Emptying the google contacts
		for(var i = 0; i < data["feed"]["entry"].length; i++){
			// Getting the id
			var idStr  = data["feed"]["entry"][i]["id"]["$t"];
			var array = idStr.split("/");
			var id = array[array.length-1];
			
			// Deleting this contact
			deleteGoogleContact(token, id);
		}
		// Saving the contacts from mongodb
		
	});
}

function deleteGoogleContact(token, id){
	$.ajax({
		url: 'https://www.google.com/m8/feeds/contacts/default/full/'+id+'?'+$.param(token),
		type: 'DELETE',
		dataType: 'jsonp',
		method: 'DELETE',
		data: token
	}).done(function(data2) {
		console.log(JSON.stringify(data2));
		console.log(data2);
	});
}

