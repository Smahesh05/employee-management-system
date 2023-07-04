const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

var daydetailsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    employee: {
        type: ObjectId,
        ref: "Users",
        required: true
    },
    task: {
        type: String,
        required: true
    },
    task_description: {
        type: String,
        required: true
    },
    login_time: {
        type: String,
        required: true
    },
    logout_time: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model("Daydetail", daydetailsSchema);