const firebase = require('./firebase_connect');

module.exports = {
    createNewUser: function (req) {
        let uid = req.uid;
        firebase.database().ref("users/" + uid).set({
            username: req.displayName,
            email: req.email,
            monthly_expenses: '',
        });
    },
    insertCategory: function (req, callback) {
        var userId = req.body.uid.uid;
        var budget = firebase.database().ref("users/" + userId + "/2020/January/Budget");
        budget.update({
            [req.query.category]: Number(req.query.Amount)
        });
        var expense = firebase.database().ref("users/" + userId + "/2020/January/Expense");
        expense.update({
            [req.query.category]: 0
        });
        callback(null, {
            "statusCode": 200,
            "message": "Category Inserted Successfully!"
        })
    },
    deleteCategory: function (req, callback) {
        var userId = req.body.uid.uid;

        var budget = firebase.database().ref("users/" + userId + "/2020/January/Budget/" + req.query.key);
        budget.remove();
        var expense = firebase.database().ref("users/" + userId + "/2020/January/Expense/" + req.query.key);
        expense.remove();
        callback(null, {
            "statusCode": 200,
            "message": "Category deleted Successfully!"
        })
    },
    insertTransaction: function (req, callback) {
        var userId = req.body.uid.uid;
        let count=0;
        firebase.database().ref('/users/' + userId + "/2020/January/Transactions/").once('value').then((snapshot) => {
            console.log(snapshot.val());
            for(let row in snapshot.val()){
                count++;
            }
            firebase.database().ref("users/"+ userId + "/2020/January/Transactions/"+count).set({
               Category:req.query.Category,
               Date:req.query.Date,
               Details:req.query.Details,
               Spent:req.query.Spent
            });
        });
        
        callback(null, {
            "statusCode": 200,
            "message": "Transaction Inserted Successfully!"
        })
    }

}