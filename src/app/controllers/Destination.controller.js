const Destination = require('../models/Destination.model')

const create = async (req, res) => {
  try {
    const destination = new Destination(req.body)
    await destination.save()
    res.status(201).json(destination)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo địa điểm', error })
  }
}

const getAll = async (req, res) => {
  try {
    const destinations = await Destination.find({});

    for (let destination of destinations) {
      if (destination.hotel_id.length > 0) {
        await destination.populate('hotel_id');
      }
      if (destination.restaurant_id.length > 0) {
        await destination.populate('restaurant_id');
      }
      if (destination.place_id.length > 0) {
        await destination.populate('place_id');
      }
    }

    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách', error });
  }
};


const getById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id).populate('hotel_id').populate('restaurant_id')
    if (!destination) return res.status(404).json({ message: 'Không tìm thấy địa điểm' })

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

const softDelete = async (req, res) => {
  try {
    const destination = await Destination.delete({ _id: req.params.id })
    if (!destination) return res.status(404).json({ message: 'Không tìm thấy địa điểm' })

    res.status(200).json({ message: 'Đã xóa địa điểm' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa', error })
  }
}

const restore = async (req, res) => {
  try {
    const destination = await Destination.restore({ _id: req.params.id })
    if (!destination) return res.status(404).json({ message: 'Không tìm thấy địa điểm' })

    res.status(200).json({ message: 'Đã khôi phục địa điểm' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi khôi phục', error })
  }
}

module.exports = { create, getAll, getById, update, softDelete, restore }
