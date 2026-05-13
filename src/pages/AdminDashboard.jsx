import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalClients: 0,
    thisMonth: 0,
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'kitchen',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/projects');
      setProjects(res.data.data || []);
      setStats({
        totalProjects: res.data.data?.length || 0,
        totalClients: Math.floor(Math.random() * 500) + 100,
        thisMonth: Math.floor(Math.random() * 50) + 10,
      });
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/api/projects', {
        ...newProject,
        year: new Date().getFullYear(),
      });
      setProjects([...projects, res.data.data]);
      setNewProject({ title: '', category: 'kitchen', description: '', imageUrl: '' });
      setSuccess('Проект успешно добавлен!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Ошибка добавления проекта:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await API.delete(`/api/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      setSuccess('Проект удален!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Ошибка удаления проекта:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-zinc-900 to-black border-b border-gray-800 sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light tracking-widest">АДМИН ПАНЕЛЬ</h1>
            <p className="text-gray-400 text-sm mt-1">Добро пожаловать, {admin.username}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-medium"
          >
            Выход
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="sticky top-20 z-30 glass-morphism border-b border-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {['dashboard', 'projects', 'add'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-4 text-sm font-medium tracking-widest border-b-2 transition-colors duration-300 ${
                  activeTab === tab
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'dashboard' && 'СТАТИСТИКА'}
                {tab === 'projects' && 'ПРОЕКТЫ'}
                {tab === 'add' && 'ДОБАВИТЬ'}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-6 right-6 max-w-md bg-green-950 border border-green-600 text-green-400 px-6 py-4 rounded-lg"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={containerVariants}
            >
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  { label: 'Всего проектов', value: stats.totalProjects, icon: '📁' },
                  { label: 'Клиентов', value: stats.totalClients, icon: '👥' },
                  { label: 'Этот месяц', value: stats.thisMonth, icon: '📊' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="glass-morphism-gold rounded-3xl p-8"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-400 text-sm tracking-widest mb-3">{stat.label}</p>
                        <p className="text-5xl font-light text-[#D4AF37]">{stat.value}</p>
                      </div>
                      <span className="text-4xl">{stat.icon}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="glass-morphism rounded-3xl p-10">
                <h3 className="text-2xl font-light mb-6">Последние проекты</h3>
                <div className="space-y-4">
                  {projects.slice(-5).map((project) => (
                    <div key={project.id} className="flex justify-between items-center p-4 border border-gray-800 rounded-xl hover:border-[#D4AF37] transition-all">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-gray-400">{project.category}</p>
                      </div>
                      <span className="text-[#D4AF37]">{project.year}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={containerVariants}
            >
              <h2 className="text-3xl font-light mb-8">Все проекты ({projects.length})</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    className="glass-morphism rounded-2xl p-6 flex justify-between items-center group hover:border-[#D4AF37] transition-all"
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-400">{project.category} • {project.year}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Удалить
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Add Project Tab */}
          {activeTab === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl"
            >
              <h2 className="text-3xl font-light mb-8">Добавить новый проект</h2>
              <form onSubmit={handleAddProject} className="glass-morphism rounded-3xl p-10 space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm text-gray-400 mb-3 tracking-widest">
                    НАЗВАНИЕ ПРОЕКТА
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                    className="w-full bg-black border border-gray-700 focus:border-[#D4AF37] transition-colors rounded-xl px-6 py-4 text-white outline-none"
                    placeholder="например, Элегантная кухня"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm text-gray-400 mb-3 tracking-widest">
                    КАТЕГОРИЯ
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-black border border-gray-700 focus:border-[#D4AF37] transition-colors rounded-xl px-6 py-4 text-white outline-none"
                  >
                    <option value="kitchen">Кухни</option>
                    <option value="living">Гостиные</option>
                    <option value="bedroom">Спальни</option>
                    <option value="office">Офисы</option>
                  </select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm text-gray-400 mb-3 tracking-widest">
                    ОПИСАНИЕ
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    required
                    rows="4"
                    className="w-full bg-black border border-gray-700 focus:border-[#D4AF37] transition-colors rounded-xl px-6 py-4 text-white outline-none resize-none"
                    placeholder="Описание проекта..."
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm text-gray-400 mb-3 tracking-widest">
                    URL ИЗОБРАЖЕНИЯ
                  </label>
                  <input
                    type="url"
                    value={newProject.imageUrl}
                    onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                    required
                    className="w-full bg-black border border-gray-700 focus:border-[#D4AF37] transition-colors rounded-xl px-6 py-4 text-white outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-white transition-all duration-300"
                >
                  Добавить проект
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
