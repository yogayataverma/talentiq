const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidates');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.parse(file.originalname).name}.pdf`);
  },
});

const upload = multer({ storage: storage });

router.get('/', candidateController.getAllCandidates);
router.post('/', upload.single('resume'), candidateController.createCandidate);
router.put('/:id/status', candidateController.updateCandidateStatus);
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router; 