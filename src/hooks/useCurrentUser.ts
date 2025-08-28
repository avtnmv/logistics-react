import { useState, useEffect } from 'react';
import { getGlobalTestDB } from '../data/testData';

export interface CurrentUser {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
}

export const useCurrentUser = (): CurrentUser | null => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    // Получаем данные пользователя из localStorage
    const storedUser = localStorage.getItem('currentUser');
    console.log('useCurrentUser: storedUser =', storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('useCurrentUser: parsed userData =', userData);
        
        // Если у пользователя нет ID, создаем его
        if (!userData.id) {
          console.log('⚠️ У пользователя нет ID, создаем новый...');
          const updatedUserData = {
            ...userData,
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
          
          // Обновляем в localStorage
          localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
          console.log('✅ Новый ID создан:', updatedUserData.id);
          
          setCurrentUser(updatedUserData);
        } else {
          console.log('✅ У пользователя уже есть ID:', userData.id);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.warn('Ошибка парсинга данных пользователя:', error);
      }
    } else {
      console.log('useCurrentUser: пользователь не найден в localStorage');
    }
  }, []);

  return currentUser;
};
