const dbProductOperation = require("../../Model/operations/dbProductOperation");
const dbAdminOperation = require("../../Model/operations/dbAdminOperation");
const dbCartOperation = require("../../Model/operations/dbCartOperation");
const dbOrderOperation = require("../../Model/operations/dbOrderOperation");

// while rendering, we send "products" data
// as "productList"
// This is just "/products" route. In the index.js
// file, because it is indicated as
// app.use("/display", userViewRoute);
// combination of these 2 routes become
// "/display/products"

exports.getProducts = async (req, res, next) => {
  const allProducts = await dbProductOperation.getAllProducts();

  // This means render productList.ejs
  // with renderTitle, pagePath and productList arguments
  // server will understand "allProducts" as allProducts.ejs because
  // it is indicated in index.js like that, html is the root folder for all
  // ejs files.
  res.render("shop/productList", {
    pagePath: "/products",
    productList: allProducts,
    renderTitle: "All Products",
    selectedUser: res.locals.selectedUser,
  });
};

exports.getIndex = async (req, res, next) => {
  const products = await dbProductOperation.getAllProducts();

  res.render("shop/index", {
    pagePath: "/",
    productList: products,
    renderTitle: "Shop",
    selectedUser: res.locals.selectedUser,
  });
};

exports.getCart = async (req, res, next) => {
  const currentUser = await dbAdminOperation.getOneUser(req.session.userId);

  const [cartProductList, cartTotalPrice, userCartDB] =
    await dbCartOperation.getCartProducts(currentUser);

  res.render("shop/cart", {
    pagePath: "/cart",
    renderTitle: "Your Cart",
    cartProducts: cartProductList,
    cartPrice: cartTotalPrice,
    selectedUser: res.locals.selectedUser,
  });
};

exports.postCart = async (req, res, next) => {
  const addedProductId = req.body.addedProductId;
  const addedProduct = await dbProductOperation.getOneProduct(addedProductId);

  const currentUser = await dbAdminOperation.getOneUser(req.session.userId);

  await dbCartOperation.addUserAndProductToCart(currentUser, addedProduct);

  res.redirect("/");
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  const foundProduct = await dbProductOperation.getOneProduct(productId);

  res.render("shop/productDetail", {
    pagePath: "/products",
    renderTitle: `${foundProduct.productName} Details`,
    product: foundProduct,
    selectedUser: res.locals.selectedUser,
  });
};

exports.postDeleteCartItem = async (req, res, next) => {
  const loggedInUser = res.locals.selectedUser;
  const deletedCartItemId = req.body.deletedCartItemId;

  await dbCartOperation.deleteCartProduct(loggedInUser, deletedCartItemId);

  res.redirect("/cart");
};

exports.getAllUsers = async (req, res, next) => {
  const allUsers = await dbAdminOperation.getAllUsers();

  res.render("shop/login", {
    pagePath: "/login",
    renderTitle: "Login",
    userList: allUsers,
    selectedUser: res.locals.selectedUser,
  });
};

exports.postSelectedUser = async (req, res, next) => {
  const loggedinUserId = req.body["logged-in-user-id"];
  const loggedinUser = await dbAdminOperation.getOneUser(loggedinUserId);

  req.session.userId = loggedinUser._id;
  req.session.userName = loggedinUser.userName;
  req.session.userEmail = loggedinUser.userEmail;
  req.session.adminId = loggedinUser.adminId;

  res.redirect("/login");
};

exports.getOrders = async (req, res, next) => {
  const loggedInUser = res.locals.selectedUser;

  const orderList = await dbOrderOperation.getOrders(loggedInUser);

  res.render("shop/orders", {
    pagePath: "/orders",
    renderTitle: "Orders",
    orderList,
  });
};

exports.orderCart = async (req, res, next) => {
  const loggedInUser = res.locals.selectedUser;
  await dbOrderOperation.postCartToOrders(loggedInUser);

  res.redirect("/orders");
};
