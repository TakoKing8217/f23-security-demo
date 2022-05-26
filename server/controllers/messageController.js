const bcrypt = require("bcryptjs");
const chats = [];

module.exports = {
  handleMessage: (req, res) => {
    const { pin, message } = req.body;
    for (let i = 0; i < chats.length; i++) {
      const existing = bcrypt.compareSync(pin, chats[i].pinHash);
      if (existing) {
        chats[i].messages.push(message);
        let messagesToReturn = { ...chats[i] };
        delete messagesToReturn.pinHash;
        res.status(200).send(messagesToReturn);
        return;
      }
    }
    const salt = bcrypt.genSaltSync(5);
    const pinHash = bcrypt.hashSync(pin, salt);
    let messageObj = {
      pinHash,
      messages: [message],
    };
    chats.push(messageObj);
    let messagesToReturn = { ...messageObj };
    delete messagesToReturn.pinHash;
    res.status(200).send(messagesToReturn);
  },
};
