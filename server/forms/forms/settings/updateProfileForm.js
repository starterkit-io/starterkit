"use strict";

var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var form = forms.create({
  firstname: fields.string({
    label: 'First name',
  }),
  lastname: fields.string({
    label: 'Last name',
  })
});

module.exports = form;
