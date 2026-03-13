/* ******************************************
 * controllers/baseController.js
 *******************************************/
const baseController = {};

baseController.buildHome = async function (req, res) {
    res.render("index", {
        title: "CSE Motors | Home",
    });
};

module.exports = baseController; 