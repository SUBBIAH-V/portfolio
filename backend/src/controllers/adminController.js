import { 
  Profile, About, Skill, Experience, Project, 
  Certification, Research, Achievement, Message, Settings 
} from '../models/allModels.js';
import { getPublicData, memoryStoreAccess } from '../utils/dataStore.js';

// Stats Overview
export const getAdminStats = async (req, res) => {
  try {
    const data = await getPublicData();
    const unreadMessages = data.messages ? data.messages.filter(m => !m.isRead).length : 0;
    
    return res.json({
      success: true,
      stats: {
        totalProjects: data.projects.length,
        totalSkills: data.skills.length,
        totalCertifications: data.certifications.length,
        totalExperience: data.experience.length,
        totalResearch: data.research.length,
        totalAchievements: data.achievements.length,
        totalMessages: data.messages ? data.messages.length : 0,
        unreadMessages,
        estimatedVisitors: 1420
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Generic helper for Memory Fallback CRUD
const updateMemorySection = (key, item, action = 'update') => {
  const store = memoryStoreAccess.getStore();
  if (!store[key]) store[key] = [];

  if (key === 'profile' || key === 'about' || key === 'settings') {
    store[key] = { ...store[key], ...item };
    return store[key];
  }

  if (action === 'add') {
    const newItem = { ...item, id: `item-${Date.now()}` };
    store[key].push(newItem);
    return newItem;
  } else if (action === 'update') {
    const index = store[key].findIndex(x => (x.id === item.id || x._id === item._id || x._id?.toString() === item.id));
    if (index !== -1) {
      store[key][index] = { ...store[key][index], ...item };
    }
    return item;
  } else if (action === 'delete') {
    store[key] = store[key].filter(x => (x.id !== item.id && x._id !== item.id && x._id?.toString() !== item.id));
    return true;
  }
};

// PROFILE
export const updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('profile', updateData);

    try {
      let profile = await Profile.findOne();
      if (profile) {
        Object.assign(profile, updateData);
        await profile.save();
      } else {
        profile = await Profile.create(updateData);
      }
      return res.json({ success: true, data: profile });
    } catch (e) {
      console.warn('[Profile Update DB Warning]:', e.message);
      const store = memoryStoreAccess.getStore();
      return res.json({ success: true, data: store.profile });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ABOUT
export const updateAbout = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('about', updateData);

    try {
      let about = await About.findOne();
      if (about) {
        Object.assign(about, updateData);
        await about.save();
      } else {
        about = await About.create(updateData);
      }
      return res.json({ success: true, data: about });
    } catch (e) {
      const store = memoryStoreAccess.getStore();
      return res.json({ success: true, data: store.about });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SKILLS CRUD
export const addSkill = async (req, res) => {
  try {
    try {
      const skill = await Skill.create(req.body);
      return res.json({ success: true, data: skill });
    } catch (e) {
      const created = updateMemorySection('skills', req.body, 'add');
      return res.json({ success: true, data: created });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('skills', { id, ...updateData }, 'update');

    try {
      const skill = await Skill.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, data: skill });
    } catch (e) {
      return res.json({ success: true, data: { id, ...updateData } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Skill.findByIdAndDelete(id);
    } catch (e) {}
    updateMemorySection('skills', { id }, 'delete');
    return res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// EXPERIENCE CRUD
export const addExperience = async (req, res) => {
  try {
    try {
      const exp = await Experience.create(req.body);
      return res.json({ success: true, data: exp });
    } catch (e) {
      const created = updateMemorySection('experience', req.body, 'add');
      return res.json({ success: true, data: created });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('experience', { id, ...updateData }, 'update');

    try {
      const exp = await Experience.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, data: exp });
    } catch (e) {
      return res.json({ success: true, data: { id, ...updateData } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Experience.findByIdAndDelete(id);
    } catch (e) {}
    updateMemorySection('experience', { id }, 'delete');
    return res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PROJECTS CRUD
export const addProject = async (req, res) => {
  try {
    try {
      const proj = await Project.create(req.body);
      return res.json({ success: true, data: proj });
    } catch (e) {
      const created = updateMemorySection('projects', req.body, 'add');
      return res.json({ success: true, data: created });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('projects', { id, ...updateData }, 'update');

    try {
      const proj = await Project.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, data: proj });
    } catch (e) {
      return res.json({ success: true, data: { id, ...updateData } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Project.findByIdAndDelete(id);
    } catch (e) {}
    updateMemorySection('projects', { id }, 'delete');
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// CERTIFICATIONS CRUD
export const addCertification = async (req, res) => {
  try {
    try {
      const cert = await Certification.create(req.body);
      return res.json({ success: true, data: cert });
    } catch (e) {
      const created = updateMemorySection('certifications', req.body, 'add');
      return res.json({ success: true, data: created });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('certifications', { id, ...updateData }, 'update');

    try {
      const cert = await Certification.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, data: cert });
    } catch (e) {
      return res.json({ success: true, data: { id, ...updateData } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Certification.findByIdAndDelete(id);
    } catch (e) {}
    updateMemorySection('certifications', { id }, 'delete');
    return res.json({ success: true, message: 'Certification deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// RESEARCH CRUD
export const addResearch = async (req, res) => {
  try {
    try {
      const item = await Research.create(req.body);
      return res.json({ success: true, data: item });
    } catch (e) {
      const created = updateMemorySection('research', req.body, 'add');
      return res.json({ success: true, data: created });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResearch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('research', { id, ...updateData }, 'update');

    try {
      const item = await Research.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, data: item });
    } catch (e) {
      return res.json({ success: true, data: { id, ...updateData } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResearch = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Research.findByIdAndDelete(id);
    } catch (e) {}
    updateMemorySection('research', { id }, 'delete');
    return res.json({ success: true, message: 'Research item deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ACHIEVEMENTS CRUD
export const addAchievement = async (req, res) => {
  try {
    try {
      const item = await Achievement.create(req.body);
      return res.json({ success: true, data: item });
    } catch (e) {
      const created = updateMemorySection('achievements', req.body, 'add');
      return res.json({ success: true, data: created });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('achievements', { id, ...updateData }, 'update');

    try {
      const item = await Achievement.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, data: item });
    } catch (e) {
      return res.json({ success: true, data: { id, ...updateData } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Achievement.findByIdAndDelete(id);
    } catch (e) {}
    updateMemorySection('achievements', { id }, 'delete');
    return res.json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// MESSAGES MANAGEMENT
export const getMessages = async (req, res) => {
  try {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: messages });
    } catch (e) {
      const store = memoryStoreAccess.getStore();
      return res.json({ success: true, data: store.messages || [] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const msg = await Message.findByIdAndUpdate(id, { isRead: true }, { new: true });
      return res.json({ success: true, data: msg });
    } catch (e) {
      const store = memoryStoreAccess.getStore();
      const msg = (store.messages || []).find(m => m.id === id || m._id === id);
      if (msg) msg.isRead = true;
      return res.json({ success: true, data: msg });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Message.findByIdAndDelete(id);
    } catch (e) {}
    const store = memoryStoreAccess.getStore();
    store.messages = (store.messages || []).filter(m => m.id !== id && m._id !== id);
    return res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SETTINGS
export const updateSettings = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;

    updateMemorySection('settings', updateData);

    try {
      let settings = await Settings.findOne();
      if (settings) {
        Object.assign(settings, updateData);
        await settings.save();
      } else {
        settings = await Settings.create(updateData);
      }
      return res.json({ success: true, data: settings });
    } catch (e) {
      const store = memoryStoreAccess.getStore();
      return res.json({ success: true, data: store.settings });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
