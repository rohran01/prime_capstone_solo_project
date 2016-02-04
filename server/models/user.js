var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//var Food = require('./food');
var SALT_WORK_FACTOR = 10;

//creates mongoose schema

var Schema = mongoose.Schema;

var FoodSchema = new Schema({
    name: {type: String},
    calories: {type: Number},
    fat: {type: Number},
    carbs: {type: Number},
    protein: {type: Number},
    fiber: {type: Number},
    netCarbs: {type: Number}
});

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, require: true},
    logs: [{date:{type: Date, required: true},
            food: {type: Schema.ObjectId,
                    ref: 'FoodSchema'},
            meal: String}],
    myFoods: [{food: {type: Schema.ObjectId,
                        ref: 'FoodSchema'}}]
});

//hashes passwords

UserSchema.pre('save', function(next) {
    var user = this;

    //only hashes the password if it has been modified or is new
    if(!user.isModified('password')) {
        return next();
    }

    //generates a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) {
            return next(err);
        }

        //hashes password along with the new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
                return next(err);
            }

            //overrides cleartext password with hashed password
            user.password = hash;
            next();
        })
    })
});

//adds convenience method to schema to compare passwords later
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) {
            return callback(err);
        } else {
            callback(null, isMatch);
        }
    });
};

//will add convenience method to total macronutrients each day
UserSchema.methods.dailyTotals = function(date) {
    ///this method should find all foods with the date passed in and return totals for each macronutrient

};

var User = mongoose.model('User', UserSchema);
var Food = mongoose.model('Food', FoodSchema);
module.exports = {User: User, Food: Food};
