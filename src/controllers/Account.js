const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast strings for security
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);


    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.username || !req.body.pass || !req.body.pass2 || !req.body.screenname) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      screenname: req.body.screenname,
    };

    const newAccount = new Account.AccountModel(accountData);

    newAccount.save((err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error ocurred' });
      }

      req.session.account = Account.AccountModel.toAPI(newAccount);

      return res.json({ redirect: '/maker' });
    });
  });
};

const nicknameChange = (req, res) => {
  // check whether the nickname change field is filled
  if (!req.body.newNickname) {
    return res.status(400).json({ error: 'Please enter a new Nickname' });
  }
  
  Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    //change nickname of active session
    req.session.account.screenname = req.body.newNickname;
    
    //change nickname in database
    docs.screenname = req.body.newNickname;
    docs.save();
    
    //return res.render('app', { csrfToken: req.csrfToken(), screenname: docs.screenname });
    return res.json({ redirect: '/maker' });
  });
};


module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.nicknameChange = nicknameChange;
