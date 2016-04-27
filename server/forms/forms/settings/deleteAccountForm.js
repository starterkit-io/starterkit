"use strict";

var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var form = forms.create({
  email: fields.email({
    label: 'Email address',
    required: true
  })
});

module.exports = form;
