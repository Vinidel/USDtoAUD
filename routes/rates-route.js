const express = require('express');
const { getAllByDate } = require('../services/rates-service');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const { query } = req;
    const dateString = query.date;
    const result = await getAllByDate(dateString);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(error.status).json(error.data);
  }
});

module.exports = router;
