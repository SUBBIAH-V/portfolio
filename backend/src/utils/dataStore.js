import { initialData, seedDatabase } from './seedData.js';
import { Profile, About, Skill, Experience, Project, Certification, Research, Achievement, Settings, Message } from '../models/allModels.js';

let isMongoConnected = false;

export const setDbConnected = (connected) => {
  isMongoConnected = connected;
};

export const seedDBIfEmpty = async () => {
  if (isMongoConnected) {
    await seedDatabase();
  }
};

class MemoryDataStore {
  constructor() {
    this.resetStore();
  }

  resetStore() {
    this.profile = { ...initialData.profile };
    this.about = { ...initialData.about };
    this.skills = [...initialData.skills.map((s, idx) => ({ ...s, id: `skill-${idx + 1}` }))];
    this.experience = [...initialData.experience.map((e, idx) => ({ ...e, id: `exp-${idx + 1}` }))];
    this.projects = [...initialData.projects.map((p, idx) => ({ ...p, id: p.id || `proj-${idx + 1}` }))];
    this.certifications = [...initialData.certifications.map((c, idx) => ({ ...c, id: `cert-${idx + 1}` }))];
    this.research = [...initialData.research.map((r, idx) => ({ ...r, id: `res-${idx + 1}` }))];
    this.achievements = [...initialData.achievements.map((a, idx) => ({ ...a, id: `ach-${idx + 1}` }))];
    this.messages = [
      {
        id: 'msg-1',
        name: 'Alex Johnson',
        email: 'alex.recruiter@techcorp.com',
        subject: 'AI Engineering Role Opportunity',
        message: 'Hi Subbiah! We reviewed your AI Medical Chatbot and Agro Puthalavan IEEE paper. We would love to discuss a Senior AI Engineer position.',
        createdAt: new Date().toISOString(),
        isRead: false
      }
    ];
    this.settings = { ...initialData.settings };
  }
}

export const memoryStore = new MemoryDataStore();

export const memoryStoreAccess = {
  getStore: () => memoryStore,
  updateStore: (key, val) => {
    memoryStore[key] = val;
  }
};

export const getPublicData = async () => {
  if (isMongoConnected) {
    try {
      const profile = await Profile.findOne();
      const about = await About.findOne();
      const skills = await Skill.find();
      const experience = await Experience.find();
      const projects = await Project.find();
      const certifications = await Certification.find();
      const research = await Research.find();
      const achievements = await Achievement.find();
      const settings = await Settings.findOne();
      const messages = await Message.find();

      return {
        profile: profile || memoryStore.profile,
        about: about || memoryStore.about,
        skills: skills.length ? skills : memoryStore.skills,
        experience: experience.length ? experience : memoryStore.experience,
        projects: projects.length ? projects : memoryStore.projects,
        certifications: certifications.length ? certifications : memoryStore.certifications,
        research: research.length ? research : memoryStore.research,
        achievements: achievements.length ? achievements : memoryStore.achievements,
        settings: settings || memoryStore.settings,
        messages: messages.length ? messages : memoryStore.messages
      };
    } catch (e) {
      console.warn('[DB Error]: Failed fetching Mongo data, using memory store fallback.');
    }
  }
  return {
    profile: memoryStore.profile,
    about: memoryStore.about,
    skills: memoryStore.skills,
    experience: memoryStore.experience,
    projects: memoryStore.projects,
    certifications: memoryStore.certifications,
    research: memoryStore.research,
    achievements: memoryStore.achievements,
    settings: memoryStore.settings,
    messages: memoryStore.messages
  };
};
