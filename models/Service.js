import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Service = sequelize.define("service", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  frontImg: {
    type: DataTypes.STRING,
  },
  images: {
    type: DataTypes.STRING,
  },
  freelancerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Service;
