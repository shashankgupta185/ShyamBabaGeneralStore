const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const { initDB } = require("./models/schema");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Log format with response time
morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);
app.use((req, res, next) => {
  const oldSend = res.send;

  res.send = function (data) {
    console.log("📤 RESPONSE: - server.js:31", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      body: data,
    });

    return oldSend.apply(res, arguments);
  };

  next();
});

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date() }),
);

app.use((err, req, res, next) => {
  console.error("❌ ERROR: - server.js:55", {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({ error: "Internal Server Error" });
});

process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION: - server.js:66", err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION: - server.js:70", err);
});
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`,
      );
    });
  } catch (err) {
    console.error("Failed to start server: - server.js:81", err.message);
    process.exit(1);
  }
};

startServer();
