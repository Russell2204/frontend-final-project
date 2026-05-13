import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Портфолио', path: '/portfolio' },
    { name: 'Контакты', path: '#contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: 300,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? 'glass-morphism border-b border-gray-800 py-3'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 border border-gold-500 rounded-full flex items-center justify-center group-hover:glow-gold-hover transition-all">
              <span className="text-gold-500 text-lg font-bold">✦</span>
            </div>
            <span className="hidden md:block text-xl font-semibold tracking-widest text-white">
              STUDIO
            </span>
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <motion.div key={link.name} variants={itemVariants}>
              <Link
                to={link.path}
                className={`relative text-sm tracking-widest font-medium transition-colors duration-300 group ${
                  isActive(link.path)
                    ? 'text-[#D4AF37]'
                    : 'text-gray-300 hover:text-[#D4AF37]'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#D4AF37] transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <Link
            to="/admin/login"
            className="hidden sm:inline-block px-6 py-2.5 text-xs tracking-widest font-semibold border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300 glow-gold-hover"
          >
            АДМИН
          </Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-screen w-4/5 glass-morphism bg-black/95 backdrop-blur-xl border-l border-gray-800 md:hidden"
          >
            <div className="flex flex-col items-start gap-1 p-8 pt-24">
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  variants={itemVariants}
                  className="w-full"
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className="block py-4 text-lg tracking-widest font-medium text-gray-300 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={itemVariants} className="w-full pt-6 border-t border-gray-800 mt-6">
                <Link
                  to="/admin/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="block py-4 px-6 text-center text-sm tracking-widest font-semibold border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                >
                  АДМИН
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
