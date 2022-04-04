const axios = require('axios');
const db = require("../models");
const User = db.user;

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

//Добавление всех пользователей сайта в массив 'userSiteData'
const getAllUsersSite = async (totalDb) => {
    try {
        let usersSiteData=[];
        const usersSite  = await getUsersSite();

        for (let i = 1; i <= usersSite.data.total_pages; i++) { 
            const usersSiteAll = await getUsersSite(i)
            usersSiteData.push(...usersSiteAll.data.data);
        }
        return transferUsers(usersSiteData, usersSite.data.total, totalDb);    
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

module.exports = compareNumberOfUsers;