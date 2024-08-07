const express = require('express');
const { receiveTicket } = require('../controllers/ticketController');

const router = express.Router();

router.post('/tickets', receiveTicket);

module.exports = router;
