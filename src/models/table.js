import db from "./db";
// import config from "../consts";

const Model = db.sequelize.define("list", {
  block: {
    type: db.Sequelize.INTEGER,
  },
  timestamp: {
    type: db.Sequelize.INTEGER,
  },
  count: {
    type: db.Sequelize.INTEGER,
  },
  amount: {
    type: db.Sequelize.STRING,
  },
  amountUnit: {
    type: db.Sequelize.FLOAT,
  },
});

export default Model;

// export async function getStatistic() {
//   return "123";
// }
export async function getStatistic() {
  const sql = `
    select block, timestamp, count, amount, amountUnit, interval
    from
    (
      select *, datetime((timestamp/1000/300)*300, 'unixepoch') interval from lists ORDER by block desc
    )  as t
    group by interval
  `;
  return await db.sequelize.query(sql, {
    // replacements,
    type: db.sequelize.QueryTypes.SELECT,
  });
}

// export function getEndBlock(release) {
//   return Model.findOne({
//     attributes: ["block"],
//     where: { release },
//     order: [["block", "DESC"]],
//     raw: true
//   }).then(row => {
//     return row ? row.block : config.startBlockParse;
//   });
// }
