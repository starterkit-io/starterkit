"use strict";

var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var form = forms.create({
  password: fields.password({
    required: validators.required('You definitely want a password')
  }),
  password2: fields.password({
    label: 'Confirm password',
    required: validators.required('don\'t you know your own password?'),
    validators: [validators.matchField('password')]
  })
});

module.exports = form;
