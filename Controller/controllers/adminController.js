const dbProductOperation = require("../../Model/operations/dbProductOperation");
const dbAdminOperation = require("../../Model/operations/dbAdminOperation");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/addEditProduct", {
    renderTitle: "Add Product",
    pagePath: "/admin/add-product",
    editing: false,
    selectedUser: res.locals.selectedUser,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const newProduct = {
    productName: req.body.newProductName,
    productDesc: req.body.newProductDescription,
    productPrice: req.body.newProductPrice,
    productImg: req.body.newProductImage,
    // Express-Session-Keep-Cookie-in-req.session
    // here, we can assign req.session from everywhere because it is a cookie file.
    adminId: res.locals.selectedUser.adminId,
  };

  await dbProductOperation.addNewProduct(newProduct);

  res.redirect("/");
};

exports.getProducts = async (req, res, next) => {
  let products = false;

  if (req.session.adminId) {
    products = await dbAdminOperation.getAdminProducts(req.session.adminId);
  }

  res.render("admin/adminProducts", {
    pagePath: "/admin/products",
    productList: products,
    renderTitle: "Admin Products",
    selectedUser: res.locals.selectedUser,
  });
};

// editProduct and postEditProduct are responsible of
// "Edit" button.
exports.editProduct = async (req, res, next) => {
  const productId = req.params.productId;

  const editMode = req.query.edit;
  const isEditMode = editMode === "true";

  const foundProduct = await dbProductOperation.getOneProduct(productId);

  // Normally if product cannot be found, an error message
  // should be shown.
  if (!foundProduct) {
    return res.redirect("/");
  }

  res.render("admin/addEditProduct", {
    renderTitle: "Edit Product",
    pagePath: "/admin/edit-product",
    editing: isEditMode,
    product: foundProduct,
    selectedUser: res.locals.selectedUser,
  });
};

// editProduct and postEditProduct are responsible of
// "Edit" button.

// After all "POST" request logic
// always use res.redirect to avoid
// unnecessary loading screen on the page.
exports.postEditProduct = async (req, res, next) => {
  const productId = req.body.editedProductId;

  const updatedProduct = {
    _id: productId,
    productName: req.body.newProductName,
    productDesc: req.body.newProductDescription,
    productPrice: req.body.newProductPrice,
    productImg: req.body.newProductImage,
    adminId: res.locals.selectedUser.adminId,
  };

  await dbProductOperation.updateOneProduct(updatedProduct);

  res.redirect("/");
};

exports.postDeleteProduct = async (req, res, next) => {
  const deletedId = req.body.deletedProductId;

  await dbProductOperation.deleteOneProduct(deletedId);

  res.redirect("/admin/products");
};
