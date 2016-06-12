/**
 * Created by Sangyoon on 2016-05-30.
 */
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimetableSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    creator:{
        type: String,
        unique: true
    },
    creatorName: {
        type: String,
        unique: true
    },
    data: Array(5)

});

mongoose.model('Timetable', TimetableSchema);