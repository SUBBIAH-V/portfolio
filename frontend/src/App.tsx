import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Home } from './pages/public/Home';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboardLayout } from './pages/admin/AdminDashboardLayout';
import { DashboardOverview } from './pages/admin/DashboardOverview';
import { ProfileEditor } from './pages/admin/ProfileEditor';
import { AboutEditor } from './pages/admin/AboutEditor';
import { SkillsManager } from './pages/admin/SkillsManager';
import { ExperienceManager } from './pages/admin/ExperienceManager';
import { ProjectsManager } from './pages/admin/ProjectsManager';
import { CertificationsManager } from './pages/admin/CertificationsManager';
import { ResearchManager } from './pages/admin/ResearchManager';
import { AchievementsManager } from './pages/admin/AchievementsManager';
import { ResumeManager } from './pages/admin/ResumeManager';
import { MessagesManager } from './pages/admin/MessagesManager';
import { SettingsEditor } from './pages/admin/SettingsEditor';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* PUBLIC WEBSITE ROUTES (Zero authentication required) */}
            <Route path="/" element={<Home />} />

            {/* HIDDEN ADMIN LOGIN (Not visible in public nav) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* PROTECTED ADMIN DASHBOARD CMS (Role-based access) */}
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="profile" element={<ProfileEditor />} />
              <Route path="about" element={<AboutEditor />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="experience" element={<ExperienceManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="certifications" element={<CertificationsManager />} />
              <Route path="research" element={<ResearchManager />} />
              <Route path="achievements" element={<AchievementsManager />} />
              <Route path="resume" element={<ResumeManager />} />
              <Route path="messages" element={<MessagesManager />} />
              <Route path="social" element={<ProfileEditor />} />
              <Route path="settings" element={<SettingsEditor />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
