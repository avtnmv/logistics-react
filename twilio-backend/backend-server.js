const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Проверяем настройки Twilio
const isTwilioConfigured = () => {
  return process.env.TWILIO_ACCOUNT_SID && 
         process.env.TWILIO_AUTH_TOKEN && 
         process.env.TWILIO_PHONE_NUMBER &&
         process.env.TWILIO_ACCOUNT_SID !== 'YOUR_ACCOUNT_SID_HERE' &&
         process.env.TWILIO_AUTH_TOKEN !== 'YOUR_AUTH_TOKEN_HERE' &&
         process.env.TWILIO_PHONE_NUMBER !== 'YOUR_TWILIO_PHONE_NUMBER_HERE';
};

// Тестовый endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend работает!',
    twilio: isTwilioConfigured() ? 'Настроен' : 'Не настроен',
    from: process.env.TWILIO_PHONE_NUMBER || 'Не указан'
  });
});

// Проверка баланса
app.get('/api/balance', async (req, res) => {
  if (!isTwilioConfigured()) {
    return res.json({
      balance: '0.00',
      currency: 'USD',
      status: 'simulation',
      message: 'Twilio не настроен - используется имитация'
    });
  }

  try {
    const twilio = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const account = await twilio.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    
    res.json({
      balance: account.balance,
      currency: account.currency,
      status: account.status
    });
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
    res.status(500).json({
      error: 'Ошибка получения баланса Twilio',
      details: error.message
    });
  }
});

// Отправка SMS
app.post('/api/send-sms', async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({
      success: false,
      error: 'Необходимо указать phone и code'
    });
  }

  try {
    if (isTwilioConfigured()) {
      // Отправляем через Twilio
      const twilio = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      const message = await twilio.messages.create({
        body: `Ваш код подтверждения: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      console.log(`✅ SMS отправлен через Twilio на ${phone}. SID: ${message.sid}`);
      
      res.json({
        success: true,
        message: 'SMS отправлен через Twilio',
        sid: message.sid,
        to: phone,
        code: code,
        method: 'twilio'
      });
    } else {
      // Имитация отправки SMS
      console.log(`📱 ИМИТАЦИЯ SMS отправлен на ${phone}: ${code}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({
        success: true,
        message: 'SMS отправлен (имитация)',
        to: phone,
        code: code,
        method: 'simulation'
      });
    }
  } catch (error) {
    console.error('Ошибка отправки SMS:', error);
    
    // Fallback на имитацию при ошибке Twilio
    console.log(`📱 FALLBACK: Имитация SMS отправлен на ${phone}: ${code}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({
      success: true,
      message: 'SMS отправлен (имитация при ошибке Twilio)',
      to: phone,
      code: code,
      method: 'fallback',
      error: error.message
    });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Backend сервер запущен на порту ${PORT}`);
  
  if (isTwilioConfigured()) {
    console.log(`📱 Twilio настроен для номера: ${process.env.TWILIO_PHONE_NUMBER}`);
  } else {
    console.log(`📱 Twilio не настроен - используется имитация SMS`);
  }
  
  console.log(`🔗 Тест: http://localhost:${PORT}/api/test`);
  console.log(`💳 Баланс: http://localhost:${PORT}/api/balance`);
});
