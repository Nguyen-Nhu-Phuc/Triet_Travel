const Destination = require('../models/Destination.model')
const Place = require('../models/Place.model')

const create = async (req, res) => {
    try {
        const place = new Place(req.body)
        const destination = await Destination.findById(req.body.destination_id)
        if (!destination) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy địa điểm'
        })
        destination.place_id = place._id
        await destination.save()
        await place.save()
        res.status(201).json(place)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo địa điểm', error })
    }
}

const getAll = async (req, res) => {
    try {
        const places = await Place.find({}).populate('destination_id');

        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách', error });
    }
};

const getById = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id).populate('destination_id')
        if (!place) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy địa điểm'
        })

        res.status(200).json(place)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy địa điểm', error })
    }
}


const update = async (req, res) => {
    try {

        const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!place) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy địa điểm'
        });

        const oldDestination = await Destination.findOne({ place_id: place._id });
        if (oldDestination) {
            oldDestination.place_id = null;
            await oldDestination.save();
        }
        const destination = await Destination
            .findById(req.body.destination_id)
        if (!destination) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy địa điểm'
        })
        destination.place_id = place._id
        await destination.save()
        res.status(200).json(place)
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật', error })
    }
}

const deletePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id)
        if (!place) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy địa điểm'
        })
        const destination = await Destination.findOne({ place_id: place._id })
        if (destination) {
            destination.place_id = null
            await destination.save()
        }
        res.status(200).json(place)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa', error })
    }
}

module.exports = { create, getAll, getById, update, deletePlace }

