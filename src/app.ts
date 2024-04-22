import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./infrastructure/router"
const port = process.env.PORT || 3001
const app = express()

const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.includes(origin)) {
      // Allow the request to proceed if the origin is in the whitelist
      callback(null, true);
    } else {
      // Reject the request with an error if the origin is not in the whitelist
      callback(new Error("Error of Cors"));
    }
  },
};

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.static('tmp'))
app.use(`/`,routes)

app.listen(port, () => console.log(`Ready...${port}`))