const db = require("../models");
const User = db.user;
const { user } = require("../models");

// Получить всех пользователей с пагинацией 
exports.getUsers = (req, res) => {
  try {
    
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    const startIndex = (page-1)*limit;
 
    if(!page){
      page = 1;     //Если пусто то получает страницу 1
    }

    if(!limit){
      limit = 6;   //Если пусто то лимит выводимых пользователей 6 на 1 страницу
    }
    
    User.find()
    .skip(startIndex)
    .limit(limit)
    .exec((err, user)=> { 

      if (err) {
        res.status(500).send({ 
          status: 500,
          message: "Внутренняя ошибка сервера"
        });
        return;
      }
      //Отправка ответа
      res.status(200).send({
        status: 200,
        user
      });
    });


       
  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Вывод пользователей c пагинацией"
    });

  }
}

// Получить пользователя
exports.getUser = (req, res) => {
  try {
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    console.log(first_name);
    console.log(last_name);


    if(!first_name && !last_name){
        res.status(402).send({
          status: 402,
          message: "Ошибка! Требуемый параметр - пустой!"
        });   
        return;     
    }
    
    let filtr = {};
    if(first_name && !last_name){
      filtr = { first_name: first_name };
    }
    if(!first_name && last_name){
      filtr = { last_name: last_name };
    }
    if(first_name && last_name){
      filtr = { first_name: first_name, last_name: last_name };
    }

    User.findOne(
      filtr
    )
      .exec((err, user) => {
        console.log(user);
        if (err) { 
          res.status(500).send({ 
            status: 500,
            message: "Внутренняя ошибка сервера"
          });
          return;
        }

        if (!user) {
          return res.status(404).send({ 
            status: 404,
            message: "Пользователь не найден"
          });
        }

        //Отправка ответа
        res.status(200).send({
          status: 200,
          data: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar
          }
        });
      });
  }catch(err){
    console.log(err)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Вывод пользователя"
    });

  }
}
