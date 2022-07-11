const router = require('express').Router();



router.post('/login', (req, res) => {

    uname = req.body.username.replace(/ /g, "")
    pword = req.body.password;

    connection.query((``), (err, results, fields) => {
        if (err) {
            res.json({
                "status": "failed",
                "message": "An error occured when trying to match values with the database"
            })
            return;
        }
        res.json({
            "status": "success",
            "message": "User exists in the database"
        })
    })

})

router.post('/register', (req, res) => {
    console.log(req.body);

    uname = req.body.username.replace(/ /g, "")
    pword = req.body.password;


    id = uuidv1();
    // (`SELECT EXISTS(SELECT * FROM users WHERE username="hello" AND password="passwordboi");`)
    console.log(`SELECT EXISTS(SELECT * FROM ${tablename} WHERE username="${uname}");`);
    connection.query((`SELECT EXISTS(SELECT * FROM ${tablename} WHERE username="${uname}");`), (err, result, fields) => {
        console.log(result.query)
        if (result == 0) {
            connection.query((`INSERT INTO ${tablename} (username,password,id) VALUES ("${uname}","${pword}","${id}");`), (err, results, fields) => {
                // console.log(results); // results contains rows returned by server
                // console.log(fields); // fields contains extra meta data about results, if available
                if (err) {
                    res.json({
                        "status": "failed",
                        "message": "An error occured when trying to store values into the database"
                    })
                    return;
                }
                res.json({
                    "status": "success",
                    "message": "User successfully created into the database"
                })

            })
        }
        else {
            res.json({
                "status": "failed",
                "message": "User already exists in database"
            })
        }
    })
    console.log(` got the req with ${uname} and ${pword} and id as ${id}`)
})

router.post('/users', (req, res) => {
    connection.query((`SELECT * FROM ${tablename}`), (err, results, fields) => {
        res.json({
            "status": "success",
            "message": "Database sent",
            "value": results
        })
    })
})
router.post(('/user'), (req, res) => {
    userid = req.body.userid;
    connection.query((`SELECT username FROM ${tablename} WHERE id="${userid}";`), (err, results, fields) => {
        if (err) {
            res.json({
                "status": "failed",
                "message": "An error occured when trying to retrieve the value from the database",
                "value": results
            })
            return;
        }
        res.json({
            "status": "success",
            "message": "Successfully retrieved the user's data",
            "value": results
        })
    })
})

router.post('/deleteuser', (req, res) => {
    id2delete = req.body.id;
    console.log(`DELETE FROM ${tablename} WHERE id="${id2delete}";`);
    connection.query(`DELETE FROM ${tablename} WHERE id="${id2delete}";`, (err, results, fields) => {
        if (err) {
            res.json({
                "status": "failed",
                "message": "An error occured when trying to delete the user from the database"
            })
            return
        }
        res.json({
            "status": "success",
            "message": "User successfully deleted from database"
        })
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    })
})


module.export = router;