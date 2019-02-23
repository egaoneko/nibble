import express from 'express';
import compression from 'compression';  // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import dotenv from 'dotenv';
import mongo from 'connect-mongo';
import flash from 'express-flash';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import bluebird from 'bluebird';
import cors from 'cors';
import {
  MONGODB_URI,
  SESSION_SECRET,
} from './util/secrets';
import Swagger from './config/swagger-def';
import {
  Request,
  Response,
} from 'express';

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env.example' });

// Controllers (route handlers)
import authRouter from './routes/auth';
import oauthRouter from './routes/oauth';

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl: string = MONGODB_URI;
(mongoose as any).Promise = bluebird;
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  },
).catch((err: any) => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  // process.exit();
});
mongoose.set('useCreateIndex', true);

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(cors({
  origin: [
    'http://127.0.0.1:8080',
    'http://localhost:8080',
    'http://myapp.com:8080',
  ],
  credentials: true,
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true,
  }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }),
);

/**
 * Primary app routes.
 */
app.get('/', (req: Request, res: Response): void => {
  res.redirect('/api-docs');
});
app.use('/', authRouter);

/**
 * API examples routes.
 */
app.use('/api-docs', Swagger.swaggerUi.serve, Swagger.swaggerUi.setup(Swagger.spec));

/**
 * OAuth authentication routes. (Sign in)
 */
app.use('/oauth', oauthRouter);

export default app;
