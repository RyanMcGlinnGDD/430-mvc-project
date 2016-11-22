const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

const chat = (req, res) => {
  res.render('chat', {
    csrfToken: req.csrfToken(),
    screenname: req.session.account.screenname,
    username: req.session.account.username,
  });
};

// export the relevant public controller functions
module.exports = {
  notFound,
  chat,
};

module.exports.Account = require('./Account.js');
module.exports.Domo = require('./Domo.js');

