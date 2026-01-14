import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";

export const signUP = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let photourl;
    if (req.file) {
      photourl = await uploadOnCloudinary(req.file.path);
    }

    const exitUser = await User.findOne({ email });
    if (exitUser) {
      return res.status(400).json({ message: "user already exist" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "invalid email" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedpassword,
      photourl,
    });
    const token = await genToken(user._id);
    res.cookie("token", token, {
      httponly: true,
      secure: true,
      samesite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "signup error " + error });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httponly: true,
      secure: true,
      samesite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "SignIn error" + error });
  }
};

export const signOut = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ messgae: "signout successfully" });
  } catch (error) {
    return res.status(500).json({ message: "signout error" + error });
  }
};

export const googleAuth = async (req, res) => {
  console.log("come");
  try {
    const { username, email, photourl } = req.body;
    let googlePhoto = photourl;
    if (photourl) {
      googlePhoto = await uploadOnCloudinary(photourl);
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ username, email, photourl: googlePhoto });
    } else {
      if (!user.photourl && googlePhoto) {
        user.photourl = googlePhoto;
        await user.save();
      }
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httponly: true,
      secure: true,
      samesite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "google auth error" + error });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    const otp = Math.round(1000 + Math.random() * 9000).toString();
    await sendMail(email, otp);
    user.resetotp = otp;
    user.otpexpires = Date.now() + 5 * 60 * 1000;
    user.isvarifiedotp = false;
    await user.save();
    return res
      .status(200)
      .json({ message: "otp sent to your mail successfully" });
  } catch (error) {
    return res.status(500).json({ message: "send Otp error" + error });
  }
};

export const varifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetotp !== otp || user.otpexpires < Date.now) {
      return res.status(400).json({ message: "Invalid otp" });
    }
    user.isvarifiedotp = true;
    await user.save();
    return res.status(200).json({ message: "otp varified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "varify otp error" + error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isvarifiedotp) {
      return res
        .status(200)
        .json({ message: "please conmplate otp varifactoin process first" });
    }
    user.resetotp = undefined;
    user.otpexpires = undefined;
    user.isvarifiedotp = false;
    const hashpass = await bcrypt.hash(password, 10);
    user.password = hashpass;
    await user.save();
    return res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "reset pass error" + error });
  }
};
