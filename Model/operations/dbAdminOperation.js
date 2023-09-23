const mongoose = require("mongoose");

const Tables = require("../dbAssociation");

const checkAndCreateAdminsAndUsers = async () => {
  const allUsers = await getAllUsers();

  if (allUsers.length > 0) {
    return;
  }

  const newUsers = [
    {
      userName: "Aras",
      userEmail: "aras@gmail.com",
      adminId: new mongoose.Types.ObjectId(),
    },
    {
      userName: "Jason",
      userEmail: "jason@gmail.com",
      adminId: new mongoose.Types.ObjectId(),
    },
    {
      userName: "Alice",
      userEmail: "alice@gmail.com",
    },
    {
      userName: "Amanda",
      userEmail: "amanda@gmail.com",
    },
  ];

  await Tables.UserTable.createUsers(newUsers);
};

const getAllUsers = async () => {
  const allUsers = await Tables.UserTable.getUsers();
  return allUsers;
};

const getOneUser = async (userId) => {
  const foundUser = await Tables.UserTable.getSingleUser(userId);
  return foundUser;
};

const getAdminProducts = async (adminId) => {
  const adminProducts = await Tables.ProductTable.adminProducts(adminId);
  return adminProducts;
};

module.exports = {
  checkAndCreateAdminsAndUsers,
  getAllUsers,
  getOneUser,
  getAdminProducts,
};
