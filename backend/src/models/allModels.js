import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Admin User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Profile Schema
const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Alex Rivera' },
  headline: { type: String, default: 'Senior Full-Stack Engineer & System Architect' },
  bio: { type: String, default: 'Passionate software engineer with 6+ years of experience building high-scale web applications, microservices, and AI-driven platforms.' },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
  email: { type: String, default: 'alex.rivera@example.com' },
  phone: { type: String, default: '+1 (555) 234-5678' },
  location: { type: String, default: 'San Francisco, CA (Open to Remote)' },
  resumeUrl: { type: String, default: '/uploads/sample_resume.pdf' },
  github: { type: String, default: 'https://github.com' },
  linkedin: { type: String, default: 'https://linkedin.com' },
  leetcode: { type: String, default: 'https://leetcode.com' },
  hackerrank: { type: String, default: 'https://hackerrank.com' },
  twitter: { type: String, default: 'https://twitter.com' }
}, { timestamps: true });

// About Schema
const aboutSchema = new mongoose.Schema({
  aboutMe: { type: String, default: 'I am a software engineer dedicated to crafting clean code, high-performance web systems, and delightful user experiences.' },
  careerObjective: { type: String, default: 'To leverage cloud-native technologies, TypeScript, and modern frontend/backend frameworks to build scalable products that solve impactful real-world challenges.' },
  interests: [{ type: String }]
}, { timestamps: true });

// Skill Schema
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, default: 'Frontend' }, // Frontend, Backend, DevOps, AI/ML, Tools
  level: { type: Number, default: 90 }, // 1-100
  icon: { type: String, default: 'code' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Experience Schema
const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: { type: String, required: true }, // e.g. "Jan 2022 - Present"
  location: { type: String, default: 'San Francisco, CA' },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  companyLogo: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  features: [{ type: String }],
  githubLink: { type: String, default: '' },
  liveDemo: { type: String, default: '' },
  category: { type: String, default: 'Full Stack' }, // Full Stack, Frontend, Backend, AI/ML
  image: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Certification Schema
const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  date: { type: String, required: true },
  credentialId: { type: String, default: '' },
  verificationLink: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true });

// Research Schema
const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  publisher: { type: String, default: 'IEEE / ACM' },
  doi: { type: String, default: '' },
  publicationLink: { type: String, default: '' },
  date: { type: String, default: '' }
}, { timestamps: true });

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true });

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'Portfolio Contact' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Settings Schema
const settingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: 'Alex Rivera - Senior Software Engineer Portfolio' },
  metaDescription: { type: String, default: 'Explore the work, projects, experience, research, and skills of Alex Rivera.' },
  metaKeywords: { type: String, default: 'Software Engineer, Full-Stack, React, Node.js, TypeScript, Portfolio' },
  ogImage: { type: String, default: '' },
  isMaintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Profile = mongoose.model('Profile', profileSchema);
export const About = mongoose.model('About', aboutSchema);
export const Skill = mongoose.model('Skill', skillSchema);
export const Experience = mongoose.model('Experience', experienceSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Certification = mongoose.model('Certification', certificationSchema);
export const Research = mongoose.model('Research', researchSchema);
export const Achievement = mongoose.model('Achievement', achievementSchema);
export const Message = mongoose.model('Message', messageSchema);
export const Settings = mongoose.model('Settings', settingsSchema);
