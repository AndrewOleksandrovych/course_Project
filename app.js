const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const reportRoutes = require('./routes/report'); 

const app = express();
connectDB(); // Підключення до бази даних

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use('/fonts', express.static(__dirname + '/fonts')); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Підключення маршрутів
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);
app.use('/reports', reportRoutes); 

// Головна сторінка
app.get('/', (req, res) => {
  res.render('pages/index');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
