const bcrypt = require('bcrypt');
const saltRounds = 10;

const plainPassword = 'smiths';

bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Hashed password for "smiths":');
  console.log(hash);
});