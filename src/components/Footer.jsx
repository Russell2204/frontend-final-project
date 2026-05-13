import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    // TODO: Connect to backend newsletter API
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const sections = [
    {
      title: 'О СТУДИИ',
      links: [
        { name: 'О нас', href: '#' },
        { name: 'Наша команда', href: '#' },
        { name: 'Карьера', href: '#' },
      ],
    },
    {
      title: 'УСЛУГИ',
      links: [
        { name: 'Дизайн интерьеров', href: '#' },
        { name: 'Мебель на заказ', href: '#' },
        { name: 'Консультация', href: '#' },
      ],
    },
    {
      title: 'КОНТАКТЫ',
      links: [
        { name: 'Телефон: +7 (999) 123-45-67', href: 'tel:+79991234567' },
        { name: 'Email: hello@studio.com', href: 'mailto:hello@studio.com' },
        { name: 'Москва, ул. Примерная 123', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Instagram', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'Pinterest', href: '#' },
  ];

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="bg-black border-t border-gray-800 relative overflow-hidden"
    >
      {/* Decorative Element */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/20 via-transparent to-black pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Newsletter Section */}
        <motion.div
          variants={itemVariants}
          className="mb-20 glass-morphism-gold rounded-3xl p-12 md:p-16"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-light mb-4">
              Подпишитесь на новости
            </h3>
            <p className="text-gray-400 mb-8">
              Первыми узнавайте о новых проектах, коллекциях и эксклюзивных предложениях
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ваша почта"
                className="flex-1 px-6 py-4 bg-black/50 border border-gray-700 rounded-xl focus:border-[#D4AF37] focus:outline-none text-white placeholder-gray-500 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-white transition-all duration-300 whitespace-nowrap"
              >
                Подписаться
              </button>
            </form>

            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-400 text-sm"
              >
                Спасибо за подписку!
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 border border-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] text-lg font-bold">✦</span>
              </div>
              <span className="text-xl font-semibold tracking-widest">STUDIO</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Премиум-студия дизайна и производства экскюзивной мебели. Более 15 лет опыта в создании пространств мировой класса.
            </p>
          </motion.div>

          {/* Links Sections */}
          {sections.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="text-sm font-semibold tracking-widest text-[#D4AF37] mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links & Bottom */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div>
            <h4 className="text-sm font-semibold tracking-widest text-[#D4AF37] mb-4">
              СЛЕДИТЕ ЗА НАМИ
            </h4>
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-[#D4AF37] text-sm font-medium transition-colors duration-300"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-gray-600 tracking-widest">
              © 2026 Luxury Furniture Studio. Все права защищены.
            </p>
            <p className="text-xs text-gray-700 mt-2">
              Политика конфиденциальности • Условия использования
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        ↑
      </motion.button>
    </motion.footer>
  );
};

export default Footer;
