const NameProfile = require("../models/profileSchema.js");

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

		const existing = await NameProfile.findOne({ name });
		if (existing)
			return res.json({
				message: "NameProfile already exists",
				data: existing,
			});

		const result = await nameprofile.create({
			name: age.name,
			gender: genderize.gender,
			age: age.age,
			count: age.count,
			countryId: countryId.country_id,
			probability: genderize.probability,
		});

		res.json({
			_id: result._id,
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

const getAnalyze = async (req, res) => {
	const { gender, countryId } = req.query;
	const sort = req.query.sort;
	const order = req.query.order === "desc" ? -1 : 1;
	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit

	try {
		const filter = {};

		if (gender) filter.gender = gender;
		if (countryId) filter.countryId = countryId;
		const result = await NameProfile.find(filter).sort({ [sort]: order }).limit(limit).skip(skip);
		res.json(result);
	} catch (err) {
		res.json({ message: err.message });
	}
};

const getId = async (req, res) => {
	const userId = req.params.id;
	try {
		const result = await NameProfile.findById(userId);
		res.json(result);
	} catch (err) {
		res.json({ message: err.message });
	}
};
const deleteId = async (req, res) => {
	const userId = req.params.id;
	try {
		const result = await NameProfile.findByIdAndDelete(userId);
		res.json(result);
	} catch (err) {
		res.json({ message: err.message });
	}
};
module.exports = { analyze, getAnalyze, getId, deleteId };
