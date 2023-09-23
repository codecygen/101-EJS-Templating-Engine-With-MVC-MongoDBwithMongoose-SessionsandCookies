const dbAdminOperation = require("../../Model/operations/dbAdminOperation");

exports.loginHandler = async (req, res, next) => {
  const allUsers = await dbAdminOperation.getAllUsers();

  res.render("login", {
    pagePath: "/login",
    renderTitle: "Login",
    selectedUser: res.locals.selectedUser,
  });
};
