const Candidate = require('../models/candidate');

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCandidate = async (req, res) => {
  console.log('Uploaded file:', req.file);
  const { name, email, phone, position, experience, status } = req.body;
  const newCandidate = new Candidate({
    name,
    email,
    phone,
    position,
    experience,
    status,
    resume: `uploads/${req.file.filename}`,
  });

  try {
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    await Candidate.findByIdAndDelete(id);
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 