const axios = require("axios");
const Sequelize = require('sequelize');
const { market_info } = require('../models');

axios.get('https://api.upbit.com/v1/market/all')
    .then(res => {
        for (let i = 0; i < res.data.length; i++) {
            market_info.create({
                    market: res.data[i].market,
                    korean_name: res.data[i].korean_name,
                    english_name: res.data[i].english_name
                }
            );
        }
    })
    .catch(error =>
        console.log('error')
    );
