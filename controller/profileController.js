const Profile = require("../models/profileSchema.js");

const analyze = async (req, res) => {
  const name = req.body.name;

  try {
    const [res1, res2, res3] = await Promise.all([
      fetch(`https://api.agify.io/?name=${name}`),
      fetch(`https://api.nationalize.io/?name=${name}`),
      fetch(`https://api.genderize.io/?name=${name}`),
    ]);

    const [age, nationalize, genderize] = await Promise.all([
      res1.json(),
      res2.json(),
      res3.json(),
    ]);

    if (!age || !nationalize || !genderize)
      return res.json({ message: "Error" });

    const countryId = nationalize.country.reduce((prev, current) =>
      prev.probability > current.probability ? prev : current,
    );

    const existing = await Profile.findOne({ name });
    if (existing)
      return res.json({ message: "Profile already exists", data: existing });

    const result = await Profile.create({
      name: age.name,
      gender: genderize.gender,
      age: age.age,
      count: age.count,
      countryId: countryId.country_id,
      probability: genderize.probability,
    });

    res.json({
      name: result.name,
      gender: result.gender,
      age: result.age,
      count: result.count,
      countryId: result.countryId,
      probability: result.probability,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports = analyze;
