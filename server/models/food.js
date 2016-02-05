var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FoodSchema = new Schema({
    name: {type: String, required: true},
    calories: {type: Number, required: true},
    fat: {type: Number, required: true},
    carbs: {type: Number, required: true},
    protein: {type: Number, required: true},
    fiber: {type: Number, required: true},
    netCarbs: {type: Number, required: true}
});


exports.model = mongoose.model('Food', FoodSchema);

exports.schema = FoodSchema;