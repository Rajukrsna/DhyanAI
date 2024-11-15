const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');  // Import connect-flash
 
require('./config/passport')(passport);  
require('dotenv').config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Use connect-flash middleware
app.use(flash());  // Must be placed after session and passport initialization

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success');
  res.locals.error_message = req.flash('error');
  next();
});

// Import Routes
const habitRoutes = require('./routes/habits');
const nutritionRoutes = require('./routes/nutrition');

const dashboardRouter = require('./routes/dashboard'); 
const authRouter = require('./routes/auth');  
const sympRouter = require('./routes/symptom');
const chatbotRoute = require('./routes/chatbot');  
const generateRoute = require('./routes/generate');
const recommendYoga = require('./routes/yogas');
// Routes

app.use('/auth', authRouter);
app.use('/habits', habitRoutes);
app.use('/nutrition', nutritionRoutes);
app.use('/symptom', sympRouter)
app.use('/dashboard', dashboardRouter);
app.use('/chatbot', chatbotRoute);  
app.use('/generate', generateRoute);
app.use('/yogas' , recommendYoga);

// Home Route
app.get('/', (req, res) => res.redirect('/auth/login'));

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
