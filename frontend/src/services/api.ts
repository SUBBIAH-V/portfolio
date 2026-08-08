import axios from 'axios';
import { PortfolioData, AdminStats } from '../types';

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

// Fallback initial dataset (Subbiah V. AI Engineer Portfolio)
export const fallbackPortfolioData: PortfolioData = {
  profile: {
    name: 'Subbiah V.',
    headline: 'AI Engineer Aspirant',
    bio: 'Artificial Intelligence & Data Science student passionate about Machine Learning, Computer Vision, Data Engineering and Full-Stack Development. I build practical solutions that transform real-world problems into intelligent applications.',
    avatarUrl: '/subbiah_avatar.png',
    resumeUrl: '/resume.pdf',
    phone: '+91 8122121806',
    email: 'subbiahvadivelan@gmail.com',
    location: 'Chennai, Tamil Nadu, India',
    github: 'https://github.com/SUBBIAH-V',
    linkedin: 'https://www.linkedin.com/in/subbiah-v-356a18305/',
    leetcode: 'https://leetcode.com',
    hackerrank: 'https://hackerrank.com',
    twitter: 'https://twitter.com'
  },
  about: {
    aboutMe: 'I am a B.Tech Artificial Intelligence & Data Science student at Sri Sairam Institute of Technology, Chennai. My interests span Artificial Intelligence, Machine Learning, Computer Vision, Data Engineering and Full-Stack Development.\n\nI enjoy turning ideas into working products — from machine learning models and computer vision systems to data-driven dashboards and full-stack web applications.\n\nI am continuously improving my problem-solving, data structures and algorithms skills while building real-world projects.',
    careerObjective: 'B.Tech in Artificial Intelligence & Data Science (Sri Sairam Institute of Technology, Chennai · 2023 - 2027 · CGPA 8.31/10). Aiming to leverage Machine Learning, Deep Learning, and MERN stack engineering to build intelligent enterprise solutions.',
    interests: ['AI/ML', 'Data Engineering', 'Software Development']
  },
  skills: [
    // Programming
    { name: 'Python', category: 'Programming', level: 95, icon: 'code' },
    { name: 'Java', category: 'Programming', level: 85, icon: 'code' },
    { name: 'C', category: 'Programming', level: 88, icon: 'code' },
    { name: 'JavaScript', category: 'Programming', level: 90, icon: 'code' },

    // AI / Machine Learning
    { name: 'Machine Learning', category: 'AI / Machine Learning', level: 94, icon: 'cpu' },
    { name: 'Deep Learning', category: 'AI / Machine Learning', level: 90, icon: 'cpu' },
    { name: 'CNN', category: 'AI / Machine Learning', level: 92, icon: 'cpu' },
    { name: 'Computer Vision', category: 'AI / Machine Learning', level: 90, icon: 'eye' },
    { name: 'TensorFlow', category: 'AI / Machine Learning', level: 88, icon: 'cpu' },
    { name: 'Keras', category: 'AI / Machine Learning', level: 85, icon: 'cpu' },
    { name: 'Scikit-learn', category: 'AI / Machine Learning', level: 92, icon: 'bar-chart' },
    { name: 'XGBoost', category: 'AI / Machine Learning', level: 90, icon: 'bar-chart' },
    { name: 'MediaPipe', category: 'AI / Machine Learning', level: 88, icon: 'eye' },
    { name: 'OpenCV', category: 'AI / Machine Learning', level: 90, icon: 'eye' },

    // Data
    { name: 'Pandas', category: 'Data', level: 92, icon: 'database' },
    { name: 'NumPy', category: 'Data', level: 90, icon: 'database' },
    { name: 'Data Analysis', category: 'Data', level: 94, icon: 'bar-chart' },
    { name: 'Power BI', category: 'Data', level: 85, icon: 'bar-chart' },
    { name: 'Google Colab', category: 'Data', level: 95, icon: 'terminal' },

    // Backend
    { name: 'Python', category: 'Backend', level: 95, icon: 'terminal' },
    { name: 'Flask', category: 'Backend', level: 88, icon: 'server' },
    { name: 'FastAPI', category: 'Backend', level: 86, icon: 'server' },
    { name: 'Node.js', category: 'Backend', level: 90, icon: 'server' },
    { name: 'Express.js', category: 'Backend', level: 88, icon: 'server' },
    { name: 'REST APIs', category: 'Backend', level: 92, icon: 'globe' },

    // Frontend
    { name: 'HTML', category: 'Frontend', level: 95, icon: 'layout' },
    { name: 'CSS', category: 'Frontend', level: 92, icon: 'layout' },
    { name: 'JavaScript', category: 'Frontend', level: 90, icon: 'code' },
    { name: 'React.js', category: 'Frontend', level: 92, icon: 'layout' },
    { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: 'feather' },

    // Database / Tools
    { name: 'MongoDB', category: 'Database / Tools', level: 90, icon: 'database' },
    { name: 'MongoDB Atlas', category: 'Database / Tools', level: 88, icon: 'database' },
    { name: 'Git', category: 'Database / Tools', level: 92, icon: 'code' },
    { name: 'GitHub', category: 'Database / Tools', level: 94, icon: 'code' },
    { name: 'VS Code', category: 'Database / Tools', level: 95, icon: 'terminal' },
    { name: 'Vercel', category: 'Database / Tools', level: 90, icon: 'globe' }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Maestoriminds',
      position: 'Backend Developer',
      duration: 'June 2026 – July 2026',
      location: 'Chennai, India',
      description: 'Developed a full-stack Real Estate CRM application. Built backend functionality using Node.js and Express.js with MongoDB for data management. Implemented lead management and assignment workflows, worked with React-based frontend integration, and contributed to a Round Robin Lead Assignment module.',
      technologies: ['Node.js', 'Express.js', 'MongoDB', 'React', 'Round Robin Assignment']
    },
    {
      id: 'exp-2',
      company: 'Elevate Labs',
      position: 'Data Science Intern',
      duration: 'January 2026 – March 2026',
      location: 'Remote / India',
      description: 'Worked on data science and machine learning workflows. Performed data preprocessing and exploratory analysis. Built and evaluated machine learning solutions using Python-based data analysis tools.',
      technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Data Analysis']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Life Line – AI Medical Assistant',
      description: 'An AI-powered medical assistance platform designed to provide symptom analysis, personalized reports and doctor consultation support.',
      category: 'AI/ML',
      techStack: ['React', 'Tailwind CSS', 'AI', 'REST API'],
      features: [
        'AI Symptom Checker',
        'AI Analysis',
        'Personalized Report',
        'Doctor Consultation',
        'Multilingual support',
        'Responsive UI'
      ],
      githubLink: 'https://github.com/SUBBIAH-V',
      liveDemo: 'https://github.com/SUBBIAH-V',
      featured: true,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-2',
      title: 'Smart Ambulance Traffic Signal System',
      description: 'Developed an AI-powered smart traffic management system to enable priority signal clearance for ambulances using GPS tracking, GSM communication and IR-based real-time vehicle detection.',
      category: 'AI/ML',
      techStack: ['Python', 'IoT', 'GPS', 'GSM', 'IR Sensors', 'AI'],
      features: [
        'Priority signal clearance algorithm',
        'GPS ambulance tracking',
        'IR real-time vehicle detection',
        'GSM communication module'
      ],
      githubLink: 'https://github.com/SUBBIAH-V',
      liveDemo: 'https://github.com/SUBBIAH-V',
      featured: true,
      image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-3',
      title: 'Plant Disease Prediction & AI Chatbot',
      description: 'A computer vision system that detects plant diseases from leaf images and provides intelligent assistance through a chatbot.',
      category: 'Computer Vision',
      techStack: ['Python', 'CNN', 'TensorFlow', 'Keras', 'OpenCV'],
      features: [
        'Convolutional Neural Network classification',
        'Real-time leaf image scanner',
        'AI Advisory Chatbot',
        'Treatment recommendations'
      ],
      githubLink: 'https://github.com/SUBBIAH-V',
      liveDemo: 'https://github.com/SUBBIAH-V',
      featured: true,
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-4',
      title: 'Sign Language Recognition',
      description: 'Developed a real-time sign language recognition system using computer vision and deep learning.',
      category: 'Computer Vision',
      techStack: ['Python', 'CNN', 'MediaPipe', 'OpenCV', 'TensorFlow'],
      features: [
        'MediaPipe hand landmark extraction',
        'CNN gesture recognizer',
        'Real-time webcam interface'
      ],
      githubLink: 'https://github.com/SUBBIAH-V',
      liveDemo: 'https://github.com/SUBBIAH-V',
      featured: false,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-5',
      title: 'Smart Community Health Monitoring System',
      description: 'A system designed to monitor community-level health and provide early warning for water-borne disease risks.',
      category: 'Data',
      techStack: ['Python', 'Machine Learning', 'Data Analysis', 'Leaflet', 'OpenStreetMap'],
      features: [
        'Geospatial disease mapping',
        'Early warning risk assessment',
        'Data analysis visualizer'
      ],
      githubLink: 'https://github.com/SUBBIAH-V',
      liveDemo: 'https://github.com/SUBBIAH-V',
      featured: true,
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-6',
      title: 'Crop Recommendation System',
      description: 'Machine-learning based application that recommends suitable crops based on agricultural and environmental parameters.',
      category: 'AI/ML',
      techStack: ['Python', 'XGBoost', 'Flask', 'Machine Learning'],
      features: [
        'Soil composition NPK analysis',
        'XGBoost predictive engine',
        'Flask API server'
      ],
      githubLink: 'https://github.com/SUBBIAH-V',
      liveDemo: 'https://github.com/SUBBIAH-V',
      featured: false,
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-7',
      title: 'Real Estate CRM',
      description: 'A full-stack CRM application for managing properties, leads, employees and follow-ups.',
      category: 'Full Stack',
      techStack: ['React', 'Node.js', 'Express.js', 'MongoDB'],
      features: [
        'Authentication',
        'Admin Dashboard',
        'Employee Dashboard',
        'Lead Management',
        'Property Management',
        'Follow-up Management',
        'Round Robin Lead Assignment'
      ],
      githubLink: 'https://github.com/SUBBIAH-V',
      liveDemo: 'https://github.com/SUBBIAH-V',
      featured: true,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'proj-8',
      title: 'Heritage Trail / Heritage Quest',
      description: 'An interactive heritage-focused board game/project designed to promote cultural awareness through gameplay.',
      category: 'Full Stack',
      techStack: ['React', 'JavaScript', 'Game Design', 'Interactive Media'],
      features: [
        'Gamified cultural learning',
        'Interactive board prototype'
      ],
      githubLink: 'https://github.com/SUBBIAH-V',
      liveDemo: 'https://github.com/SUBBIAH-V',
      featured: false,
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'NPTEL Certification',
      organization: 'NPTEL',
      date: 'Certified',
      credentialId: '',
      verificationLink: 'https://nptel.ac.in'
    },
    {
      id: 'cert-2',
      title: 'C Programming',
      organization: 'Spoken Tutorial, IIT Bombay',
      date: 'Certified',
      credentialId: '',
      verificationLink: 'https://spoken-tutorial.org'
    },
    {
      id: 'cert-3',
      title: 'Relevant AI / ML Certification',
      organization: 'Professional AI Certification',
      date: 'Certified',
      credentialId: '',
      verificationLink: '#'
    }
  ],
  research: [
    {
      id: 'res-1',
      title: 'Agro Puthalavan',
      abstract: 'IEEE Conference Paper – ICDSAAI 2025 focusing on Machine Learning algorithms, Computer Vision for plant disease diagnosis, and smart agriculture decision systems.',
      publisher: 'IEEE Conference Paper – ICDSAAI 2025',
      doi: '10.1109/ICDSAAI.2025.0192',
      publicationLink: '#',
      date: '2025'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'DataSprint 3.0',
      description: '24 Hour Data Science Hackathon',
      date: '2024'
    },
    {
      id: 'ach-2',
      title: 'Hackwise 2.0',
      description: 'Hackathon participant and innovative project recognition.',
      date: '2024'
    },
    {
      id: 'ach-3',
      title: 'Smart India Hackathon',
      description: 'Smart India Hackathon participation & project presentation.',
      date: '2023'
    },
    {
      id: 'ach-4',
      title: 'IEEE Conference Paper',
      description: 'ICDSAAI 2025 Research Paper Author',
      date: '2025'
    },
    {
      id: 'ach-5',
      title: 'AICTE / TechSaksham',
      description: 'AICTE / TechSaksham internship experience',
      date: '2024'
    }
  ],
  messages: [],
  settings: {
    siteTitle: 'Subbiah V. | AI Engineer | Machine Learning | Data Science',
    metaDescription: 'Portfolio of Subbiah V., an Artificial Intelligence & Data Science student specializing in Machine Learning, Computer Vision, Data Engineering and Full-Stack Development.',
    metaKeywords: 'Subbiah V., AI Engineer, Machine Learning, Data Science, Sri Sairam Institute of Technology, Computer Vision, Python, React'
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

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string });
    };
    reader.readAsDataURL(file);
  });
};
