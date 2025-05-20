const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const SETTINGS_PATH = path.join(__dirname, '../settings.json');

// GET current S.Y.
router.get('/api/settings/sy', (req, res) => {
  try {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    res.json({ sy: settings.sy });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read S.Y. setting.' });
  }
});

// POST update S.Y.
router.post('/api/settings/sy', (req, res) => {
  const { sy } = req.body;
  if (!sy || typeof sy !== 'string') {
    return res.status(400).json({ error: 'Invalid S.Y. value.' });
  }
  try {
    let settings = {};
    if (fs.existsSync(SETTINGS_PATH)) {
      settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    }
    settings.sy = sy;
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    res.json({ sy: settings.sy });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update S.Y. setting.' });
  }
});

module.exports = router; 