import express from "express";
import dotenv from "dotenv";
import sequelize from "./models/db.js";
import cors from "cors";
import freelancerRoutes from "./routes/freelancer.js";
import serviceRoutes from "./routes/service.js";
import adminRoutes from "./routes/admin.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to API" });
});

//get faculties
app.get("/faculties", async (req, res) => {
  try {
    const [result] = await sequelize.query("SELECT * FROM faculties");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//get majors
app.get("/faculties/:fid/majors", async (req, res) => {
  const fid = req.params.fid;
  try {
    const [result] = await sequelize.query(`SELECT * FROM majors WHERE facultyId = ${fid}`);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get category
app.get("/categories", async (req, res) => {
  try {
    const [result] = await sequelize.query("SELECT * FROM categories");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use("/services", serviceRoutes);
app.use("/freelancers", freelancerRoutes);
app.use("/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

//connect to database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
