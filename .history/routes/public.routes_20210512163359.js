const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
//const Service = require('../models/Service.model);
//const Reserve = require('../models/Reserve.model);

//SHOW ALL SERVICES
router.get("/services", (req, res, next) => {
    Service.find({})
    .then(services => res.status(200).json(todos))
    .catch(err => res.status(500).json(err))
});

//CREATE RESERVE

module.exports = router;