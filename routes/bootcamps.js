const express = require("express");
const {getBootcamps, getBootcamp, createBootcamps, updateBootcamps,
     deleteBootcamps, getBootcampsInRadius} = require("./../controllers/bootcamps");
const router = express.Router();


router.get('/', getBootcamps);
router.get('/:id', getBootcamp);
router.post('/', createBootcamps);
router.put('/:id', updateBootcamps);
router.delete('/:id', deleteBootcamps);
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;