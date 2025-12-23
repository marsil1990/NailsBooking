const baseController = {};
const utilites = require("../utilities/index");
const serviceModel = require("../models/service-model");

baseController.buildHome = async function (req, res) {
  //   const nav = await utilities.getNav();
  // req.flash("notice", "This is a flash message.");
  const data = await serviceModel.getAllservices();
  const grid = await utilites.buildServicesMarquee(data);
  const cards = await utilites.buildServicesCards(data);
  res.render("index", {
    title: "Home",
    grid,
    cards,
  });
};

module.exports = baseController;
