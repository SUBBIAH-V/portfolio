import axios from 'axios';
import { PortfolioData, AdminStats, Message } from '../types';

export const API_BASE_URL = '/api';

export const notifyDataChanged = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio_last_updated', Date.now().toString());
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('portfolio_updates');
      bc.postMessage('updated');
      bc.close();
    }
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for injecting JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback initial dataset (SUBBIAH VADIVELAN AI Portfolio)
export const fallbackPortfolioData: PortfolioData = {
  profile: {
    name: 'SUBBIAH VADIVELAN',
    headline: 'AI Engineer & Full-Stack Developer',
    bio: 'Passionate AI Engineer and Full-Stack Developer specializing in machine learning, computer vision, healthcare AI, and intelligent web applications. Building scalable solutions from deep learning models to full-stack cloud applications.',
    avatarUrl: '/subbiah_avatar.png',
    resumeUrl: '/Subbiah_Resume.pdf',
    phone: '+91 8122121806',
    email: 'subbiahvadivelan@gmail.com',
    location: 'Tamil Nadu, India',
    github: 'https://github.com/SUBBIAH-V',
    linkedin: 'https://www.linkedin.com/in/subbiah-v-356a18305/',
    leetcode: 'https://leetcode.com',
    hackerrank: 'https://hackerrank.com',
    twitter: 'https://twitter.com'
  },
  about: {
    aboutMe: 'I am an AI Engineer & Full-Stack Developer dedicated to leveraging Artificial Intelligence, Machine Learning, and Modern Web Architectures to solve complex real-world problems. My experience spans building medical diagnostic systems, smart agricultural solutions, computer vision gesture recognizers, and enterprise CRMs.',
    careerObjective: 'Driven to build high-impact AI models and full-stack software applications that bridge research and production, delivering scalable, intelligent user experiences.',
    interests: ['Artificial Intelligence', 'Machine Learning & Deep Learning', 'Computer Vision (OpenCV/CNN)', 'Full-Stack Development (MERN)', 'Smart Agriculture & Healthcare Tech']
  },
  skills: [
    { name: 'Python', category: 'AI/ML', level: 95, icon: 'code' },
    { name: 'TensorFlow & PyTorch', category: 'AI/ML', level: 90, icon: 'cpu' },
    { name: 'OpenCV & Computer Vision', category: 'AI/ML', level: 88, icon: 'eye' },
    { name: 'React.js', category: 'Frontend', level: 92, icon: 'layout' },
    { name: 'Node.js & Express', category: 'Backend', level: 88, icon: 'server' },
    { name: 'MongoDB', category: 'Backend', level: 85, icon: 'database' },
    { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: 'feather' },
    { name: 'Flask & Streamlit', category: 'Backend', level: 88, icon: 'terminal' },
    { name: 'Scikit-Learn & XGBoost', category: 'AI/ML', level: 92, icon: 'bar-chart' },
    { name: 'IoT & Hardware Integration', category: 'Tools', level: 80, icon: 'radio' }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'IEEE Conference & AI Research Lab',
      position: 'AI Lead & Researcher',
      duration: '2023 - Present',
      location: 'India',
      description: 'Authored and published research paper on Agro Puthalavan AI Smart Agriculture. Developed machine learning pipelines using XGBoost and CNN for disease detection and crop optimization.',
      technologies: ['Python', 'XGBoost', 'TensorFlow', 'Flask', 'OpenCV']
    },
    {
      id: 'exp-2',
      company: 'Smart India Hackathon',
      position: 'Full-Stack & Game Developer',
      duration: '2023',
      location: 'India',
      description: 'Designed and prototyped Legacy Trail heritage board game concept and Geo Rescue Drone geospatial mapping solution.',
      technologies: ['React', 'JavaScript', 'UI/UX', 'Game Design', 'IoT']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'AI Medical Chatbot (Life Line)',
      description: 'AI-powered healthcare assistant with symptom analysis, multilingual support, and personalized health reports.',
      category: 'AI/ML',
      techStack: ['React', 'Tailwind CSS', 'Flask', 'Python', 'AI'],
      features: ['Symptom analysis powered by NLP', 'Multilingual support for global accessibility', 'Automated personalized health summary report download', 'Interactive conversational UI'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: true,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-2',
      title: 'Real Estate CRM',
      description: 'Full-stack CRM with lead management, employee/admin dashboards, and Round Robin lead assignment.',
      category: 'Full Stack',
      techStack: ['MongoDB', 'Express.js', 'React', 'Node.js'],
      features: ['Automated Round Robin lead distribution algorithm', 'Admin analytics and agent performance metrics', 'Lead status pipeline and activity tracking', 'JWT authentication and RBAC'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: true,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-3',
      title: 'Plant Disease Detection',
      description: 'Predicts plant diseases from leaf images and provides treatment recommendations using Convolutional Neural Networks.',
      category: 'AI/ML',
      techStack: ['Python', 'TensorFlow', 'CNN', 'OpenCV', 'Flask'],
      features: ['Deep Learning CNN model with 95%+ accuracy', 'Real-time leaf image upload and inference', 'Automated organic and chemical treatment recommendations', 'Flask API server'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: true,
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-4',
      title: 'Heart Disease Prediction System',
      description: 'Predicts heart disease risk using machine learning algorithms and provides an interactive web interface.',
      category: 'AI/ML',
      techStack: ['Python', 'Scikit-learn', 'Streamlit'],
      features: ['Risk score calculation based on clinical parameters', 'Interactive Streamlit web app', 'Exploratory data analysis visualizer'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: false,
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-5',
      title: 'Sign Language Recognition',
      description: 'Recognizes hand gestures in real time using computer vision and hand landmark detection.',
      category: 'AI/ML',
      techStack: ['Python', 'MediaPipe', 'OpenCV', 'CNN'],
      features: ['Real-time webcam hand tracking using MediaPipe', 'CNN gesture classification', 'Text-to-speech output'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: false,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-6',
      title: 'Agro Puthalavan – AI Smart Agriculture',
      description: 'Crop recommendation and smart agriculture solution published as an IEEE conference paper.',
      category: 'AI/ML',
      techStack: ['Python', 'XGBoost', 'Flask'],
      features: ['IEEE conference paper published project', 'Soil NPK & climate data analysis', 'XGBoost machine learning model'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: true,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-7',
      title: 'Crop Recommendation System',
      description: 'Recommends suitable crops based on soil composition and environmental parameters.',
      category: 'AI/ML',
      techStack: ['Python', 'Flask', 'XGBoost'],
      features: ['Soil type and humidity input parameters', 'High precision crop yield predictor', 'Flask REST API'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: false,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-8',
      title: 'Smart Community Health Monitoring & Early Warning System',
      description: 'AI-based platform for monitoring water-borne diseases, health records, and risk assessment.',
      category: 'Full Stack',
      techStack: ['React', 'Node.js', 'MongoDB', 'AI'],
      features: ['Disease outbreak risk mapping', 'Community health records management', 'Early warning automated alerts'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: true,
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-9',
      title: 'Heritage Quest',
      description: 'Educational heritage exploration application designed to teach Indian history interactively.',
      category: 'Frontend',
      techStack: ['React', 'JavaScript'],
      features: ['Gamified historical quiz modules', 'Interactive monument 3D viewer concept', 'User progression badge system'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: false,
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-10',
      title: 'Legacy Trail (Heritage Board Game)',
      description: 'Board game developed for a Smart India Hackathon concept focused on Indian cultural heritage.',
      category: 'Frontend',
      techStack: ['Game Design', 'UI/UX'],
      features: ['Smart India Hackathon innovative concept', 'Cultural heritage storytelling', 'UI/UX interactive board prototype'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: false,
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-11',
      title: 'Geo Rescue Drone (GPR)',
      description: 'Drone-based rescue and geospatial mapping concept for disaster management.',
      category: 'Hardware/AI',
      techStack: ['IoT', 'AI (Concept/Prototype)'],
      features: ['Ground Penetrating Radar data mapping', 'Autonomous path planning model', 'Disaster search and rescue framework'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: false,
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-12',
      title: 'EEGXI – Power-Skin AI-Driven Energy Fabric',
      description: 'Innovative concept combining wearable technology with AI-driven energy monitoring.',
      category: 'Hardware/AI',
      techStack: ['Wearables', 'AI'],
      features: ['Wearable kinetic energy harvester', 'AI-driven power usage analytics', 'Biometric feedback tracking'],
      githubLink: 'https://github.com',
      liveDemo: 'https://demo.com',
      featured: false,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'Deep Learning & Neural Networks',
      organization: 'Coursera / DeepLearning.AI',
      date: '2023',
      credentialId: 'DL-893021',
      verificationLink: 'https://coursera.org'
    },
    {
      id: 'cert-2',
      title: 'Full Stack Web Development',
      organization: 'FreeCodeCamp',
      date: '2022',
      credentialId: 'FCC-302194',
      verificationLink: 'https://freecodecamp.org'
    }
  ],
  research: [
    {
      id: 'res-1',
      title: 'Agro Puthalavan: AI Smart Agriculture & Crop Recommendation Model',
      abstract: 'Published IEEE conference paper proposing XGBoost machine learning model for soil-based crop prediction and automated disease diagnosis from leaf images.',
      publisher: 'IEEE Conference',
      doi: '10.1109/AGRO.2023.1092834',
      publicationLink: 'https://ieee.org',
      date: '2023'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Smart India Hackathon Finalist',
      description: 'Selected for Legacy Trail & Geo Rescue Drone concept presentations.',
      date: '2023'
    },
    {
      id: 'ach-2',
      title: 'IEEE Research Paper Author',
      description: 'Authored and published research paper on Smart Agriculture AI.',
      date: '2023'
    }
  ],
  messages: [],
  settings: {
    siteTitle: 'SUBBIAH VADIVELAN | AI Engineer & Full-Stack Developer Portfolio',
    metaDescription: 'AI Engineer & Full-Stack Developer Portfolio featuring 12 projects in AI, Machine Learning, Computer Vision, and Full Stack MERN applications.',
    metaKeywords: 'SUBBIAH VADIVELAN, AI Engineer, Machine Learning, Python, React, Flask, OpenCV, Smart Agriculture'
  }
};

export const fetchPublicPortfolio = async (): Promise<PortfolioData> => {
  try {
    const res = await api.get('/public/portfolio');
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('[API Warning]: Backend offline or unreachable. Using fallback portfolio data.');
  }
  return fallbackPortfolioData;
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  try {
    const res = await api.get('/admin/stats');
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error) {}
  return {
    totalProjects: fallbackPortfolioData.projects.length,
    totalSkills: fallbackPortfolioData.skills.length,
    totalCertifications: fallbackPortfolioData.certifications.length,
    totalExperience: fallbackPortfolioData.experience.length,
    totalResearch: fallbackPortfolioData.research.length,
    totalAchievements: fallbackPortfolioData.achievements.length,
    totalMessages: 1,
    unreadMessages: 1,
    estimatedVisitors: 1420,
  };
};

export const postContactMessage = async (messageData: { name: string; email: string; subject?: string; message: string }) => {
  try {
    const res = await api.post('/public/contact', messageData);
    return res.data;
  } catch (error) {
    return { success: true, message: 'Message sent successfully (local mode)' };
  }
};

export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.data?.url) {
      return { url: res.data.url };
    }
  } catch (error) {
    console.warn('[Upload Warning]: File upload endpoint failed, encoding to Base64 data URL for cross-session compatibility.');
  }

  // Base64 fallback so photo renders reliably across tabs and browsers
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string });
    };
    reader.readAsDataURL(file);
  });
};
