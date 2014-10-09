
$(function() {
	// Enable debug mode
	$.garm.debugMode = true;

	// Set custom validator
	$.garm.setValidator('slow', function(args, value, $field, $form, def) {
		$.get('/slowfake.php').always(function(status) {
			def.resolve(false);
		});

		return def;
	});

	// Bind validator
	$('.validate').garm();
});