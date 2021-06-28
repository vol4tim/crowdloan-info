import { getStatistic } from "../../models/table";
// import config from "../../consts";

export default {
  async all(req, res) {
    // let start = req.params.start || null;
    // let end = req.params.end || null;

    try {
      // console.log(where);
      const result = await getStatistic();

      res.send({
        result,
      });
      return;
    } catch (error) {
      console.log(error);
      res.send({
        error: "Error",
      });
    }
  },
};
