// pagePath has to be defined otherwise,
// it throws error!
exports.get404Page = (req, res, next) => {
  res.status(404).render("404", {
    renderTitle: "No Page Found!",
    pagePath: "NA",
    selectedUser: res.locals.selectedUser,
  });
};
