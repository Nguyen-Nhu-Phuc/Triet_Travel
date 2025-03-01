const Destination = require('../models/Destination.model')
const Hotel = require('../models/Hotel.model')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const create = async (req, res) => {
    try {
        const data = req.body;
        const destination = await Destination.findById(req.body.destination_id);

        if (!destination) {
            return res.status(404).json({
                status: 1,
                message: 'Không tìm thấy địa điểm'
            });
        }

        if (req.files && req.files.length > 0) {
            const imageArray = [];
            for (const file of req.files) {
                const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const uploadedImage = await cloudinary.uploader.upload(base64String, {
                    folder: 'hotels'
                });
                imageArray.push({ url: uploadedImage.secure_url });
            }
            data.image = imageArray;
        }

        const hotel = new Hotel(data);

        destination.hotel_id = hotel._id;
        await destination.save();
        await hotel.save();

        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo khách sạn', error });
    }
};


const getAll = async (req, res) => {
    try {
        const hotels = await Hotel.find({}).populate('destination_id');

        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách', error });
    }
};


const getById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('destination_id')
        if (!hotel) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy khách sạn'
        })

        res.status(200).json(hotel)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy khách sạn', error })
    }
}

const update = async (req, res) => {
    try {

        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hotel) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy khách sạn'
        });

        const oldDestination = await Destination.findOne({ hotel_id: hotel._id });
        if (oldDestination) {
            oldDestination.hotel_id = [];
            await oldDestination.save();
        }

        const newDestination = await Destination.findById(req.body.destination_id);
        if (!newDestination) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy địa điểm'
        });

        newDestination.hotel_id = hotel._id;
        await newDestination.save();

        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật', error });
    }
};

const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy khách sạn'
        });

        const destination = await Destination.findOne({ hotel_id: hotel._id });
        if (destination) {
            destination.hotel_id = [];
            await destination.save();
        }

        res.status(200).json({
            status: 0,
            message: 'Xóa thành công'
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa', error });
    }
}


module.exports = { create, getAll, getById, update, deleteHotel }