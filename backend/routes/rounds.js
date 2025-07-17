const express = require('express');
const router = express.Router();
const { createRound, getUserRounds, deleteRound } = require('../controllers/roundController');
const auth = require('../middleware/auth');

router.post('/', auth, createRound);
router.get('/', auth, getUserRounds);
router.delete('/:roundId', auth, deleteRound);

module.exports = router; 