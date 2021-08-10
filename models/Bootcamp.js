const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const geocoder = require("./../utils/geocoder");


const BootcampSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name cannot be mo than 50 characters"]

    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        unique: true,
        maxlength: [500, "Description can not be more than 500"]
    },
    website: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String,
        required: [true, "Please add a address"],
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            "Mobile Development",
            "Web Development",
            "Data Science",
            "Business",
            "UI/UX",
            "Other"
        ]
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at leat 1"],
        max: [10, "Rating must can not be more than 10"]
    },

    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    

});


// Create bootcamp slug from name
BootcampSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

// Geocode & create location field
BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [
            loc[0].longitude, loc[0].latitude
        ],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode

    };
    // do not save address in Db
    this.address = undefined;
    next();
});


module.exports = mongoose.model('Bootcamp', BootcampSchema);