var mongoose = require('mongoose');

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


exports.model = mongoose.model('Food', FoodSchema);

exports.schema = FoodSchema;