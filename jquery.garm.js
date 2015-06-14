/*! Garm Form Validator v1.0.2 | (c) 2014 FAKTOR VIER GmbH | http://faktorvier.ch */

(function($) {
	// Global object
	$.garm = {
		debugMode: false,
		setValidator: function(key, value) {
			$.garm.validators[key] = value;
		},
		setConfig: function(key, value) {
			$.garm.config[key] = value;
		},
		info: function(message) {
			if($.garm.debugMode) {
				console.info('GARM: ' + message);
			}
		},
		warn: function(message) {
			if($.garm.debugMode) {
				console.warn('GARM: ' + message);
			}
		}
	};

	// Default validators
	$.garm.validators = {
		'email': /^((([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df\-0-9]+\.)+[a-zA-Z]{2,}))|\s*)$/,
		'url': /^((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00df]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))|\s*)$/,
		'integer': /^((\-?[0-9]+)|\s*)$/,
		'decimal': /^((\-?\d+\.\d{1,})|\s*)$/,
		'alpha': /^(([a-z]+)|\s*)$/i,
		'alphanumeric': /^(([a-z0-9]+)|\s*)$/i,
		'password': /^(((?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$&\*]).*)|\s*)$/,
		'required': function(args, value, $field) {
			// Args: min, max
			var match = true;

			args[0] = args[0] || 1;
			args[1] = args[1] || -1;

			if($field[0].tagName.toLowerCase() == 'select' && $field.prop('multiple')) {
				var selectedCount = $field.find('option:selected').length;

				if(match && args[0] !== 0) {
					match = selectedCount >= +args[0];
				}

				if(match && args[1] !== -1) {
					match = selectedCount <= +args[1];
				}
			} else {
				match = ($field.attr('type') == 'checkbox') ? $field.is(':checked') : /^\s*\S.*$/m.test(value);
			}

			return match;
		},
		'creditcard': function(args, value) {
			// Args: strict
			var pattern = /^(((?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})[\s]{0,4})|\s*)$/;
			var value = (typeof args[0] != 'undefined' && args[0] == 'strict') ? value : value.replace(/[\s\-]*/g, '');

			return pattern.test(value);
		},
		'number': function(args, value) {
			// Args: min number, max number
			value = $.trim(value);

			var match = !isNaN(value) || value == '';

			args[0] = args[0] || 'n';
			args[1] = args[1] || 'n';

			if(match && value != '' && !isNaN(args[0])) {
				match = +value >= +args[0];
			}

			if(match && value != '' && !isNaN(args[1])) {
				match = +value <= +args[1];
			}

			return match;
		},
		'length': function(args, value) {
			// Args: min length, max length
			value = $.trim(value);

			var match = true;

			args[0] = args[0] || 0;
			args[1] = args[1] || -1;

			if(match && value != '' && args[0] !== 0) {
				match = value.length >= +args[0];
			}

			if(match && value != '' && args[1] !== -1) {
				match = value.length <= +args[1];
			}

			return match;
		},
		'match': function(args, value) {
			// Args: n strings
			return $.map(args, function(item) {
				return item.toLowerCase()
			}).indexOf(value.toLowerCase()) != -1 || value == '';
		},
		'match-case': function(args, value) {
			// Args: n strings
			return args.indexOf(value) != -1 || value == '';
		},
		'match-field': function(args, value) {
			// Args: n selectors
			var match = true;

			$(args.join(',')).each(function() {
				if($(this).val() != value) {
					match = false;
					return false;
				}
			});

			return match;
		},
		'date': function(args, value) {
			// Args: date format (d, m, y)
			args[0] = args[0] || 'd.m.y';

			var delimiter = args[0].substr(1,1);
			var formatArray = args[0].split(delimiter);
			var inputArray = value.split(delimiter);

			var match = $.trim(value) == '' || (formatArray.length == inputArray.length && !isNaN(Date.parse(inputArray[formatArray.indexOf('m')] + '.' + inputArray[formatArray.indexOf('d')] + '.' + inputArray[formatArray.indexOf('y')])));

			return match;
		},
		'checkboxgroup': function(args, value, $field) {
			// Args: min, max
			args[0] = args[0] || 0;
			args[1] = args[1] || -1;

			var checkedCount = $field.find('input[type="checkbox"]:checked').length;
			var match = checkedCount >= +args[0];

			if(match && args[1] !== -1) {
				match = checkedCount <= +args[1];
			}

			return match;
		}
		// filetypes (upload), filextension (upload)
	};

	// Default config
	$.garm.config = {
		// Classes
		classFormBusy: 'busy',
		classFieldError: 'error',
		classFieldLoading: 'loading',
		classLabelError: '',
		//classHint: '', // TODO

		// Options
		attr: 'data-garm',
		attrIgnore: 'data-garm-ignore',
		onlyValidate: false,
		//disableSubmit: false, // TODO
		//ajaxSubmit: false, // TODO

		// Callbacks
		beforeSubmit: function() {},
		onSubmit: function($form) {},
		onSuccess: function($form) {},
		onFail: function($form) {}
	};

	// Validate
	$.garm.validate = function(garmConfig, garmValidators, $form) {
		// CALLBACK: before submit
		garmConfig.beforeSubmit();

		// Check if form is already busy
		if($form.hasClass(garmConfig.classFormBusy)) {
			// DEBUG: Validation busy
			$.garm.info('VALIDATION ALREADY BUSY');

			return false;
		}

		// DEBUG: Validation started
		$.garm.info('VALIDATION STARTED');

		var $fields = $form.find('[' + garmConfig.attr + ']').not('[' + garmConfig.attr + '=""]');
		var $labels = $form.find('label');

		var fieldsFailCount = 0;
		var deferredValidators = [];

		// Remove all existing error classes
		$fields.removeClass(garmConfig.classFieldError);
		$labels.removeClass(garmConfig.classLabelError);

		// Add busy class to the form
		$form.addClass(garmConfig.classFormBusy);

		$fields.each(function() {
			var $field = $(this);
			var fieldValue = $field.val();
			var fieldName = $field.attr('name');
			//var fieldValue = $.trim($field.val());
			var fieldValidators = $field.attr(garmConfig.attr).split(' ');

			for(var classIndex in fieldValidators) {
				var validatorName = fieldValidators[classIndex];
				var validatorArgs = [];

				if(validatorName.indexOf('[') !== -1) {
					validatorArgs = validatorName.substring(validatorName.indexOf('[') + 1, validatorName.length - 1).split(',');
					validatorName =  validatorName.substring(0, validatorName.indexOf('['));
				}

				// Check if field has ignored validators
				var ignoreValidator = $field.is('[' + garmConfig.attrIgnore + '~="' + validatorName + '"]') || $field.is('[' + garmConfig.attrIgnore + '="all"]');

				// Check if parent container has ignored validators
				var parentIgnore = $field.parents('[' + garmConfig.attrIgnore + ']');

				if(parentIgnore.length) {
					ignoreValidator = parentIgnore.is('[' + garmConfig.attrIgnore + '~="' + validatorName + '"]') || parentIgnore.is('[' + garmConfig.attrIgnore + '="all"]');
				}

				// DEBUG: Validation ignored
				if(ignoreValidator) {
					$.garm.info('validation ignored (field: ' + fieldName + ', validator: ' + validatorName + ')');
				}

				if(validatorName in garmValidators && !$field.hasClass(garmConfig.classFieldError) && !ignoreValidator) {
					var validatorValue = garmValidators[validatorName];

					// Add deferred object to the deferred-array
					deferredValidators.push(function() {
						var validatorDeferred = $.Deferred();

						if(typeof validatorValue == 'function') {
							// Callback
							var callbackReturn = validatorValue(validatorArgs, fieldValue, $field, $form, validatorDeferred);

							if(typeof callbackReturn == 'undefined' || typeof callbackReturn.promise == 'undefined') {
								validatorDeferred.resolve(callbackReturn == true);
							} else {
								validatorDeferred = callbackReturn;

								// Add loading class
								$field.addClass(garmConfig.classFieldLoading);
							}
						} else if(typeof validatorValue == 'string' && validatorValue.indexOf('http') === 0) {
							// Add loading class
							$field.addClass(garmConfig.classFieldLoading);

							// Ajax
							$.get(validatorValue, { value : fieldValue }).always(function(status) {
								validatorDeferred.resolve($.trim(status) == true);
							});
						} else if(validatorValue instanceof RegExp) {
							// Regexp
							validatorDeferred.resolve(validatorValue.test(fieldValue));
						}

						validatorDeferred.always(function(validatorStatus) {
							// Remove loading class
							$field.removeClass(garmConfig.classFieldLoading);

							if(validatorStatus == false) {
								// Update fail counter
								fieldsFailCount++;

								// Add error classes
								$field.addClass(garmConfig.classFieldError);
								$form.find('label[for="' + $field.attr('id') + '"]').addClass(garmConfig.classLabelError);

								// DEBUG: Validation failed
								if($.garm.debugMode) {
									if(typeof fieldName == 'undefined') {
										fieldName = $field[0].tagName.toLowerCase();
										fieldName += $field.is('[id]') ? '#' + $field.attr('id') : '';
									}

									$.garm.warn('validation failed (field: ' + fieldName + ', validator: ' + validatorName + ')');
								}
							}
						});

						return validatorDeferred.promise();
					}());
				}
			};
		});

		// Run deferred objects
		$.when.apply($, deferredValidators).done(function() {
			// CALLBACK: on submit
			garmConfig.onSubmit($form);

			if(fieldsFailCount === 0) {
				// DEBUG: Validation end
				$.garm.info('VALIDATION ENDED: SUCCESS');

				// CALLBACK: on success (ignore default success if success-callback returns a value)
				if(typeof garmConfig.onSuccess($form) != 'undefined') {
					return true;
				}

				if(garmConfig.onlyValidate) {
					// Remove busy class from form
					$form.removeClass(garmConfig.classFormBusy);
				} else {
					$form.off('submit.garm').submit();
				}
			} else {
				// Remove busy class from form
				$form.removeClass(garmConfig.classFormBusy);

				// DEBUG: Validation end
				$.garm.warn('VALIDATION ENDED: ' + fieldsFailCount + ' FIELDS FAILED');

				// CALLBACK: on fail (ignore default fail if fail-callback returns a value()
				if(typeof garmConfig.onFail($form) != 'undefined') {
					return true;
				}
			}
		});

		return true;
	}

	// Main function
	$.fn.garm = function(options, validators) {
		// Overwrite default settings and validators
		var garmConfig = $.extend($.extend({}, $.garm.config), options);
		var garmValidators = $.extend($.extend({}, $.garm.validators), validators);

		// Bind each form
		return this.each(function() {
			if(garmConfig.onlyValidate) {
				$(this).each(function() {
					$.garm.validate(garmConfig, garmValidators, $(this));
				});
			} else {
				$(this).on('submit.garm', function(e) {
					e.preventDefault();

					$.garm.validate(garmConfig, garmValidators, $(this));
				});
			}
		});
	};
}(jQuery));