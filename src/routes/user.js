const Router = require("express").Router;
const {
  validateRegisterBody,
  validateLoginBody,
  validateUpdateUserBody,
} = require("../middlewares");
const UserController = require("../controllers/user");
const { verifyAccessTocken } = require("../helpers/jwt");
const router = Router();

router.post(
  "/update",
  verifyAccessTocken,
  validateUpdateUserBody,
  UserController.postUpdateUserInfo
);
router.get("/profile", verifyAccessTocken, UserController.getUserInfo);
router.post("/login", validateLoginBody, UserController.postLogin);
router.post("/register", validateRegisterBody, UserController.postRegister);
router.post("/refresh-token", UserController.postGenerateNewTokens);
router.delete("/logout", UserController.deleteLogout);
router.get("/admin", verifyAccessTocken, UserController.getAdminPageInfo);

module.exports = router;
