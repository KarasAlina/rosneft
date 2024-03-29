import { extend, localize } from 'vee-validate';
import {
  required as rule_required,
  email as rule_email,
  min as rule_min,
  confirmed as rule_confirmed,
  regex as rule_regex,
  between as rule_between,
  alpha as rule_alpha,
  integer as rule_integer,
  digits as rule_digits,
  alpha_dash as rule_alpha_dash,
  alpha_num as rule_alpha_num,
  length as rule_length,
} from 'vee-validate/dist/rules';
import ru from 'vee-validate/dist/locale/ru.json';

// eslint-disable-next-line object-curly-newline
import { validatorPositive, validatorUrlValidator, validatorPassword, validatorCreditCard, validatorMacAddress } from './validators';

// ////////////////////////////////////////////////////////
// General
// ////////////////////////////////////////////////////////

export const required = extend('required', rule_required);

export const email = extend('email', rule_email);

export const min = extend('min', rule_min);

export const confirmed = extend('confirmed', rule_confirmed);

export const regex = extend('regex', rule_regex);

export const between = extend('between', rule_between);

export const alpha = extend('alpha', rule_alpha);

export const integer = extend('integer', rule_integer);

export const digits = extend('digits', rule_digits);

export const alphaDash = extend('alpha-dash', rule_alpha_dash);

export const alphaNum = extend('alpha-num', rule_alpha_num);

export const length = extend('length', rule_length);

export const positive = extend('positive', {
  validate: validatorPositive,
  message: 'Please enter positive number!',
});

export const credit = extend('credit-card', {
  validate: validatorCreditCard,
  message: 'It is not valid credit card!',
});

export const password = extend('password', {
  validate: validatorPassword,
  message: 'Your {_field_} must contain at least one uppercase, one lowercase, one special character !@#$%&*() and one digit. The Password field must be at least 8 characters',
});

export const url = extend('url', {
  validate: validatorUrlValidator,
  message: 'URL is invalid',
});

export const macAddress = extend('macAddress', {
  validate: validatorMacAddress,
  message: 'Mac address is invalid',
});

// Install localizations.
localize({
  ru: {
    messages: ru.messages,
    names: {
      email: 'Электронная почта',
      password: 'Пароль',
    },
    fields: {
      password: {
        min: '{_field_} слишком короткий, вы хотите, чтобы вас взломали?',
      },
    },
  },
});

localize('ru', ru);
