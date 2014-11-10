$(document).ready(function() {
    
    
    $('.js-google_contacts_get').click(function(){
		auth(fetch);
	});
    $('.js-google_contacts_set').click(function(){
		auth(syncToGoogle);
	});
    
}); 



var token;

function auth(func) {
	var config = {
		'client_id': '258506329176-j2tmeb2n406di5v07p5edgrtndif02oj.apps.googleusercontent.com',
		'scope': 'https://www.google.com/m8/feeds'
	};
	token = gapi.auth.getToken();
	gapi.auth.authorize(config, func(gapi.auth.getToken()));
}
 
function fetch(token) {
	$.ajax({
		url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json',
		dataType: 'jsonp',
		data: token
	}).done(function(data) {
		var contactsArray = [];
		
		if(data["feed"]["entry"]) { 
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
		if(data["feed"]["entry"]) { 
			for(var i = 0; i < data["feed"]["entry"].length; i++){
				// Getting the id
				var idStr  = data["feed"]["entry"][i]["id"]["$t"];
				var array = idStr.split("/");
				var id = array[array.length-1];
				
				// Deleting this contact
				deleteGoogleContact(token, id);
			}
		}
		// Saving the contacts from mongodb
		retrieve('contacts', saveToGoogle);
	});
}

function saveToGoogle(contacts) {
	for (var i = 0; i < contacts.length; i++) {
		var xmlString = "\
		<entry xmlns='http://www.w3.org/2005/Atom' xmlns:gd='http://schemas.google.com/g/2005'>\
		  <gd:name>\
		    <gd:fullName>"+contacts[i].name+"</gd:fullName>\
		  </gd:name>\
		  <gd:email rel='http://schemas.google.com/g/2005#home'\
		    address='"+contacts[i].email+"'/>\
		  <gd:phoneNumber rel='http://schemas.google.com/g/2005#work'\
		    primary='true'>"+contacts[i].phone+"</gd:phoneNumber>\
		</entry>";

		$.ajax({
			url: 'https://www.google.com/m8/feeds/contacts/default/full/',
			type: 'POST',
			cache: false,
			async: true,
			crossDomain: true,
        			dataType: "xml", 
			data: xmlString,
			headers: {
				'Gdata-version': '3.0',
				'Content-Type': 'application/atom+xml',
				'Authorization': 'Bearer ' + token.access_token
			},
			success: function(response) {
			},
			fail: function(response) {
			},
			error: function(response) {
				console.log(response);
			}
		});
	}
}

function deleteGoogleContact(token, id){

	$.ajax({
		url: 'https://www.google.com/m8/feeds/contacts/default/full/'+id,
		type: 'DELETE',
		cache: false,
		async: false,
		crossDomain: true,
		headers: {
			'If-Match': '*',
			'Gdata-version': '3.0',
			'Authorization': 'Bearer ' + token.access_token
		},
		success: function(response) {
		},
		fail: function(response) {
		},
		error: function(response) {
			console.log(response);
		}
	});
}

