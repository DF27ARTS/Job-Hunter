require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const Card = require("./models/card");
const UserProfile = require("./models/user");

const { Router } = require("express");
const router = Router();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      logging: false,
      native: false,
      pool: {
        max: 3,
        min: 1,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        keepAlive: true,
      },
      ssl: true,
    })
  : new Sequelize(process.env.LOCAL_URL, {
      logging: false,
      native: false,
    }); 

Card(sequelize);
UserProfile(sequelize);

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const { userProfile, card } = sequelize.models;

userProfile.belongsToMany(card, {
  through: "user_card",
});
card.belongsToMany(userProfile, {
  through: "user_card",
});

module.exports = {
  database: sequelize,
  ...sequelize.models,
  router: router,
};
