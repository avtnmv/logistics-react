export interface TestPhoneData {
  [phone: string]: string; 
}

export interface UserData {
  phone: string;
  password: string;
  isRegistered: boolean;
  firstName?: string;  
  lastName?: string;   
}

export interface TestDB {
  codes: TestPhoneData;
  users: { [phone: string]: UserData };
  lastRequestTime: { [phone: string]: number };
  attempts: { [phone: string]: number };
}

export const TEST_PHONES: TestPhoneData = {
  '+998901234567': '1234',
  '+998901234568': '5678',
  '+998901234569': '9999',
  '+380635032027': '2027' 
};

const STORAGE_KEY = 'logistics_app_users';

const DEFAULT_USERS: { [phone: string]: UserData } = {
  '+998901234567': {
    phone: '+998901234567',
    password: 'Test123!',
    isRegistered: true
  },
  '+998901234568': {
    phone: '+998901234568',
    password: 'Test456!',
    isRegistered: true
  },
  '+998901234569': {
    phone: '+998901234569',
    password: 'Test789!',
    isRegistered: true
  },
  '+380635032027': {
    phone: '+380635032027',
    password: 'Ukraine2027!',
    isRegistered: true
  }
};

// Функция для загрузки пользователей из localStorage
const loadUsersFromStorage = (): { [phone: string]: UserData } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📱 Загружены данные пользователей из localStorage:', Object.keys(parsed));
      return { ...DEFAULT_USERS, ...parsed }; // Объединяем с предустановленными
    }
  } catch (error) {
    console.warn('⚠️ Ошибка загрузки данных из localStorage:', error);
  }
  return DEFAULT_USERS;
};

// Функция для сохранения пользователей в localStorage
export const saveUsersToStorage = (users: { [phone: string]: UserData }): void => {
  try {
    // Сохраняем только новых пользователей (не предустановленных)
    const customUsers: { [phone: string]: UserData } = {};
    Object.entries(users).forEach(([phone, userData]) => {
      if (!DEFAULT_USERS[phone]) {
        customUsers[phone] = userData;
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customUsers));
    console.log('💾 Данные пользователей сохранены в localStorage:', Object.keys(customUsers));
  } catch (error) {
    console.warn('⚠️ Ошибка сохранения данных в localStorage:', error);
  }
};

// Глобальная база данных для всех компонентов
let globalTestDB: TestDB = {
  codes: { ...TEST_PHONES },
  users: loadUsersFromStorage(),
  lastRequestTime: {},
  attempts: {}
};

// Создание TestDB для компонентов, которым нужны дополнительные поля
export const createTestDB = (): TestDB => {
  return globalTestDB;
};

// Функция для получения глобальной базы данных
export const getGlobalTestDB = (): TestDB => {
  return globalTestDB;
};

// Функция для очистки localStorage
export const clearStoredUsers = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Пользовательские данные удалены из localStorage');
  } catch (error) {
    console.warn('⚠️ Ошибка очистки localStorage:', error);
  }
};

// Функция для сброса базы данных к исходному состоянию
export const resetTestDB = (): void => {
  // Очищаем localStorage
  clearStoredUsers();
  
  globalTestDB = {
    codes: { ...TEST_PHONES },
    users: { ...DEFAULT_USERS }, // Используем константу
    lastRequestTime: {},
    attempts: {}
  };
  console.log('🔄 База данных сброшена к исходному состоянию');
};

// Функция для проверки существования номера
export const isTestPhone = (phone: string): boolean => {
  return phone in TEST_PHONES;
};

// Функция для получения кода по номеру
export const getTestCode = (phone: string): string | null => {
  return TEST_PHONES[phone] || null;
};

// Функция для проверки существования пользователя
export const isUserRegistered = (phone: string, db: TestDB): boolean => {
  return phone in db.users && db.users[phone].isRegistered;
};

// Функция для проверки пароля пользователя
export const verifyUserPassword = (phone: string, password: string, db: TestDB): boolean => {
  const user = db.users[phone];
  return user && user.isRegistered && user.password === password;
};

// Функция для регистрации нового пользователя
export const registerUser = (phone: string, password: string, db: TestDB, firstName?: string, lastName?: string): void => {
  db.users[phone] = {
    phone,
    password,
    isRegistered: true,
    firstName,
    lastName
  };
  // Сохраняем в localStorage
  saveUsersToStorage(db.users);
  console.log(`✅ Пользователь ${phone} (${firstName} ${lastName}) успешно зарегистрирован и сохранен в localStorage`);
};

// Функция для изменения пароля пользователя
export const updateUserPassword = (phone: string, newPassword: string, db: TestDB): void => {
  if (db.users[phone]) {
    db.users[phone].password = newPassword;
    // Сохраняем в localStorage
    saveUsersToStorage(db.users);
    console.log(`✅ Пароль для ${phone} успешно изменен и сохранен в localStorage`);
  }
};

// Функция для логирования доступных данных
export const logTestData = (title: string): void => {
  console.log('');
  console.log('==================================================');
  console.log(`                ${title}`);
  console.log('==================================================');
  console.log('');
  Object.entries(TEST_PHONES).forEach(([phone, code]) => {
    console.log(`📱 ${phone} → код: ${code}`);
  });
  console.log('');
  console.log('💡 Используйте эти данные для тестирования');
  console.log('');
};


