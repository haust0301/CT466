const mongoose = require("mongoose");

// Ket noi co so du lieu
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Kết nối thành công đến cơ sở dữ liệu");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dbConnection,
};
