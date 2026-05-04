const Profile = require("../models/profileSchema.js");

const analyze = async (req, res) => {
  const name = req.query.name;

  try {
    const [res1, res2, res3] = await Promise.all([
      fetch(`https://api.agify.io/?name=${name}`),
      fetch(`https://api.nationalize.io/?name=${name}`),
      fetch(`https://https://api.genderize.io/?name=${name}`),
    ]);

    const [age, nationalize, genderize] = await Promise.all([
      res1.json(),
      res2.json(),
      res3.json(),
    ]);

    if (!genderize || !nationalize || !genderize)
      return res.json({ message: "Error" });

    const result = await Promise.create({
      name: age.name,
      gender: genderize.gender,
      age: age.age,
      count: genderize.count,
      genderProbability: genderize.genderProbability,
      nationality: nationalize.countryProb,
      countryId: nationalize.countryId,
    });

    res.json({
      name: result.name,
      gender: result.gender,
      age: result.age,
      count: result.count,
      genderProbability: result.genderProbability,
      nationality: result.nationality,
      countryId: result.countryId,
    });
  } catch (err) {
    res.json({ message: "console.error" });
  }
};

module.exports = analyze;
