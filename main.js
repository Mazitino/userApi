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

        //show_users();
        //delete_users(10);
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
  } catch (err) {
    console.log(err)
  }
};

//Добавление всех пользователей сайта в массив 'userSiteData'
const getAllUsersSite = async (totalDb) => {
  try {
    let usersSiteData=[];
    const usersSite  = await getUsersSite();

    for (let i = 1; i <= usersSite.data.total_pages; i++) { 
      const usersSiteAll = await getUsersSite(i)
      usersSiteData.push(...usersSiteAll.data.data);
    }
    //console.log (userSiteData)
    return transferUsers(usersSiteData, usersSite.data.total, totalDb);
    
  } catch (err) {
    console.log(err)
  }
};

//Сравнение количества пользователей сайта и БД
const compareNumberOfUsers = async () => {
  try {
    //Сайт
    const usersSite = await getUsersSite()
    //База данных
    const users = await User.find({})
    
    console.log(Date());
    if(usersSite.data.total === users.length){
      console.log("Количество пользоватлей на 'сайте' и 'БД' равно = ", users.length);
      return;
    }else{
      console.log("Всего (сайт): ",usersSite.data.total);
      console.log("Всего (БД): ", users.length);
      return getAllUsersSite(users.length);
    }
  } catch (err) {
    console.log(err)
  }
};

//Перенос новых пользователй в БД
function transferUsers (usersSiteData, totalSite, totalDb){
  try{

    for (let id = totalDb+1; id <= totalSite; id++){

      User.findOne({
        id: id   
      }).exec((err, user) => {

          if (err) {
            console.log(err); 
            return;
          }

          //Проверка на существущиего пользователя в БД
          if (user) { 
            console.log("Ошибка! Пользователь с id: " + id + " уже существует!");
            return;
          }
    
          //Создание нового пользователя
          new User({
            id:         usersSiteData[id-1].id,
            email:      usersSiteData[id-1].email,
            first_name: usersSiteData[id-1].first_name,
            last_name:  usersSiteData[id-1].last_name,
            avatar:     usersSiteData[id-1].avatar
          }).save(err => {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Пользователь с id: " + id + " добавлен!");
          });    
      });
    }
  }catch (err) {
    console.log(err)
  }
};

setInterval(compareNumberOfUsers, 60000);




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