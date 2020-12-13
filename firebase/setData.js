const firebase = require('./firebase_connect');

module.exports = {
    createNewUser: function (req) {
        let uid = req.uid;
        firebase.database().ref("users/" + uid).set({
            username: req.displayName,
            email: req.email,
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
    deleteTransactions: function (req, callback) {
        var userId = req.body.uid.uid;
        console.log(req.query);
        var expense = firebase.database().ref("users/" + userId + "/2020/January/Transactions/" + req.query.id);
        expense.remove();
        firebase.database().ref('/users/' + userId + "/2020/January/TotalExpense").once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();

            exp = exp - Number(req.query.spent);
            console.log(exp);
            firebase.database().ref('/users/' + userId + "/2020/January/TotalExpense").set(exp);

        });
        firebase.database().ref('/users/' + userId + "/2020/January/Expense/" + req.query.category).once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp - Number(req.query.spent);
            console.log(exp);
            firebase.database().ref('/users/' + userId + "/2020/January/Expense/" + req.query.category).set(exp);

        });
        callback(null, {
            "statusCode": 200,
            "message": "Category deleted Successfully!"
        })
    },
    insertTransaction: function (req, callback) {
        var userId = req.body.uid.uid;
        let count = 0;
        firebase.database().ref('/users/' + userId + "/2020/January/Transactions/").once('value').then((snapshot) => {
            console.log(snapshot.val());
            for (let row in snapshot.val()) {
                count++;
            }
            firebase.database().ref("users/" + userId + "/2020/January/Transactions/" + count).set({
                Category: req.query.Category,
                Date: req.query.Date,
                Details: req.query.Details,
                Spent: Number(req.query.Spent)
            });
        });
        firebase.database().ref('/users/' + userId + "/2020/January/TotalExpense").once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp + Number(req.query.Spent);
            firebase.database().ref('/users/' + userId + "/2020/January/TotalExpense").set(exp);

        });
        firebase.database().ref('/users/' + userId + "/2020/January/Expense/" + req.query.Category).once('value').then((snapshot) => {
            let exp = 0;
            exp = snapshot.val();
            exp = exp + Number(req.query.Spent);
            firebase.database().ref('/users/' + userId + "/2020/January/Expense/" + req.query.Category).set(exp);

        });
        callback(null, {
            "statusCode": 200,
            "message": "Transaction Inserted Successfully!"
        })
    }

}