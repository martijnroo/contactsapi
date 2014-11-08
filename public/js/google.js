$(document).ready(function() {
    
    
    $('.js-google_contacts_get').click(function(){
		auth();
	});
    $('.js-google_contacts_set').click(function(){
		seContacts();
	});
    
}); 


var clientId = '550013882256-q04gtqu6tkdub380cuaj6r6j0c4mespj.apps.googleusercontent.com';
var apiKey = 'AIzaSyA2CvsroFnZ1p2eLCMwkHlD-9mX9syDFoQ';
var scopes = 'https://www.google.com/m8/feeds';
function auth() {
	var config = {
		'client_id': clientId,
		'scope': 'https://www.google.com/m8/feeds'
	};
	gapi.auth.authorize(config, function() {
		fetch(gapi.auth.getToken());
	});
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
			contactsArray.push(contact);
			alert(JSON.stringify(contact));
		}
		
	});
}
