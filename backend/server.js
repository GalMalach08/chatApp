const express = require("express");
require("dotenv").config();

const app = express();

app.get("/api/chat", (req, res) => {
  res.send({ mes: "meson" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server runs on port ${PORT}`));
