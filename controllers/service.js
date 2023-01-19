import Service from "../models/Service.js";
import sequelize from "../models/db.js";

export const addService = async (req, res) => {
  let { name, description, price, categoryId, freelancerId } = req.body;
  let frontImg = req.files.frontImg[0].filename;
  let images = req.files.images.map((img) => img.filename);

  try {
    await Service.create({
      name,
      description,
      price,
      frontImg,
      images: images.toString(),
      categoryId,
      freelancerId,
    });
    res.status(201).json({ message: "Berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
    console.log(error.message);
  }
};

//untuk tampilan card di halaman dashboard freelancer
export const getServicesCards = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await sequelize.query(
      `select services.id as serviceId, services.name as serviceName, services.price, services.frontImg, freelancers.id as freelancerId, freelancers.name as freelancerName, freelancers.profilePict from freelancers, services
      where freelancers.id = services.freelancerId and services.freelancerId = ${id}`
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
    console.log(error.message);
  }
};

//untuk tampilan di halaman services di user
export const getServices = async (req, res) => {
  try {
    const [result] =
      await sequelize.query(`select services.id as serviceId, services.name as serviceName, services.price, services.frontImg, freelancers.id as freelancerId, freelancers.name as freelancerName, freelancers.profilePict from freelancers, services
    where services.freelancerId = freelancers.id order by rand() limit 32`);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
    console.log(error.message);
  }
};

export const getServicesByCategory = async (req, res) => {
  let category = req.params.categoryName;
  try {
    const [result] = await sequelize.query(
      `select services.id as serviceId, services.name as serviceName, services.price, services.frontImg, freelancers.id as freelancerId, freelancers.name as freelancerName, freelancers.profilePict, services.categoryId, categories.name as categoryName from freelancers, services, categories where services.freelancerId = freelancers.id and services.categoryId = categories.id and  categories.name = "${category}" order by rand();`
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
    console.log(error.message);
  }
};

export const getServicesBySearch = async (req, res) => {
  const { s } = req.query;
  try {
    const [result] = await sequelize.query(
      `select services.id as serviceId, services.name as serviceName, services.price, services.frontImg, freelancers.id as freelancerId, freelancers.name as freelancerName, freelancers.profilePict from freelancers, services
      where services.freelancerId = freelancers.id and (services.name like '%${s}%' or freelancers.name like '%${s}%')`
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
    console.log(error.message);
  }
};

export const getDetailService = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await sequelize.query(
      `select s.id as serviceId, s.name as serviceName, s.description, s.price, s.images, f.id as freelancerId, f.name as freelancerName, f.nowa, f.profilePict, c.id as categoryId, c.name as categoryName 
      from services as s join freelancers as f on s.freelancerId = f.id join categories as c on s.categoryId = c.id and s.id = ${id}`
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
    console.log(error.message);
  }
};
