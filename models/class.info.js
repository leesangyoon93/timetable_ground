/**
 * Created by Sangyoon on 2016-06-08.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classSchema = new Schema({
    major: String,
    classInfo: {
        name: String,
        prof: String,
        time: []
    }
});

mongoose.model('Class', classSchema);