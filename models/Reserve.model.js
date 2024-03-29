const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reserveSchema = new Schema({
    service_name: {type: String},
    user_id: [{type: Schema.Types.ObjectId, ref: 'User'}],
    worker_id: [{type: Schema.Types.ObjectId, ref: 'Reserve'}],
    reservation_date: {type: Date, required: true, min: '2021-05-01' },
	status: {type: String, enum: ["done", "todo"]},
    service_id: { type: Schema.Types.ObjectId, ref: 'Service'},
    assigned_worker: { type: Schema.Types.ObjectId, ref: 'Worker'},
    assigned_client: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Reserve = mongoose.model('Reserve', reserveSchema);
module.exports = Reserve;