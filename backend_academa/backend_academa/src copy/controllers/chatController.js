const db = require('../config/database');

// Get all people user can chat with
const getPeople = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id,name,role,department,designation FROM users WHERE id!=$1 AND is_active=true ORDER BY role,name',
      [req.user.id]
    );
    res.json({ success:true, data:result.rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Get conversations (list of people you've chatted with + last message)
const getConversations = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT ON (other_user.id)
              other_user.id, other_user.name, other_user.role, other_user.designation,
              cm.message as last_message, cm.created_at as last_message_time,
              (SELECT COUNT(*) FROM chat_messages
               WHERE sender_id=other_user.id AND receiver_id=$1 AND is_read=false) as unread_count
       FROM chat_messages cm
       JOIN users other_user ON (
         CASE WHEN cm.sender_id=$1 THEN cm.receiver_id ELSE cm.sender_id END
       ) = other_user.id
       WHERE cm.sender_id=$1 OR cm.receiver_id=$1
       ORDER BY other_user.id, cm.created_at DESC`,
      [req.user.id]
    );
    res.json({ success:true, data:result.rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { id: otherId } = req.params;
    const result = await db.query(
      `SELECT cm.*, u.name as sender_name, u.role as sender_role
       FROM chat_messages cm JOIN users u ON cm.sender_id=u.id
       WHERE (cm.sender_id=$1 AND cm.receiver_id=$2)
          OR (cm.sender_id=$2 AND cm.receiver_id=$1)
       ORDER BY cm.created_at ASC`,
      [req.user.id, otherId]
    );
    // Mark as read
    await db.query(
      'UPDATE chat_messages SET is_read=true WHERE sender_id=$1 AND receiver_id=$2 AND is_read=false',
      [otherId, req.user.id]
    );
    res.json({ success:true, data:result.rows });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiver_id, message } = req.body;
    if (!receiver_id || !message)
      return res.status(400).json({ success:false, message:'receiver_id and message are required' });
    const result = await db.query(
      'INSERT INTO chat_messages (sender_id,receiver_id,message) VALUES ($1,$2,$3) RETURNING *',
      [req.user.id, receiver_id, message.trim()]
    );
    res.status(201).json({ success:true, data:result.rows[0] });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE receiver_id=$1 AND is_read=false',
      [req.user.id]
    );
    res.json({ success:true, data:{ count: parseInt(result.rows[0].count) } });
  } catch(err) { res.status(500).json({ success:false, error:err.message }); }
};

module.exports = { getPeople, getConversations, getMessages, sendMessage, getUnreadCount };
