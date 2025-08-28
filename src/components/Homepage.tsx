import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { useCurrentUser } from '../hooks/useCurrentUser';
import '../css/left-sidebar.css';
import '../css/homepage.css';

const Homepage: React.FC = () => {
  const location = useLocation();
  const [activeForm, setActiveForm] = useState<'cards' | 'add-cargo' | 'add-transport'>('cards');
  const [loadingCity, setLoadingCity] = useState('');
  const [unloadingCity, setUnloadingCity] = useState('');
  const [showLoadingSuggestions, setShowLoadingSuggestions] = useState(false);
  const [showUnloadingSuggestions, setShowUnloadingSuggestions] = useState(false);
  
  // Состояния для дат загрузки
  const [loadingStartDate, setLoadingStartDate] = useState('');
  const [loadingEndDate, setLoadingEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  // Состояния для формы "Добавить груз"
  const [showCargoDimensions, setShowCargoDimensions] = useState(false);
  
  // Состояния для формы "Добавить транспорт"
  const [showTransportDimensions, setShowTransportDimensions] = useState(false);
  
  // Данные текущего пользователя
  const currentUser = useCurrentUser();
  
  // Состояние для select элементов (общие для обеих форм)
  const [selectedValues, setSelectedValues] = useState({
    loadingType: '',
    cargoType: '',
    vehicleType: '',
    reloadType: '',
    paymentMethod: '',
    paymentTerm: '',
    bargain: ''
  });
  
  // Состояния для всех полей форм
  const [formData, setFormData] = useState({
    // Общие поля
    loadingStartDate: '',
    loadingEndDate: '',
    loadingCity: '',
    unloadingCity: '',
    
    // Поля для груза
    cargoWeight: '',
    cargoVolume: '',
    vehicleCount: '',
    cargoLength: '',
    cargoWidth: '',
    cargoHeight: '',
    cargoPrice: '',
    cargoCurrency: 'USD',
    
    // Поля для транспорта
    transportWeight: '',
    transportVolume: '',
    transportLength: '',
    transportWidth: '',
    transportHeight: '',
    transportPrice: '',
    transportCurrency: 'USD',
    
    // Контактная информация
    additionalPhone: '',
    email: '',
    
    // Дополнительная информация
    additionalInfo: ''
  });
  
  // Состояние для карточки
  const [showCard, setShowCard] = useState(false);
  const [currentCard, setCurrentCard] = useState<any>(null);

  // Состояние для ошибок валидации
  const [validationErrors, setValidationErrors] = useState<{[key: string]: boolean}>({});
  const [shakeFields, setShakeFields] = useState<{[key: string]: boolean}>({});
  const [deletingCardId, setDeletingCardId] = useState<number | null>(null);

  // База данных городов
  const citiesDatabase = [
    'Киев, Украина',
    'Кишинев, Молдова',
    'Киров, Россия',
    'Кировоград, Украина',
    'Москва, Россия',
    'Санкт-Петербург, Россия',
    'Ташкент, Узбекистан',
    'Самарканд, Узбекистан',
    'Бухара, Узбекистан',
    'Алматы, Казахстан',
    'Астана, Казахстан',
    'Минск, Беларусь',
    'Вильнюс, Литва',
    'Рига, Латвия',
    'Таллин, Эстония'
  ];

  // Функции для преобразования значений в понятные названия
  const getCargoTypeName = (value: string): string => {
    const cargoTypes: { [key: string]: string } = {
      'pallets': 'Груз на паллетах',
      'equipment': 'Оборудование',
      'construction': 'Стройматериалы',
      'metal': 'Металл',
      'metal-products': 'Металлопрокат',
      'pipes': 'Трубы',
      'food': 'Продукты',
      'big-bags': 'Груз в биг-бэгах',
      'container': 'Контейнер',
      'cement': 'Цемент',
      'bitumen': 'Битум',
      'fuel': 'ГСМ',
      'flour': 'Мука',
      'oversized': 'Негабарит',
      'cars': 'Автомобили',
      'lumber': 'Пиломатериалы',
      'concrete': 'Бетонные изделия',
      'furniture': 'Мебель',
      'other': 'Другой тип'
    };
    return cargoTypes[value] || value;
  };

  const getVehicleTypeName = (value: string): string => {
    const vehicleTypes: { [key: string]: string } = {
      'tent': 'Тент',
      'isotherm': 'Изотерм',
      'refrigerator': 'Рефрижератор',
      'flatbed': 'Бортовой',
      'car-carrier': 'Автовоз',
      'platform': 'Платформа',
      'cement-truck': 'Цементовоз',
      'bitumen-truck': 'Битумовоз',
      'fuel-truck': 'Бензовоз',
      'flour-truck': 'Муковоз',
      'tow-truck': 'Эвакуатор',
      'timber-truck': 'Лесовоз',
      'grain-truck': 'Зерновоз',
      'trailer': 'Трал',
      'dump-truck': 'Самосвал',
      'container-truck': 'Контейнеровоз',
      'oversized-truck': 'Негабарит',
      'bus': 'Автобус',
      'gas-truck': 'Газовоз',
      'other-truck': 'Другой тип'
    };
    return vehicleTypes[value] || value;
  };

  const getReloadTypeName = (value: string): string => {
    const reloadTypes: { [key: string]: string } = {
      'no-reload': 'Без догрузки (отдельное авто)',
      'possible-reload': 'Возможна дозагрузка'
    };
    return reloadTypes[value] || value;
  };

  // Изменяем цвет фона при входе в кабинет
  useEffect(() => {
    document.body.style.backgroundColor = '#F5F5F5';
    
    // Возвращаем белый фон при размонтировании компонента
    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, []);

  // Автоматически переключаемся на вкладку карточек при переходе на /my-transports
  useEffect(() => {
    if (location.pathname === '/my-transports') {
      setActiveForm('cards');
    }
  }, [location.pathname]);

  // Миграция существующих карточек при загрузке
  useEffect(() => {
    if (currentUser?.id) {
      console.log('=== МИГРАЦИЯ КАРТОЧЕК ===');
      console.log('Текущий пользователь:', currentUser);
      
      const allCards = JSON.parse(localStorage.getItem('transportCards') || '[]');
      console.log('Все карточки в localStorage:', allCards);
      
      const userCards = allCards.filter((card: any) => card.userId === currentUser.id);
      console.log('Карточки пользователя после фильтрации:', userCards);
      
      if (userCards.length > 0) {
        // Сохраняем карточки пользователя в отдельное хранилище
        const storageKey = `transportCards_${currentUser.id}`;
        localStorage.setItem(storageKey, JSON.stringify(userCards));
        console.log('🔄 Миграция карточек пользователя завершена:', userCards.length, 'карточек');
        console.log('Сохранено в:', storageKey);
      } else {
        console.log('⚠️ Карточки пользователя не найдены для миграции');
      }
    } else {
      console.log('❌ Пользователь не авторизован, миграция не возможна');
    }
  }, [currentUser]);

  // Обработка кликов вне поп-апа автокомплита
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.form-field')) {
        setShowLoadingSuggestions(false);
        setShowUnloadingSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddCargo = () => {
    setActiveForm('add-cargo');
    // Сбрасываем состояния габаритов при переключении
    setShowCargoDimensions(false);
    setShowTransportDimensions(false);
  };

  const handleAddTransport = () => {
    setActiveForm('add-transport');
    // Сбрасываем состояния габаритов при переключении
    setShowCargoDimensions(false);
    setShowTransportDimensions(false);
  };

  const handleShowCards = () => {
    setActiveForm('cards');
  };

  // Функции для автокомплита
  const filterCities = (query: string) => {
    if (!query.trim()) return [];
    return citiesDatabase.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleCitySelect = (city: string, isLoading: boolean) => {
    if (isLoading) {
      setLoadingCity(city);
      setFormData(prev => ({ ...prev, loadingCity: city }));
      setShowLoadingSuggestions(false);
    } else {
      setUnloadingCity(city);
      setFormData(prev => ({ ...prev, unloadingCity: city }));
      setShowUnloadingSuggestions(false);
    }
  };

  // Обработчики для полей городов
  const handleLoadingCityChange = (value: string) => {
    setLoadingCity(value);
    setFormData(prev => ({ ...prev, loadingCity: value }));
    setShowLoadingSuggestions(value.length > 0);
    
    // Очищаем ошибку для этого поля
    if (validationErrors.loadingCity) {
      setValidationErrors(prev => ({ ...prev, loadingCity: false }));
    }
  };

  const handleUnloadingCityChange = (value: string) => {
    setUnloadingCity(value);
    setFormData(prev => ({ ...prev, unloadingCity: value }));
    setShowUnloadingSuggestions(value.length > 0);
    
    // Очищаем ошибку для этого поля
    if (validationErrors.unloadingCity) {
      setValidationErrors(prev => ({ ...prev, unloadingCity: false }));
    }
  };

  const handleClickOutside = () => {
    setShowLoadingSuggestions(false);
    setShowUnloadingSuggestions(false);
  };

  const handleSelectChange = (field: string, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку для этого поля
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: false }));
    }
  };
  
  // Валидация дат загрузки
  const validateDates = (startDate: string, endDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start < today) {
      setDateError('Дата начала загрузки не может быть раньше сегодняшнего дня');
      return false;
    }
    
    if (end < start) {
      setDateError('Дата окончания загрузки не может быть раньше даты начала');
      return false;
    }
    
    setDateError('');
    return true;
  };
  
  // Обработчик изменения даты начала
  const handleStartDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, loadingStartDate: date }));
    if (formData.loadingEndDate && !validateDates(date, formData.loadingEndDate)) {
      setLoadingEndDate('');
      setFormData(prev => ({ ...prev, loadingEndDate: '' }));
    }
  };
  
  // Обработчик изменения даты окончания
  const handleEndDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, loadingEndDate: date }));
    if (formData.loadingStartDate) {
      validateDates(formData.loadingStartDate, date);
    }
  };
  
  // Валидация обязательных полей для груза
  const validateCargoForm = () => {
    const errors: {[key: string]: boolean} = {};
    const requiredFields = [
      'loadingStartDate',
      'loadingEndDate', 
      'loadingCity',
      'unloadingCity',
      'cargoWeight',
      'cargoVolume'
    ];
    
    // Проверяем поля формы
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
        errors[field] = true;
      }
    }
    
    // Проверяем select поля
    if (!selectedValues.loadingType) {
      errors['loadingType'] = true;
    }
    if (!selectedValues.cargoType) {
      errors['cargoType'] = true;
    }
    
    setValidationErrors(errors);
    
    // Если есть ошибки, запускаем анимацию тряски
    if (Object.keys(errors).length > 0) {
      setShakeFields(errors);
      setTimeout(() => setShakeFields({}), 600);
    }
    
    return Object.keys(errors).length === 0;
  };

  // Валидация обязательных полей для транспорта
  const validateTransportForm = () => {
    const errors: {[key: string]: boolean} = {};
    const requiredFields = [
      'loadingStartDate',
      'loadingEndDate',
      'loadingCity', 
      'unloadingCity',
      'transportWeight',
      'transportVolume'
    ];
    
    // Проверяем поля формы
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
        errors[field] = true;
      }
    }
    
    // Проверяем select поля
    if (!selectedValues.vehicleType) {
      errors['vehicleType'] = true;
    }
    
    setValidationErrors(errors);
    
    // Если есть ошибки, запускаем анимацию тряски
    if (Object.keys(errors).length > 0) {
      setShakeFields(errors);
      setTimeout(() => setShakeFields({}), 600);
    }
    
    return Object.keys(errors).length === 0;
  };

  // Создание карточки
  // Удаление карточки
  const deleteCard = (cardId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      // Запускаем анимацию удаления
      setDeletingCardId(cardId);
      
      // Удаляем карточку через 300мс (время анимации)
      setTimeout(() => {
        if (currentUser?.id) {
          // Удаляем из хранилища пользователя
          const storageKey = `transportCards_${currentUser.id}`;
          const userCards = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const updatedUserCards = userCards.filter((card: any) => card.id !== cardId);
          localStorage.setItem(storageKey, JSON.stringify(updatedUserCards));
          
          // Также удаляем из общего списка для обратной совместимости
          const allCards = JSON.parse(localStorage.getItem('transportCards') || '[]');
          const updatedAllCards = allCards.filter((card: any) => card.id !== cardId);
          localStorage.setItem('transportCards', JSON.stringify(updatedAllCards));
        }
        
        // Сбрасываем состояние анимации
        setDeletingCardId(null);
        
        // Обновляем состояние, чтобы перерисовать карточки
        setActiveForm('cards');
      }, 300);
    }
  };

  const createCard = (type: 'cargo' | 'transport') => {
    // Отладочная информация для диагностики
    console.log('=== ДИАГНОСТИКА СОЗДАНИЯ КАРТОЧКИ ===');
    console.log('currentUser:', currentUser);
    console.log('currentUser?.id:', currentUser?.id);
    console.log('localStorage currentUser:', localStorage.getItem('currentUser'));
    
    // Проверяем, что пользователь авторизован
    if (!currentUser || !currentUser.id) {
      // Попробуем исправить пользователя, если у него нет ID
      if (currentUser && !currentUser.id) {
        console.log('🔧 Пытаемся исправить пользователя...');
        const fixedUser = {
          ...currentUser,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        // Обновляем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(fixedUser));
        console.log('✅ Пользователь исправлен:', fixedUser);
        
        // Обновляем состояние
        window.location.reload(); // Перезагружаем страницу для применения изменений
        return;
      }
      
      alert('Пожалуйста, войдите в систему для создания заявки');
      console.log('❌ Пользователь не авторизован или не имеет ID');
      return;
    }
    
    // Проверяем валидацию в зависимости от типа карточки
    if (type === 'cargo' && !validateCargoForm()) {
      alert('Пожалуйста, заполните все обязательные поля для создания карточки груза');
      return;
    }
    
    if (type === 'transport' && !validateTransportForm()) {
      alert('Пожалуйста, заполните все обязательные поля для создания карточки транспорта');
      return;
    }

    // Отладочная информация
    console.log('Создание карточки:', { type, currentUser, formData, selectedValues });

    const cardData = {
      id: Date.now(),
      type: type,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      status: 'Активна',
      userId: currentUser?.id || '',
      ...formData,
      ...selectedValues,
      mainPhone: currentUser?.phone || '',
      userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Пользователь'
    };
    
    setCurrentCard(cardData);
    setShowCard(true);
    
    // Сохраняем карточки для конкретного пользователя
    const storageKey = `transportCards_${currentUser.id}`;
    const existingCards = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Добавляем новую карточку
    existingCards.push(cardData);
    localStorage.setItem(storageKey, JSON.stringify(existingCards));
    
    // Также сохраняем в общий список для обратной совместимости
    const allCards = JSON.parse(localStorage.getItem('transportCards') || '[]');
    allCards.push(cardData);
    localStorage.setItem('transportCards', JSON.stringify(allCards));
    
    // Принудительно обновляем пользовательское хранилище
    const updatedUserCards = JSON.parse(localStorage.getItem(storageKey) || '[]');
    localStorage.setItem(storageKey, JSON.stringify(updatedUserCards));
    
    // Отладочная информация
    console.log('=== СОХРАНЕНИЕ КАРТОЧКИ ===');
    console.log('Карточка сохранена:', cardData);
    console.log('Storage key:', storageKey);
    console.log('Карточки пользователя:', existingCards);
    console.log('Все карточки:', allCards);
    console.log('localStorage после сохранения:');
    console.log('- Пользовательские:', localStorage.getItem(storageKey));
    console.log('- Общие:', localStorage.getItem('transportCards'));
    
    // Сброс формы
    setActiveForm('cards');
    setFormData({
      loadingStartDate: '',
      loadingEndDate: '',
      loadingCity: '',
      unloadingCity: '',
      cargoWeight: '',
      cargoVolume: '',
      vehicleCount: '',
      cargoLength: '',
      cargoWidth: '',
      cargoHeight: '',
      cargoPrice: '',
      cargoCurrency: 'USD',
      transportWeight: '',
      transportVolume: '',
      transportLength: '',
      transportWidth: '',
      transportHeight: '',
      transportPrice: '',
      transportCurrency: 'USD',
      additionalPhone: '',
      email: '',
      additionalInfo: ''
    });
    setSelectedValues({
      loadingType: '',
      cargoType: '',
      vehicleType: '',
      reloadType: '',
      paymentMethod: '',
      paymentTerm: '',
      bargain: ''
    });
    setShowCargoDimensions(false);
    setShowTransportDimensions(false);
    setLoadingCity('');
    setUnloadingCity('');
    setDateError('');
  };

  const renderContent = () => {
    switch (activeForm) {
              case 'add-cargo':
          return (
            <>
                                          <div className="homepage-form-header-block">
                <div className="homepage-form-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                    <path d="M12 22c-.818 0-1.6-.33-3.163-.99C4.946 19.366 3 18.543 3 17.16V7m9 15c.818 0 1.6-.33 3.163-.99C19.054 19.366 21 18.543 21 17.16V7m-9 15V11.355M8.326 9.691 5.405 8.278C3.802 7.502 3 7.114 3 6.5s.802-1.002 2.405-1.778l2.92-1.413C10.13 2.436 11.03 2 12 2s1.871.436 3.674 1.309l2.921 1.413C20.198 5.498 21 5.886 21 6.5s-.802 1.002-2.405 1.778l-2.92 1.413C13.87 10.564 12.97 11 12 11s-1.871-.436-3.674-1.309M6 12l2 1m9-9L7 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                
                <div className="homepage-form-header-content">
                  <h2>Добавление заявки на перевозку груза</h2>
                  <p>Укажите, пожалуйста, пункты загрузки и выгрузки, параметры груза и контактную информацию.</p>
                </div>
              </div>
              
              <div className="homepage-form-container">
                <div className="homepage-form-content">
                <h3>Информация о грузе</h3>
                <p>Укажите как можно подробнее доступную информацию о грузе.</p>
                
                <div className="form-section">
                  <div className={`form-row ${validationErrors.loadingStartDate || validationErrors.loadingEndDate ? 'error' : ''}`}>
                    <div className="form-field">
                      <label>Дни загрузки</label>
                      <div className="date-range-input">
                        <input 
                          type="date" 
                          className={`form-input ${validationErrors.loadingStartDate ? 'error' : ''} ${shakeFields.loadingStartDate ? 'shake' : ''}`}
                          value={formData.loadingStartDate}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, loadingStartDate: e.target.value }));
                            if (formData.loadingEndDate) {
                              validateDates(e.target.value, formData.loadingEndDate);
                            }
                            // Очищаем ошибку для этого поля
                            if (validationErrors.loadingStartDate) {
                              setValidationErrors(prev => ({ ...prev, loadingStartDate: false }));
                            }
                          }}
                        />
                        <span>-</span>
                        <input 
                          type="date" 
                          className={`form-input ${validationErrors.loadingEndDate ? 'error' : ''} ${shakeFields.loadingEndDate ? 'shake' : ''}`}
                          value={formData.loadingEndDate}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, loadingEndDate: e.target.value }));
                            if (formData.loadingStartDate) {
                              validateDates(formData.loadingStartDate, e.target.value);
                            }
                            // Очищаем ошибку для этого поля
                            if (validationErrors.loadingEndDate) {
                              setValidationErrors(prev => ({ ...prev, loadingEndDate: false }));
                            }
                          }}
                        />
                      </div>
                      {dateError && <div className="error-message">{dateError}</div>}
                      {(validationErrors.loadingStartDate || validationErrors.loadingEndDate) && (
                        <div className="error-message">Пожалуйста, укажите даты загрузки</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Место загрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название" 
                        value={loadingCity}
                        onChange={(e) => {
                          setLoadingCity(e.target.value);
                          setFormData(prev => ({ ...prev, loadingCity: e.target.value }));
                          setShowLoadingSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowLoadingSuggestions(loadingCity.length > 0)}
                      />
                      {showLoadingSuggestions && (
                        <div className="autocomplete-suggestions">
                          {filterCities(loadingCity).map((city, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCitySelect(city, true)}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Место выгрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название" 
                        value={unloadingCity}
                        onChange={(e) => {
                          setUnloadingCity(e.target.value);
                          setShowUnloadingSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowUnloadingSuggestions(unloadingCity.length > 0)}
                      />
                      {showUnloadingSuggestions && (
                        <div className="autocomplete-suggestions">
                          {filterCities(unloadingCity).map((city, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCitySelect(city, false)}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <button className="add-location-btn">Добавить место загрузки</button>
                    </div>
                    <div className="form-field">
                      <button className="add-location-btn">Добавить место выгрузки</button>
                    </div>
                  </div>
                </div>
                
                <hr className="form-divider" />
                
                <div className="form-section">
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.loadingType ? 'error' : ''}`}>
                      <label>Тип загрузки</label>
                      <select 
                        className={`form-input ${selectedValues.loadingType ? 'has-value' : ''} ${validationErrors.loadingType ? 'error' : ''} ${shakeFields.loadingType ? 'shake' : ''}`}
                        value={selectedValues.loadingType}
                        onChange={(e) => handleSelectChange('loadingType', e.target.value)}
                      >
                        <option value="" disabled>Выберите тип</option>
                        <option value="back">Задняя</option>
                        <option value="side">Боковая</option>
                        <option value="top">Верхняя</option>
                      </select>
                      {validationErrors.loadingType && (
                        <div className="error-message">Пожалуйста, выберите тип загрузки</div>
                      )}
                    </div>
                    <div className={`form-field ${validationErrors.cargoType ? 'error' : ''}`}>
                      <label>Тип груза</label>
                      <select 
                        className={`form-input ${selectedValues.cargoType ? 'has-value' : ''} ${validationErrors.cargoType ? 'error' : ''} ${shakeFields.cargoType ? 'shake' : ''}`}
                        value={selectedValues.cargoType}
                        onChange={(e) => handleSelectChange('cargoType', e.target.value)}
                      >
                        <option value="" disabled>Укажите что за груз</option>
                        <option value="pallets">Груз на паллетах</option>
                        <option value="equipment">Оборудование</option>
                        <option value="construction">Стройматериалы</option>
                        <option value="metal">Металл</option>
                        <option value="metal-products">Металлопрокат</option>
                        <option value="pipes">Трубы</option>
                        <option value="food">Продукты</option>
                        <option value="big-bags">Груз в биг-бэгах</option>
                        <option value="container">Контейнер</option>
                        <option value="cement">Цемент</option>
                        <option value="bitumen">Битум</option>
                        <option value="fuel">ГСМ</option>
                        <option value="flour">Мука</option>
                        <option value="oversized">Негабарит</option>
                        <option value="cars">Автомобили</option>
                        <option value="lumber">Пиломатериалы</option>
                        <option value="concrete">Бетонные изделия</option>
                        <option value="furniture">Мебель</option>
                        <option value="other">Другой тип</option>
                      </select>
                      {validationErrors.cargoType && (
                        <div className="error-message">Пожалуйста, выберите тип груза</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Тип автомобиля</label>
                      <select 
                        className={`form-input ${selectedValues.vehicleType ? 'has-value' : ''}`}
                        value={selectedValues.vehicleType}
                        onChange={(e) => handleSelectChange('vehicleType', e.target.value)}
                      >
                        <option value="" disabled>Выберите тип</option>
                        <option value="tent">Тент</option>
                        <option value="isotherm">Изотерм</option>
                        <option value="refrigerator">Рефрижератор</option>
                        <option value="flatbed">Бортовой</option>
                        <option value="car-carrier">Автовоз</option>
                        <option value="platform">Платформа</option>
                        <option value="cement-truck">Цементовоз</option>
                        <option value="bitumen-truck">Битумовоз</option>
                        <option value="fuel-truck">Бензовоз</option>
                        <option value="flour-truck">Муковоз</option>
                        <option value="tow-truck">Эвакуатор</option>
                        <option value="timber-truck">Лесовоз</option>
                        <option value="grain-truck">Зерновоз</option>
                        <option value="trailer">Трал</option>
                        <option value="dump-truck">Самосвал</option>
                        <option value="container-truck">Контейнеровоз</option>
                        <option value="oversized-truck">Негабарит</option>
                        <option value="bus">Автобус</option>
                        <option value="gas-truck">Газовоз</option>
                        <option value="other-truck">Другой тип</option>
                      </select>
                    </div>
                    <div className={`form-field ${validationErrors.cargoWeight ? 'error' : ''}`}>
                      <label>Вес груза</label>
                      <input 
                        type="number" 
                        className={`form-input ${validationErrors.cargoWeight ? 'error' : ''} ${shakeFields.cargoWeight ? 'shake' : ''}`}
                        placeholder="кг" 
                        value={formData.cargoWeight}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, cargoWeight: e.target.value }));
                          // Очищаем ошибку для этого поля
                          if (validationErrors.cargoWeight) {
                            setValidationErrors(prev => ({ ...prev, cargoWeight: false }));
                          }
                        }}
                      />
                      {validationErrors.cargoWeight && (
                        <div className="error-message">Пожалуйста, укажите вес груза</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.cargoVolume ? 'error' : ''}`}>
                      <label>Объем груза</label>
                      <input 
                        type="number" 
                        className={`form-input ${validationErrors.cargoVolume ? 'error' : ''} ${shakeFields.cargoVolume ? 'shake' : ''}`}
                        placeholder="м³" 
                        value={formData.cargoVolume}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, cargoVolume: e.target.value }));
                          // Очищаем ошибку для этого поля
                          if (validationErrors.cargoVolume) {
                            setValidationErrors(prev => ({ ...prev, cargoVolume: false }));
                          }
                        }}
                      />
                      {validationErrors.cargoVolume && (
                        <div className="error-message">Пожалуйста, укажите объем груза</div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Возможность дозагрузки</label>
                      <select 
                        className={`form-input ${selectedValues.reloadType ? 'has-value' : ''}`}
                        value={selectedValues.reloadType}
                        onChange={(e) => handleSelectChange('reloadType', e.target.value)}
                      >
                        <option value="" disabled>Возможность дозагрузки</option>
                        <option value="no-reload">Без догрузки (отдельное авто)</option>
                        <option value="possible-reload">Возможна дозагрузка</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Указать габариты груза</label>
                      <div 
                        className={`dimensions-trigger ${showCargoDimensions ? 'active' : ''}`}
                        onClick={() => setShowCargoDimensions(!showCargoDimensions)}
                      >
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ввести длину, ширину и высоту" 
                          readOnly
                        />
                        <div className="dimensions-icon">
                          <div className="dimensions-circle"></div>
                        </div>
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Количество автомобилей</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="шт" 
                        value={formData.vehicleCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehicleCount: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  {showCargoDimensions && (
                    <div className="form-row dimensions-row">
                      <div className="form-field">
                        <label>Длина груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите длину в метрах" 
                          value={formData.cargoLength}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoLength: e.target.value }))}
                        />
                      </div>
                      <div className="form-field">
                        <label>Ширина груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите ширину в метрах" 
                          value={formData.cargoWidth}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoWidth: e.target.value }))}
                        />
                      </div>
                      <div className="form-field">
                        <label>Высота груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите высоту в метрах" 
                          value={formData.cargoHeight}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoHeight: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <hr className="form-divider" />
                
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Стоимость</label>
                      <div className="currency-input">
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="0" 
                          value={formData.cargoPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoPrice: e.target.value }))}
                        />
                        <select 
                          className="currency-select"
                          value={formData.cargoCurrency}
                          onChange={(e) => setFormData(prev => ({ ...prev, cargoCurrency: e.target.value }))}
                        >
                          <option value="USD">USD</option>
                          <option value="RUB">RUB</option>
                          <option value="UZS">UZS</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Метод оплаты</label>
                      <select 
                        className={`form-input ${selectedValues.paymentMethod ? 'has-value' : ''}`}
                        value={selectedValues.paymentMethod}
                        onChange={(e) => handleSelectChange('paymentMethod', e.target.value)}
                      >
                        <option value="" disabled>Выберите метод оплаты</option>
                        <option value="cashless">Безналичный</option>
                        <option value="card">На карту</option>
                        <option value="combined">Комбинированный</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Срок оплаты</label>
                      <select 
                        className={`form-input ${selectedValues.paymentTerm ? 'has-value' : ''}`}
                        value={selectedValues.paymentTerm}
                        onChange={(e) => handleSelectChange('paymentTerm', e.target.value)}
                      >
                        <option value="" disabled>Выберите срок оплаты</option>
                        <option value="unloading">При разгрузке</option>
                        <option value="prepayment">Предоплата</option>
                        <option value="deferred">Отсрочка платежа</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Торг</label>
                      <select 
                        className={`form-input ${selectedValues.bargain ? 'has-value' : ''}`}
                        value={selectedValues.bargain}
                        onChange={(e) => handleSelectChange('bargain', e.target.value)}
                      >
                        <option value="" disabled>Возможность торга</option>
                        <option value="yes">Возможен</option>
                        <option value="no">Нет</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px' }}>
                  <hr className="form-divider" />
                </div>
                
                <div className="form-section" style={{ marginTop: '32px' }}>
                  <h3>Выберите контакты, которые будут видны в заказе</h3>
                  <p>Здесь отображаются доступные контакты, добавленные вами в разделе "Профиль". Вы можете изменить или добавить их в личном кабинете.</p>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Основной телефон</label>
                      <input type="tel" className="form-input" value={currentUser?.phone || ''} readOnly />
                    </div>
                    <div className="form-field">
                      <label>Дополнительный телефон</label>
                      <input type="tel" className="form-input" />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>E-mail</label>
                      <input type="email" className="form-input" placeholder="example@email.com" />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px' }}>
                  <hr className="form-divider" />
                </div>
                

                
                <div className="form-section" style={{ marginTop: '32px' }}>
                  <div className="form-row">
                    <div className="form-field" style={{ width: '100%' }}>
                      <label>Дополнительная информация</label>
                      <textarea className="form-input" rows={4} placeholder="Введите дополнительную информацию..." />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <button className="submit-cargo-btn" onClick={() => createCard('cargo')}>
                    Добавить груз
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'add-transport':
        return (
          <>
            <div className="homepage-form-header-block">
              <div className="homepage-form-header-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                  <circle cx="17" cy="18" r="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="7" cy="18" r="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M11 17h4M13.5 7h.943c1.31 0 1.966 0 2.521.315.556.314.926.895 1.667 2.056.52.814 1.064 1.406 1.831 1.931.772.53 1.14.789 1.343 1.204.195.398.195.869.195 1.811 0 1.243 0 1.864-.349 2.259l-.046.049c-.367.375-.946.375-2.102.375H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="m13 7 .994 2.486c.487 1.217.73 1.826 1.239 2.17.508.344 1.163.344 2.475.344H21M4.87 17c-1.353 0-2.03 0-2.45-.44C2 16.122 2 15.415 2 14V7c0-1.414 0-2.121.42-2.56S3.517 4 4.87 4h5.26c1.353 0 2.03 0 2.45.44C13 4.878 13 5.585 13 7v10H8.696" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <div className="homepage-form-header-content">
                <h2>Добавление заявки на перевозку транспорта</h2>
                <p>Укажите, пожалуйста, пункты загрузки и выгрузки, параметры автомобиля и контактную информацию.</p>
              </div>
            </div>
            
            <div className="homepage-form-container">
              <div className="homepage-form-content">
                <h3>Информация о транспорте</h3>
                <p>Укажите как можно подробнее доступную информацию о транспорте.</p>
                
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Дни загрузки</label>
                      <div className="date-range-input">
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.loadingStartDate}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, loadingStartDate: e.target.value }));
                            if (formData.loadingEndDate) {
                              validateDates(e.target.value, formData.loadingEndDate);
                            }
                          }}
                        />
                        <span>-</span>
                        <input 
                          type="date" 
                          className="form-input" 
                          value={formData.loadingEndDate}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, loadingEndDate: e.target.value }));
                            if (formData.loadingStartDate) {
                              validateDates(formData.loadingStartDate, e.target.value);
                            }
                          }}
                        />
                      </div>
                      {dateError && <div className="error-message">{dateError}</div>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Место загрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название" 
                        value={loadingCity}
                        onChange={(e) => {
                          setLoadingCity(e.target.value);
                          setFormData(prev => ({ ...prev, loadingCity: e.target.value }));
                          setShowLoadingSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowLoadingSuggestions(loadingCity.length > 0)}
                      />
                      {showLoadingSuggestions && (
                        <div className="autocomplete-suggestions">
                          {filterCities(loadingCity).map((city, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCitySelect(city, true)}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Место выгрузки</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Начните вводить название" 
                        value={unloadingCity}
                        onChange={(e) => {
                          setUnloadingCity(e.target.value);
                          setShowUnloadingSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowUnloadingSuggestions(unloadingCity.length > 0)}
                      />
                      {showUnloadingSuggestions && (
                        <div className="autocomplete-suggestions">
                          {filterCities(unloadingCity).map((city, index) => (
                            <div 
                              key={index} 
                              className="suggestion-item"
                              onClick={() => handleCitySelect(city, false)}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <button className="add-location-btn">Добавить место загрузки</button>
                    </div>
                    <div className="form-field">
                      <button className="add-location-btn">Добавить место выгрузки</button>
                    </div>
                  </div>
                </div>
                
                <hr className="form-divider" />
                
                <div className="form-section">
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.vehicleType ? 'error' : ''}`}>
                      <label>Тип автомобиля</label>
                      <select 
                        className={`form-input ${selectedValues.vehicleType ? 'has-value' : ''} ${validationErrors.vehicleType ? 'error' : ''} ${shakeFields.vehicleType ? 'shake' : ''}`}
                        value={selectedValues.vehicleType}
                        onChange={(e) => handleSelectChange('vehicleType', e.target.value)}
                      >
                        <option value="" disabled>Выберите тип</option>
                        <option value="tent">Тент</option>
                        <option value="isotherm">Изотерм</option>
                        <option value="refrigerator">Рефрижератор</option>
                        <option value="flatbed">Бортовой</option>
                        <option value="car-carrier">Автовоз</option>
                        <option value="platform">Платформа</option>
                        <option value="cement-truck">Цементовоз</option>
                        <option value="bitumen-truck">Битумовоз</option>
                        <option value="fuel-truck">Бензовоз</option>
                        <option value="flour-truck">Муковоз</option>
                        <option value="tow-truck">Эвакуатор</option>
                        <option value="timber-truck">Лесовоз</option>
                        <option value="grain-truck">Зерновоз</option>
                        <option value="trailer">Трал</option>
                        <option value="dump-truck">Самосвал</option>
                        <option value="container-truck">Контейнеровоз</option>
                        <option value="oversized-truck">Негабарит</option>
                        <option value="bus">Автобус</option>
                        <option value="gas-truck">Газовоз</option>
                        <option value="other-truck">Другой тип</option>
                      </select>
                      {validationErrors.vehicleType && (
                        <div className="error-message">Пожалуйста, выберите тип автомобиля</div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Количество автомобилей</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="Укажите количество" 
                        value={formData.vehicleCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehicleCount: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.transportWeight ? 'error' : ''}`}>
                      <label>Масса (т)</label>
                      <input 
                        type="number" 
                        className={`form-input ${validationErrors.transportWeight ? 'error' : ''} ${shakeFields.transportWeight ? 'shake' : ''}`}
                        placeholder="Укажите вес" 
                        value={formData.transportWeight}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, transportWeight: e.target.value }));
                          // Очищаем ошибку для этого поля
                          if (validationErrors.transportWeight) {
                            setValidationErrors(prev => ({ ...prev, transportWeight: false }));
                          }
                        }}
                      />
                      {validationErrors.transportWeight && (
                        <div className="error-message">Пожалуйста, укажите массу транспорта</div>
                      )}
                    </div>
                    <div className="form-field">
                      <label>Указать габариты груза</label>
                      <div className="dimensions-trigger" onClick={() => setShowTransportDimensions(!showTransportDimensions)}>
                        <input 
                          type="text" 
                          className={`form-input ${showTransportDimensions ? 'active' : ''}`}
                          placeholder="Ввести длину, ширину и высоту"
                          readOnly
                        />
                        <div className="dimensions-icon">
                          <div className={`dimensions-circle ${showTransportDimensions ? 'active' : ''}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {showTransportDimensions && (
                    <div className="form-row dimensions-row">
                      <div className="form-field">
                        <label>Длина груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите длину в метрах" 
                          value={formData.transportLength}
                          onChange={(e) => setFormData(prev => ({ ...prev, transportLength: e.target.value }))}
                        />
                      </div>
                      <div className="form-field">
                        <label>Ширина груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите ширину в метрах" 
                          value={formData.transportWidth}
                          onChange={(e) => setFormData(prev => ({ ...prev, transportWidth: e.target.value }))}
                        />
                      </div>
                      <div className="form-field">
                        <label>Высота груза</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите высоту в метрах" 
                          value={formData.transportHeight}
                          onChange={(e) => setFormData(prev => ({ ...prev, transportHeight: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="form-row">
                    <div className={`form-field ${validationErrors.transportVolume ? 'error' : ''}`}>
                      <label>Объём (м³)</label>
                      <input 
                        type="number" 
                        className={`form-input ${validationErrors.transportVolume ? 'error' : ''} ${shakeFields.transportVolume ? 'shake' : ''}`}
                        placeholder="Укажите объём" 
                        value={formData.transportVolume}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, transportVolume: e.target.value }));
                          // Очищаем ошибку для этого поля
                          if (validationErrors.transportVolume) {
                            setValidationErrors(prev => ({ ...prev, transportVolume: false }));
                          }
                        }}
                      />
                      {validationErrors.transportVolume && (
                        <div className="error-message">Пожалуйста, укажите объём транспорта</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <hr className="form-divider" />
                
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Стоимость</label>
                      <div className="currency-input">
                        <select 
                          className="currency-select"
                          value={formData.transportCurrency}
                          onChange={(e) => setFormData(prev => ({ ...prev, transportCurrency: e.target.value }))}
                        >
                          <option value="USD">USD</option>
                          <option value="RUB">RUB</option>
                          <option value="UZS">UZS</option>
                        </select>
                        <input 
                          type="number" 
                          className="form-input" 
                          placeholder="Укажите стоимость" 
                          value={formData.transportPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, transportPrice: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Метод оплаты</label>
                      <select 
                        className={`form-input ${selectedValues.paymentMethod ? 'has-value' : ''}`}
                        value={selectedValues.paymentMethod}
                        onChange={(e) => handleSelectChange('paymentMethod', e.target.value)}
                      >
                        <option value="" disabled>Выберите метод оплаты</option>
                        <option value="cashless">Безналичный</option>
                        <option value="card">На карту</option>
                        <option value="combined">Комбинированный</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Срок оплаты</label>
                      <select 
                        className={`form-input ${selectedValues.paymentTerm ? 'has-value' : ''}`}
                        value={selectedValues.paymentTerm}
                        onChange={(e) => handleSelectChange('paymentTerm', e.target.value)}
                      >
                        <option value="" disabled>Выберите срок оплаты</option>
                        <option value="unloading">При разгрузке</option>
                        <option value="prepayment">Предоплата</option>
                        <option value="deferred">Отсрочка платежа</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>Торг</label>
                                              <select 
                          className={`form-input ${selectedValues.bargain ? 'has-value' : ''}`}
                          value={selectedValues.bargain}
                          onChange={(e) => handleSelectChange('bargain', e.target.value)}
                        >
                        <option value="" disabled>Возможность торга</option>
                        <option value="yes">Возможен</option>
                        <option value="no">Невозможен</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px' }}>
                  <hr className="form-divider" />
                </div>
                
                <div className="form-section" style={{ marginTop: '32px' }}>
                  <h3>Выберите контакты, которые будут видны в заказе</h3>
                  <p>Здесь отображаются доступные контакты, добавленные вами в разделе "Профиль". Вы можете изменить или добавить их в личном кабинете.</p>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>Основной телефон</label>
                      <input type="tel" className="form-input" value={currentUser?.phone || ''} readOnly />
                    </div>
                    <div className="form-field">
                      <label>Дополнительный телефон</label>
                      <input type="tel" className="form-input" />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>E-mail</label>
                      <input type="email" className="form-input" placeholder="example@email.com" />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px' }}>
                  <hr className="form-divider" />
                </div>
                
                <div className="form-section" style={{ marginTop: '32px' }}>
                  <div className="form-row">
                    <div className="form-field" style={{ width: '100%' }}>
                      <label>Дополнительная информация</label>
                      <textarea className="form-input" rows={4} placeholder="Введите дополнительную информацию..." />
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <button className="submit-transport-btn" onClick={() => createCard('transport')}>
                    Добавить автомобиль
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <div className="cards-container">
            <h3>Мои перевозки</h3>
            <p>Здесь отображаются все созданные вами заявки на перевозку</p>
            
            {(() => {
              if (!currentUser?.id) {
                return (
                  <div className="no-cards">
                    <p>Пожалуйста, войдите в систему для просмотра ваших заявок.</p>
                  </div>
                );
              }
              
              // Загружаем карточки конкретного пользователя
              const storageKey = `transportCards_${currentUser.id}`;
              let userCards = JSON.parse(localStorage.getItem(storageKey) || '[]');
              
              // Если карточек нет в пользовательском хранилище, пробуем мигрировать
              if (userCards.length === 0) {
                console.log('🔄 Попытка миграции карточек...');
                const allCards = JSON.parse(localStorage.getItem('transportCards') || '[]');
                console.log('Все карточки для миграции:', allCards);
                
                // Пробуем найти карточки по userId
                let migratedCards = allCards.filter((card: any) => card.userId === currentUser.id);
                
                // Если не найдены по userId, пробуем по номеру телефона
                if (migratedCards.length === 0) {
                  console.log('🔍 Поиск карточек по номеру телефона...');
                  migratedCards = allCards.filter((card: any) => card.mainPhone === currentUser.phone);
                  console.log('Найдено по номеру телефона:', migratedCards);
                }
                
                // Если все еще не найдены, пробуем по имени пользователя
                if (migratedCards.length === 0) {
                  console.log('🔍 Поиск карточек по имени пользователя...');
                  const userName = `${currentUser.firstName} ${currentUser.lastName}`;
                  migratedCards = allCards.filter((card: any) => card.userName === userName);
                  console.log('Найдено по имени:', migratedCards);
                }
                
                if (migratedCards.length > 0) {
                  // Добавляем userId к найденным карточкам
                  const updatedCards = migratedCards.map((card: any) => ({
                    ...card,
                    userId: currentUser.id
                  }));
                  
                  localStorage.setItem(storageKey, JSON.stringify(updatedCards));
                  userCards = updatedCards;
                  console.log('✅ Миграция успешна:', updatedCards.length, 'карточек');
                } else {
                  console.log('⚠️ Карточки для миграции не найдены');
                }
              }
              
              // Отладочная информация
              console.log('=== ОТОБРАЖЕНИЕ КАРТОЧЕК ===');
              console.log('Текущий пользователь:', currentUser.id);
              console.log('Storage key:', storageKey);
              console.log('Карточки пользователя:', userCards);
              console.log('Количество карточек:', userCards.length);
              console.log('localStorage содержимое:');
              console.log('- Пользовательские:', localStorage.getItem(storageKey));
              console.log('- Общие:', localStorage.getItem('transportCards'));
              
              // Отладочная информация уже выведена выше
              
              if (userCards.length === 0) {
                return (
                  <div className="no-cards">
                    <p>У вас пока нет созданных заявок. Создайте первую заявку, нажав "Добавить груз" или "Добавить транспорт" в левом меню.</p>
                  </div>
                );
              }
              
              return (
                <div className="cards-grid">
                  {userCards.map((card: any, index: number) => (
                    <div 
                      key={card.id} 
                      className={`transport-card ${deletingCardId === card.id ? 'deleting' : ''}`}
                    >
                      <div className="transport-card__header">
                        <div className="transport-card__header-left">
                          <div className="transport-card__type">
                            {card.type === 'cargo' ? 'Груз' : 'Транспорт'}
                          </div>
                          <div className="transport-card__status">{card.status}</div>
                        </div>
                        <button 
                          className="transport-card__delete-btn"
                          onClick={() => deleteCard(card.id)}
                          title="Удалить заявку"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2h4M5 4h6M4 6h8M3 8h10M2 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 4v8m4-8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="transport-card__content">
                        <div className="transport-card__info">
                          <p><strong>Дата создания:</strong> {card.createdAt}</p>
                          <p><strong>Дни загрузки:</strong> {card.loadingStartDate} - {card.loadingEndDate}</p>
                          <p><strong>Маршрут:</strong> {card.loadingCity} → {card.unloadingCity}</p>
                          {card.type === 'cargo' ? (
                            <>
                              <p><strong>Тип груза:</strong> {getCargoTypeName(card.cargoType) || 'Не указан'}</p>
                              <p><strong>Возможность дозагрузки:</strong> {getReloadTypeName(card.reloadType) || 'Не указана'}</p>
                              <p><strong>Вес:</strong> {card.cargoWeight || 'Не указан'} т</p>
                              <p><strong>Объем:</strong> {card.cargoVolume || 'Не указан'} м³</p>
                            </>
                          ) : (
                            <>
                              <p><strong>Тип автомобиля:</strong> {getVehicleTypeName(card.vehicleType) || 'Не указан'}</p>
                              <p><strong>Масса:</strong> {card.transportWeight || 'Не указан'} т</p>
                              <p><strong>Объем:</strong> {card.transportVolume || 'Не указан'} м³</p>
                            </>
                          )}
                          <p><strong>Стоимость:</strong> {card.cargoPrice || card.transportPrice || 'Не указана'} {card.cargoCurrency || card.transportCurrency}</p>
                        </div>
                        
                        <div className="transport-card__contacts">
                          <p><strong>Контакт:</strong> {card.userName}</p>
                          <p><strong>Телефон:</strong> {card.mainPhone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="homepage-container container">
        <LeftSidebar 
          onAddCargo={handleAddCargo}
          onAddTransport={handleAddTransport}
          onShowCards={handleShowCards}
          activeForm={activeForm}
          currentUser={currentUser}
        />
        <div className="homepage-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Homepage;


