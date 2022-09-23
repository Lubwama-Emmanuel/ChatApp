const moment = require("moment");

function formatMessage(username, message) {
  return {
    username,
    message,
    time: moment().format("LT"),
  };
}

module.exports = formatMessage;
