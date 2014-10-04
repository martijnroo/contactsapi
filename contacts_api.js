var express = require('express');
var app = express();

app.use(express.bodyParser());

// For testing purposes:
contacts = [
    {
        name: "Martijn",
        phone: "1233456",
        email: "foo@bar.com"
    },
    {
        name: "Martinus",
        phone: "44444",
        email: "foo@bar.com"
    },
    {
        name: "John",
        phone: "333",
        email: "foo@bar.com"
    }
];

// GET
// Get contacts, possibly filtered on name, phone or email
app.get('/contacts', function(req, res) {
    partialName = new RegExp(req.param('name'), "gi");
    partialPhone = new RegExp(req.param('phone'), "gi");
    partialEmail = new RegExp(req.param('email'), "gi");
    result = [];
    for(i=0; i<contacts.length; i++) {
        if(contacts[i].name.match(partialName) != null && contacts[i].phone.match(partialPhone) != null 
            && contacts[i].email.match(partialEmail) != null) {
            result.push(contacts[i]);
        }
    }
    res.json(result);
});


// POST
app.post('/contacts', function(req, res) {
    if(!req.body.hasOwnProperty('name')) {
        res.statusCode = 400;
        return res.send('Error 400: Name attribute missing.');
    } 
 
    var newContact = {
        name : req.body.name,
        phone : req.body.phone,
        email: req.body.email
    };
   
    contacts.push(newContact);
        res.json(true);
});


// DELETE
app.delete('/contacts', function(req, res) {
    partialName = new RegExp(req.param('name'), "gi");
    partialPhone = new RegExp(req.param('phone'), "gi");
    partialEmail = new RegExp(req.param('email'), "gi");
    for(i=contacts.length-1; i>=0; i--) {
        if(contacts[i].name.match(partialName) != null && contacts[i].phone.match(partialPhone) != null 
            && contacts[i].email.match(partialEmail) != null) {
            contacts.splice(i, 1);
        }
    }
    res.json(true);
});



app.listen(process.env.PORT || 3000);

