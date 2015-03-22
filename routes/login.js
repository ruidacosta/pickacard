var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET home page. */
router.get('/',function(req, res, next) {
	//var error = req.flash('error');
	var options = { title: 'PickUpACard - Login' };
	if (req.query['error'] == 1)
	{
		options.error = ' No user/password found.';
		//console.info(options); 
	}
	res.render('login', options);
});

router.post('/validator', function(req,res,next){
	var db = req.db;
	var collection = db.get('Users');
	var passHash = crypto.createHash('sha256').update(req.body.pass).digest('base64');
	collection.findOne({ username : req.body.user, password: passHash }, function (err,user){
		if (err)
		{
			next(err);	
		} 
		else if (user)
		{
			console.info(user);
			var token = (Math.random().toString(36)+'00000000000000000').slice(2,16+2);
			collection.update({ '_id' : user._id}, { $set : { 'lastRequestDateTime' : Date.now(), 'token' : token }}, function (err, updatedUser){
				if (err)
				{
					next(err);
				}
			});
			res.cookie('username', req.body.user, { expires: new Date(Date.now() + 10 * 60 * 1000) });
			res.cookie('token', token , { expires: new Date(Date.now() + 10 * 60 * 1000) });
			res.redirect('/');	
		} 
		else
		{
			//res.flash('error', 'User/password not found.');
			res.redirect('/login?error=1');
		}
	});
});

module.exports = router;
