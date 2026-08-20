require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbService = require('../services/db.service');

const loginFunc = async (req, res, Schema) => {
  try {
    const { email, password } = req.body;
    const query = { email };

    const dbRes = await dbService.findOneRecord(query, Schema);

    if (dbRes) {
      const isMatch = await bcrypt.compare(password, dbRes.password);

      if (isMatch) {
        if (dbRes.isActive) {
          // Safely convert Mongoose document to a plain JavaScript object
          const plainUser = dbRes.toObject();
          delete plainUser.password;

          const payload = {
            ...plainUser,
            _id: dbRes._id.toString()
          };

          const secretKey = process.env.JWT_SECRET ;

          // Generate token synchronously
          const token = jwt.sign(
            payload,
            secretKey,
            { expiresIn: '3h' }
          );

          return res.status(200).json({
            message: 'Data Found',
            isLogged: true,
            token
          });
        } else {
          return res.status(401).json({
            message: 'You are not active member',
            isLogged: false
          });
        }
      } else {
        return res.status(401).json({
          message: 'Invalid credentials',
          isLogged: false
        });
      }
    } else {
      return res.status(401).json({
        message: 'Invalid credentials',
        isLogged: false
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: 'Internal server error',
      isLogged: false,
      error: error.message
    });
  }
};

module.exports = {
  loginFunc
};