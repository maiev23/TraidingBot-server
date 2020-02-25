'use strict';
module.exports = (sequelize, DataTypes) => {
  const market_info = sequelize.define('market_info', {
    market: DataTypes.STRING,
    korean_name: DataTypes.STRING,
    english_name: DataTypes.STRING
  }, {});
  market_info.associate = function(models) {
    // associations can be defined here
  };
  return market_info;
};
