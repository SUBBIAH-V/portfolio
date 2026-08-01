import { getPublicData, memoryStoreAccess } from '../utils/dataStore.js';
import { Message } from '../models/allModels.js';

export const getPortfolioData = async (req, res) => {
  try {
    const data = await getPublicData();
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject: subject || 'Portfolio Inquiry',
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    try {
      const created = await Message.create({ name, email, subject, message });
      return res.json({ success: true, message: 'Message sent successfully!', data: created });
    } catch (e) {
      // Fallback in memory
      const currentMsgs = memoryStoreAccess.getStore().messages || [];
      currentMsgs.unshift(newMessage);
      memoryStoreAccess.updateStore('messages', currentMsgs);
      return res.json({ success: true, message: 'Message sent successfully!', data: newMessage });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
