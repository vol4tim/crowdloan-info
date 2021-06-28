import Model from "../../models/email";
// import config from "../../consts";

export default {
  async save(req, res) {
    console.log(req.body);
    await Model.create({
      email: req.body.email,
      address: req.body.address,
    });

    res.send({
      result: true,
    });
  },
};
