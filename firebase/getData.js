const firebase = require('./firebase_connect');

module.exports = {
    getUserInfo: function (req, callback) {
        console.log(req);
        var userId = req;
        return firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
            console.log('Snapshot',snapshot.val())
            callback(null, snapshot.val())
        });


    }
}