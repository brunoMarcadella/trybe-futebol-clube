const userRegistered = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
};

const validLoginBody = {
  email: 'admin@admin.com',
  password: 'secret_admin',
}

const invalidEmailLoginBody = {
  email: 'invalid_eail',
  password: 'secret_admin',
}

const invalidPasswordLoginBody = {
  email: 'admin@admin.com',
  password: '123',
}

const wrongPassUser = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: 'wrong_password',
}

export {
  userRegistered,
  validLoginBody,
  invalidEmailLoginBody,
  invalidPasswordLoginBody,
  wrongPassUser,
};