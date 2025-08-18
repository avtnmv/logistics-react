import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import FormMessage from './FormMessage';
import PasswordToggle from './PasswordToggle';
import { getGlobalTestDB, logTestData, isUserRegistered, registerUser } from '../data/testData';
import { usePasswordToggle } from '../hooks/usePasswordToggle';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'phone' | 'code' | 'details'>('phone');
  const [phone, setPhone] = useState('');
  const [codeInputs, setCodeInputs] = useState(['', '', '', '']);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [showMessage, setShowMessage] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Хуки для переключения видимости паролей
  const passwordToggle = usePasswordToggle();
  const confirmPasswordToggle = usePasswordToggle();

  // Получаем глобальную базу данных
  const testDB = getGlobalTestDB();

  // Логируем доступные данные в консоль при загрузке
  React.useEffect(() => {
    logTestData('ТЕСТОВЫЕ ДАННЫЕ ДЛЯ РЕГИСТРАЦИИ');
  }, []);

  // Обратный отсчет
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      showFormMessage('Введите номер телефона', 'error');
      return;
    }

    // Проверяем формат номера телефона (любая страна с кодом +XXX и длиной 10-15 цифр)
    const phoneRegex = /^\+\d{1,4}\d{7,14}$/;
    if (!phoneRegex.test(phone)) {
      showFormMessage('Введите корректный номер телефона в международном формате (например: +380XXXXXXXXX, +998XXXXXXXXX, +1XXXXXXXXXX)', 'error');
      return;
    }

    // Генерируем код для номера
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Проверяем, не зарегистрирован ли уже пользователь
    if (isUserRegistered(phone, testDB)) {
      showFormMessage('Пользователь с этим номером уже зарегистрирован', 'info');
    } else {
      // Регистрируем пользователя с временным паролем
      const tempPassword = 'Temp' + Math.random().toString(36).substring(2, 8) + '!';
      registerUser(phone, tempPassword, testDB);
      
      // Добавляем номер в базу кодов
      testDB.codes[phone] = code;
      
      showFormMessage('Код отправлен на ваш номер телефона', 'success');
      setCurrentStep('code');
      setCountdown(30);
      
      // Логируем код в консоль
      console.log('');
      console.log('==================================================');
      console.log('                КОД ДЛЯ РЕГИСТРАЦИИ: ' + code);
      console.log('==================================================');
      console.log('');
      console.log('Номер телефона: ' + phone);
      console.log('Введите этот код для подтверждения: ' + code);
      console.log('');
    }
  };

  const showFormMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setShowMessage(true);
    
    // Убираем автоматическое скрытие - сообщение остается до следующего ввода
    // const duration = text.includes('Код отправлен') ? 25000 : 5000;
    // setTimeout(() => {
    //   setShowMessage(false);
    // }, duration);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = codeInputs.join('');
    
    // Проверяем, что код введен полностью
    if (code.length !== 4) {
      showFormMessage('Введите полный 4-значный код', 'error');
      return;
    }
    
    // Проверяем, что код состоит только из цифр
    if (!/^\d{4}$/.test(code)) {
      showFormMessage('Код должен состоять только из цифр', 'error');
      return;
    }
    
    if (testDB.codes[phone] === code) {
      // Код правильный
      setIsCodeCorrect(true);
      showFormMessage('Код подтвержден!', 'success');
      setTimeout(() => {
        setCurrentStep('details');
        // Сбрасываем состояние кода при переходе к следующему шагу
        setIsCodeCorrect(null);
      }, 1000);
    } else {
      // Код неправильный
      setIsCodeCorrect(false);
      showFormMessage('Код неверный. Проверьте правильность ввода', 'error');
      setCodeInputs(['', '', '', '']);
      // Сбрасываем состояние через 2 секунды
      setTimeout(() => {
        setIsCodeCorrect(null);
      }, 2000);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем, что все поля заполнены
    if (!firstName.trim()) {
      showFormMessage('Введите имя', 'error');
      return;
    }
    
    if (!lastName.trim()) {
      showFormMessage('Введите фамилию', 'error');
      return;
    }
    
    if (!password.trim()) {
      showFormMessage('Введите пароль', 'error');
      return;
    }
    
    if (!confirmPassword.trim()) {
      showFormMessage('Повторите пароль', 'error');
      return;
    }
    
    // Валидация пароля
    if (password.length < 6) {
      showFormMessage('Пароль должен содержать минимум 6 символов', 'error');
      return;
    }
    
    if (!/[A-Z]/.test(password)) {
      showFormMessage('Пароль должен содержать хотя бы одну заглавную букву', 'error');
      return;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      showFormMessage('Пароль должен содержать хотя бы один специальный символ (!@#$%^&*(),.?":{}|<>)', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showFormMessage('Пароли не совпадают. Проверьте правильность ввода', 'error');
      return;
    }
    
    // Обновляем пароль пользователя
    testDB.users[phone].password = password;
    
    showFormMessage('Поздравляем! Вы успешно зарегистрированы!', 'success');
    
    // Переходим на страницу входа через 2 секунды
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleResendCode = () => {
    if (countdown > 0) return;
    
    // Генерируем новый код
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    testDB.codes[phone] = newCode;
    
    // Логируем новый код
    console.log('');
    console.log('==================================================');
    console.log('                ПОВТОРНАЯ ОТПРАВКА КОДА');
    console.log('==================================================');
    console.log('');
    console.log('📱 Номер телефона: ' + phone);
    console.log('🔑 Новый код для ввода: ' + newCode);
    console.log('');
    console.log('✅ Код повторно отправлен на номер ' + phone);
    console.log('');
    
    showFormMessage('Код был повторно отправлен на ваш номер телефона', 'success');
    setCountdown(30);
  };

  const handleChangePhone = () => {
    setCurrentStep('phone');
    setPhone('');
    setCodeInputs(['', '', '', '']);
    setCountdown(0);
    setIsCodeCorrect(null);
  };

  const handleCodeInputChange = (index: number, value: string) => {
    const newInputs = [...codeInputs];
    newInputs[index] = value;
    setCodeInputs(newInputs);
    
    // Автоматический переход к следующему полю
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Если нажат Backspace и поле пустое, переходим к предыдущему полю
    if (e.key === 'Backspace' && codeInputs[index] === '' && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        // Очищаем предыдущее поле
        const newInputs = [...codeInputs];
        newInputs[index - 1] = '';
        setCodeInputs(newInputs);
      }
    }
    
    // Если зажат Backspace и поле не пустое, очищаем все поля
    if (e.key === 'Backspace' && codeInputs[index] !== '') {
      // Проверяем, зажат ли Backspace (событие повторяется)
      if (e.repeat) {
        // Очищаем все поля
        setCodeInputs(['', '', '', '']);
        // Фокусируемся на первом поле
        const firstInput = document.querySelector(`input[data-index="0"]`) as HTMLInputElement;
        if (firstInput) firstInput.focus();
        // Предотвращаем стандартное поведение
        e.preventDefault();
      }
    }
    
    // Если нажат Backspace в первом поле и оно пустое, очищаем все поля
    if (e.key === 'Backspace' && index === 0 && codeInputs[index] === '') {
      // Очищаем все поля
      setCodeInputs(['', '', '', '']);
      e.preventDefault();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (/^\d{4}$/.test(pastedData)) {
      const newInputs = pastedData.split('');
      setCodeInputs([...newInputs, '', '', '', ''].slice(0, 4));
    }
  };

  return (
    <>
      <Header />
      
      <main className="main container">
        <div className="main__container">
          <AnimatePresence mode="wait">
            {/* Шаг 1: Ввод номера телефона */}
            {currentStep === 'phone' && (
              <motion.div 
                key="phone"
                className="form-container form-container--active"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="20.833" fill="#EEF4F7"/>
                  <path d="M26.736 31.076a.868.868 0 1 0 0 1.736h4.34c.96 0 1.736-.777 1.736-1.736V18.923c0-.959-.777-1.736-1.736-1.736h-4.34a.868.868 0 1 0 0 1.736h4.34v12.153z" fill="#4472B8"/>
                  <path d="M28.224 25.608a.87.87 0 0 0 .248-.606v-.005a.87.87 0 0 0-.254-.611l-3.472-3.472a.868.868 0 1 0-1.228 1.227l1.99 1.99h-8.32a.868.868 0 1 0 0 1.737h8.32l-1.99 1.99a.868.868 0 1 0 1.228 1.227l3.471-3.471z" fill="#4472B8"/>
                </svg>

                <h2 className="form-container__title">Регистрация</h2>
                <p className="form-container__description">Введите номер телефона для регистрации в системе</p>

                <FormMessage 
                  message={message} 
                  type={messageType} 
                  isVisible={showMessage} 
                />

                <form className="form" onSubmit={handleSubmit}>
                  <div className="form__group">
                    <input 
                      type="tel" 
                      className="form__input" 
                      placeholder=" " 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                    <label className="form__label">Номер телефона</label>
                  </div>

                  <button type="submit" className="form__button form__button--login">
                    Зарегистрироваться
                  </button>
                </form>

                <div className="form-container__footer">
                  <p className="form-container__text">Уже зарегистрированы?</p>
                  <button 
                    className="form__button form-container__button"
                    onClick={() => navigate('/')}
                  >
                    Войти в систему
                  </button>
                </div>
              </motion.div>
            )}

            {/* Шаг 2: Ввод кода */}
            {currentStep === 'code' && (
              <motion.div 
                key="code"
                className="form-container"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="20.833" fill="#EEF4F7"/>
                  <path d="M26.736 31.076a.868.868 0 1 0 0 1.736h4.34c.96 0 1.736-.777 1.736-1.736V18.923c0-.959-.777-1.736-1.736-1.736h-4.34a.868.868 0 1 0 0 1.736h4.34v12.153z" fill="#4472B8"/>
                  <path d="M28.224 25.608a.87.87 0 0 0 .248-.606v-.005a.87.87 0 0 0-.254-.611l-3.472-3.472a.868.868 0 1 0-1.228 1.227l1.99 1.99h-8.32a.868.868 0 1 0 0 1.737h8.32l-1.99 1.99a.868.868 0 1 0 1.228 1.227l3.471-3.471z" fill="#4472B8"/>
                </svg>

                <h2 className="form-container__title">Введите код</h2>
                <p className="form-container__description">Мы отправили код на номер <span>{phone}</span></p>

                <FormMessage 
                  message={message} 
                  type={messageType} 
                  isVisible={showMessage} 
                />

                <form className="form" onSubmit={handleCodeSubmit}>
                  <div className="code-input-container" onPaste={handleCodePaste}>
                    {codeInputs.map((value, index) => (
                      <input
                        key={index}
                        type="text"
                        className={`code-input ${
                          isCodeCorrect === true ? 'code-input--correct' : 
                          isCodeCorrect === false ? 'code-input--incorrect' : ''
                        }`}
                        maxLength={1}
                        data-index={index}
                        value={value}
                        onChange={(e) => handleCodeInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        autoComplete="off"
                      />
                    ))}
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="form__button form__button--login">
                      Подтвердить
                    </button>
                    <button 
                      type="button" 
                      className="form__button form__button--secondary"
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `Отправить код ещё раз (${countdown}s)` : 'Отправить код ещё раз'}
                    </button>
                    <button 
                      type="button" 
                      className="form__button form__button--secondary"
                      onClick={handleChangePhone}
                    >
                      Изменить номер телефона
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Шаг 3: Ввод личных данных */}
            {currentStep === 'details' && (
              <motion.div 
                key="details"
                className="form-container"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="20.833" fill="#EEF4F7"/>
                  <path d="M26.736 31.076a.868.868 0 1 0 0 1.736h4.34c.96 0 1.736-.777 1.736-1.736V18.923c0-.959-.777-1.736-1.736-1.736h-4.34a.868.868 0 1 0 0 1.736h4.34v12.153z" fill="#4472B8"/>
                  <path d="M28.224 25.608a.87.87 0 0 0 .248-.606v-.005a.87.87 0 0 0-.254-.611l-3.472-3.472a.868.868 0 1 0-1.228 1.227l1.99 1.99h-8.32a.868.868 0 1 0 0 1.737h8.32l-1.99 1.99a.868.868 0 1 0 1.228 1.227l3.471-3.471z" fill="#4472B8"/>
                </svg>

                <h2 className="form-container__title">Завершение регистрации</h2>
                <p className="form-container__description">Введите ваши личные данные для завершения регистрации</p>

                <FormMessage 
                  message={message} 
                  type={messageType} 
                  isVisible={showMessage} 
                />

                <form className="form" onSubmit={handleDetailsSubmit}>
                  <div className="form__group">
                    <input 
                      type="text" 
                      className="form__input" 
                      placeholder=" " 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                    />
                    <label className="form__label">Имя</label>
                  </div>

                  <div className="form__group">
                    <input 
                      type="text" 
                      className="form__input" 
                      placeholder=" " 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                    />
                    <label className="form__label">Фамилия</label>
                  </div>

                  <div className="form__group">
                    <input 
                      type={passwordToggle.isVisible ? 'text' : 'password'}
                      className="form__input" 
                      placeholder=" " 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <label className="form__label">Пароль</label>
                    <PasswordToggle 
                      isVisible={passwordToggle.isVisible} 
                      onToggle={passwordToggle.toggle} 
                    />
                  </div>

                  <div className="form__group">
                    <input 
                      type={confirmPasswordToggle.isVisible ? 'text' : 'password'}
                      className="form__input" 
                      placeholder=" " 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                    <label className="form__label">Повторите пароль</label>
                    <PasswordToggle 
                      isVisible={confirmPasswordToggle.isVisible} 
                      onToggle={confirmPasswordToggle.toggle} 
                    />
                  </div>

                  <button type="submit" className="form__button form__button--login">
                    Завершить регистрацию
                  </button>
                </form>

                <div className="form-container__footer">
                  <p className="form-container__text">Уже зарегистрированы?</p>
                  <button 
                    className="form__button form-container__button"
                    onClick={() => navigate('/')}
                  >
                    Войти в систему
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Registration;
