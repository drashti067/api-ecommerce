require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/error.controller');

const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const categoryRoutes = require('./routes/category.routes');
const reviewRoutes = require('./routes/review.routes');

const userRoutes = require('./routes/user.routes');
const galleryRoutes = require("./routes/gallery.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const sliderRoutes = require("./routes/slider.routes");
const customerRoutes = require("./routes/customer.routes");


const MONGO_URI = process.env.MONGO_URI || "mongodb://ecom:error@13.233.203.30:27017/ecommerce";
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("connected to the database"))
  .catch((err) => console.log(err.message));

const app = express();

app.use(cors({
  withCredentials: true,
  origin: ['https://apibahujicholi.lehengabrand.com','http://localhost:4401','http://localhost:5501','https://bahujicholi.lehengabrand.com','http://admin.lehengabrand.com']
}));

app.use("/public", express.static(__dirname + "/public"))
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: false}));
app.use(cookieParser());

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use("/api/v1/gallery", galleryRoutes); 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/slider", sliderRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/customers", customerRoutes);


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});
app.use(GlobalErrorHandler);

app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});