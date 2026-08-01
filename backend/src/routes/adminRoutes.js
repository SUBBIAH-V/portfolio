import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  getAdminStats, updateProfile, updateAbout,
  addSkill, updateSkill, deleteSkill,
  addExperience, updateExperience, deleteExperience,
  addProject, updateProject, deleteProject,
  addCertification, updateCertification, deleteCertification,
  addResearch, updateResearch, deleteResearch,
  addAchievement, updateAchievement, deleteAchievement,
  getMessages, markMessageRead, deleteMessage,
  updateSettings
} from '../controllers/adminController.js';

const router = express.Router();

// Apply admin protection to all routes below
router.use(protectAdmin);

// Dashboard overview stats
router.get('/stats', getAdminStats);

// Profile & About
router.put('/profile', updateProfile);
router.put('/about', updateAbout);

// Skills
router.post('/skills', addSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Experience
router.post('/experience', addExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Projects
router.post('/projects', addProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Certifications
router.post('/certifications', addCertification);
router.put('/certifications/:id', updateCertification);
router.delete('/certifications/:id', deleteCertification);

// Research
router.post('/research', addResearch);
router.put('/research/:id', updateResearch);
router.delete('/research/:id', deleteResearch);

// Achievements
router.post('/achievements', addAchievement);
router.put('/achievements/:id', updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Messages Inbox
router.get('/messages', getMessages);
router.put('/messages/:id/read', markMessageRead);
router.delete('/messages/:id', deleteMessage);

// Settings
router.put('/settings', updateSettings);

export default router;
