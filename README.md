Garm Form Validator
==============

Garm Form Validator is a small, lightweight, attribute-based jQuery form validator, developed by <a href="http://faktorvier.ch" target="_blank">FAKTOR VIER</a>.

## Dependencies

* <a href="http://jquery.com/" target="_blank">jQuery 1.9+</a>

## Installation and use

* Download the file `jquery.garm.min.js`
* Upload it to your server (e.g. `/js/` folder)
* Embed the file in your html code: `<script src="/js/jquery.garm.min.js"></script>`

## Use

### plugin

Bind the validator plugin on any form-tag you like:

`$('form.validator').garm();`

### validators

Validators can be defined in the `data-garm`-attribute of any form-field:

`<input type="text" name="firstname" data-garm="required" />`

Multiple validators can be separated by spaces:

`<input type="text" name="email" data-garm="required email" />`

Some validators take one or multiple arguments. They can be defined in __square brackets__ and __comma-separated__ after the validator-name:

`<input type="text" name="int-range" data-garm="required integer number[10,100]" />`

## Validators

### required

Makes a field required.

### required[ _min_, _max_ ]

Only for __multiple selects__, you can specify how many options have to be selected:

`required[2]` = 2 - n, `required[0,2]` = 0 - 2, `required[4,4]` = exact 4

### integer

Allows only integers (positive and negative).

### decimal

Allows only decimal numbers (any decimal places, positive and negative).

### number[ _min_, _max_ ]

Allows any integers and decimal numbers (positive and negative).

Optionally you can define an range:

`number[10]` = 10 - n, `number[n,100]` = n - 100, `number[20,40]` = 20 - 40, `number[-20,20]` = -20 - 20

Can be combined with `integer` or `decimal`, if you want to limit the range to `integer` or `decimal` only:

`<input type="text" name="int-range" data-garm="integer number[10,100]" />`

### alpha

Allows only alphabetical chars (a-Z)

### alphanumeric

Allows only alphabetical chars (a-Z) and integers

### length[ _min_, _max_ ]

Allows only a value with the specific length:

`length[10]` = 10 - n, `length[10,20]` = 10 - 20, `length[20,20]` = exact 20

### email

Allows only valid email adresses.

### url

Allows only valid url's.

### password

Allows only strong passwords with the following criteria:

* min length 8
* one or more uppercase chars
* one or more special-cars (! @ # $ & *)
* one or more integer

### creditcard[ _strict_ ]

Allows only valid creditcard formats. The following creditcards are supported:

* Visa
* MasterCard
* American Express
* Diners Club
* Discover
* JCB

If you set the argument `strict`, the number will be invalid if it contains spaces or dashes:

The following number `5555 5555 5555 4444` will be __invalid__ if the validator is `creditcard[strict]`.


### match[ _n strings ..._ ]

Allows only values defined in the arguments (__case insensitive__). The following example allows only one of the three values `apple`, `pear` or `banana`:

`<input type="text" name="match" data-garm="match[apple,pear,banana]" />`

### match-case[ _n strings ..._ ]

The same as `match` but __case sensitive__.

### date[ format ]

Allows only valid dates, matching the defined format. The format must contain `d` (day), `m` (month), `y` (year), separated by any one-char-delimiter (e.g. `.`):

American format: `date[m-d-y]`, european format: `date[d.m.y]`

### checkboxgroup[ _min_, _max_ ]

Allows only a number of checked checkboxes within the defined range. This is the only validator you cannot set on a single field, but on a container-element around multiple checkboxes.

`checkboxgroup[10]` = 10 - n, `checkboxgroup[10,20]` = 10 - 20, `checkboxgroup[20,20]` = exact 20

The following example allows 2 - 4 checked checkboxes:

```
<fieldset data-garm="checkboxgroup[2,4]">
<input type="checkbox" name="cb1" />
<input type="checkbox" name="cb2" />
<input type="checkbox" name="cb3" />
<input type="checkbox" name="cb4" />
<input type="checkbox" name="cb5" />
</fieldset>
```

## Debug mode

If enabled, some debug output will be displayed in the developer console:

`$.garm.debugMode = true/false`


## Set global settings

Coming soon...

## Set settings by form

Coming soon...

## Add custom validator

Coming soon...

## Todo

* decimal: add float parameters
* password: specify password strength
* date: better date format handling

## Changelog

##### v1.0.0 (2014-10-08)
Initial release