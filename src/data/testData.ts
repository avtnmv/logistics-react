// Централизованные тестовые данные для всех компонентов

export interface TestPhoneData {
  [phone: string]: string; // номер телефона → код
}

export interface UserData {
  phone: string;
  password: string;
  isRegistered: boolean;
}

export interface TestDB {
  codes: TestPhoneData;
  users: { [phone: string]: UserData };
  lastRequestTime: { [phone: string]: number };
  attempts: { [phone: string]: number };
}

// Основные тестовые данные
export const TEST_PHONES: TestPhoneData = {
  '+998901234567': '1234',
  '+998901234568': '5678',
  '+998901234569': '9999',
  '+380635032027': '2027' // Украинский номер
};

// Глобальная база данных для всех компонентов
let globalTestDB: TestDB = {
  codes: { ...TEST_PHONES },
  users: {
    // Предустановленные тестовые пользователи
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
  },
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

// Функция для сброса базы данных к исходному состоянию
export const resetTestDB = (): void => {
  globalTestDB = {
    codes: { ...TEST_PHONES },
    users: {
      // Предустановленные тестовые пользователи
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
    },
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
export const registerUser = (phone: string, password: string, db: TestDB): void => {
  db.users[phone] = {
    phone,
    password,
    isRegistered: true
  };
  console.log(`✅ Пользователь ${phone} успешно зарегистрирован`);
};

// Функция для изменения пароля пользователя
export const updateUserPassword = (phone: string, newPassword: string, db: TestDB): void => {
  if (db.users[phone]) {
    db.users[phone].password = newPassword;
    console.log(`✅ Пароль для ${phone} успешно изменен`);
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


