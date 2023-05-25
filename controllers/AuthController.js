const userDB = {
    users: require('../models/users.json'),
    setUser: function(data) {
        this.users = data;
    },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const path = require("path");
const fsPromise = require("fs/promises");

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    if(!user || !pwd)
    return res
    .status(400)
    .json({message: "Username and password required"});
    const foundUser = userDB.users.find((person)=>person.username === user)
    if(!foundUser)
    return res
    .status(401)
    .json({message: "User is not found"});

    //EVALUTE PASSWORD
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match){
        //Create JWTs
        const accessToken = jwt.sign({username: foundUser.username},
            process.env.ACCESS_TOKEN_SECRET_KEY,
            {expiresIn: '30s'}
            );
            // Refresh Token
        const refreshToken = jwt.sign({username: foundUser.username},
            process.env.REFRESH_TOKEN_SECRET_KEY,
            {expiresIn: '1d'}
            );

            //Saving the refresh token with current user 
            const otherUser = userDB.users.filter(person => person.username !== foundUser.username)
            const currentUser = {...foundUser, refreshToken};
            userDB.setUser([...otherUser, currentUser]);

            await fsPromise.writeFile(
                path.join(__dirname, '../', 'models', 'user.json'),
                JSON.stringify(userDB.users)
            );

            res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});

    return res
    .status(200)
    .json({accessToken});
}
    else {
        return res.status(401).json({message: "Check the password and try again"})
    };


}

module.exports = handleLogin