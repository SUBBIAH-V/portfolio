export interface Profile {
  _id?: string;
  name: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
  leetcode: string;
  hackerrank: string;
  twitter: string;
}

export interface About {
  _id?: string;
  aboutMe: string;
  careerObjective: string;
  interests: string[];
}

export interface Skill {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order?: number;
}

export interface Experience {
  _id?: string;
  id?: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
  companyLogo?: string;
  order?: number;
}

export interface Project {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  githubLink?: string;
  liveDemo?: string;
  category: string;
  image?: string;
  featured: boolean;
  order?: number;
}

export interface Certification {
  _id?: string;
  id?: string;
  title: string;
  organization: string;
  date: string;
  credentialId?: string;
  verificationLink?: string;
  image?: string;
}

export interface Research {
  _id?: string;
  id?: string;
  title: string;
  abstract: string;
  publisher: string;
  doi?: string;
  publicationLink?: string;
  date?: string;
}

export interface Achievement {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  date?: string;
  image?: string;
}

export interface Message {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Settings {
  _id?: string;
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage?: string;
  isMaintenanceMode?: boolean;
}

export interface AdminStats {
  totalProjects: number;
  totalSkills: number;
  totalCertifications: number;
  totalExperience: number;
  totalResearch: number;
  totalAchievements: number;
  totalMessages: number;
  unreadMessages: number;
  estimatedVisitors: number;
}

export interface PortfolioData {
  profile: Profile;
  about: About;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  research: Research[];
  achievements: Achievement[];
  settings: Settings;
  messages?: Message[];
}
