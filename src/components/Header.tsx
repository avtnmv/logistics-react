import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentUser } from '../hooks/useCurrentUser';
import '../css/header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentUser = useCurrentUser();

  const isActive = (path: string) => location.pathname === path;
  
  // Определяем, является ли страница авторизованной
  const isAuthorizedPage = ['/dashboard', '/homepage', '/my-transports'].includes(location.pathname);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Очистка при размонтировании компонента
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Если это авторизованная страница, показываем хедер с тремя элементами
  if (isAuthorizedPage) {
    return (
      <header className="header">
        <div className="container flex-between-center">
          <Link to="/homepage" className="logo header__logo">
            <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="header__logo-img" width="180" height="62" />
          </Link>
          
          {/* Блок с кнопкой создания заказа и информацией о пользователе */}
          <div className="header__user-section">
            {/* Кнопка создания заказа */}
            <button className="header__nav-button header__nav-button--create-order">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Создать заказ
            </button>

            {/* Информация о пользователе */}
            <div className="header__user-info">
              <div className="header__user-avatar">
                <img 
                  src="/img/default-avatar.svg" 
                  alt="Аватар пользователя"
                  width="42" 
                  height="42"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMjEiIGZpbGw9IiNFNUY1RjUiLz4KPHBhdGggZD0iTTIxIDIwQzIzLjIwOTEgMjAgMjUgMTguMjA5MSAyNSAxNkMyNSAxMy43OTA5IDIzLjIwOTEgMTIgMjEgMTJDMTAuOCAxMiAxMyAxNCAxMyAxNkMxMyAxOC4yMDkxIDE0Ljc5MDkgMjAgMjEgMjBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yMSAyMkMxNi4wMzA0IDIyIDEyIDI2LjAzMDQgMTIgMzFIMzBDMzAgMjYuMDMwNCAyNS45Njk2IDIyIDIxIDIyWiIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K';
                  }}
                />
              </div>
              <div className="header__user-details">
                <div className="header__user-name">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Пользователь'}
                </div>
              </div>
            </div>

            {/* Бургер меню */}
            <button 
              className={`burger-menu ${isMobileMenuOpen ? 'burger-menu--active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Открыть меню"
            >
              <span className="burger-menu__line"></span>
              <span className="burger-menu__line"></span>
              <span className="burger-menu__line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay для авторизованных страниц */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="mobile-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={closeMobileMenu}
              />
              
              {/* Mobile Menu */}
              <motion.nav
                className="header__nav--mobile"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <div className="mobile-menu__header">
                  <div className="mobile-menu__header-content">
                    <Link to="/homepage" className="mobile-menu__logo" onClick={closeMobileMenu}>
                      <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="mobile-menu__logo-img" />
                    </Link>
                  </div>
                </div>
                
                <div className="mobile-menu__content">
                  {/* Информация о пользователе в мобильном меню */}
                  <div className="mobile-menu__user-info">
                    <div className="mobile-menu__user-avatar">
                      <img 
                        src="/img/default-avatar.svg" 
                        alt="Аватар пользователя"
                        width="42" 
                        height="42"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMjEiIGZpbGw9IiNFNUY1RjUiLz4KPHBhdGggZD0iTTIxIDIwQzIzLjIwOTEgMjAgMjUgMTguMjA5MSAyNSAxNkMyNSAxMy43OTA5IDIzLjIwOTEgMTIgMjEgMTJDMTAuOCAxMiAxMyAxNCAxMyAxNkMxMyAxOC4yMDkxIDE0Ljc5MDkgMjAgMjEgMjBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yMSAyMkMxNi4wMzA0IDIyIDEyIDI2LjAzMDQgMTIgMzFIMzBDMzAgMjYuMDMwNCAyNS45Njk2IDIyIDIxIDIyWiIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    <div className="mobile-menu__user-details">
                      <div className="mobile-menu__user-name">
                        {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Пользователь'}
                      </div>
                    </div>
                    {/* Ссылка на настройки профиля */}
                    <Link 
                      to="/profile-settings" 
                      className="mobile-menu__profile-link"
                      onClick={closeMobileMenu}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000" fill="none">
                        <path d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M21.011 14.097c.522-.141.783-.212.886-.346.103-.135.103-.351.103-.784v-1.934c0-.433 0-.65-.103-.784s-.364-.205-.886-.345c-1.95-.526-3.171-2.565-2.668-4.503.139-.533.208-.8.142-.956s-.256-.264-.635-.479l-1.725-.98c-.372-.21-.558-.316-.725-.294s-.356.21-.733.587c-1.459 1.455-3.873 1.455-5.333 0-.377-.376-.565-.564-.732-.587-.167-.022-.353.083-.725.295l-1.725.979c-.38.215-.57.323-.635.48-.066.155.003.422.141.955.503 1.938-.718 3.977-2.669 4.503-.522.14-.783.21-.886.345S2 10.6 2 11.033v1.934c0 .433 0 .65.103.784s.364.205.886.346c1.95.526 3.171 2.565 2.668 4.502-.139.533-.208.8-.142.956s.256.264.635.48l1.725.978c.372.212.558.317.725.295s.356-.21.733-.587c1.46-1.457 3.876-1.457 5.336 0 .377.376.565.564.732.587.167.022.353-.083.726-.295l1.724-.979c.38-.215.57-.323.635-.48s-.003-.422-.141-.955c-.504-1.937.716-3.976 2.666-4.502Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </Link>
                  </div>

                  {/* Кнопка создания заказа в мобильном меню */}
                  <button className="mobile-menu__create-order-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Создать заказ
                  </button>

                  <Link 
                    to="/homepage" 
                    className={`mobile-menu__item ${isActive('/homepage') ? 'mobile-menu__item--active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <div className="mobile-menu__item-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span>Главная</span>
                  </Link>
                  
                  <Link 
                    to="/" 
                    className="mobile-menu__item mobile-menu__item--logout"
                    onClick={closeMobileMenu}
                  >
                    <div className="mobile-menu__item-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000" fill="none">
                        <path d="M18 18c0 .464 0 .697-.022.892a3.5 3.5 0 0 1-3.086 3.086C14.697 22 14.464 22 14 22h-3c-3.3 0-4.95 0-5.975-1.025S4 18.3 4 15V9c0-3.3 0-4.95 1.025-5.975S7.7 2 11 2h3c.464 0 .697 0 .892.022a3.5 3.5 0 0 1 3.086 3.086C18 5.303 18 5.536 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.076 11.118C8 11.302 8 11.535 8 12.001s0 .699.076.883a1 1 0 0 0 .541.54c.184.077.417.077.883.077h5c0 1.75.011 2.629.562 2.885q.03.015.063.026c.58.223 1.275-.398 2.666-1.64 1.467-1.312 2.2-1.987 2.209-2.815-.009-.828-.742-1.503-2.21-2.814-1.39-1.243-2.085-1.864-2.665-1.641l-.063.026c-.56.26-.562 1.165-.562 2.973h-5c-.466 0-.699 0-.883.076a1 1 0 0 0-.54.541" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <span>Выйти</span>
                  </Link>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    );
  }

  // Оригинальный хедер для неавторизованных страниц (вход, регистрация, восстановление пароля)
  return (
    <header className="header">
      <div className="container flex-between-center">
        <Link to="/" className="logo header__logo">
          <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="header__logo-img" width="180" height="62" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="header__nav header__nav--desktop">
          <Link 
            to="/" 
            className={`header__nav-button header__nav-button--login ${isActive('/') ? 'header__nav-button--active' : ''}`}
          >
            Вход
          </Link>
          <Link 
            to="/registration" 
            className={`header__nav-button header__nav-button--registration ${isActive('/registration') ? 'header__nav-button--active' : ''}`}
          >
            Регистрация
          </Link>
          <Link 
            to="/forgot-password" 
            className={`header__nav-button header__nav-button--forgot-password ${isActive('/forgot-password') ? 'header__nav-button--active' : ''}`}
          >
            Восстановить пароль
          </Link>
        </nav>

        {/* Mobile Burger Button */}
        <button 
          className={`burger-menu ${isMobileMenuOpen ? 'burger-menu--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Открыть меню"
        >
          <span className="burger-menu__line"></span>
          <span className="burger-menu__line"></span>
          <span className="burger-menu__line"></span>
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.nav
              className="header__nav--mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-menu__header">
                <div className="mobile-menu__header-content">
                  <Link to="/" className="mobile-menu__logo" onClick={closeMobileMenu}>
                    <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="mobile-menu__logo-img" />
                  </Link>
                </div>
              </div>
              
              <div className="mobile-menu__content">
                <Link 
                  to="/" 
                  className={`mobile-menu__item ${isActive('/') ? 'mobile-menu__item--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="mobile-menu__item-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Вход</span>
                </Link>
                
                <Link 
                  to="/registration" 
                  className={`mobile-menu__item ${isActive('/registration') ? 'mobile-menu__item--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="mobile-menu__item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path d="M15 8A5 5 0 1 0 5 8a5 5 0 0 0 10 0m2.5 13v-7M14 17.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 20a7 7 0 0 1 11-5.745" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Регистрация</span>
                </Link>
                
                <Link 
                  to="/forgot-password" 
                  className={`mobile-menu__item ${isActive('/forgot-password') ? 'mobile-menu__item--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="mobile-menu__item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Восстановить пароль</span>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
