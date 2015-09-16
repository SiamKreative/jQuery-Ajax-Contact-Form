jQuery(document).ready(function ($) {

	$('form[data-form-ajax]').on('submit', function (event) {

		/**
		 * Cache selectors in variables
		 */
		var $form = $(this);
		var $formStatus = $('.form-status', $form);
		var $submitBtn = $('[type="submit"]', $form);
		var $submitBtnDefault = $submitBtn.clone();
		var $redirect = $form.attr('data-form-redirect');
		var $geolocation = $form.attr('data-form-geolocation');
		var $geoData = '';
		var $msgSuccess = $form.attr('data-form-success');
		var $emailTo = $form.attr('action').match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

		/**
		 * Avoid multiple form submissions
		 * Update the UI to show user it's submitting + Remove existing form status
		 */
		$submitBtn.prop('disabled', false).text('Sending...').blur();
		$formStatus.fadeOut('fast', function () {
			$formStatus.remove();
		});

		/**
		 * Process the form using AJAX
		 * http://api.jquery.com/jquery.ajax/
		 */
		function formAjax() {

			$.ajax({

				type: $form.attr('method'),
				url: $form.attr('action'),
				data: $form.serialize(),
				dataType: 'json',
				encode: true

			})

			// Using the done promise callback
			.done(function (data) {

				// Handle errors and validation messages
				if (!data.success) {

					// Show the error message
					$form.append('<div class="alert alert-danger form-status">Oops something went wrong. Email us at <a href="mailto:' + $emailTo + '">' + $emailTo + '</a>.</div>');

				} else {

					// Redirect the user to thanks page after form submission (if there is the attribute data-form-redirect)
					if (typeof $redirect !== typeof undefined && $redirect !== false) {

						window.location = $redirect;

					}

					// Show the success message
					else {

						if (typeof $msgSuccess !== typeof undefined && $msgSuccess !== false) {
							$form.append('<div class="alert alert-success form-status">' + $msgSuccess + '</div>');
						} else {
							$form.append('<div class="alert alert-success form-status">' + data.success + '</div>');
						}

					}

				}

				// Reset the form
				$form[0].reset();
				// Reset the submit button
				$submitBtn.prop('disabled', false).replaceWith($submitBtnDefault.clone());

			});
		}

		/**
		 * Optional geolocation data
		 * To enable it, add the attribute data-form-geolocation="//geolocation-json-endpoint.com"
		 */
		if (typeof $geolocation !== typeof undefined && $geolocation !== false) {

			$.ajax({
				dataType: 'json',
				url: $geolocation,
				timeout: 5000
			})

			// Using the done promise callback
			.done(function (json) {

				// Loop through the JSON object
				$.each(json, function (index, val) {
					$geoData += '<input type="hidden" name="geodata_' + index + '" value="' + val + '">';
				});

				// Append geodata only once
				$form.append($geoData);

			})

			// Detect Network Connection error
			.fail(function (jqxhr, textStatus, error) {

				console.warn('AJAX error!', error);
				console.log(jqxhr);

			})

			// Submit the form in every case (success / fail)
			.always(function () {
				formAjax();
			});

		} else {

			formAjax();

		}

		// Stop the form from submitting the normal way and refreshing the page
		event.preventDefault();
	});

});