const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const app = express();

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // <---- ¡Añade esta línea!
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Cache control
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Routes
const indexRoutes = require("./src/routes/index");
const chrcRoutes = require('./src/routes/chrcRoutes');

app.use("/", indexRoutes);
app.use('/chrc', chrcRoutes); // Las rutas de chrcRoutes ahora empiezan con /chrc

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err.message });
});

// Start server
app.listen(app.get("port"), () => {
  console.log("Server on port " + app.get("port"));
});