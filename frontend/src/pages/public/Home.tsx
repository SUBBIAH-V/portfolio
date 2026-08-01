import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Mail, Phone, MapPin, Download, ExternalLink, 
  Code, Award, BookOpen, Trophy, Sparkles, Send, CheckCircle2, 
  Terminal, ArrowRight, Layers, FileText, Globe, ArrowUp
} from 'lucide-react';
import { fetchPublicPortfolio, postContactMessage } from '../../services/api';
import { PortfolioData, Project, Skill } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { SectionSkeleton } from '../../components/Skeleton';
import { CustomCursor } from '../../components/CustomCursor';

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

    // 1. Re-fetch when user switches back to this tab
    window.addEventListener('focus', loadData);

    // 2. Storage event listener for cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio_last_updated') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. BroadcastChannel listener for instant live update
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
      <div className="min-h-screen bg-slate-950 px-6 py-24">
        <SectionSkeleton />
      </div>
    );
  }

  const { profile, about, skills, experience, projects, certifications, research, achievements } = data;

  const projectCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const skillCategories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];
  const filteredSkills = skillCategory === 'All'
    ? skills
    : skills.filter(s => s.category === skillCategory);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
      {/* Interactive Dot Cursor */}
      <CustomCursor />

      {/* Ambient Animated Background Grids */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      <Navbar resumeUrl={profile.resumeUrl} name={profile.name} />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-blue-500/30 text-blue-400 text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Available for Senior Engineering Roles & Consulting</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
              Hi, I'm <span className="gradient-text">{profile.name}</span>
            </h1>

            <p className="text-xl font-semibold text-slate-300">
              {profile.headline}
            </p>

            <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
              {profile.bio}
            </p>

            {/* Quick Tech Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['TypeScript', 'React.js', 'Node.js', 'System Architecture', 'AWS & Cloud', 'MongoDB'].map((tech) => (
                <motion.span 
                  key={tech} 
                  whileHover={{ scale: 1.08, borderColor: '#3b82f6' }}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 transition-colors"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="#projects"
                className="flex items-center space-x-2 px-7 py-3.5 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow transition-all"
              >
                <span>View Featured Work</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-7 py-3.5 text-sm font-bold rounded-xl glass-panel border border-slate-700 text-slate-200 hover:bg-slate-800/80 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </motion.a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 pt-4 text-slate-400">
              {profile.github && (
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href={profile.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-all">
                  <Github className="w-5 h-5" />
                </motion.a>
              )}
              {profile.linkedin && (
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href={profile.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-all">
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              )}
              {profile.leetcode && (
                <motion.a whileHover={{ scale: 1.1, y: -2 }} href={profile.leetcode} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition-all" title="LeetCode">
                  <Globe className="w-5 h-5" />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Right Hero Image Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-40 group-hover:opacity-75 blur-xl transition-all duration-500"></div>
              <div className="relative glass-panel p-4 rounded-3xl border border-slate-800 shadow-2xl">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-[400px] object-cover rounded-2xl border border-slate-800 shadow-lg group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-slate-300 font-medium">{profile.location}</span>
                  </div>
                  <span className="text-slate-400 font-mono">Senior Engineer</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT & OBJECTIVE SECTION */}
      <section id="about" className="py-24 border-t border-slate-900 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">About & Core Focus</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Architecting Software Excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* About Me Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 interactive-hover"
            >
              <div className="flex items-center space-x-3 text-blue-400">
                <Terminal className="w-6 h-6" />
                <h3 className="text-xl font-bold text-white">About Me</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">
                {about.aboutMe}
              </p>
              {about.interests && about.interests.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Focus & Passions</h4>
                  <div className="flex flex-wrap gap-2">
                    {about.interests.map((interest, i) => (
                      <span key={i} className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Career Objective Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 interactive-hover"
            >
              <div className="flex items-center space-x-3 text-indigo-400">
                <Layers className="w-6 h-6" />
                <h3 className="text-xl font-bold text-white">Career Objective</h3>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">
                {about.careerObjective}
              </p>
              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-2xl font-extrabold text-white">6+</span>
                  <p className="text-xs text-slate-400 mt-1">Years Experience</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-2xl font-extrabold text-blue-400">20+</span>
                  <p className="text-xs text-slate-400 mt-1">Shipped Projects</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED & ALL PROJECTS SECTION */}
      <section id="projects" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Portfolio Showcase</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Featured Projects</h3>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 glass-panel p-1.5 rounded-xl border border-slate-800">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
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
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveProject(project)}
              className="glass-panel rounded-3xl overflow-hidden border border-slate-800 flex flex-col group interactive-hover cursor-pointer"
            >
              {project.image && (
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {project.featured && (
                    <span className="absolute top-3 left-3 px-3 py-1 text-[11px] font-bold rounded-full bg-blue-600 text-white shadow-lg">
                      Featured
                    </span>
                  )}
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mt-1">
                    {project.title}
                  </h4>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack?.map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-[11px] rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action links */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setActiveProject(project)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-3">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="GitHub Code">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveDemo && (
                      <a href={project.liveDemo} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="Live Demo">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SKILLS MATRIX SECTION */}
      <section id="skills" className="py-24 border-t border-slate-900 bg-slate-950/70 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Technical Proficiency</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Skills & Competencies</h3>
            </div>

            {/* Skill Category Filter */}
            <div className="flex flex-wrap gap-2 glass-panel p-1.5 rounded-xl border border-slate-800">
              {skillCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSkillCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    skillCategory === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredSkills.map((skill: Skill) => (
              <motion.div 
                key={skill.id || skill._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 interactive-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{skill.name}</span>
                  <span className="text-xs font-mono text-blue-400 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full"
                  ></motion.div>
                </div>
                <span className="inline-block text-[10px] font-semibold uppercase text-slate-500 tracking-wider">
                  {skill.category}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EXPERIENCE TIMELINE SECTION */}
      <section id="experience" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Career Journey</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Work Experience</h3>
        </motion.div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:-translate-x-px before:w-0.5 before:bg-slate-800">
          {experience.map((exp, idx) => (
            <motion.div 
              key={exp.id || exp._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${
                idx % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-glow shrink-0 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Code className="w-5 h-5" />
              </div>

              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 interactive-hover">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-lg font-bold text-white">{exp.position}</h4>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-300">{exp.company} — <span className="text-slate-400 font-normal">{exp.location}</span></p>
                <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies?.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 text-[10px] rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS & RESEARCH SECTION */}
      <section id="certifications" className="py-24 border-t border-slate-900 bg-slate-950/70 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Certifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center space-x-3 mb-8">
              <Award className="w-6 h-6 text-amber-400" />
              <h3 className="text-2xl font-extrabold text-white">Certifications & Licenses</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <motion.div key={cert.id || cert._id} whileHover={{ scale: 1.02 }} className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-start space-x-4 interactive-hover">
                  {cert.image && (
                    <img src={cert.image} alt={cert.title} className="w-16 h-16 object-cover rounded-xl border border-slate-800 shrink-0" />
                  )}
                  <div className="space-y-2 flex-1">
                    <h4 className="text-base font-bold text-white">{cert.title}</h4>
                    <p className="text-xs text-slate-400">{cert.organization} • <span className="text-slate-300">{cert.date}</span></p>
                    {cert.credentialId && (
                      <p className="text-[11px] font-mono text-slate-500">ID: {cert.credentialId}</p>
                    )}
                    {cert.verificationLink && (
                      <a href={cert.verificationLink} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:underline pt-1">
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Research Publications */}
          <motion.div id="research" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center space-x-3 mb-8">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <h3 className="text-2xl font-extrabold text-white">Research & Publications</h3>
            </div>
            <div className="space-y-6">
              {research.map((pub) => (
                <motion.div key={pub.id || pub._id} whileHover={{ y: -4 }} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 interactive-hover">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-bold text-white">{pub.title}</h4>
                    {pub.date && <span className="text-xs text-slate-400">{pub.date}</span>}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{pub.abstract}</p>
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Published in: <strong className="text-slate-200">{pub.publisher}</strong></span>
                    {pub.doi && <span className="font-mono">DOI: {pub.doi}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Let's Build Something Extraordinary</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Have a technical project, architectural question, or senior career opportunity? Feel free to drop me a message.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4 glass-panel p-4 rounded-2xl border border-slate-800">
                <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Direct Email</p>
                  <a href={`mailto:${profile.email}`} className="text-sm font-bold text-white hover:text-blue-400">
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 glass-panel p-4 rounded-2xl border border-slate-800">
                <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-sm font-bold text-white">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 glass-panel p-4 rounded-2xl border border-slate-800">
                <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="text-sm font-bold text-white">{profile.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-slate-800">
            {msgSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{msgSuccess}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Project Collaboration / Leadership Inquiry"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submittingMsg}
                className="w-full py-4 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow hover:opacity-95 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{submittingMsg ? 'Sending...' : 'Send Message'}</span>
              </motion.button>
            </form>
          </motion.div>
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
            className="fixed bottom-6 right-6 p-3.5 rounded-2xl bg-blue-600 text-white shadow-glow hover:bg-blue-500 z-50 transition-colors border border-blue-400/40"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* PROJECT DETAILS MODAL */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6">
            {activeProject.image && (
              <img src={activeProject.image} alt={activeProject.title} className="w-full h-64 object-cover rounded-2xl border border-slate-800" />
            )}
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{activeProject.category}</span>
              <h3 className="text-2xl font-extrabold text-white mt-1">{activeProject.title}</h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">{activeProject.description}</p>
            </div>

            {activeProject.features && activeProject.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Features</h4>
                <ul className="space-y-1">
                  {activeProject.features.map((feat, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              {activeProject.techStack?.map((t, i) => (
                <span key={i} className="px-3 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                onClick={() => setActiveProject(null)}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
              >
                Close
              </button>
              {activeProject.liveDemo && (
                <a
                  href={activeProject.liveDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-glow"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer profile={profile} />
    </div>
  );
};
