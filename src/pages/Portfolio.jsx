import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import API from '../services/api';

const categories = [
  { id: 'all', label: 'Все проекты' },
  { id: 'kitchen', label: 'Кухни' },
  { id: 'living', label: 'Гостиные' },
  { id: 'bedroom', label: 'Спальни' },
  { id: 'office', label: 'Офисы' },
];

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Загрузка проектов
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await API.get('/api/projects');
        const data = res.data?.data || [];
        
        setProjects(data);
      } catch (err) {
        console.error('Ошибка загрузки проектов:', err);
        setError('Не удалось загрузить проекты с сервера');

        // Демо-данные как fallback
        const demoProjects = [
          {
            id: 1,
            title: "Элегантная кухня в особняке",
            category: "kitchen",
            imageUrl: "https://picsum.photos/id/1015/800/600",
            year: 2025,
            description: "Роскошная кухня с натуральным мрамором Calacatta Gold, шпоном дуба и встроенной техникой Gaggenau.",
            details: "Площадь: 45 м² • Материалы: Мрамор, Дуб, Латунь • Срок: 4 месяца"
          },
          {
            id: 2,
            title: "Гостиная в стиле Contemporary Classic",
            category: "living",
            imageUrl: "https://picsum.photos/id/106/800/600",
            year: 2024,
            description: "Пространство, где встречаются классика и современность с камином из травертина.",
            details: "Площадь: 82 м² • Материалы: Травертин, Бархат, Бронза"
          },
          {
            id: 3,
            title: "Мастер-спальня с гардеробной",
            category: "bedroom",
            imageUrl: "https://picsum.photos/id/201/800/600",
            year: 2025,
            description: "Уютная и величественная спальня с индивидуальной кроватью и скрытым освещением.",
            details: "Площадь: 38 м² • Материалы: Шёлк, Орех, Золото"
          },
          {
            id: 4,
            title: "Домашний кабинет руководителя",
            category: "office",
            imageUrl: "https://picsum.photos/id/133/800/600",
            year: 2024,
            description: "Статусный кабинет с массивным дубовым столом и библиотекой.",
            details: "Площадь: 28 м² • Материалы: Дуб, Кожа, Латунь"
          },
        ];
        setProjects(demoProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Фильтрация
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, projects]);

  const openModal = (project) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen">
      {/* Header */}
      <motion.div
        className="pt-32 pb-16 border-b border-gray-900 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          style={{ y: parallaxY }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-light tracking-widest mb-4"
          >
            PORTFOLIO
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-md mx-auto">
            Избранные работы, в которых воплощено наше понимание luxury
          </motion.p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div className="sticky top-0 z-50 glass-morphism border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full text-sm tracking-widest transition-all duration-300 font-medium ${
                  activeCategory === cat.id
                    ? 'bg-[#D4AF37] text-black glow-gold'
                    : 'border border-gray-700 hover:border-[#D4AF37] text-gray-300 hover:text-white'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full"
            />
          </div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => openModal(project)}
                  className="group cursor-pointer"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative overflow-hidden rounded-3xl aspect-[4/3] mb-6">
                    <motion.img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.7 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    <div className="absolute bottom-6 left-6">
                      <span className="inline-block px-4 py-1 bg-black/70 text-[#D4AF37] text-xs tracking-widest rounded-full backdrop-blur-md">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-light mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm tracking-wider uppercase">
                    {categories.find((c) => c.id === project.category)?.label || ''}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-4xl w-full bg-zinc-950 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                className="absolute top-6 right-6 z-10 text-4xl text-gray-400 hover:text-white transition-colors"
              >
                ×
              </motion.button>

              <div className="aspect-video overflow-hidden">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-10 md:p-14">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-4xl font-light mb-2">{selectedProject.title}</h2>
                    <p className="text-[#D4AF37] tracking-widest">
                      {categories.find((c) => c.id === selectedProject.category)?.label} • {selectedProject.year}
                    </p>
                  </div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {selectedProject.description}
                </p>

                <div className="border-t border-gray-800 pt-6 text-sm text-gray-400">
                  {selectedProject.details}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModal}
                    className="flex-1 py-4 border border-gray-700 hover:border-white transition-colors rounded-2xl text-white font-medium"
                  >
                    Закрыть
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-4 bg-[#D4AF37] text-black rounded-2xl hover:bg-white transition-all duration-300 font-medium"
                  >
                    Обсудить похожий проект
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;