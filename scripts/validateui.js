var ValidateUI = {
	initialize: function() {

		window.savejqxhr = null;	

		$('a.save').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
				console.log('disabled!');
			} else {
			//	$(this).addClass('disabled');

			//	ValidateUI.removeDeletedConfig();

				var AllValidator = new com.RhythmTraffic.ConfigurationLibrary.ConfigCompatibility();
	            var validSave = AllValidator.ValidateConfigInfo(allWorkingData.InSpire);
	            if (validSave) {
	            	BaseUI.showNotificationModal('reset','Saving in Progress','Please wait.',true);	
	            	ValidateUI.postObject();
	            } else {
	            	$('body').find('.overlay.save-error .confirm-title').text(ValidateUI.updSaveErrorTitle(1));
	            	$('body').find('.overlay.save-error .confirm-subtitle').text(AllValidator.errorMsg[0]);
	            	$('body').find('.overlay.save-error').show();            
	            	//ValidateUI.postObject();	

	            }				
			}

		});


		$('.overlay.save-error').find('.set').on('mousedown',function() {
			BaseUI.resetOverlay();
		});

		$('.overlay.save-error').find('.scroll-next').on('mousedown',function() {
			var errorId = parseInt($('.overlay.save-error').find('#error-id').val());
			var errorLabel = 0;
			var errorCount = ValidateUI.getSaveErrorCount();
			if (errorId === parseInt(errorCount - 1)) {
				errorId = 0;
			} else {
				errorId = parseInt(errorId + 1);
			}
			errorLabel = errorId + 1;
			$('body').find('.overlay.save-error .confirm-title').text(ValidateUI.updSaveErrorTitle(errorLabel));
			$('body').find('.overlay.save-error .confirm-subtitle').text(ValidateUI.getSaveErrorMsg(errorId));
			$('.overlay.save-error').find('#error-id').val(errorId);
		});		

		$('.overlay.save-error').find('.scroll-prev').on('mousedown',function() {
			var errorId = parseInt($('.overlay.save-error').find('#error-id').val());
			var errorLabel = 0;
			var errorCount = ValidateUI.getSaveErrorCount();
			if (errorId === 0) {
				errorId = parseInt(ValidateUI.getSaveErrorCount() - 1);
			} else {
				errorId = parseInt(errorId - 1);
			}
			errorLabel = errorId + 1;
			$('body').find('.overlay.save-error .confirm-title').text(ValidateUI.updSaveErrorTitle(errorLabel));
			$('body').find('.overlay.save-error .confirm-subtitle').text(ValidateUI.getSaveErrorMsg(errorId));
			$('.overlay.save-error').find('#error-id').val(errorId);
		});	

	},	


	updSaveErrorTitle: function(errorId) {
		var titleText = 'Displaying error ' + errorId + ' of ' + ValidateUI.getSaveErrorCount() + ' errors found';
		return titleText;
	},

	getSaveErrorCount: function() {
		var count = 0;
		var AllValidator = new com.RhythmTraffic.ConfigurationLibrary.ConfigCompatibility();	
		var errorObj = AllValidator.ValidateConfigInfo(allWorkingData.InSpire);
		var count = AllValidator.errorMsg.length;
		return count;
	},

	getSaveErrorMsg: function(id) {
		var AllValidator = new com.RhythmTraffic.ConfigurationLibrary.ConfigCompatibility();	
		var errorObj = AllValidator.ValidateConfigInfo(allWorkingData.InSpire);
		var msg = AllValidator.errorMsg[id];	
		return msg;
	},


	removeDiff: function() {
		$('.config.panel').find('.diff').removeClass('diff');
		$('.preempt.panel').find('.diff').removeClass('diff');
	},

	replacePristineWithWorking: function() {
		delete allPristineData;
		delete allUnsavedData;
		window.allPristineData = jQuery.extend(true, {}, allWorkingData);
		window.allUnsavedData = jQuery.extend(true, {}, allWorkingData);
		BaseUI.refreshAfterSaveOrUndo();	
		
	},

	trimPeriodEnd: function(val) {
		val = val.slice(0,-1);
	},

	postObject: function() {
		$('.config .save').addClass('disabled');
		$('.preempt .save').addClass('disabled');

		ValidateUI.setToReadOnly();

		if (savejqxhr != null) {
			savejqxhr.abort();
			savejqxhr = null;
		}

			savejqxhr =
			    $.ajax({
			    	type: 'post',
			        url: inspireUrl,
			        contentType: "text/plain;charset=utf-8",
			        data: JSON.stringify(allWorkingData),
			        traditional: true
			    })
				.done(function(data, textStatus, jqxhr) {
		
				})
				.fail(function(data, textStatus, jqxhr) {

				})
				.always(function(data, textStatus, jqxhr) {

					if (textStatus === 'success') {
		               	ValidateUI.replacePristineWithWorking();
		               	ValidateUI.removeDiff();
		               	BaseUI.showNotificationModal('success','success','Save successful',true);
					
					} else {
						//ValidateUI.postObject();
						BaseUI.showNotificationModal('fail','Oops!','Something wrong went during an attempt to save');						
					}
					$('.config .save').removeClass('disabled');
					$('.preempt .save').removeClass('disabled');	
				});		


	},

	setToReadOnly: function() {
		$('.panel.config').addClass('read-only');
	},

	unsetFromReadOnly: function() {
		$('.panel.config').removeClass('read-only');
	},	

	resubmitSetManualOverride: function() {
		window.setSaveInterval = setInterval(function() {
			ValidateUI.setManualOverride();
		}, 5000);
	},

	stopResubmitSetManualOverride: function() {
		clearInterval(window.setSaveInterval);
	},


 } // end of ValidateUI

$(document).ready(ValidateUI.initialize);