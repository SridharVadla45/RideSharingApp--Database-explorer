import { config } from "dotenv";

 config();

 const configuration={
    server:{
        port: process.env.SERVER_PORT || 3000,
    }
 }

 export default configuration;