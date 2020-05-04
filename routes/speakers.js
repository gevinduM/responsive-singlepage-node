const express = require('express');

const route = express.Router();

module.exports = (param) => {
  const { speakerService } = param;

  route.get('/', async (request, response, next) => {
    try {
      const artwork = await speakerService.getAllArtwork();
      const speakers = await speakerService.getList();
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  route.get('/:shortName', async (request, response, next) => {
    try {
      const speaker = await speakerService.getSpeaker(request.params.shortName);
      const artwork = await speakerService.getArtworkForSpeaker(request.params.shortName);
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers-details',
        speaker,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  return route;
};
