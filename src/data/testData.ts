export interface TestPhoneData {
  [phone: string]: string; 
}

export interface UserData {
  id: string;
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
    id: 'user_001',
    phone: '+998901234567',
    password: 'Test123!',
    isRegistered: true,
    firstName: 'Алексей',
    lastName: 'Петров'
  },
  '+998901234568': {
    id: 'user_002',
    phone: '+998901234568',
    password: 'Test456!',
    isRegistered: true,
    firstName: 'Мария',
    lastName: 'Иванова'
  },
  '+998901234569': {
    id: 'user_003',
    phone: '+998901234569',
    password: 'Test789!',
    isRegistered: true,
    firstName: 'Дмитрий',
    lastName: 'Сидоров'
  },
  '+380635032027': {
    id: 'user_004',
    phone: '+380635032027',
    password: 'Ukraine2027!',
    isRegistered: true,
    firstName: 'Виктор',
    lastName: 'Кравчук'
  }
};


const loadUsersFromStorage = (): { [phone: string]: UserData } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📱 Загружены данные пользователей из localStorage:', Object.keys(parsed));
      return { ...DEFAULT_USERS, ...parsed }; 
    }
  } catch (error) {
    console.warn('⚠️ Ошибка загрузки данных из localStorage:', error);
  }
  return DEFAULT_USERS;
};

export const saveUsersToStorage = (users: { [phone: string]: UserData }): void => {
  try {
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

let globalTestDB: TestDB = {
  codes: { ...TEST_PHONES },
  users: loadUsersFromStorage(),
  lastRequestTime: {},
  attempts: {}
};

export const createTestDB = (): TestDB => {
  return globalTestDB;
};

export const getGlobalTestDB = (): TestDB => {
  return globalTestDB;
};

export const clearStoredUsers = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Пользовательские данные удалены из localStorage');
  } catch (error) {
    console.warn('⚠️ Ошибка очистки localStorage:', error);
  }
};

export const resetTestDB = (): void => {
  clearStoredUsers();
  
  globalTestDB = {
    codes: { ...TEST_PHONES },
    users: { ...DEFAULT_USERS }, 
    lastRequestTime: {},
    attempts: {}
  };
  console.log('🔄 База данных сброшена к исходному состоянию');
};

export const isTestPhone = (phone: string): boolean => {
  return phone in TEST_PHONES;
};

export const getTestCode = (phone: string): string | null => {
  return TEST_PHONES[phone] || null;
};

export const isUserRegistered = (phone: string, db: TestDB): boolean => {
  return phone in db.users && db.users[phone].isRegistered;
};

export const verifyUserPassword = (phone: string, password: string, db: TestDB): boolean => {
  const user = db.users[phone];
  return user && user.isRegistered && user.password === password;
};


export const registerUser = (phone: string, password: string, db: TestDB, firstName?: string, lastName?: string): void => {
  db.users[phone] = {
    id: `user_${Date.now()}`,
    phone,
    password,
    isRegistered: true,
    firstName,
    lastName
  };
  saveUsersToStorage(db.users);
  console.log(`✅ Пользователь ${phone} (${firstName} ${lastName}) успешно зарегистрирован и сохранен в localStorage`);
};

export const updateUserPassword = (phone: string, newPassword: string, db: TestDB): void => {
  if (db.users[phone]) {
    db.users[phone].password = newPassword;
    saveUsersToStorage(db.users);
    console.log(`✅ Пароль для ${phone} успешно изменен и сохранен в localStorage`);
  }
};

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


