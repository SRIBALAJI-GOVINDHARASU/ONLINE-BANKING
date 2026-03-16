const crypto = require('crypto');

const generateAccountNumber = () => {
  // 12 digit account number
  return `AC${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 90 + 10)}`;
};

const generateAtmCardNumber = () => {
  return `4${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`;
};

const generateAtmPin = () => {
  return String(Math.floor(1000 + Math.random() * 9000));
};

const generateAtmCvv = () => {
  return String(Math.floor(100 + Math.random() * 900)).padStart(3, '0');
};

const generateAtmExpiry = () => {
  // MM/YY format - expires 3 years from now
  const now = new Date();
  const month = (`0${now.getMonth() + 1}`).slice(-2);
  const year = String(now.getFullYear() + 3).slice(-2);
  return `${month}/${year}`;
};

const generateMobilePassbookId = () => {
  return `MPB${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

module.exports = {
  generateAccountNumber,
  generateAtmCardNumber,
  generateAtmPin,
  generateAtmCvv,
  generateAtmExpiry,
  generateMobilePassbookId,
};
