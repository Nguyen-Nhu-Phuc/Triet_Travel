const Destination = require('../models/Destination.model')
const Restaurant = require('../models/Restaurant.model')

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const create = async (req, res) => {
    try {
        const data = req.body;
        const destination = await Destination.findById(data.destination_id);

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
                    folder: 'restaurants'
                });
                imageArray.push({ url: uploadedImage.secure_url });
            }
            data.image = imageArray;
        }

        const restaurant = new Restaurant(data);

        destination.restaurant_id = restaurant._id;
        await destination.save();
        await restaurant.save();

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo nhà hàng', error });
    }
};


const getAll = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({}).populate('destination_id');

        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách', error });
    }
};

const getById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('destination_id')
        if (!restaurant) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy nhà hàng'
        })

        res.status(200).json(restaurant)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy nhà hàng', error })
    }
}

const update = async (req, res) => {
    try {

        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!restaurant) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy nhà hàng'
        });

        const oldDestination = await Destination.findOne({ restaurant_id: restaurant._id });
        if (oldDestination) {
            oldDestination.restaurant_id = [];
            await oldDestination.save();
        }
        const destination = await Destination

            .findById(req.body.destination_id)
        if (!destination) return res.status(404).json({
            status: 1,
            message: 'Không tìm thấy địa điểm'
        })
        destination.restaurant_id = restaurant._id
        await destination.save()
        res.status(200).json(restaurant)
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật', error })
    }
}

const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id)
        if (!restaurant) return res.status(404).json({ message: 'Không tìm thấy nhà hàng' })

        const destination = await Destination.findOne({ restaurant_id: restaurant._id })
        if (destination) {
            destination.restaurant_id = []
            await destination.save()
        }

        res.status(200).json({ message: 'Xóa thành công' })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa', error })
    }
}


module.exports = { create, getAll, getById, update, deleteRestaurant }