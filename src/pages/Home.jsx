import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import API from '../services/api';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { number: 150, label: 'Проектов' },
    { number: 500, label: 'Довольных клиентов' },
    { number: 15, label: 'Лет опыта' },
  ]);
  const [displayedStats, setDisplayedStats] = useState([0, 0, 0]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Animate counter
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/api/projects');
        setFeaturedProjects(res.data.data?.slice(0, 3) || []);
      } catch (err) {
        console.error('Ошибка загрузки проектов:', err);
        setFeaturedProjects([
          { id: 1, title: "Villa Collection", category: "Классика", imageUrl: "https://picsum.photos/id/1015/800/600" },
          { id: 2, title: "Modern Loft", category: "Современный стиль", imageUrl: "https://picsum.photos/id/106/800/600" },
          { id: 3, title: "Minimal Harmony", category: "Минимализм", imageUrl: "https://picsum.photos/id/201/800/600" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Counter animation effect
  useEffect(() => {
    const intervals = stats.map((stat, idx) => {
      return setInterval(() => {
        setDisplayedStats((prev) => {
          const newStats = [...prev];
          if (newStats[idx] < stat.number) {
            newStats[idx] = Math.min(newStats[idx] + Math.ceil(stat.number / 30), stat.number);
          }
          return newStats;
        });
      }, 30);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const textRevealVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
      },
    }),
  };

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* HERO SECTION */}
      <motion.section
        className="min-h-screen relative flex items-center justify-center bg-[radial-gradient(at_center,#1a1a1a_0%,#000000_70%)] pt-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Background */}
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0 bg-[url('https://picsum.photos/id/1015/1920/1080')] bg-cover bg-center opacity-20"
        />

        {/* Glow Effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            variants={itemVariants}
            className="text-6xl sm:text-7xl md:text-8xl font-light tracking-widest mb-6 text-white"
          >
            LUXURY
            <br />
            <motion.span
              className="text-[#D4AF37] font-medium inline-block"
              animate={{
                textShadow: [
                  '0 0 20px rgba(212, 175, 55, 0.2)',
                  '0 0 40px rgba(212, 175, 55, 0.4)',
                  '0 0 20px rgba(212, 175, 55, 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              FURNITURE
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Изысканный дизайн. Безупречное качество. Индивидуальные решения.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="px-8 sm:px-10 py-4 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-base sm:text-lg tracking-wider font-medium rounded-xl"
            >
              НАШИ ПРОЕКТЫ
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="px-8 sm:px-10 py-4 bg-[#D4AF37] text-black hover:bg-white transition-all duration-300 text-base sm:text-lg tracking-wider font-medium rounded-xl"
            >
              ОБСУДИТЬ ПРОЕКТ
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center">
            <motion.div
              animate={{ y: [5, 15, 5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-[#D4AF37] rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* ABOUT PREVIEW */}
      <motion.section
        className="py-24 border-b border-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl font-light mb-8">
              Искусство
              <br />
              <span className="text-[#D4AF37]">создавать пространство</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Более 15 лет мы создаём эксклюзивную мебель и интерьеры для тех, кто ценит настоящее качество,
              внимание к деталям и timeless эстетику.
            </p>
            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-8 text-sm tracking-widest"
            >
              <div className="text-gray-300">МОСКВА • ДУБАЙ • ЛОНДОН</div>
              <motion.div
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-px w-16 bg-[#D4AF37]"
              />
              <div className="text-gray-300">EST. 2010</div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative group"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src="https://picsum.photos/id/1016/800/600"
              alt="Studio"
              className="rounded-2xl shadow-2xl"
            />
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(212, 175, 55, 0.2)',
                  '0 0 40px rgba(212, 175, 55, 0.4)',
                  '0 0 20px rgba(212, 175, 55, 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 bg-black border border-[#D4AF37] p-6 max-w-[220px]"
            >
              <p className="text-[#D4AF37] text-sm tracking-widest">НАГРАДА</p>
              <p className="text-2xl font-light mt-2">Best Luxury Furniture 2025</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* FEATURED PROJECTS */}
      <motion.section
        id="projects"
        className="py-24 bg-zinc-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-5xl font-light mb-2">Избранные проекты</h2>
              <p className="text-gray-400 mt-3">Лучшие работы за последние годы</p>
            </div>
            <motion.a
              whileHover={{ x: 10 }}
              href="/portfolio"
              className="text-[#D4AF37] hover:text-white flex items-center gap-2 tracking-wider font-medium"
            >
              Все проекты
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                →
              </motion.span>
            </motion.a>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group cursor-pointer"
                whileHover={{ y: -10 }}
              >
                <div className="overflow-hidden rounded-2xl aspect-[4/3] mb-6 relative">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ opacity: [0, 0.3] }}
                  />
                </div>
                <h3 className="text-2xl font-light mb-1 group-hover:text-[#D4AF37] transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-[#D4AF37] text-sm tracking-widest">{project.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* STATS SECTION */}
      <motion.section
        className="py-24 bg-black border-b border-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-morphism rounded-3xl p-10 text-center"
              >
                <motion.div
                  className="text-6xl md:text-7xl font-light text-[#D4AF37] mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {displayedStats[idx]}+
                </motion.div>
                <p className="text-gray-300 text-lg tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SERVICES PREVIEW */}
      <motion.section
        className="py-24 border-b border-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2 variants={itemVariants} className="text-5xl font-light mb-4">
            Наши услуги
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 max-w-xl mx-auto mb-16">
            Полный цикл создания интерьера премиум-класса
          </motion.p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Эксклюзивная мебель', desc: 'Авторские изделия по индивидуальным проектам' },
              { title: 'Дизайн интерьеров', desc: 'От концепции до полной реализации' },
              { title: 'Архитектурное сопровождение', desc: 'Комплексное решение пространства' },
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)' }}
                className="border border-gray-800 hover:border-[#D4AF37] transition-all p-10 rounded-3xl group cursor-pointer"
              >
                <motion.div
                  className="text-6xl mb-6 text-gray-700 group-hover:text-[#D4AF37] transition-colors"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  0{i + 1}
                </motion.div>
                <h3 className="text-2xl mb-4 font-light">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        id="contact"
        className="py-32 bg-gradient-to-b from-black to-zinc-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-3xl mx-auto text-center px-6">
          <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-light leading-tight mb-8">
            Готовы создать
            <br />
            <span className="text-[#D4AF37]">что-то исключительное?</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-12">
            Напишите нам — и мы начнём работать над вашим проектом уже сегодня
          </motion.p>
          <motion.a
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.5)',
            }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="inline-block px-12 md:px-16 py-6 bg-[#D4AF37] text-black text-lg md:text-xl tracking-widest hover:bg-white transition-all duration-300 font-semibold rounded-xl"
          >
            НАЧАТЬ ПРОЕКТ
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
