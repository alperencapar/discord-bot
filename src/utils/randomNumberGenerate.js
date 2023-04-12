const getRandomValues = require("get-random-values");
module.exports = async (max = 99, countOfRandomNumber = 1) => {
  let randomNumArr = [];

  // With Math lib
  /*
    for (let i = 0; i <= countOfRandomNumber; i++) {
		let random = Math.random() * max;
		randomNumArr.push(random);
	}
    */

  let randomNums = await getRandomValues(new Uint8Array(10));

  while (randomNums) {
    for (const num of randomNums) {
      if (num <= max) {
        randomNumArr.push(num);
      }
    }
    if (countOfRandomNumber <= randomNumArr.length) break;
  }

  return randomNumArr;
};
