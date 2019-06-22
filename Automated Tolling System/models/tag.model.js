const mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    tagID: {
        type: String,
        required: 'This field is required.',
        unique: true
    },
    carType: {
        type: String
    },
    tollCredit: {
        type: Number,
        default: 0
    },
    plateNo: {
        type: String,
        minlength: 3,
        maxlength: 8
    }
});

mongoose.model('Tag', tagSchema);