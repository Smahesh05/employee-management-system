const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        // required: true
    },
    number: {
        type: Number,
        required: true
    },
    role: {
        type: Number,
        // required: true,
        default: 0
    },
    isVerified: {
        type: Boolean,
        // required: true,
        default: false
    },
    location: {
        type: String,
        // required: true,
        default: "NA"
    }
})

module.exports = mongoose.model("User", userSchema);