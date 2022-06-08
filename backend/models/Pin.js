const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
   username:{
       type: String,
       require: true,
       min : 0,
       max: 5
   },
   lat:{
       type: Number, 
       require: true
   },
   long : {
       type: Number,
       require: true
   },
   title: {
    type: String,
    required: true,
    min: 3,
    max: 60,
  },
  desc: {
    type: String,
    required: true,
    min: 3,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },

},
{timestamps: true}
);

module.exports = mongoose.model("Pin",PinSchema);

