const express = require('express');
const router = express.Router();

module.exports = router;

router.post('/test',(req,res) => {
  res.send('test')
});
