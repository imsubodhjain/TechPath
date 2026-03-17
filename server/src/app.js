const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { NODE_ENV } = require('./config/env');

const roadmapRoutes = require('./routes/roadmapRoutes');
const toolRoutes = require('./routes/toolRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/tools', toolRoutes);

// Search endpoint
const { searchAll } = require('./controllers/searchController');
app.get('/api/search', searchAll);

app.use(errorHandler);

module.exports = app;
