var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

function authentication(req,res,next)
{
	console.info(req.cookies);
	var db = req.db;
	var collection = db.get('Users');
	collection.findOne({ username : req.cookies.username, token : req.cookies.token }, function (err,user){
		if (err)
		{
			next(err);
		}
		if (user)
		{
			if (user.lastRequestDateTime < new Date(Date.now() + 10 * 60 * 1000))
			{
				collection.update({ '_id' : user._id}, { $set : { 'lastRequestDateTime' : Date.now() }}, function (err, updatedUser){
					if (err)
					{
						next(err);
					}
				});
				next();
			}
			else
			{
				res.redirect('/login');		
			}
		}
		else
		{
			res.redirect('/login');
		}
	});
}

/* GET home page. */
router.get('/', authentication, function(req, res, next) {
  res.render('main', { title: 'Express' });
});

module.exports = router;
