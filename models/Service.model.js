const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: {type: String, required: true},
    image: {type: String /*, required: true */},
    duration: {type: Number, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    worker_id: [{type: Schema.Types.ObjectId, ref: 'Worker'}]
})

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;