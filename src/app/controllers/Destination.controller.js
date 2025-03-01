const Destination = require('../models/Destination.model')
const Hotel = require('../models/Hotel.model')
const Place = require('../models/Place.model')
const Restaurant = require('../models/Restaurant.model')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const create = async (req, res) => {
  try {
    const data = req.body
    // console.log(data)

    if (req.files && req.files.length > 0) {
      const imageArray = []
      for (const file of req.files) {
        const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        const uploadedImage = await cloudinary.uploader.upload(base64String, {
          folder: 'destinations'
        })
        imageArray.push({ url: uploadedImage.secure_url })
      }
      data.image = imageArray
    }

    const destination = new Destination(data)
    await destination.save()

    res.status(201).json(destination)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo địa điểm', error })
  }
}

const getAll = async (req, res) => {
  try {
    const destinations = await Destination.find({})

    for (let destination of destinations) {
      if (destination.hotel_id.length > 0) {
        await destination.populate('hotel_id')
      }
      if (destination.restaurant_id.length > 0) {
        await destination.populate('restaurant_id')
      }
      if (destination.place_id.length > 0) {
        await destination.populate('place_id')
      }
    }

    res.status(200).json(destinations)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách', error })
  }
}

const getById = async (req, res) => {
  try {
    let destination = await Destination.findById(req.params.id)
    if (!destination) return res.status(404).json({ message: 'Không tìm thấy địa điểm' })

    if (destination.hotel_id.length > 0) {
      await destination.populate('hotel_id')
    }
    if (destination.restaurant_id.length > 0) {
      await destination.populate('restaurant_id')
    }

    res.status(200).json(destination)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy địa điểm', error })
  }
}

const update = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!destination) return res.status(404).json({ message: 'Không tìm thấy địa điểm' })

    res.status(200).json(destination)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật', error })
  }
}

const remove = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
    if (!destination) return res.status(404).json({ message: 'Không tìm thấy địa điểm' })

    // Xóa các khách sạn liên quan đến destination này
    await Hotel.deleteMany({ _id: { $in: destination.hotel_id } })

    // Xóa các Places liên quan đến destination
    await Place.deleteMany({ _id: { $in: destination.place_id } })

    await Restaurant.deleteMany({ _id: { $in: destination.restaurant_id } })
    // Xóa destination
    await Destination.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Đã xóa địa điểm và khách sạn liên quan' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa', error })
  }
}

module.exports = { create, getAll, getById, update, remove }
