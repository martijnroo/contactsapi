var express = require('express');
var app = express();

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/mydb');

app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use(express.bodyParser());

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
});


//GET
//Gets contacts, possibly filtered by name, phone and/or email
app.get('/contacts', function(req, res) {

	// Getting the database connection
	var db = req.db;
	var collection = db.get('contacts');

	// Getting the fields as regex
	var partialName = new RegExp(req.param('name'), "gi");
	var partialPhone = new RegExp(req.param('phone'), "gi");
	var partialEmail = new RegExp(req.param('email'), "gi");

	// Querying the database
	collection.find({
		name: partialName,
		phone: partialPhone,
		email: partialEmail
	}, function(err, doc) {
		if(err) {
			res.statusCode = 500;
			res.send("There was a problem retrieving information from the database.");
		} else {
			res.json(doc);
		}
	});
});

//Retrieves one contact by its ID
app.get('/contacts/:id', function(req, res) {

	// Getting the database connection
	var db = req.db;
	var collection = db.get('contacts');
	
	// Getting the parameter 'id'
	var id = req.params.id
	
	// Querying the database
	collection.findById(id, function(err, doc) {
		if(err) {
			res.statusCode = 500;
			res.send("There was a problem retrieving information from the database.");
		} else if(doc == null) {
			res.statusCode = 404;
			res.send("No contact with given ID found.");
		} else {
			res.json(doc);
		}
	});
});


//PUT
//Updates one contact
app.put('/contacts/:id', function(req, res) {

	// Getting the database connection
	var db = req.db;
	var collection = db.get('contacts');

	// Getting the parameter 'id'
	var id = req.params.id
	
	// getting the new fields of the contact
	var newContactInfo = {};
	if(req.body.name) {
		newContactInfo.name = req.body.name;
	}
	if(req.body.phone) {
		newContactInfo.phone = req.body.phone;
	}
	if(req.body.email) {
		newContactInfo.email = req.body.email;
	}

	// Querying the database to update the contact
	collection.update({_id: id}, {$set: newContactInfo}, function(err, doc) {
		if(err) {
			res.statusCode = 500;
			res.send("There was a problem updating information in the database.");
		} else if(doc == 0) {
			res.statusCode = 404;
			res.send("Contact with given ID not found.");
		} else {
			res.json({nr_contacts_updated: doc});
		}
	});
});



//POST
//Adds one contact, name is mandatory
app.post('/contacts', function(req, res) {
	
	// Checking that there is the mandatory parameter
	if(!req.body.hasOwnProperty('name')) {
		res.statusCode = 400;
		return res.send('Error 400: Name attribute missing.');
	} 

	// Getting the database connection
	var db = req.db;
	var collection = db.get('contacts');

	// Creating a new contact 
	var newContact = {
			name : (req.body.name ? req.body.name : ''),
			phone : (req.body.phone ? req.body.phone : ''),
			email: (req.body.email ? req.body.email : '')
	};
	
	// Inserting the new contact in the database
	collection.insert(newContact, function (err, doc) {
		if (err) {
			// If insert failed, return error
			res.statusCode = 500;
			res.send("There was a problem adding the information to the database."+err+doc);
		}
		else {
			res.statusCode = 201;
			res.json({id: doc._id});
		}
	});
});


//DELETE
//Deletes contacts, possibly filtered by name, phone and/or email
app.delete('/contacts', function(req, res) {

	// Getting the database connection
	var db = req.db;
	var collection = db.get('contacts');

	// Getting the parameters as regex
	var partialName = new RegExp(req.param('name'), "gi");
	var partialPhone = new RegExp(req.param('phone'), "gi");
	var partialEmail = new RegExp(req.param('email'), "gi");

	// Querying the database to remove the contact
	collection.remove({
		name: partialName,
		phone: partialPhone,
		email: partialEmail
	}, function(err, doc) {
		if(err) {
			res.statusCode = 500;
			res.send("There was a problem removing information from the database.");
		} else {
			res.json({nr_contacts_deleted: doc});
		}
	});
});

//Deletes one contact by its ID
app.delete('/contacts/:id', function(req, res) {
	
	// Getting the database connection
	var db = req.db;
	var collection = db.get('contacts');

	// Getting the id parameter
	var id = req.params.id

	// Querying the database to remove the contact
	collection.remove({_id: id}, function(err, doc) {
		if(err) {
			res.statusCode = 500;
			res.send("There was a problem retrieving information from the database.");
		} else if(doc == 0) {
			res.statusCode = 404;
			res.send("Contact with given ID not found.");
		} else {
			res.json({nr_contacts_deleted: doc});
		}
	});
});

// Serve static web pages
app.use(express.static(__dirname + '/public'));


app.listen(8081);

