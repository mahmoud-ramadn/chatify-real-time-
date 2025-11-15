import express from "express";

const router = express.Router();

router.get("/send-messages", (req, res) => {
  res.send("Messages EndPoint");
});

export default router;
