"use strict";

var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var form = forms.create({
  email: fields.email({
    label: 'Email address',
    required: true
  }),
  password: fields.password({
    required: validators.required('You definitely want a password')
  })
});

module.exports = form;
