const express = require("express");
const app = express();
var mongo = require("mongodb");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/registrationDB";

var myobj;

app.get("/", (req, res) => {
  console.log("hello");
  res.render("registration.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", (req, res) => {
  console.log("check");
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("registrationDB");
      myobj = {
        name: req.body.fname,
        email: req.body.email,
        phone: req.body.phone,
        file: req.body.file,
      };
      dbo
        .collection("registration_credentials")
        .insertOne(myobj, function (err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
    });
    res.redirect("/login");
  } catch {
    res.redirect("/");
  }
});
app.post("/login", (req, res) => {
  res.render("login.ejs");
});

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("user_data").findOne({}, function (err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
app.post("/show", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("registrationDB");
    var str2 = "function onClickHandler(eml,MongoClient){}";
    var str =
      "<script>" +
      str2 +
      "</script><style>td{background-color:yellow;}</style><html><body><table><tr><th>NAME</th><th>EMAIL</th><th>IMAGE</th><th>MOBILE NUMBER</th><th>ACTION</th></tr>";
    dbo
      .collection("registration_credentials")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        var obj = "$(result)";
        for (var i = 0; i < result.length; i++) {
          str += "<tr>";
          str += "<td>";
          str += result[i].name;
          str += "</td>";
          str += "<td>";
          str += result[i].email;
          str += "</td>";
          str += "<td>";
          str += result[i].file;
          str += "</td>";
          str += "<td>";
          str += result[i].phone;
          str += "</td>";
          str += "<td>";
          str += `<button onclick='onClickHandler("${result[i].email}")'>EDIT/DELETE</button>`;
          str += "</td>";
          str += "</tr>";
        }

        str += "</table></body></html>";
        var fs = require("fs");
        fs.writeFile("./show.ejs", str, function (err) {
          if (err) throw err;
          console.log("Saved!");
        });
        if (result.length) db.close();
      });
  });

  res.render("../show.ejs");
});
// app.post("/show", (req, res) => {
//res.render("../show.ejs");
// });
app.listen(4000);
