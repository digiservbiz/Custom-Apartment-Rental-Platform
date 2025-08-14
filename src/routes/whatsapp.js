const express = require('express');
const { handleIncomingMessage } = require('../controllers/whatsappController');

const router = express.Router();

router.post('/webhook', handleIncomingMessage);

module.exports = router;
