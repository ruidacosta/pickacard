var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* GET home page. */
router.get('/',function (req, res, next) {
  res.render('admin', { title: 'PickUpACard - Admin' });
});

router.post('/save',function (req,res,next){
	var db = req.db;
	var users = db.get('Users');
	var passwordHash = crypto.createHash('sha256').update(req.body.pass).digest('base64');
	users.insert({ username : req.body.user, password: passwordHash }, function (err,user){
		if (err)
		{
			next(err)
		}
		else if (user)
		{
			console.info('User criado %s', user);
		}
		else
		{
			console.error('ERRO BASEDADOS.');
		}
	});
});

module.exports = router;
