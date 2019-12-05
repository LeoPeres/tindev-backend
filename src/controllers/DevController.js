const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
	async index(req, res) {
		const authID = req.headers.user;
		const loggedDev = await Dev.findById(authID);

		const devs = await Dev.find({
			$and: [
				{ _id: { $ne: authID } },
				{ _id: { $nin: loggedDev.likes } },
				{ _id: { $nin: loggedDev.dislikes } }
			]
		});

		return res.send(devs);
	},
	async store(req, res) {
		const { user } = req.body;

		const userExists = await Dev.findOne({ user });
		if (userExists) {
			return res.json(userExists);
		}

		const response = await axios.get(`https://api.github.com/users/${user}`);
		const { name, avatar_url: avatar, bio } = response.data;
		const dev = await Dev.create({
			name: name ? name : user,
			user,
			bio,
			avatar
		});
		return res.json(dev);
	}
};
