const bcrypt = require('bcryptjs')
  const admin = [
      {
        name:'Admin doe',
        email: 'admin@gmail.com',
        phone: 07035061222,
        password: bcrypt.hashSync('1234', 10),
        isAdmin: true,
        isVerified: false
      },

    ]

module.exports = admin;