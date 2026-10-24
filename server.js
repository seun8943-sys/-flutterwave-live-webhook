const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// Read JSON request bodies.
app.use(express.json());

// Health check to confirm the server is running.
app.get("/", (req, res) => {
  res.status(200).send("Flutterwave webhook server is running.");
});

// Flutterwave V3 webhook endpoint.
app.post("/flw-webhook", (req, res) => {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.get("verif-hash");

  if (!secretHash || !signature) {
    return res.status(401).send("Unauthorized");
  }

  const expected = Buffer.from(secretHash);
  const received = Buffer.from(signature);

  if (
    expected.length !== received.length ||
    !crypto.timingSafeEqual(expected, received)
  ) {
    return res.status(401).send("Invalid webhook signature");
  }

  // The webhook passed the V3 secret-hash check.
  // Payment processing and transaction verification
  // must be implemented before fulfilling orders.
  console.log("Verified Flutterwave webhook received.");

  return res.sendStatus(200);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
