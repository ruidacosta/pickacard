use pickacard

db.Users.createIndex({ "username" : 1}, { unique: true, dropDups: true})
