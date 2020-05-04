const express = require('express');

const route = express.Router();
const feedbackRoute = require('./feedback');
const speakeRoute = require('./speakers');

module.exports = (params) => {
  const { speakerService } = params;

  route.get('/', async (request, response, next) => {
    try {
      const artwork = await speakerService.getAllArtwork();
      const topSpeakers = await speakerService.getList();
      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  route.use('/feedback', feedbackRoute(params));
  route.use('/speakers', speakeRoute(params));

  return route;
};
