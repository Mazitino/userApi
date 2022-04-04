const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  let objectURL = "/api/user";

  app.get(objectURL,controller.getUser);        // Получить пользователя
  app.get("/api/users",controller.getUsers);    // Получить всех пользователей с пагинацией (админ)

};