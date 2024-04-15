var express = require("express");
var router = express.Router();
const {
  getInvoice,
  
} = require("../services/invoice.service");

router.post("/invoice", async (req, res, next) => {
  let body = req.body;
  let response = await getInvoice(body);
  res.json(response);
});

module.exports = router;
