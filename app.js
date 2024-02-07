import  express from "express";
//import morgan from "morgan"
import errorMiddleware from "./middlewares/errorsMiddleware"
import auth from "./routes/auth" 
import withdrawal from "./routes/withdrawal"
import webhook from "./routes/webhook" 
import user from "./routes/user"
import payment from "./routes/payments"
import atm from "./routes/atm"
import cors from "cors"; 



const app = express();

app.use(cors());
//app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));//to handle url encoded data 


app.use('/api/v1',auth); 
app.use('/api/v1/withdrawal',withdrawal);
app.use('/api/v1/webhook',webhook);
app.use('/api/v1',user); 
app.use('/api/v1/payment',payment);
app.use('/api/v1/atm',atm);


//Middleware to handle errors
app.use(errorMiddleware);

export default app;