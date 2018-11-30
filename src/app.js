import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import controller from './controller';
import { PORT } from './config';

const app = express();

/* Server middlewares */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
/* Server middlewares */

app.post('/', controller.retrieveCourses);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
