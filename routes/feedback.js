const express = require('express');

const { check, validationResult } = require('express-validator');

const validations = [
  check('Name').trim().isLength({ min: 3 }).escape().withMessage('A name is required!'),
  check('EMail').trim().isEmail().normalizeEmail().withMessage('A valid email is required!'),
  check('Title').trim().isLength({ min: 3 }).escape().withMessage('A Title is required!'),
  check('Message').trim().isLength({ min: 5 }).escape().withMessage('A Message is required!'),
];

const route = express.Router();

module.exports = (param) => {
  const { feedBackService } = param;

  route.get('/', async (request, response, next) => {
    try {
      const feedbacks = await feedBackService.getList();
      const errors = request.session.feedback ? request.session.feedback.errors : false;
      const succsessMesg = request.session.feedback ? request.session.feedback.message : false;
      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedbacks,
        errors,
        succsessMesg,
      });
    } catch (error) {
      return next(error);
    }
  });

  route.post('/', validations, async (request, response, next) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.session.feedback = {
          errors: errors.array(),
        };
        return response.redirect('/feedback');
      }

      const { Name, EMail, Title, Message } = request.body;
      await feedBackService.addEntry(Name, EMail, Title, Message);
      request.session.feedback = {
        message: 'Thank you for your feedback!',
      };

      return response.redirect('/feedback');
    } catch (error) {
      return next(error);
    }
  });

  route.post('/api', validations, async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.json({ errors: errors.array() });
      }
      const { Name, EMail, Title, Message } = request.body;
      await feedBackService.addEntry(Name, EMail, Title, Message);
      const feedback = await feedBackService.getList();
      return response.json({ feedback, successMessage: 'Thank you for your feedback!' });
    } catch (error) {
      return next(error);
    }
  });

  return route;
};
