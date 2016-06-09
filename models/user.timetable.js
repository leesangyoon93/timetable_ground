/**
 * Created by Sangyoon on 2016-05-30.
 */
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
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

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Timetable', TimetableSchema);