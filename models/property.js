const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    desci: { type: String, required: true },
    beds: { type: String, required: true },
    baths: { type: String, required: true },
    beds: { type: String, required: true },
    places: { type: String, required: true },
    location: { type: String, required: true },
    seller_id: { type: String, required: true },
    // Add other fields as needed
});

module.exports = mongoose.model('Property', propertySchema);
