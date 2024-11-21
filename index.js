const  express  = require("express");
const routes = require("./routes/index");
const app = express();

app.use(express.json());

app.use("/api/v1",routes);

app.listen((5000),()=>{
    console.log("Server is Running on 5000")});
