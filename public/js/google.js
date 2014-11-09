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

function authSaveGoogle(contacts) {

}

function saveToGoogle(contacts) {
	for (var i = 0; i < contacts.length; i++) {
		var xmlString = "<atom:entry xmlns:atom='http://www.w3.org/2005/Atom'\
		    xmlns:gd='http://schemas.google.com/g/2005'>\
		  <atom:category scheme='http://schemas.google.com/g/2005#kind'\
		    term='http://schemas.google.com/contact/2008#contact'/>\
		  <gd:name>\
		     <gd:fullName>"+contacts[i].name+"</gd:fullName>\
		  </gd:name>\
		  <atom:content type='text'>Notes</atom:content>\
		  <gd:email rel='http://schemas.google.com/g/2005#work'\
		    primary='true'\
		    address='liz@gmail.com' displayName='E. Bennet'/>\
		  <gd:email rel='http://schemas.google.com/g/2005#home'\
		    address='liz@example.org'/>\
		  <gd:phoneNumber rel='http://schemas.google.com/g/2005#work'\
		    primary='true'>\
		    (206)555-1212\
		  </gd:phoneNumber>\
		  <gd:phoneNumber rel='http://schemas.google.com/g/2005#home'>\
		    (206)555-1213\
		  </gd:phoneNumber>\
		  <gd:im address='liz@gmail.com'\
		    protocol='http://schemas.google.com/g/2005#GOOGLE_TALK'\
		    primary='true'\
		    rel='http://schemas.google.com/g/2005#home'/>\
		  <gd:structuredPostalAddress\
		      rel='http://schemas.google.com/g/2005#work'\
		      primary='true'>\
		    <gd:city>Mountain View</gd:city>\
		    <gd:street>1600 Amphitheatre Pkwy</gd:street>\
		    <gd:region>CA</gd:region>\
		    <gd:postcode>94043</gd:postcode>\
		    <gd:country>United States</gd:country>\
		    <gd:formattedAddress>\
		      1600 Amphitheatre Pkwy Mountain View\
		    </gd:formattedAddress>\
		  </gd:structuredPostalAddress>\
		</atom:entry>";



		// <entry xmlns='http://www.w3.org/2005/Atom' xmlns:gd='http://schemas.google.com/g/2005'>\
		//   <gd:name>\
		//     <gd:fullName>First Last</gd:fullName>\
		//   </gd:name>\
		//   <gd:structuredPostalAddress rel='http://schemas.google.com/g/2005#work' primary='true'>\
		//     <gd:formattedAddress>1600 Amphitheatre Pkwy Mountain View, CA 94043 United States</gd:formattedAddress>\
		//   </gd:structuredPostalAddress>\
		// </entry>";

		// <?xml version='1.0' encoding='utf-8'?>\
		// <entry xmlns='http://www.w3.org/2005/Atom'>\
		//   <author>\
		//     <name>Elizabeth Bennet</name>\
		//     <email>liz@gmail.com</email>\
		//   </author>\
		//   <title type='text'>Entry 1</title>\
		//   <content type='text'>This is my entry</content>\
		// </entry>";

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
				console.log(response);
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

	// gapi.auth.setToken(token);
	// var req = gapi.client.request({method:'DELETE',path:'/m8/feeds/contacts/default/full/'+id+'?access_token='+token.access_token});
	// gapi.client.HttpRequest.execute(req);
	
	$.ajax({
		//url: 'https://www.google.com/m8/feeds/contacts/default/full/'+id+'?'+$.param(token),
		url: 'https://www.google.com/m8/feeds/contacts/default/full/'+id,
		type: 'DELETE',
		cache: false,
		async: true,
		crossDomain: true,
		// beforeSend: function (xhr) {
		//     xhr.setRequestHeader('Authorization', 'Bearer 1/'+token.access_token);
		// },
		// dataType: 'jsonp',
		headers: {
			'If-Match': '*',
			'Gdata-version': '3.0',
			// 'X-HTTP-Method-Override': 'DELETE',
			'Authorization': 'Bearer ' + token.access_token
		},
		success: function(response) {
			console.log(response);
		},
		fail: function(response) {
		},
		error: function(response) {
			console.log(response);
		}
	});
}

