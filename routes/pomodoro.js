const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.render('Hindex');
});

// Progress route
router.get('/progress', (req, res) => {
  res.render('progress');
});

module.exports = router;
