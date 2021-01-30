const Matchmaking = require('../models/Matchmaking');
const User = require('../models/User');

exports.join = async (req, res, next) => {
    User.findById(req.body.userId)
        .then((user) => {
            const userRank = parseInt(user.rank);
            const newUser = new Matchmaking({
                playerId: req.body.userId,
                rank: userRank
            })
            newUser.save()
                .then(game => {
                    res.status(201).json({ message:'succefully join queue' });
                })
                .catch(error => {
                    res.status(401).json({ error });
                });
        })
}
