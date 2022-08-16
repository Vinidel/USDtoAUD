const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.json({message: 'hey'});
});

module.exports = router;
