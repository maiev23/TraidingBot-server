'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    sKey: DataTypes.STRING,
    aKey: DataTypes.STRING,
    salt: DataTypes.STRING,
    key: DataTypes.STRING,
    iv: DataTypes.STRING
  }, {
    timestamps: false,
    hooks: {
      beforeCreate: (data, option) => {
        var shasum = crypto.createHmac('sha512', 'thisismysecretkey');
        shasum.update(data.password);
        data.password = shasum.digest('hex');
      },
      beforeFind: (data, option) => {
        if (data.where.password) {
          var shasum = crypto.createHmac('sha512', 'thisismysecretkey');
          shasum.update(data.where.password);
          data.where.password = shasum.digest('hex');
        }
      }
    }
  });
  return users;
};