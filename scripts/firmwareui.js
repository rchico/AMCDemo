var FirmwareUI = {

	initialize: function () {
		window.timerLength = 0;
		//$('.upload-form').on('mousedown',function() {
		//	alert('javascript can be executed before submit');
		//$( "#k1" ).submit();
		//return true;
		//});

		//alert($('#upload-filename').val());
		var uploadFilename = $('#upload-filename').val();
		$.ajax({
			type: 'post',
			//url: "/service/firmware/tmp/outfile.bin",
			url: "/service/firmware" + uploadFilename,
			success: function (data) {
				//alert('success yeah!');
				$('.upload-feedback').text('Waiting...');
				window.firmwareInterval = setInterval('FirmwareUI.getFirmwareStatus()', 1000);
			}
		});
	},

	getFirmwareStatus: function () {
		//alert('called getFirmwareStatus');
		timerLength = parseInt(timerLength + 1);
		var jqxhr =
		$.ajax({
			url: "/service/firmware/status",

			dataType: 'text'
			})

		.done(function(data) {
			console.log(data);
			//alert( "done" );
			$('.upload-feedback').text(data);
			// Set scrollTop to be large value as scrollHeight didn't work.
			$('.upload-feedback').scrollTop(1000000);
			clearInterval(firmwareInterval);
		})
	
		.fail(function(data) {
			$('.upload-feedback').text('In Progress: ' + timerLength);
		})

	.always(function() {
		//alert( "complete" );
	});

	// Perform other work here ...
	// Set another completion function for the request above
	jqxhr.always(function() {
	//	 alert( "second complete" );
	});


	},

} // end of FirmwareUI

$(document).ready(FirmwareUI.initialize);

