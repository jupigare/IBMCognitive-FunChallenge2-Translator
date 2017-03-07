/**
 * The application entry point
 */

import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import domainMiddleware from 'express-domain-middleware';
import {errorHandler, notFoundHandler} from 'express-api-error-handler';
import config from 'config';
import './bootstrap';
import routes from './routes';
import loadRoutes from './common/loadRoutes';
import logger from './common/logger';

const app = express();
app.set('port', config.PORT);

app.use(cors());
// app.set('views', path.join(__dirname, './views'));
// app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './../bower_components')));
app.use('/static', express.static(path.join(__dirname, '/client/public')));
app.use('/bootstrap', express.static(path.join(__dirname, './../bower_components/bootstrap/dist')));
app.use('/d3', express.static(path.join(__dirname, './../bower_components/d3')));
app.use('/radar-chart-d3', express.static(path.join(__dirname, './../bower_components/radar-chart-d3/src')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(domainMiddleware);

const apiRouter = new express.Router();

loadRoutes(apiRouter, routes);

app.use('/api/v1', apiRouter);

app.use(errorHandler({
  log: ({err, req, body}) => {
    logger.error(err, `${body.status} ${req.method} ${req.url}`);
  },
}));

app.use(notFoundHandler({
  log: ({req}) => {
    logger.error(`404 ${req.method} ${req.url}`);
  },
}));

if (!module.parent) {
  app.listen(app.get('port'), () => {
    logger.info(`Express server listening on port ${app.get('port')} in ${process.env.NODE_ENV} mode`);
  });
}

export default app;
