import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Mail, Phone, MapPin, Download, ExternalLink, 
  Code, Award, BookOpen, Trophy, Sparkles, Send, CheckCircle2, 
  Terminal, ArrowRight, Layers, FileText, Globe, ArrowUp, Binary, Cpu, Database, Layout, Eye, Server
} from 'lucide-react';
import { fetchPublicPortfolio, postContactMessage } from '../../services/api';
import { PortfolioData, Project, Skill } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SectionSkeleton } from '../../components/Skeleton';
import { CustomCursor } from '../../components/CustomCursor';
import { NeuralNetworkCanvas } from '../../components/NeuralNetworkCanvas';

export const Home: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [skillCategory, setSkillCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submittingMsg, setSubmittingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState('');

  useEffect(() => {
    const loadData = () => {
      fetchPublicPortfolio().then((res) => {
        setData(res);
        setLoading(false);
      });
    };

    loadData();

    window.addEventListener('focus', loadData);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio_last_updated') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    let bc: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel('portfolio_updates');
      bc.onmessage = (event) => {
        if (event.data === 'updated') {
          loadData();
        }
      };
    }

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('focus', loadData);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
      if (bc) bc.close();
    };
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setSubmittingMsg(true);
    const res = await postContactMessage(contactForm);
    setSubmittingMsg(false);
    if (res.success) {
      setMsgSuccess('Thank you! Your message has been sent successfully.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setMsgSuccess(''), 6000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#070a12] px-6 py-24">
        <SectionSkeleton />
      </div>
    );
  }

  const { profile, about, skills, experience, projects, certifications, research, achievements } = data;

  const projectCategories = ['All', 'AI/ML', 'Computer Vision', 'Full Stack', 'Data'];
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const skillCategories = ['All', 'Programming', 'AI / Machine Learning', 'Data', 'Backend', 'Frontend', 'Database / Tools'];
  const filteredSkills = skillCategory === 'All'
    ? skills
    : skills.filter(s => s.category === skillCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const dsaTopics = [
    'Arrays', 'Strings', 'Hashing', 'Stack', 'Queue', 
    'Linked List', 'Binary Search', 'Trees', 'Graphs', 'Dynamic Programming'
  ];

  return (
    <div id="home" className="min-h-screen bg-[#070a12] text-slate-100 overflow-x-hidden relative font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Interactive Dot Cursor */}
      <CustomCursor />

      {/* Futuristic Cyber Ambient Grid Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      <Navbar resumeUrl={profile.resumeUrl} name={profile.name} />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/12 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-600/12 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Availability Pill */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-glow cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Available for AI / ML / Data Engineering Opportunities</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Building Intelligent Solutions with <span className="gradient-text neon-text-cyan">AI & Data</span>
            </h1>

            <p className="text-xl font-bold font-mono text-cyan-400">
              {profile.headline}
            </p>

            <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
              Artificial Intelligence & Data Science student passionate about Machine Learning, Computer Vision, Data Engineering and Full-Stack Development. I build practical solutions that transform real-world problems into intelligent applications.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="#projects"
                className="flex items-center space-x-2 px-7 py-3.5 text-sm font-bold rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-glow hover:shadow-cyan-500/25 transition-all"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-7 py-3.5 text-sm font-bold rounded-2xl glass-panel border border-slate-700 text-slate-200 hover:bg-slate-800/80 hover:border-slate-500 transition-all"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Resume</span>
              </motion.a>

              <a
                href="#contact"
                className="px-5 py-3.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Contact Me
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-4 text-slate-400">
              {profile.github && (
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href={profile.github} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-all" title="GitHub">
                  <Github className="w-5 h-5" />
                </motion.a>
              )}
              {profile.linkedin && (
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href={profile.linkedin} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-all" title="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              )}
              {profile.email && (
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href={`mailto:${profile.email}`} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/50 transition-all" title="Email">
                  <Mail className="w-5 h-5" />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Right Hero Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 h-[420px] flex items-center justify-center"
          >
            <NeuralNetworkCanvas />
          </motion.div>
        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="py-24 border-t border-slate-900/80 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-3 mb-16"
          >
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">WHO I AM</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">About Me</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Bio Paragraphs */}
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6"
            >
              <p className="text-slate-300 leading-relaxed text-base">
                I am a B.Tech Artificial Intelligence & Data Science student at Sri Sairam Institute of Technology, Chennai. My interests span Artificial Intelligence, Machine Learning, Computer Vision, Data Engineering and Full-Stack Development.
              </p>

              <p className="text-slate-300 leading-relaxed text-base">
                I enjoy turning ideas into working products — from machine learning models and computer vision systems to data-driven dashboards and full-stack web applications.
              </p>

              <p className="text-slate-300 leading-relaxed text-base">
                I am continuously improving my problem-solving, data structures and algorithms skills while building real-world projects.
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center hover:border-cyan-500/40 transition-colors shadow-lg">
                  <span className="text-3xl font-extrabold text-cyan-400">8.31</span>
                  <span className="block text-xs font-semibold text-slate-400 mt-1">CGPA</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center hover:border-blue-500/40 transition-colors shadow-lg">
                  <span className="text-3xl font-extrabold text-white">2027</span>
                  <span className="block text-xs font-semibold text-slate-400 mt-1">Graduation</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center hover:border-purple-500/40 transition-colors shadow-lg">
                  <span className="text-3xl font-extrabold text-purple-400">10+</span>
                  <span className="block text-xs font-semibold text-slate-400 mt-1">Projects</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center hover:border-emerald-500/40 transition-colors shadow-lg">
                  <span className="text-3xl font-extrabold text-emerald-400">3+</span>
                  <span className="block text-xs font-semibold text-slate-400 mt-1">Years Teaching Experience</span>
                </div>
              </div>
            </motion.div>

            {/* Profile Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 glass-card-premium p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                  SV
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white">{profile.name}</h3>
                  <p className="text-xs font-mono text-cyan-400">AI Engineer Aspirant · ML · Data Engineering · MERN</p>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800/80 text-sm">
                <div className="flex items-start space-x-3 text-slate-300">
                  <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">B.Tech – Artificial Intelligence & Data Science</strong>
                    <span className="text-xs text-slate-400">Sri Sairam Institute of Technology, Chennai · 2023 – 2027</span>
                    <span className="block text-xs font-semibold text-cyan-400 mt-0.5">CGPA 8.31 / 10</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <strong className="block text-white">Location</strong>
                    <span className="text-xs text-slate-400">{profile.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {['AI/ML', 'Data Engineering', 'Software Development'].map((tag) => (
                  <span key={tag} className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-cyan-300">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SKILLS MATRIX SECTION */}
      <section id="skills" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">WHAT I BRING</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Skills & Competencies</h2>
        </motion.div>

        {/* Skill Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {skillCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSkillCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                skillCategory === cat
                  ? 'bg-blue-600 text-white shadow-glow'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSkills.map((skill: Skill) => (
            <motion.div 
              key={skill.name}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 interactive-hover"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>{skill.name}</span>
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">{skill.level}%</span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 h-full rounded-full"
                ></motion.div>
              </div>

              <span className="inline-block text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                {skill.category}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* WORK EXPERIENCE TIMELINE */}
      <section id="experience" className="py-24 border-t border-slate-900/80 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-3"
          >
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">MY JOURNEY</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Work Experience</h2>
          </motion.div>

          <div className="space-y-8 relative max-w-4xl mx-auto before:absolute before:inset-0 before:left-6 md:before:left-1/2 before:-translate-x-px before:w-0.5 before:bg-slate-800">
            {experience.map((exp, idx) => (
              <motion.div 
                key={exp.id || exp._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${
                  idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-glow shrink-0 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <Code className="w-5 h-5" />
                </div>

                <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 interactive-hover">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{exp.position} – {exp.company}</h3>
                    <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.technologies?.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION */}
      <section id="projects" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">MY WORK</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Featured Projects</h2>
          </div>

          {/* Project Categories Filter */}
          <div className="flex flex-wrap gap-2 glass-panel p-1.5 rounded-2xl border border-slate-800">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id || project._id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="glass-card-premium rounded-3xl overflow-hidden flex flex-col group interactive-hover"
            >
              {project.image && (
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-cyan-500 text-slate-950 shadow-lg">
                    {project.category}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Features List */}
                {project.features && project.features.length > 0 && (
                  <div className="space-y-1">
                    {project.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack?.map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  {project.githubLink && (
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 flex items-center space-x-1.5 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {project.liveDemo && (
                    <a 
                      href={project.liveDemo} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow hover:bg-blue-500 flex items-center space-x-1.5 transition-all"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* RESEARCH & PUBLICATIONS SECTION */}
      <section id="research" className="py-24 border-t border-slate-900/80 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">ACADEMIC RESEARCH</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Research & Publications</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {research.map((pub) => (
              <motion.div key={pub.id || pub._id} whileHover={{ y: -3 }} className="glass-card-premium p-8 rounded-3xl space-y-4 interactive-hover">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-2xl font-extrabold text-white">{pub.title}</h3>
                  <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 w-fit">
                    {pub.publisher}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{pub.abstract}</p>

                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Conference: <strong>ICDSAAI 2025</strong></span>
                  </div>

                  <a 
                    href={pub.publicationLink || '#'} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center space-x-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow hover:opacity-95 transition-all"
                  >
                    <span>View Publication</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS SECTION */}
      <section id="certifications" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase font-mono">CREDENTIALS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Certifications</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <motion.div key={cert.id || cert._id} whileHover={{ scale: 1.02 }} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 interactive-hover flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">{cert.title}</h3>
                <p className="text-xs text-slate-400">{cert.organization}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400">{cert.date}</span>
                <a 
                  href={cert.verificationLink || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-1 font-semibold text-cyan-400 hover:underline"
                >
                  <span>View Certificate</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS SECTION */}
      <section id="achievements" className="py-24 border-t border-slate-900/80 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">HONORS & RECOGNITION</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Achievements</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((ach) => (
              <motion.div key={ach.id || ach._id} whileHover={{ y: -4 }} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 interactive-hover">
                <div className="flex items-center space-x-3 text-amber-400">
                  <Trophy className="w-5 h-5 shrink-0" />
                  <h3 className="text-lg font-bold text-white">{ach.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
                {ach.date && (
                  <span className="inline-block text-[11px] font-mono text-cyan-400 font-semibold pt-2">
                    {ach.date}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SOLVING & DSA MATRIX */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card-premium p-8 sm:p-10 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Binary className="w-6 h-6" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Problem Solving & DSA</h2>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                Alongside AI and application development, I continuously practice Data Structures and Algorithms to strengthen my problem-solving skills for technical interviews and software engineering roles.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <a href={profile.leetcode} target="_blank" rel="noreferrer" className="px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/50 transition-colors">
                LeetCode Profile
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow">
                GitHub Profile
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-4 border-t border-slate-800/80">
            {dsaTopics.map((topic) => (
              <span key={topic} className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 hover:border-cyan-500/40 transition-colors">
                {topic}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* RESUME DEDICATED CTA SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Want to know more about my journey?</h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            Download my resume to explore my education, experience, projects, technical skills and achievements.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-8 py-4 text-sm font-bold rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-glow hover:opacity-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-8 py-4 text-sm font-bold rounded-2xl glass-panel border border-slate-700 text-white hover:bg-slate-800 transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>View Resume</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 border-t border-slate-900/80 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">GET IN TOUCH</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Let's Build Something Intelligent</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Have an opportunity, project idea, or collaboration in mind? I'd love to hear from you.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4 glass-panel p-4 rounded-2xl border border-slate-800">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Location</span>
                    <strong className="text-sm text-white">Chennai, India</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-4 glass-panel p-4 rounded-2xl border border-slate-800">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Email</span>
                    <a href={`mailto:${profile.email}`} className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 glass-panel p-4 rounded-2xl border border-slate-800">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">LinkedIn</span>
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                      LinkedIn Profile
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 glass-panel p-4 rounded-2xl border border-slate-800">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">GitHub</span>
                    <a href={profile.github} target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                      GitHub Profile
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7 glass-card-premium p-8 rounded-3xl">
              {msgSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{msgSuccess}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="AI / Full-Stack Project Inquiry"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submittingMsg}
                  className="w-full py-4 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingMsg ? 'Sending...' : 'Send Message'}</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Back To Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3.5 rounded-2xl bg-cyan-500 text-slate-950 shadow-glow hover:bg-cyan-400 z-50 transition-colors border border-cyan-300/40 font-bold"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer profile={profile} />
    </div>
  );
};

export default Home;
