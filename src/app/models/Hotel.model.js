const mongoose = require('mongoose');

const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const Hotel = new Schema(
    {
        name: { type: String, require: true },
        description: { type: String, require: true },
        destination_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination',
        },
        long: { type: String },
        lat: { type: String },
        image: [{ type: String, require: true }],
        rating: { type: Number },
    },
    {
        timestamps: true,
    },
);

// Add plugins
mongoose.set('strictQuery', false)

Hotel.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Hotel', Hotel);
