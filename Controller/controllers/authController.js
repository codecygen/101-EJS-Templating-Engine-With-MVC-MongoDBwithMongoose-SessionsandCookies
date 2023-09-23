const dbAdminOperation = require("../../Model/operations/dbAdminOperation");

exports.getLoginPage = async (req, res, next) => {
  const allUsers = await dbAdminOperation.getAllUsers();

  res.render("login", {
    pagePath: "/login",
    renderTitle: "Login",
    selectedUser: res.locals.selectedUser,
  });
};

exports.postLoginPage = async (req, res, next) => {
  const {
    "entered-username": enteredUsername,
    "entered-password": enteredPassword,
  } = req.body;

  console.log(enteredUsername, enteredPassword);
};
