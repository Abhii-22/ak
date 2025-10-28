const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, sportName, date, place, rules, icon, prize1, prize2, prize3, prize4, prize5 } = req.body;

  try {
    const prizes = {
      '1st': prize1,
      '2nd': prize2,
      '3rd': prize3,
      '4th': prize4,
      '5th': prize5,
    };

    const newEvent = new Event({
      title,
      sportName,
      date,
      place,
      rules,
      icon,
      prizes,
      poster: req.file ? `/uploads/${req.file.filename}` : '',
      uploadedBy: req.user.id,
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
