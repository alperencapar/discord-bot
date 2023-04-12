module.exports = (messageContent) => {
  let clearedMessageContent = "";
  let messageContentArr = messageContent.split(" ");

  messageContentArr.map((element) => {
    let tempArr = [];
    let elementArr = [];
    elementArr = element.split("");

    elementArr.map((letter) => {
      if (tempArr[tempArr.length - 1] != letter) {
        tempArr.push(letter);
      }
    });

    let word = tempArr.join("");
    clearedMessageContent += `${word} `;
  });

  return clearedMessageContent;
};
