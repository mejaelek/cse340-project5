/* ===================================================
   utilities/index.js
   Helper functions: nav builder, select list builder,
   error handler wrapper
   =================================================== */
const invModel = require("../models/inventory-model");

const Util = {};

/* ── Build Navigation Bar HTML ──────────────────── */
Util.getNav = async function () {
    let data = await invModel.getClassifications();
    let list = `<ul>`;
    list += `<li><a href="/" title="Home page">Home</a></li>`;
    data.rows.forEach((row) => {
        list += `<li>
      <a href="/inv/type/${row.classification_id}"
         title="See our inventory of ${row.classification_name} vehicles">
        ${row.classification_name}
      </a>
    </li>`;
    });
    list += `</ul>`;
    return list;
};

/* ── Build Classification Select List ───────────── */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications();
    let classificationList =
        '<select name="classification_id" id="classificationList" required>';
    classificationList +=
        "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
        classificationList +=
            '<option value="' + row.classification_id + '"';
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected ";
        }
        classificationList +=
            ">" + row.classification_name + "</option>";
    });
    classificationList += "</select>";
    return classificationList;
};

/* ── Build Inventory Grid HTML ──────────────────── */
Util.buildClassificationGrid = async function (data) {
    let grid = "";
    if (data.length > 0) {
        grid = '<ul id="inv-display">';
        data.forEach((vehicle) => {
            grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}"
           title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}"
               alt="${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}"
               title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`;
        });
        grid += "</ul>";
    } else {
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
};

/* ── Build Vehicle Detail HTML ──────────────────── */
Util.buildVehicleDetail = function (vehicle) {
    const price = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(vehicle.inv_price);
    const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles);

    return `
    <section class="vehicle-detail-wrapper">
      <div class="vehicle-image-panel">
        <img src="${vehicle.inv_image}"
             alt="${vehicle.inv_make} ${vehicle.inv_model}"
             class="vehicle-main-img" />
      </div>
      <div class="vehicle-info-panel">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <div class="vehicle-specs">
          <div class="spec-row">
            <span class="spec-label">Price</span>
            <span class="spec-value highlight-price">${price}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Mileage</span>
            <span class="spec-value">${miles} miles</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Color</span>
            <span class="spec-value">${vehicle.inv_color}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Category</span>
            <span class="spec-value">${vehicle.classification_name}</span>
          </div>
        </div>
        <h3>Description</h3>
        <p class="vehicle-description">${vehicle.inv_description}</p>
        <a href="#" class="btn btn-primary">Schedule Test Drive</a>
      </div>
    </section>`;
};

/* ── Error Handling Wrapper ─────────────────────── */
Util.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
