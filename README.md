# Contacts API
REST API for the Mobile Cloud Computing course at Aalto university.


## Additional features
On top of the course mandated features, this API offers two options that the course manual does not require. These are the support for the PUT command and the ability to filter by or search for other attributes than the contact's name (such as phone number and email). Both features are further explained below.


## Installation & Usage
First, setup MongoDB with a database called mydb and install npm. Then, execute the following commands from the `package.json` directory (at least on Ubuntu) to start the API server:

```bash
npm install
node-js contacts_api.js
```

Now, `/contacts` (on the server that runs the API) should give a list of all contacts.


### GET
`/contacts` gives a list of all contacts. This list can be filtered by name, phone number and/or email. For example, `/contacts?name=john&phone=444&email=@bar.com$` retrieves all contacts with 'john' as part of their name, '444' in their phone number with an email ending in '\@bar.com'. All filtering is optional and case-insensitive. If no contacts match the filter, an empty list is returned.

A single contact can also be retrieved by ID using `/contacts/[contact_id]`.


### PUT
Update a contact by putting the updated attributes for a contact to `/contacts/[contact_id]`. Other attributes remain the same.


### POST
Create a contact by posting the contact's attributes to `/contacts`. The name is a required attibute and has to be specified. Unsupported attributes are ignored.


### DELETE
Contacts can be deleted by in batch at `/contacts` using the same filtering as with GET. All matching contacts are deleted and the number of deleted contacts is returned.

A contact can also be deleted by its ID using `/contacts/[contact_id]`. Here too, the number of deleted contacts is returned.