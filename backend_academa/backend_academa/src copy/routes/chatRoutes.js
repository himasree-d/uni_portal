const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/auth');
const { getPeople, getConversations, getMessages, sendMessage, getUnreadCount } = require('../controllers/chatController');

router.get('/people',           authenticate, getPeople);
router.get('/conversations',    authenticate, getConversations);
router.get('/unread',           authenticate, getUnreadCount);
router.get('/messages/:id',     authenticate, getMessages);
router.post('/send',            authenticate, sendMessage);

module.exports = router;
