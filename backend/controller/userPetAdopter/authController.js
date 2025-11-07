const adopterService = require('../../services/adopterService');

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  return re.test(String(email || '').toLowerCase());
}

function validatePhone(phone) {
  const re = /^[+()\d\s-]{7,20}$/;
  return re.test(String(phone || ''));
}

async function signUpUser(req, res) {
  const payload = req.body || {};

  if (!payload.adopterFName || !payload.adopterLName || !payload.adopterEmail || !payload.adopterPassword) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  if (!validateEmail(payload.adopterEmail)) return res.status(400).json({ success: false, message: 'Invalid email format.' });
  if (payload.adopterPhone && !validatePhone(payload.adopterPhone)) return res.status(400).json({ success: false, message: 'Invalid phone number.' });
  if (typeof payload.adopterPassword !== 'string' || payload.adopterPassword.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

  try {
    const { adopterId } = await adopterService.signUp(payload);
    return res.status(201).json({ success: true, message: 'Signup successful', adopterId });
  } catch (err) {
    console.error('signup controller error:', err && err.message ? err.message : err);
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ success: false, message: err && err.message ? err.message : 'Failed to create account.' });
  }
}

async function loginUser(req, res) {
  const payload = req.body || {};
  if (!payload.adopterEmail || !payload.adopterPassword) return res.status(400).json({ success: false, message: 'Email and password are required.' });
  try {
    const result = await adopterService.login(payload);
    return res.json({ success: true, message: 'Login successful', ...result });
  } catch (err) {
    console.error('login controller error:', err && err.message ? err.message : err);
    const status = err && err.status ? err.status : 500;
    return res.status(status).json({ success: false, message: err && err.message ? err.message : 'Login failed.' });
  }
}

module.exports = { signUpUser, loginUser };

