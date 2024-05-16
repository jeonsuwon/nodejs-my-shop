// schemas/todo.schema.js

import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  goodsNumber: {
    type: Number,
    required: true,
  },
  goodsName: {
    type: String,
    required: true,
  },
  goodsInfor: {
    type: String,
    required: false,
  },
  manager: {
    type: String,
    required: false,
  },
  PW: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  creatDate: {
    type: Date,
    required: false,
  },
  chageDate: {
    type: Date,
    required: false,
  },
});

export default mongoose.model("Shop", shopSchema);
