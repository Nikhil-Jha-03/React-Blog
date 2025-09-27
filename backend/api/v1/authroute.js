import { Router } from "express";
import { RegisterUser, LoginUser } from "../../types.js";
import userModel from "../../Schema/UserSchema.js";
import bcrypt from "bcrypt";
import transporter from "../../config/nodemailer.js";
import jwt from 'jsonwebtoken'
import mailHtmlTemp from "./mailHtmlTemp.js";
import { isLoggedIn } from "../../middleware/isLoggedin.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ msg: "Base auth route" });
});

router.post("/login", async (req, res) => {
  try {
    const parsedData = LoginUser.safeParse(req.body);

    if (!parsedData.success) {
      const formattedErrors = parsedData.error.issues.map(e => ({
        field: e.path.join("."),
        message: e.message
      }));
      return res.status(400).json({
        success: false,
        error: formattedErrors
      })
    }

    const { email, password } = parsedData.data

    const userExist = await userModel.findOne({ email: email })
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "Email or Password incorrect"
      })
    }

    const hashedPassword = await bcrypt.compare(password, userExist.password);
    if (!hashedPassword) {
      return res.status(400).json({
        success: false,
        message: "Email or Password incorrect"
      })
    }

    const token = jwt.sign({ email: userExist.email }, process.env.JWT_SECRET, { expiresIn: '1d' })

    return res
      .setHeader("Authorization", `Bearer ${token}`)
      .status(200)
      .json({
        success: true,
        message: "User login successfully",
        token
      });


  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.post("/register", async (req, res) => {
  try {

    const parsedData = RegisterUser.safeParse(req.body);
    if (!parsedData.success) {
      const formattedErrors = parsedData.error.issues.map(e => ({
        field: e.path.join("."),
        message: e.message
      }));
      return res.status(400).json({
        success: false,
        error: formattedErrors
      })
    }

    const { name, email, password } = parsedData.data

    const userAlreadyExist = await userModel.findOne({ email: email })
    if (userAlreadyExist) {
      return res.status(409).json({
        success: false,
        message: "Account already exist"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    if (!hashedPassword) {
      return res.status(400).json({
        success: false,
        message: "something went wrong"
      })

    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' })

    const registerUser = new userModel({ name, email, password: hashedPassword })
    await registerUser.save()


    // Send Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome",
      text: `Welcome ${name} ${email}`,
      html: mailHtmlTemp({ name: name, type: 'welcome' })

    }

    // await transporter.sendMail(mailOptions)

    return res
      .setHeader("Authorization", `Bearer ${token}`)
      .status(200)
      .json({
        success: true,
        message: "User register successfully",
        token
      });

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

});

router.get("/getCurrentUser", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.userId }).select("email name _id isAccountVerified aiCredit");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.get("/sendVerifyEmail", isLoggedIn, async (req, res) => {

  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User Not found"
        })
    }

    if (user.isAccountVerified) {
      return res
        .json({
          success: false,
          message: "Account already verified"
        })
    }

    if (Date.now() - user.lastOtpSentAt > 120000) {
      // const otp = String(Math.floor(100000 + Math.random() * 900000));

      const otp = '123456'
      const hashOtp = await bcrypt.hash(otp, 10);

      user.verifyOtp = hashOtp;
      user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
      // help in rate limiting : Dont let user send another email within 2min time frame
      user.lastOtpSentAt = Date.now();
      await user.save()

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Verify your account - OTP inside",
        text: `Welcome ${user.name} ${user.email}`,
        html: mailHtmlTemp({ name: user.name, type: 'otp', otp: otp })
      }

      // await transporter.sendMail(mailOptions)

      return res
        .status(200)
        .json({
          success: true,
          message: "OTP send successfully"
        });
    }
    else {
      return res
        .status(401)
        .json({
          success: false,
          message: "Please wait 2 min before requesting otp again "
        });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.post("/verifyOtp", isLoggedIn, async (req, res) => {
  try {
    const userId = req.userId;

    const { otp } = req.body;

    if (!otp) {
      return res
        .status(400)
        .json({
          success: false,
          message: "OTP is required"
        })
    }

    const user = await userModel.findById(userId);


    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "User Not found"
        })
    }

    if (Date.now() < user.otpBlockedUntil) {
      return res.status(429)
        .json({
          success: false,
          message: "Not allowed to many otp attempt try again after 5 min"
        })
    }

    if (user.isAccountVerified) {
      return res
        .json({
          success: false,
          message: "Account already verified"
        })
    }

    if (!user.verifyOtp) {
      return res
        .status(401)
        .json({
          success: false,
          message: "OTP not generated for this account"
        })
    }


    if (Date.now() > user.verifyOtpExpireAt) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Otp expired"
        })
    }

    const userOptUnhashed = await bcrypt.compare(otp, String(user.verifyOtp));

    if (!userOptUnhashed) {
      if (user.otpFailedAttempts >= 5) {
        user.otpBlockedUntil = Date.now() + 5 * 60 * 1000;
        await user.save();
        return res.status(429)
          .json({
            success: false,
            message: "To many otp attempt try again after 5 min"
          })
      }
      user.otpFailedAttempts = user.otpFailedAttempts + 1;
      user.save();
      return res.status(401)
        .json({
          success: false,
          message: "Invalid Otp"
        })

    }

    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    user.isAccountVerified = true;
    user.lastOtpSentAt = 0;
    user.otpFailedAttempts = 0;
    user.otpBlockedUntil = 0;


    await user.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Account/Otp successfully verified"
      });


  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

});

router.get("/logout", isLoggedIn, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;
