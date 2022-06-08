const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
// ---------------------------------------------------------------------------------------------
const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/MapProjectDB",{useNewUrlParser: true}) .then(() => console.log("MongoDB connected!"))
.catch(err => console.log(err));

app.use("/api/pins/",pinRoute); 
app.use("/api/users", userRoute);

app.listen(3001,()=>{
    console.log("server runnign at port 3000");
})

