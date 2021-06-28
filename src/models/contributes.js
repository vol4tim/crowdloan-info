import db from "./db";

const Model = db.sequelize.define("contributes", {
  block: {
    type: db.Sequelize.INTEGER,
  },
  signer: {
    type: db.Sequelize.STRING,
  },
  amount: {
    type: db.Sequelize.STRING,
  },
  amountUnit: {
    type: db.Sequelize.FLOAT,
  },
});

export default Model;
