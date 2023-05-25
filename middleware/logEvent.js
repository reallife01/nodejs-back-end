const { v4: uuid } = require("uuid");
const { format } = require("date-fns");

const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

const logEvents = async (message, logName) => {
    const dateTime = format(new Date(), 'yyyy-MM-dd\t\tHH:mm:ss');
    console.log(dateTime);
    const logItems = `${dateTime}\t${uuid()}\t ${message}\n`;
    console.log(logItems);
    try {
        if(!fs.existsSync(path.join(__dirname, "..", "logs"))){
            await fsPromises.mkdir(path.join(__dirname, "..", 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logName), logItems);
    } catch (error) {
        console.error(error);
    }
   
}

const logger = (req, res, next) => {
    console.log(`${req.method}\n${req.path}`)
      logEvents(`${req.method}\t${req.path}\t${req.headers.origin}`, 'reqLog.txt')
      next()
}

module.exports = {logEvents, logger}