const JWT = require("jsonwebtoken");
const { redisClient, prefixREF, prefixACC } = require("./redis");

const signAccessToken = ({ userID, role }) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.ACCESS_KEY_SECRET;
    const payload = { role };
    const options = {
      expiresIn: "1d", //86400000
      issuer: "pitchouX",
      audience: userID,
    };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      redisClient.set(
        prefixACC + userID,
        token,
        "EX",
        86400000,
        (err, reply) => {
          if (err) return reject(err);
          return resolve(token);
        }
      );
    });
  });
};

const verifyAccessTocken = (req, res, next) => {
  if (!req.headers["authorization"])
    return res.status(401).json({ message: `unauthorized` });

  const authHeader = req.headers["authorization"];
  const accessToken = authHeader.split(" ")[1];

  JWT.verify(accessToken, process.env.ACCESS_KEY_SECRET, (err, payload) => {
    // if (err) {
    //   const error =
    //     err.name === "JsonWebTokenError"
    //       ? { message: `unauthorized` }
    //       : { message: err.message };
    //   return res.status(401).json(error);
    // }
    if (err) return res.status(401).json({ message: `unauthorized` });
    req.payload = payload;

    redisClient.get(prefixACC + payload.aud, (err, value) => {
      if (err) return res.sendStatus(500);
      if (value !== accessToken)
        return res.status(401).json({ message: `unauthorized` });
      return next();
    });
  });
};

const signRefreshToken = ({ userID, role }) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.REFRESH_KEY_SECRET;
    const payload = { role };
    const options = {
      expiresIn: "30 days", //172800000
      issuer: "pitchouX",
      audience: userID,
    };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);

      redisClient.set(
        prefixREF + userID,
        token,
        "EX",
        172800000,
        (err, reply) => {
          if (err) return reject(err);
          return resolve(token);
        }
      );
    });
  });
};

const verifyRefreshTocken = (refreshTocken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshTocken,
      process.env.REFRESH_KEY_SECRET,
      (err, payload) => {
        if (err) return reject({ message: `Unauthorized` });

        redisClient.get(prefixREF + payload.aud, (err, value) => {
          if (err) return res.sendStatus(500);
          if (value !== refreshTocken)
            return reject({ message: `Unauthorized` });
          return resolve(payload);
        });
      }
    );
  });
};

module.exports = {
  signAccessToken,
  verifyAccessTocken,
  signRefreshToken,
  verifyRefreshTocken,
};
