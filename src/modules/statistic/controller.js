import { getStatistic } from "../../models/table";

export default {
  async all(req, res) {
    try {
      const result = await getStatistic();

      res.send({
        result: result[0],
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
