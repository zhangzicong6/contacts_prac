var express = require('express');
var { check, validationResult } = require('express-validator/check');
var router = express.Router();


var contact_objs = {};
var contact_ids = [];

/* get  contacts */
router.get('/', function(req, res, next) {
	var contacts=[];
	contact_ids.forEach(function(id){
		contacts.push(contact_objs[id]);
	});
  res.send(contacts);
});

/* get contact*/
router.put('/:id', function(req, res, next) {
	var id = req.param('id');
	var contact = contact_objs[id];
    if(!contact){
    	res.status(404).send('not found ' +id+ '`s contact');
    }else{
    	res.send(contact);
    }
});

/* create  contact */
router.post('/', [
		check('first_name').exists(),
		check('last_name').exists(),
		check('email').isEmail().withMessage('must be an email').trim().normalizeEmail(),
	],function(req, res, next) {
		const errors = validationResult(req);
	    if (!errors.isEmpty()) {
	        return res.status(422).json({ errors: errors.mapped() });
	    }
		var id= contact_ids.length ? contact_ids[contact_ids.length-1]+1 : 1;
		var contact = {
			'id':id,
			'first_name':req.param('first_name'),
			'last_name':req.param('last_name'),
			'email':req.param('email'),
			'description':req.param('description'),
		};
		contact_ids.push(id);
		contact_objs[id] = contact;
		res.send(contact);
});

/* update  contact */
router.put('/:id', function(req, res, next) {
	var id = req.param('id');
	var contact = contact_objs[id];
    if(!contact){
    	res.status(404).send('not found ' +id+ '`s contact');
    }
    if(req.param('email')){
    	if(check('email').isEmail()){
    		contact['email'] = req.param('email');
    	}else{
    		res.status(403).send('email not validate');
    	}
    }
    if(req.param('first_name')){
    	contact['first_name'] = req.param('first_name');
    }
    if(req.param('last_name')){
    	contact['last_name'] = req.param('last_name');
    }
    if(req.param('description')){
    	contact['description'] = req.param('description');
    }
    res.send(contact);
});

/* delete  contact */
router.delete('/:id', function(req, res, next) {
	var id = parseInt(req.param('id'));
    var index = contact_ids.indexOf(id);
    console.log(contact_ids);
    console.log(index);
	if (index > -1) {
		contact_ids.splice(index, 1);
		delete contact_objs[id];
		res.send(id+'`s contact deleted');
	}else{
		res.status(404).send('not found ' +id+ '`s contact');
	}

});

module.exports = router;

/*
{"id": 1, "first_name": "John", "last_name": "Smith", "email": "test@test.com", “description”: "description"}
*/
