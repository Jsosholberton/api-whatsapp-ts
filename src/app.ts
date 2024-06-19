import "dotenv/config"
import express from "express"
import cors from "cors"
import routes from "./infrastructure/router"
import https from "https"
import fs from "fs"

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

const privateKeyPath = "/etc/letsencrypt/live/api.johnatanortiz.tech-0001/privkey.pem";
const certificatePath = "/etc/letsencrypt/live/api.johnatanortiz.tech-0001/fullchain.pem";

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Ready...${port}`);
});