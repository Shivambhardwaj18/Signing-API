//jshint esversion:6
//jshint esversion:8

const dotenv = require("dotenv");

const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
// const client = require("@mailchimp/mailchimp_marketing");
const https = require("https");

const app = express();

dotenv.config();

// client.setConfig({
//   apiKey: "!@#$",
//   server: "!@#$",
// });

app.use(express.static("public"));
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const Firstname = req.body.fname;
  const Lastname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: Firstname,
          LNAME: Lastname,
        },
      },
    ],
  };

  const jsondata = JSON.stringify(data);
  const url = process.env.URL;
  const options = {
    method: "POST",
    auth: process.env.API_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsondata);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server running on port 3000");
});
