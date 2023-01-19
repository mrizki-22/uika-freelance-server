import { Sequelize } from "sequelize";

const sequelize = new Sequelize("uika_freelance_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  define: {
    timestamps: false,
  },
  logging: false,
});

export default sequelize;
