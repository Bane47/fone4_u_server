// const express = require("express");
// const feedbackModel = require("../models/feedbackModel");
// const router = express.Router();


// router.post("/feedback", async (req, res) => {
//     try {
//       const { msg, userEmail } = req.body; // Destructure msg and userEmail from req.body
//       const FeedBack = await feedbackModel.create({
//         msg,
//         userEmail
//       });
  
//       res.status(200).json(FeedBack);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Server error" });
//     }
//   });
  

// router.get("/getFeed", async (req, res) => {
//   try {
//     const message = await feedbackModel.find();
//     console.log(message)
//     res.status(200).json(message);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// router.delete("/deletefeed/:id", async (req, res) => {
//   try {
//     const  id  = req.params.id;

//     const DeleteMsg = await feedbackModel.findByIdAndDelete(id);

//     if (!DeleteMsg) {
//       return res.status(404).json({ message: "No messages found" });
//     }
//      res.json({ message: "Message deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     req.status(500).json({ message: "Server Error Occured" });
//   }
// });

// module.exports = router;



const express = require("express");
const messageModel = require("../models/feedbackModel");
const router = express.Router();


router.post("/feedbackMessage", async (req, res) => {
  try {
    const { message,email } = req.body;
console.log(email)
    const Saved_Message = await messageModel.create({
      message,
      email
    });
console.log(Saved_Message)
    res.status(200).json(Saved_Message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/Get-Message", async (req, res) => {
  try {
    const message = await messageModel.find();
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/delete-message/:messageId", async (req, res) => {
  try {
    const  messageId  = req.params.messageId;

    const deleteMessage = await messageModel.findByIdAndDelete(messageId);

    if (!deleteMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
     res.json({ message: "Message deleted" });
  } catch (error) {
    console.log(error);
    req.status(500).json({ message: "Server Error Occured" });
  }
});

module.exports = router;
