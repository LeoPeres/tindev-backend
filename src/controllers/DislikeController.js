const Dev = require('../models/Dev');

module.exports = {
	async store(req, res) {
		const { id } = req.params;
		const authID = req.headers.user;

		const targetDev = await Dev.findById(id);
		const loggedDev = await Dev.findById(authID);

		if (!targetDev) {
			return res.status(400).json({ error: 'Dev not exists', id });
		}

		loggedDev.dislikes.push(targetDev._id);

		await loggedDev.save();

		return res.json({ loggedDev, targetDev });
	}
};
