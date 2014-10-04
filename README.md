# Contacts API
REST API for the Mobile Cloud Computing course at Aalto university.


## Usage
Install npm, then execute the following commands from the `package.json` directory (at least on Ubuntu) to start the API server:

```bash
npm install
node-js contacts_api.js
```

Now, `http://localhost:3000/contacts` should give a list of all contacts.


### GET
`http://localhost:3000/contacts` gives a list of all contacts. This list can be filtered by name, phone number and/or email.

`http://localhost:3000/contacts?name=john&phone=444&email=@gmail.com$` retrieves all contacts with 'john' as part of their name, '444' in their phone number with an email ending in '@gmail.com'. All filtering is optional and case-insensitive. If no contacts match the filter, an empty list is returned.


### POST
Create a contact by posting the contact's attributes to `http://localhost:3000/contacts`. The name is a required attibute and has to be specified. Unsupported attributes are ignored.


### DELETE
Uses the same filter as GET. Deletes all contacts matching the given filters or all contacts if no filters are given. Returns `true` if at least one contact was removed.
