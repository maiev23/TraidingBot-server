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
    timestamps: false
 
  });
  return users;
};