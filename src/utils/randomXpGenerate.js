module.exports = (min = 25, max = 50) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
