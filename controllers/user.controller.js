const db = require("../models");
const User = db.user;
const { user } = require("../models");

// Получить всех пользователей с пагинацией -----------
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

// Получить пользователя ------------------------------
exports.getUser = (req, res) => {
  try {
    
    //Если запрос без body
    if(Object.keys(req.body).length === 0){
      User.findOne({
        id: req.userId 
      })
        .exec((err, user) => {
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
            data: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              avatar: user.avatar
            }
          });
        });
        return;
    }
    
    //Если запрос c body 
    if(Object.keys(req.body).length != 0){
      const searchFirstName = req.body.first_name;

      if(!searchLogin) {  
        res.status(402).send({
          status: 402,
          message: "Ошибка! Требуемый параметр пустой!"
        });
        console.log("Ошибка! Требуемый параметр пустой!");
        return;
      }

      //Получение любого пользователя (админ)
      if (req.userRole === "admin") {  
        User.findOne({
          first_name: searchFirstName
        })
          .exec((err, user) => {

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
      }
      //Получение пользователя (юзер)
      if (req.userRole === "user") {  

        User.findOne({
          _id: req.userId 
        })
          .exec((err, user) => {

            if (err) {
              res.status(500).send({ 
                status: 500,
                message: "Внутренняя ошибка сервера"
              });
              return;
            }

            if (user.login != searchLogin){
              res.status(403).send({ 
                status: 403,
                message: "Отказано в доступе"
              });
              return;
            }
            //Отправка ответа
            res.status(200).send({
              status: 200,
              data: {
                id: user._id,
                login: user.login,
                role: user.role,
                password: user.password,
                department: user.department,
                name: user.name,
                surname: user.surname,
                lastname: user.lastname,
                rank: user.rank,
                image: user.image,
                notesAllow: user.notesAllow,
                last_login: user.last_login,
                login_status: user.login_status
              }
            });
          });
      }
    }
 
  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Вывод пользователя"
    });

  }
}
