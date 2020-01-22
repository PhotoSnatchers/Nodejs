const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
 
// parse application/json
app.use(bodyParser.json());
 
//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'application'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// login
app.post('/api/login',(req, res) => {
  let data = {email: req.body.email, password: req.body.password};
  let q = conn.query("SELECT * FROM registration WHERE email = ?",[data.email], function(err, results) {
    if(err) throw err;
    if (results.length > 0) {
      if(data.password == results[0].password){
        res.send(JSON.stringify({"status": 200, "error": null, "email": data.email,  "response": "login success"}));
      } else {
        res.send(JSON.stringify({"status": 200, "error": null, "response": "Email / Password Doesn't Exists"}));
      } 
    }  else {
      res.send(JSON.stringify({"status": 200, "error": null, "response": "Email / Password Doesn't Exists"}));
    }   
  });
});
// registration
app.post('/api/registration',(req, res) => {
    let data = {user_name: req.body.name, email: req.body.email, password: req.body.password};
    let q = conn.query("SELECT * FROM registration WHERE email = ?",[data.email], function(err, rows) {
      if(err) throw err;
      if (rows.length) {
        res.send(JSON.stringify({"status": 200, "error": null, "response": "Email Exists"}));
    } else {
      let sql = "INSERT INTO registration SET ?";
      let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": "Successfully Registered"}));
    });}
    });
  });
// change password
  app.put('/api/forgetpwd',(req, res) => {
  let data = {email: req.body.email,password: req.body.password};
      let query = conn.query('UPDATE `registration` SET `password` = ? WHERE `email` = ?',[data.password,data.email], function(err, result) {
        if (err) throw err;
        if(result.affectedRows > 0) {
        res.send(JSON.stringify({"status": 200, "error": null, "response": "Password changed"}));
        } else {
        res.send(JSON.stringify({"status": 200, "error": null, "response": "Email Not Found"})); 
        }
      }); 
  });

//show all users
app.get('/api',(req, res) => {
  let sql = "SELECT * FROM registration";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.listen(3000,() =>{
    console.log('Server started on port 3000...');
  });