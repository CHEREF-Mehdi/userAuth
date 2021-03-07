const User = require("../models/user");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshTocken,
} = require("../helpers/jwt");

const { redisClient, prefixREF, prefixACC } = require("../helpers/redis");

class UserController {
  static async postRegister(req, res, next) {
    const { username, password } = req.body;
    try {
      const foundUser = await User.findOne({ username });

      if (foundUser) {
        return res
          .status(409)
          .json({ message: "Account with the same username already exists." });
      }

      const user = new User({ username, password });
      await user.save();
      const payload = {
        userID: user.id,
        role: user.role,
      };
      const accessToken = await signAccessToken(payload);
      const refreshTocken = await signRefreshToken(payload);

      return res.status(200).json({
        message: "account created successfully",
        accessToken,
        refreshTocken,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  static async postLogin(req, res, next) {
    const { username, password } = req.body;
    try {
      const foundUser = await User.findOne({ username });

      if (!foundUser) {
        return res.status(401).json({
          message: `User Credentials are Invalid`,
        });
      }

      const validPassword = await foundUser.isValidPassword(password);

      if (!validPassword) {
        return res.status(401).json({
          message: "User Credentials are Invalid",
        });
      }
      const payload = {
        userID: foundUser.id,
        role: foundUser.role,
      };
      const accessToken = await signAccessToken(payload);
      const refreshTocken = await signRefreshToken(payload);

      return res.json({
        message: "Logged in Successfully",
        accessToken,
        refreshTocken,
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  static async getUserInfo(req, res, next) {
    const payload = req.payload;

    try {
      const user = await User.findOne({ _id: payload.aud });

      if (!user) {
        return res.status(404).json({
          message: `User not found`,
        });
      }

      return res.status(200).json({
        message: "ok",
        user: { username: user.username, role: user.role },
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  static async postUpdateUserInfo(req, res, next) {
    const payload = req.payload;
    const { username, password, oldPassword } = req.body;
    try {
      const user = await User.findOne({ _id: payload.aud });
      const valid = await user.isValidPassword(oldPassword);
      if (valid) {
        user.username = username;
        user.password = password;
        await user.save();

        return res.status(200).json({
          message: "ok",
          user: { username: user.username, role: user.role },
        });
      }

      return res.status(401).json({
        message: "Incorrect password",
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  static async postGenerateNewTokens(req, res, next) {
    try {
      const oldRefreshTocken = req.body.refreshTocken;

      if (oldRefreshTocken) {
        try {
          const payload = await verifyRefreshTocken(oldRefreshTocken);
          const newPayload = { userID: payload.aud, role: payload.role };
          const accessToken = await signAccessToken(newPayload);
          const refreshTocken = await signRefreshToken(newPayload);

          return res.status(200).json({ accessToken, refreshTocken });
        } catch (error) {
          return res.status(401).json({ message: `Unauthorized` });
        }
      }

      return res.sendStatus(400);
    } catch (error) {
      return res.sendStatus(500);
    }
  }

  static async deleteLogout(req, res, next) {
    const { refreshTocken } = req.body;
    if (refreshTocken) {
      try {
        const payload = await verifyRefreshTocken(refreshTocken);

        redisClient.del(prefixACC + payload.aud, (err, val) => {
          if (err) return res.sendStatus(500);
          if (!val) return res.status(401).json({ message: `Unauthorized` });
        });

        redisClient.del(prefixREF + payload.aud, (err, val) => {
          if (err) return res.sendStatus(500);
          if (!val) return res.status(401).json({ message: `Unauthorized` });
        });

        return res.sendStatus(204);
      } catch (error) {
        return res.status(401).json({ message: `Unauthorized` });
      }
    }
    return res.sendStatus(400);
  }

  static async getAdminPageInfo(req, res, next) {
    const { payload } = req;
    if (payload.role === 1) {
      try {
        const user = await User.findOne({ _id: payload.aud });
        const sendUser = { username: user.username, role: user.role };
        const usersList = await User.find({}, { id: 1, username: 1, role: 1 });

        return res.status(200).json({ user: sendUser, usersList });
      } catch (error) {
        return res.sendStatus(500);
      }
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
} //end class

module.exports = UserController;
