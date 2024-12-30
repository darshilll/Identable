import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";

const router = new Router();

//=================== Schema ===================
import { loginSchema } from "./login";
import { socialLoginSchema } from "./socialLogin";
import { signupSchema } from "./signup";
import { sentOtpSchema } from "./sentOtp";
import { forgetPasswordSchema } from "./forgetPassword";
import { checkEmailSchema } from "./checkEmail";
import { verifyOtpSchema } from "./verifyOtp";
import { updatePasswordSchema } from "./updatePassword";
import { verifyResetPasswordLinkSchema } from "./verifyResetPasswordLink";

//=================== Services ===================
import { login } from "../../../services/auth/login";
import { socialLogin } from "../../../services/auth/socialLogin";
import { signup } from "../../../services/auth/signup";
import { sendOtp } from "../../../services/auth/sendOtp";
import { forgetPassword } from "../../../services/auth/forgetPassword";
import { checkEmail } from "../../../services/auth/checkEmail";
import { verifyOtp } from "../../../services/auth/verifyOtp";
import { updatePassword } from "../../../services/auth/updatePassword";
import { verifyResetPasswordLink } from "../../../services/auth/verifyResetPasswordLink";

//=================== Permission ===================

//=================== Route ===================

router.post(
  "/login",
  commonResolver.bind({
    modelService: login,
    isRequestValidateRequired: true,
    schemaValidate: loginSchema,
  })
);

router.post(
  "/socialLogin",
  commonResolver.bind({
    modelService: socialLogin,
    isRequestValidateRequired: true,
    schemaValidate: socialLoginSchema,
  })
);

router.post(
  "/signup",
  commonResolver.bind({
    modelService: signup,
    isRequestValidateRequired: true,
    schemaValidate: signupSchema,
  })
);

router.post(
  "/sendOtp",
  commonResolver.bind({
    modelService: sendOtp,
    isRequestValidateRequired: true,
    schemaValidate: sentOtpSchema,
  })
);

router.post(
  "/checkEmail",
  commonResolver.bind({
    modelService: checkEmail,
    isRequestValidateRequired: true,
    schemaValidate: checkEmailSchema,
  })
);

router.post(
  "/verifyOtp",
  commonResolver.bind({
    modelService: verifyOtp,
    isRequestValidateRequired: true,
    schemaValidate: verifyOtpSchema,
  })
);

router.post(
  "/updatePassword",
  commonResolver.bind({
    modelService: updatePassword,
    isRequestValidateRequired: true,
    schemaValidate: updatePasswordSchema,
  })
);

router.post(
  "/forgetPassword",
  commonResolver.bind({
    modelService: forgetPassword,
    isRequestValidateRequired: true,
    schemaValidate: forgetPasswordSchema,
  })
);

router.post(
  "/verifyResetPasswordLink",
  commonResolver.bind({
    modelService: verifyResetPasswordLink,
    isRequestValidateRequired: true,
    schemaValidate: verifyResetPasswordLinkSchema,
  })
);

export default router;
