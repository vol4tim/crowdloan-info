import db from "./db";

const Model = db.sequelize.define("email", {
  email: {
    type: db.Sequelize.STRING,
  },
  address: {
    type: db.Sequelize.STRING,
  }
});

export default Model;
