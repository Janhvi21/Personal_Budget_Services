const firebase = require('./firebase_connect');

module.exports = {
    createNewUser: function (req) {
        let uid = req.uid;
        firebase.database().ref("users/" + uid).set({
            username: req.displayName,
            email: req.email,
            monthly_expenses: '',
        });

        //callback(null, {
           // "statusCode": 200,
            //"message": "Inserted Successfully"
        //});
    },
    getUserInfo:function(req,callback){

    }
}