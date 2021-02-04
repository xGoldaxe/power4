const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
    if(true) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
            const user = new User({
                pseudo: req.body.pseudo,
                password: hash,
                rank: 0
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        res.status(401).json({ error: 'error' })
    }

};


exports.login = (req, res, next) => {
    User.findOne({ pseudo: req.body.pseudo })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SEED,
                            { expiresIn: '12h' }
                        )
                    });
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};

exports.information = (req, res, next) => {
    User.findById(req.body.userId)
        .then(user => {
            return res.status(200).json({
                pseudo : user.pseudo
            })
        })
        .catch(error => res.status(404).json({ error:'utilisateur non touvé' }));
}

exports.informationpseudo = (req, res, next) => {
    User.findOne({
        pseudo : req.body.pseudo
    })
        .then(user => {     
            return res.status(200).json({
                pseudo : user.pseudo,
                rank: user.rank,
                id : user._id
            })
        })
        .catch(error => res.status(404).json({ error:'utilisateur non touvé' }));
}

exports.getPseudoById = (userId) => {
    User.findById(userId)
        .then(user => {
            return user.pseudo
        })
        .catch(error => {return false});
}