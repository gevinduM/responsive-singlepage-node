const express = require('express');

const createError = require('http-errors');

const cookieSession = require('cookie-session');

const bodyParser = require('body-parser');

const path = require('path');

const routes = require('./routes');

const FeedBackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedBackService = new FeedBackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['referfe54345', '435453rfdfe'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (request, response, next) => {
  try {
    const names = await speakerService.getList();
    response.locals.speakersNames = names;
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use(
  '/',
  routes({
    feedBackService,
    speakerService,
  })
);

app.use((request, response, next) => {
  return next(createError(404, 'File not found'));
});

app.use((err, request, response, next) => {
  response.locals.message = err.message;
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('Error');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server is listning on port ${port}!`);
});
