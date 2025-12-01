const express = require('express');
const path = require('path');
const session = require('express-session');
const hrRoutes = require('./routes/hrRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const academicRoutes = require('./routes/academicRoutes');

const app = express();

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

app.use(express.static(path.join(__dirname, 'public')));

// ============ ROUTES ============
app.get('/', (req, res) => {
  res.render('login');
});

app.use('/hr', hrRoutes);
app.use('/auth', authRoutes);
// app.use('/admin', adminRoutes);
// app. use('/academic', academicRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});