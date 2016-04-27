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
  }),
  password2: fields.password({
    label: 'Confirm password',
    required: validators.required('don\'t you know your own password?'),
    validators: [validators.matchField('password')]
  }),
  firstname: fields.string({
    label: 'First name',
  }),
  lastname: fields.string({
    label: 'Last name',
  })
});

module.exports = form;
