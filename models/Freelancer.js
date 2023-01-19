import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Freelancer = sequelize.define("freelancer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  npm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nowa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.STRING,
  },
  profilePict: {
    type: DataTypes.STRING,
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  major: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  otp: {
    type: DataTypes.INTEGER,
  },

  isWaVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ktm: {
    type: DataTypes.STRING,
  },
});

export default Freelancer;
