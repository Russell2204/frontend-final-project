import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Сбрасываем ошибку при вводе
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/api/auth/login', formData);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('admin', JSON.stringify(res.data.admin));
        
        // Перенаправление в админ-панель
        navigate('/admin');
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Ошибка входа. Проверьте данные.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      {/* Фоновый акцент */}
      <div className="absolute inset-0 bg-[radial-gradient(at_center,#1a1a1a_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-[#D4AF37] rounded-full mb-6">
            <span className="text-3xl text-[#D4AF37]">✦</span>
          </div>
          <h1 className="text-4xl font-light tracking-widest text-white">
            ADMIN PANEL
          </h1>
          <p className="text-gray-500 mt-3 tracking-wide">
            Luxury Furniture Studio
          </p>
        </div>

        <div className="bg-zinc-950 border border-gray-800 rounded-3xl p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 tracking-widest">
                ИМЯ ПОЛЬЗОВАТЕЛЯ
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-700 focus:border-[#D4AF37] transition-colors rounded-2xl px-6 py-4 text-white outline-none"
                placeholder="admin"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 tracking-widest">
                ПАРОЛЬ
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-700 focus:border-[#D4AF37] transition-colors rounded-2xl px-6 py-4 text-white outline-none"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-950/30 border border-red-900 py-3 rounded-2xl">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#D4AF37] text-black font-medium tracking-widest rounded-2xl hover:bg-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'ВХОД...' : 'ВОЙТИ В ПАНЕЛЬ'}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-xs text-gray-600">
              Только для сотрудников студии
            </p>
          </div>
        </div>

        {/* Footer hint */}
        <div className="text-center mt-8 text-gray-700 text-sm tracking-widest">
          PREMIUM FURNITURE STUDIO • 2026
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;