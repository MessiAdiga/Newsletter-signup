const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public")); //to load static files
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailId = req.body.emailId;

  const data = {
    members : [            //members is an array of objects, each object representing a subscriber that has parameters
      {
        email_address : emailId,
        status: "subscribed",
        merge_fields : {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };

  //convert javascript to flatpacked JSON
  const jsonData = JSON.stringify(data);
  const url = "https://us1.api.mailchimp.com/3.0/lists/94b12d13f3"; //mailchimp endpoint url,last paramater is the unique list id

  //javascript object, POST - to send the JSON file to mailchimp server, requires authentication - username:API key
  const options = {
  method : "POST",
  auth : ""
}

  //response - the response from mailchimp endpoint, request - save our request in a constant and send the constant to mailchimp server
  const request = https.request(url,options,function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }


    response.on("data",function(data){
      console.log(JSON.parse(data)); // to parse the JSON file sent by mailchimp
    });
  });

  request.write(jsonData); //pass the JSON file to mailchimp server
  request.end();
});

//failure route
app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000");
});



