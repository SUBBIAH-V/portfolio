import express from 'express';
import { getPortfolioData, submitContactMessage } from '../controllers/publicController.js';

const router = express.Router();

router.get('/portfolio', getPortfolioData);
router.post('/messages', submitContactMessage);

export default router;
