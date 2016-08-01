'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    stdNum: {
        type: String,
        unique: true
    },
    stdName: {
        type: String,
        unique: false
    },
    password: {
        type: String
    },
    birthday: {
        type: String
    },
    provider: {
        type:String
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save', function (next) {
    var user = this;

    if(!user.isModified('password'))
        return next();
    else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

mongoose.model('User', UserSchema);