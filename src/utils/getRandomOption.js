module.exports = (options) => {
    let randomNum = Math.floor(Math.random() * options.length);
    return options[randomNum]
}