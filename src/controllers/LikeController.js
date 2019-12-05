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

		if (targetDev.likes.includes(loggedDev._id)) {
			const loggedSocket = req.connectedUsers[authID];
			const targetSocket = req.connectedUsers[id];

			if (loggedSocket) {
				req.io.to(loggedSocket).emit('match', targetDev);
			}

			if (targetSocket) {
				req.io.to(targetSocket).emit('match', loggedDev);
			}
		}

		loggedDev.likes.push(targetDev._id);

		await loggedDev.save();

		return res.json({ loggedDev, targetDev });
	}
};
