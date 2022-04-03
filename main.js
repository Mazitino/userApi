const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const axios = require('axios');
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
        //initial();
        //show_users(); //Show all current users in DB on trmianal
        
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

// Routes
//require("./routes/user.routes")(app,{});

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});














//HTTP запрос пользователей с 'https://reqres.in/api/users'
const getUsersSite = async (page) => {
  try {
    return await axios.get('https://reqres.in/api/users',{
      params:{
        page: page
      }
    })
  } catch (error) {
    console.log(error)
  }
} 

//Добавление всех пользователей сайта в массив 'userSiteData'
const getAllUsersSite = async () => {
  try {
    let usersSiteData=[];
    const usersSite  = await getUsersSite();

    for (let i = 1; i <= usersSite.data.total_pages; i++) { 
      const usersSiteAll = await getUsersSite(i)
      usersSiteData.push(...usersSiteAll.data.data);
    }
    //console.log (userSiteData)
    return transferUsers(usersSiteData);
    
  } catch (error) {
    console.log(error)
  }
} 

const countUsersSite = async () => {
  try {
    const usersSite = await getUsersSite()
    console.log("Всего (сайт): ",usersSite.data.total);
    return usersSite.data.total
  } catch (error) {
    console.log(error)
  }
}

const countUsersDb = async () => {
  try{
    const users = await User.find({})
    console.log("Всего (БД): ", users.length)
    return users.length
  } catch (error) {
    console.log(error)
  }
}

countUsersSite();
countUsersDb();
getAllUsersSite();


function transferUsers (usersSiteData){


  console.log(usersSiteData);
}














const countsUsersSite = async () => {
  const usersSite = await getUsersSite(2)

  if(usersSite.data){
    
    var page, per_page, total, total_pages, data;
    page = usersSite.data.page;
    per_page = usersSite.data.per_page;
    total = usersSite.data.total;
    total_pages = usersSite.data.total_pages;
    data = usersSite.data.data;
    console.log("Total users in site: "+total)


    User.find({}, function(err, users){
      if(err) return console.log(err);
      console.log("Total users in DB: ", users.length);
    

      if(total === users.length){
        console.log("Новых пользователей нет. Всего: ",usersSite.data.total);
      }else{
        console.log("users[1]: ",users[0]);
        console.log("usersSite[1]: ",usersSite.data.data[0]);


      }

    });
    //console.log("New--------------",usersSite.data);
    //User.insertMany(usersSite.data.data);
    
  }
}

//setInterval(countUsersSite, 5000);















// Add test user admin (dev test)
function initial(){
    const User = db.user;
    const user_test = new User({
        id: 102,
        email: "Admin3",
        first_name: "Aydar3",
        last_name: "Mazitov3",
        avatar: "https://req3res.in/i22mg/faces/2-image.jpg"
    }).save(err => {
      if(err){
        console.log("error", err);
      }
      console.log("added 'user' to roles cpllection");
    });
  }

// Show all users (dev check)
function show_users() {
    const User = db.user;
    User.find({}, function(err, users){
      if(err) return console.log(err);
      console.log("All users: ", users);
      

    });
    
  }

  