const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./config/db.config");
const app = express();


// CORS
var corsOptions = {origin: "http://localhost:8081"};
app.use(cors(corsOptions));

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB
const db = require("./models");
const User = require("./models/user.model");
db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");

    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// Simple route
app.get("/", (req, res) => {
  //res.sendFile(__dirname + "/public/index.html");
  res.json({ message: "Welcome to application." });
});

// Routes
require("./routes/user.routes")(app,{});

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//Services
const parseUsers = require("./services/parseUsers.js");
setInterval(parseUsers, 60000);

//show_users();
//delete_users(1);

// Show all users (dev check)
function show_users() {
    const User = db.user;
    User.find({}, function(err, users){
      if(err) return console.log(err);
      console.log("All users: ", users);
    }); 
  };
// Delete user (dev)
function delete_users(id) {
    const User = db.user;
    User.deleteOne({
      id: id
    }, function(err, users){
      if(err) return console.log(err);
      console.log("All users: ", users);
    }); 
  };

