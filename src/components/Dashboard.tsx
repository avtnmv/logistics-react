import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../css/login.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Добавляем логирование для отладки
  console.log('🔍 DEBUG Dashboard: current location =', location);
  console.log('🔍 DEBUG Dashboard: pathname =', location.pathname);
  console.log('🔍 DEBUG Dashboard: search =', location.search);
  console.log('🔍 DEBUG Dashboard: hash =', location.hash);

  // Автоматически перенаправляем на homepage
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔍 DEBUG Dashboard: Redirecting to /homepage');
      navigate('/homepage');
    }, 1000); // Задержка в 1 секунду для показа анимации

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Header />
      
      <main className="main container">
        <div className="main__container">
          <motion.div 
            className="form-container form-container--active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="20.833" fill="#EEF4F7"/>
              <path d="M26.736 31.076a.868.868 0 1 0 0 1.736h4.34c.96 0 1.736-.777 1.736-1.736V18.923c0-.959-.777-1.736-1.736-1.736h-4.34a.868.868 0 1 0 0 1.736h4.34v12.153z" fill="#4472B8"/>
              <path d="M28.224 25.608a.87.87 0 0 0 .248-.606v-.005a.87.87 0 0 0-.254-.611l-3.472-3.472a.868.868 0 1 0-1.228 1.227l1.99 1.99h-8.32a.868.868 0 1 0 0 1.737h8.32l-1.99 1.99a.868.868 0 1 0 1.228 1.227l3.471-3.471z" fill="#4472B8"/>
            </svg>

            <h2 className="form-container__title">Добро пожаловать!</h2>
            <p className="form-container__description">Вы успешно вошли в систему</p>

            <div className="form-container__footer">
              <button 
                className="form__button form-container__button"
                onClick={() => {
                  console.log('🔍 DEBUG: Navigating to /');
                  navigate('/');
                }}
              >
                Выйти из системы
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;
