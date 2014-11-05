var clientId = '847876511602-7fg7p1h43h8vmnmg3a8jisfv6hn4fn11.apps.googleusercontent.com';
var apiKey = 'AIzaSyA2CvsroFnZ1p2eLCMwkHlD-9mX9syDFoQ';
var scopes = 'https://www.google.com/m8/feeds';

$(document).on("click",".js-google_contacts", function(){
	auth();
});


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
		console.log(JSON.stringify(data));
	});
}
