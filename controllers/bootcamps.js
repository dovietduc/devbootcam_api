const Bootcamp = require("./../models/Bootcamp");
const ErrorResponse = require("./../utils/errorResponse");
const asyncHandler = require("./../middleware/async");
const geocoder = require("./../utils/geocoder");
// Get all bootcamps
const getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    // Copy req.query 
    const reqQuery = { ...req.query };

    // Fields exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over remove fields and delete from req query
    removeFields.forEach(param => delete reqQuery[param]);



    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    // Create operater gt, lt, gte, lte, in
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // finding resource
    query = Bootcamp.find(JSON.parse(queryStr));

    // select fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();
    query = query.skip(startIndex).limit(limit);


    // Excuting query
    const bootcamps = await query;
    // Pagination result
    const pagination = {};
    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.status(200).send({success: true, count: bootcamps.length, pagination: pagination, data: bootcamps}); 
    
});

// Get single bootcamps
const getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).send({success: true, data: bootcamp}); 
});

// Create bootcamps
const createBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({success: true, data: bootcamp});
});

// Update bootcamps
const updateBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        news: true,
        runValidators: true
    });
    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    } 
    res.status(200).json({success: true, data: bootcamp});
});

// Delete bootcamps
const deleteBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    } 
    res.status(200).json({success: true, data: {}});
});

// Get bootcamps with a radius
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat, long from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calculater radius using radians
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });


});


module.exports = {
    getBootcamps: getBootcamps,
    getBootcamp: getBootcamp,
    createBootcamps: createBootcamps,
    updateBootcamps: updateBootcamps,
    deleteBootcamps: deleteBootcamps,
    getBootcampsInRadius: getBootcampsInRadius
};