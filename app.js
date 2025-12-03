const express = require('express');
const path = require('path');
const session = require('express-session');
const hrRoutes = require('./routes/hrRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const academicRoutes = require('./routes/academicRoutes');
const flash = require('connect-flash');
const app = express();
const { config,sql } = require('./config/db');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));  
app.use(express. json());                         

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }  // 1 hour
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req. flash('error');
  res. locals.user = req.session. user || null;
  res.locals.isLoggedIn = req.session. isLoggedIn || false;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// ============ ROUTES ============
app.get('/', (req, res) => {
  res.render('login')
});
app.use('/hr', hrRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
// app. use('/academic', academicRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});