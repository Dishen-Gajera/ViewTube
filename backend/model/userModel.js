import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    photourl: {
      type: String,
      default: "",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    history:[
      {
        contentid:{
          type:mongoose.Schema.Types.ObjectId,
          refPath:"history.contenttype"
        },
        contenttype:{
          type:String,
          enum:["Video","Short"],
          required:true
        },
        watchedAt:{
          type:Date,
          default:Date.now
        }
      }
    ],

    resetotp: { type: String },
    otpexpires: { type: Date },
    isvarifiedotp: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
