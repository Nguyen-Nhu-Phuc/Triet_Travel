const Destination = require('../models/Destination.model')
const Hotel = require('../models/Hotel.model')


const create = async (req, res) => {
    try {
        const hotel = new Hotel(req.body)
        const destination = await Destination.findById(req.body.destination_id)
        if (!destination) return res.status(404).json({ message: 'Không tìm thấy địa điểm' })
        hotel._id = Destination.hotel_id
        await destination.save()
        await hotel.save()
        res.status(201).json(hotel)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo địa điểm', error })
    }
}



module.exports = { create }