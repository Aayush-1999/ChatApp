const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    from:{
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
        }
      },
    to:{
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
        }
      },
    body:String
})

module.exports = mongoose.model("Message",MessageSchema);