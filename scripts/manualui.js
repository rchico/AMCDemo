var ManualUI = {
	initialize: function() {

		window.getResponseCount = 0;
		window.setResponseCount = 0;
		window.isRunning = false;

		window.manualjqxhr = null;

		ManualUI.getManualOverride();

		ManualUI.toggleFreeMode();	
		ManualUI.toggleCabinetFlash();
		ManualUI.toggleStopTime();
		ManualUI.toggleVehPhaseCalls();
		ManualUI.togglePedPhaseCalls();
		ManualUI.togglePedExclusiveCalls();
		ManualUI.togglePedRecalls();	

		ManualUI.toggleVehExclusiveCalls();
		ManualUI.toggleVehDetectors();	
		ManualUI.togglePedDetectors();	

		ManualUI.toggleAllVehPhaseCalls();
		ManualUI.toggleAllVehExclusiveCalls();
		ManualUI.cycleAllVehRecalls();
		ManualUI.toggleAllPedPhaseCalls();
		ManualUI.toggleAllPedExclusiveCalls();
		ManualUI.toggleAllPedRecalls();
		ManualUI.toggleAllVehDetectors();	
		ManualUI.toggleAllPedDetectors();			

		ManualUI.toggleAllControlAccess();

		ManualUI.scrollUpDown();
		manOvrSet = true;
		setTimeout(function() { BaseUI.switchPanel('manual-override-view') }, delayTime );	

	},	

	loadManualOverride: function() {
		ManualUI.getManualOverrideHeader();
		ManualUI.getfreeMode();
		ManualUI.getStopTime();
		ManualUI.getVehPhaseCalls();
		ManualUI.getVehExclusiveCalls();
		ManualUI.getVehRecalls();
		ManualUI.getVehDetectors();
		ManualUI.getPedPhaseCalls();
		ManualUI.getPedExclusiveCalls();
		ManualUI.getPedRecalls();
		ManualUI.getPedDetectors();
		ManualUI.getCabinetFlash();

	//	ManualUI.displayOvrConfigName();
		ManualUI.submitVehPhase();
		ManualUI.submitPedPhase();
		ManualUI.submitVehDetectors();
		ManualUI.submitPedDetectors();
		ManualUI.cycleVehRecalls();

		ManualUI.countVehiclePhaseOverrides();
		ManualUI.countPedPhaseOverrides();
		ManualUI.countVehicleDetectors();
		ManualUI.countPedDetectors();

		if (manualWorkingData.m_manualOverride.m_pedDetectorTriggers.length > 8) {
			BaseUI.showFirstEightOnly('manual-override-ped-detect');
		}

		// disabled by default
		$('#home').find('.manual-override').removeClass('disabled');

		// $('#manual-override-view').find('.override-cabinet-flash').on('mousedown',function() {
		// 	setTimeout(function() { BaseUI.switchPanel('manual-override-cabinet-flash') }, delayTime );		
		// });			
		$('#manual-override-view').find('.override-vehicle-phase').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('manual-override-vehicle-phase') }, delayTime );	
			}		
		});
		$('#manual-override-view').find('.override-ped-phase').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);				
				setTimeout(function() { BaseUI.switchPanel('manual-override-ped-phase') }, delayTime );		
			}	
		});		
		$('#manual-override-view').find('.override-vehicle-detect').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);				
				setTimeout(function() { BaseUI.switchPanel('manual-override-vehicle-detect') }, delayTime );
			}			
		});
		$('#manual-override-view').find('.override-ped-detect').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);				
				setTimeout(function() { BaseUI.switchPanel('manual-override-ped-detect') }, delayTime );	
			}		
		});	
		$('#manual-override-view').find('.override-config-name').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);				
				setTimeout(function() { BaseUI.switchPanel('manual-override-config-name') }, delayTime );		
			}	
		});		

		$('#manual-override-view').find('.manual-override-reset').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);							
				ManualUI.resetManualOverride();
			}	
		});	

		$('#manual-override-view').find('.manual-override-reload').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('disabled')) {
				// ignore it
			} else {	
				var thisObj = $(this);
				if (thisObj.hasClass('disabled')) {
					// ignore it
				} else {
					BaseUI.addInverse(thisObj);						
					ManualUI.reloadManualOverride();
				}
			}	
		});			

		$('#manual-override-view').find('.set').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				ManualUI.resubmitSetManualOverride();			
				ManualUI.setManualOverride();
			}
		});
	},

/****************************************************/
// MANUAL OVERRIDE HEADERS

	getManualOverrideHeader: function() {
		manOvrVehPhaseCallsLen = manualWorkingData.m_manualOverride.m_vehPhaseCalls.length;
		var markup = '';
		for (var i = 0; i < manOvrVehPhaseCallsLen; i++) {
			markup = markup + '<li class=\'has-phase\'><div><span>' + (i + 1) + '</span></div></li>';
		}	
		$('#manual-override-vehicle-phase').find('.current-settings.override.vehicle.phase .values ul').html(markup);

		manOvrPedPhaseCallsLen = manualWorkingData.m_manualOverride.m_pedPhaseCalls.length;
		markup = '';
		for (var i = 0; i < manOvrPedPhaseCallsLen; i++) {
			markup = markup + '<li class=\'has-phase\'><div><span>' + (i + 1) + '</span></div></li>';
		}					
		$('#manual-override-ped-phase').find('.current-settings.override.ped.phase .values ul').append(markup);

		manOvrPedDetectLen = manualWorkingData.m_manualOverride.m_pedDetectorTriggers.length;
		markup = '';
		for (var i = 0; i < manOvrPedDetectLen; i++) {
			markup = markup + '<li class=\'has-phase\'><div><span>' + (i + 1) + '</span></div></li>';
		}					
		$('#manual-override-ped-detect').find('.current-settings.ped.detector.phase .values ul').append(markup);

		manOvrVehDetectLen = manualWorkingData.m_manualOverride.m_vehDetectorTriggers.length;
		markup = '';
		for (var i = 0; i < manOvrVehDetectLen; i++) {
			markup = markup + '<li class=\'has-phase\'><div><span>' + (i + 1) + '</span></div></li>';
		}					
		$('#manual-override-vehicle-detect').find('.current-settings.vehicle.detector.phase .values ul').append(markup);
	},

/****************************************************/
// FREE MODE

	getfreeMode: function() {
		var isEnabled = manualWorkingData.m_manualOverride.m_forceFreeMode;
		$('#manual-override-view').find('.override-free-mode').replaceWith(ManualUI.htmlFreeMode(isEnabled));		
	},

	setFreeMode: function(value) {
		manualWorkingData.m_manualOverride.m_forceFreeMode = value;
	},

	updFreeMode: function() {
	 	var isEnabled =  manualWorkingData.m_manualOverride.m_forceFreeMode;
	 	var originalSetting = manualPristineData.m_manualOverride.m_forceFreeMode;
	 	var isDiff = false;
	 	if (isEnabled !== originalSetting) {
	 		isDiff = true;
	 	}
	 	$('#manual-override-view').find('.override-free-mode').replaceWith(ManualUI.htmlFreeMode(isEnabled,isDiff));		
	},

	toggleFreeMode: function() {
		$('#manual-override-view').on('mousedown','.override-free-mode',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var isEnabled = manualWorkingData.m_manualOverride.m_forceFreeMode;
				if (isEnabled) {
					ManualUI.setFreeMode(false);
				} else {
					ManualUI.setFreeMode(true);
				}
				ManualUI.updFreeMode();				
			}
			var thisObj = $(this);
			BaseUI.removeInverse(thisObj);
		});	
	},

	htmlFreeMode: function(isEnabled,isDiff) {
		var thisClass = 'override-free-mode no-more';
		if (isEnabled) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}	
		var markup = '<li class=\'' + thisClass + '\'\><a href=\'#\'><span class=\'switch\'></span><span class=\'label\'>Free Mode</span></a></li>';	
		return markup;	
	},


/****************************************************/
// RELOAD MANUAL OVERRIDE
	reloadManualOverride: function() {

		// delete allWorkingData;
		// window.allWorkingData = jQuery.extend(true, {}, allPristineData);
		ManualUI.setToReadOnly();
		ManualUI.refreshAfterReload();
		ManualUI.getManualOverride();
		//BaseUI.showNotificationModal('reset','Reload Successful','Changes made have been removed; all values reflect information from the last save');

	},

	refreshAfterReload: function() {
		$('.man-ovr').find('.diff').removeClass('diff');
		$('.man-ovr').find('.override-free-mode').removeClass('inverse on');
		$('.man-ovr').find('.override-cabinet-flash').removeClass('inverse on');
		$('.man-ovr').find('.override-stop-time').removeClass('inverse on');
		$('#manual-override-view').find('.override-vehicle-phase .count').text('0').hide();
		$('#manual-override-view').find('.override-ped-phase .count').text('0').hide();
		$('#manual-override-view').find('.override-vehicle-detect .count').text('0').hide();
		$('#manual-override-view').find('.override-ped-detect .count').text('0').hide();	
		$('#manual-override-vehicle-phase').find('.values ul').empty();	
		$('#manual-override-ped-phase').find('.values ul').empty();	
		$('#manual-override-vehicle-detect').find('.values ul').empty();	
		$('#manual-override-ped-detect').find('.values ul').empty();
		$('#manual-override-vehicle-phase').find('.label .on').removeClass('on');	
		$('#manual-override-ped-phase').find('.label .on').removeClass('on');	
		$('#manual-override-vehicle-detect').find('.label .on').removeClass('on');	
		$('#manual-override-ped-detect').find('.label .on').removeClass('on');		
		$('#manual-override-vehicle-phase').find('.label .cycler').removeClass('none min max soft').addClass('none').attr('data-recall-selection',0);	
	},

/****************************************************/
// RESET MANUAL OVERRIDE
	resetManualOverride: function() {
		ManualUI.resetCabinetFlash();
		ManualUI.resetFreeMode();
		ManualUI.resetVehPhaseCalls();
		ManualUI.resetStopTime();
		ManualUI.resetVehExclusiveCalls();
		ManualUI.resetVehRecalls();
		ManualUI.resetPedPhaseCalls();
		ManualUI.resetPedExclusiveCalls();
		ManualUI.resetPedRecalls();
		ManualUI.resetVehDetectors();
		ManualUI.resetPedDetectors();
		ManualUI.resetConfigurationSelection();
		ManualUI.countVehiclePhaseOverrides();
		ManualUI.countPedPhaseOverrides();
		ManualUI.countVehicleDetectors()
		ManualUI.countPedDetectors();
		ManualUI.setManualOverride();
	},

	resetCabinetFlash: function() {
		manualWorkingData.m_manualOverride.m_cabinetFlash = false;
		$('#manual-override-view').find('.override-cabinet-flash').removeClass('inverse on');
	},

	resetStopTime: function() {
		manualWorkingData.m_manualOverride.m_stopTime = false;
		$('#manual-override-view').find('.override-stop-time').removeClass('inverse on');
	},

	resetFreeMode: function() {
		manualWorkingData.m_manualOverride.m_forceFreeMode = false;
		$('#manual-override-view').find('.override-free-mode').removeClass('inverse on');
	},	

	resetVehPhaseCalls: function() {
		var manOvrVehPhaseCallsLen = manualWorkingData.m_manualOverride.m_vehPhaseCalls.length;
		for (var i = 0; i < manOvrVehPhaseCallsLen; i++) {
			manualWorkingData.m_manualOverride.m_vehPhaseCalls[i] = false;
		}
		$('#manual-override-vehicle-phase').find('.current-settings.vehicle.phase-calls .values ul li').removeClass('on');	
		$('#manual-override-vehicle-phase').find('.current-settings.vehicle.phase-calls .label .switch').removeClass('on');	
	},

	resetVehExclusiveCalls: function() {
		var manOvrVehPhaseExclusiveLen = manualWorkingData.m_manualOverride.m_vehPhaseCallsExclusive.length;
		for (var i = 0; i < manOvrVehPhaseExclusiveLen; i++) {
			manualWorkingData.m_manualOverride.m_vehPhaseCallsExclusive[i] = false;
			$('#manual-override-vehicle-phase').find('.current-settings.vehicle.exclusive-calls .values ul li').removeClass('on');	
			$('#manual-override-vehicle-phase').find('.current-settings.vehicle.exclusive-calls .label .switch').removeClass('on');	
		}	
	},

	resetVehRecalls: function() {
		var vehPhaseRecallLen = manualWorkingData.m_manualOverride.m_vehPhaseRecall.length;
		for (var i = 0; i < vehPhaseRecallLen; i++) {
			manualWorkingData.m_manualOverride.m_vehPhaseRecall[i] = 0;
			$('#manual-override-vehicle-phase').find('.current-settings.vehicle.recalls .values ul li').removeAttr('class').addClass('none').attr('data-recall-selection',0);
			$('#manual-override-vehicle-phase').find('.label .cycler').removeClass('none min max soft').addClass('none').attr('data-recall-selection',0);
		}			
	},

	resetPedPhaseCalls: function() {
		var manOvrPedPhaseCallsLen = manualWorkingData.m_manualOverride.m_pedPhaseCalls.length;
		for (var i = 0; i < manOvrPedPhaseCallsLen; i++) {
			manualWorkingData.m_manualOverride.m_pedPhaseCalls[i] = false;
		}
		$('#manual-override-ped-phase').find('.current-settings.ped.phase-calls .values ul li').removeClass('on');	
		$('#manual-override-ped-phase').find('.current-settings.ped.phase-calls .label .switch').removeClass('on');	
	},

	resetPedExclusiveCalls: function() {
		var manOvrPedPhaseExclusiveLen = manualWorkingData.m_manualOverride.m_pedPhaseCallsExclusive.length;
		for (var i = 0; i < manOvrPedPhaseExclusiveLen; i++) {
			manualWorkingData.m_manualOverride.m_pedPhaseCallsExclusive[i] = false;
			$('#manual-override-ped-phase').find('.current-settings.ped.exclusive-calls .values ul li').removeClass('on');	
			$('#manual-override-ped-phase').find('.current-settings.ped.exclusive-calls .label .switch').removeClass('on');	
		}	
	},

	resetPedRecalls: function() {
		var pedPhaseRecallLen = manualWorkingData.m_manualOverride.m_pedPhaseRecall.length;
		for (var i = 0; i < pedPhaseRecallLen; i++) {
			manualWorkingData.m_manualOverride.m_pedPhaseRecall[i] = false;
			$('#manual-override-ped-phase').find('.current-settings.ped.recalls .values ul li').removeClass('on');
			$('#manual-override-ped-phase').find('.current-settings.ped.recalls .label .switch').removeClass('on');	
		}			
	},

	resetVehDetectors: function() {
		var vehDetectorTriggersLen = manualWorkingData.m_manualOverride.m_vehDetectorTriggers.length;
		for (var i = 0; i < vehDetectorTriggersLen; i++) {
			manualWorkingData.m_manualOverride.m_vehDetectorTriggers[i] = false;
		}		
		$('#manual-override-vehicle-detect').find('.current-settings.vehicle-detectors .values ul li').removeClass('on');
	},	

	resetPedDetectors: function() {
		var pedDetectorTriggersLen = manualWorkingData.m_manualOverride.m_pedDetectorTriggers.length;
		for (var i = 0; i < pedDetectorTriggersLen; i++) {
			manualWorkingData.m_manualOverride.m_pedDetectorTriggers[i] = false;
		}		
		$('#manual-override-ped-detect').find('.current-settings.ped-detectors .values ul li').removeClass('on');
	},	

	resetConfigurationSelection: function() {
		manualWorkingData.m_manualOverride.m_confId = 0;
		ManualUI.displayOvrConfigName()	
		
	},			

	removeDiff: function() {
		$('.man-ovr .diff').removeClass('diff');
	},

	replacePristineWithWorking: function() {
		delete manualPristineData;
		window.manualPristineData = jQuery.extend(true, {}, manualWorkingData);
	},


	setToReadOnly: function() {
		$('.panel.man-ovr').addClass('read-only');
	},

	unsetFromReadOnly: function() {
		$('.panel.man-ovr').removeClass('read-only');
	},	

/****************************************************/
// SET MANUAL OVERRIDE

	setManualOverride: function() {

		$('.panel.man-ovr .set').addClass('disabled');
		BaseUI.showNotificationModal('reset','Manual Override In Progress','Please wait',true);
		ManualUI.setToReadOnly();
		//jqxhr.abort();

		if (manualjqxhr != null) {
			manualjqxhr.abort();
			manualjqxhr = null;
		}

		manualjqxhr =
		    $.ajax({
		    	type: 'post',
		        url: manualOverrideUrl,
		        contentType: "text/plain;charset=utf-8",
		        data: JSON.stringify(manualWorkingData),
	            traditional: true,		        
		    })
			.done(function(data, textStatus, jqxhr) {
               	ManualUI.replacePristineWithWorking();
               	ManualUI.removeDiff();
               	BaseUI.showNotificationModal('success','Manual Override Successful','',true);
               	ManualUI.stopResubmitSetManualOverride();	
               	ManualUI.unsetFromReadOnly();
               	ManualUI.enableReloadLastSave();				
			})
			.fail(function(data, textStatus, jqxhr) {
				BaseUI.showNotificationModal('error','Unsuccessful: ' + jqxhr,textStatus,true);
			 	ManualUI.stopResubmitSetManualOverride();
			// 	ManualUI.resubmitSetManualOverride();
			// 	ManualUI.setManualOverride();
				ManualUI.unsetFromReadOnly();	
			})
			.always(function(data, textStatus, jqxhr) {
                $('.panel.man-ovr .set').removeClass('disabled');
                setResponseCount = setResponseCount + 1;
			});	

	},

/****************************************************/
// GET MANUAL OVERRIDE

	getManualOverride: function() {
		BaseUI.showNotificationModal('reset','Getting Manual Override Information...','Click here to close this message');

			var jqxhr =
			    $.ajax({
			        url: manualOverrideUrl,
			        dataType: 'text'
			    })
				  .done(function(data) {			    
				    window.manualWorkingData = $.parseJSON(data);
				    window.manualPristineData = $.parseJSON(data);
				    ManualUI.loadManualOverride();
	                BaseUI.hideNotificationModal();	
	                ManualUI.unsetFromReadOnly();
	                $('.panel.man-ovr .set').removeClass('disabled');		    
				  })
				  .fail(function() {
				    	BaseUI.showNotificationModal('warning','File Not Found','Loading default manual override values',true);	
				    	ManualUI.loadStaticDefaults();			    	
				  })
				  .always(function() {
				//    alert( "complete" );
				  });



	},


/****************************************************/
// LOAD STATIC DEFAULTS IF GET IS UNSUCCESSFUL

	loadStaticDefaults: function() {
		var staticUrl = '/scripts/static/manual-override.js';
		if (appMode === 'prod') {
			var jqxhr =
			    $.ajax({
			        url: staticUrl,
			        dataType: 'text'
			    })
				  .done(function(data) {			    
				    window.manualWorkingData = $.parseJSON(data);
				    window.manualPristineData = $.parseJSON(data);
				    ManualUI.loadManualOverride();
	                BaseUI.hideNotificationModal();	
	                ManualUI.unsetFromReadOnly();
	                $('#home').find('.manual-override').removeClass('disabled');
	                ManualUI.disableReloadLastSave();	    
				  })
				  .fail(function() {
				    	BaseUI.showNotificationModal('warning','Static File Not Found','Static manual override file not in expected location',true);		    	
				  })
				  .always(function() {
				//    alert( "complete" );
				  });

		} else {
			var jqxhr =
			    $.ajax({
			        url: staticUrl,
			        dataType: 'text'
			    })
				  .done(function(data) {			    
				    window.manualWorkingData = $.parseJSON(data);
				    window.manualPristineData = $.parseJSON(data);
				    ManualUI.loadManualOverride();
	                BaseUI.hideNotificationModal();	
	                ManualUI.unsetFromReadOnly();
	                $('#home').find('.manual-override').removeClass('disabled');
	                console.log($('#home').find('.manual-override').attr('class'));
	                ManualUI.disableReloadLastSave();	
				  })
				  .fail(function() {
				  		BaseUI.showNotificationModal('warning','Static File Not Found','Static manual override file not in expected location',true);		    	
				  })
				  .always(function() {

				  });	
		}

	},

	disableReloadLastSave: function() {
		$('#manual-override-view').find('.manual-override-reload').addClass('disabled');
	},

	enableReloadLastSave: function() {
		$('#manual-override-view').find('.manual-override-reload').removeClass('disabled');
	},	

/****************************************************/
// CABINET FLASH

	getCabinetFlash: function() {
		var isEnabled = manualWorkingData.m_manualOverride.m_cabinetFlash;
		$('#manual-override-view').find('.override-cabinet-flash').replaceWith(ManualUI.htmlCabinetFlash(isEnabled));		
	},

	setCabinetFlash: function(value) {
		manualWorkingData.m_manualOverride.m_cabinetFlash = value;
	},

	updCabinetFlash: function() {
	 	var isEnabled =  manualWorkingData.m_manualOverride.m_cabinetFlash;
	 	var originalSetting = manualPristineData.m_manualOverride.m_cabinetFlash;
	 	var isDiff = false;
	 	if (isEnabled !== originalSetting) {
	 		isDiff = true;
	 	}
	 	$('#manual-override-view').find('.override-cabinet-flash').replaceWith(ManualUI.htmlCabinetFlash(isEnabled,isDiff));		
	},

	toggleCabinetFlash: function() {
		$('#manual-override-view').on('mousedown','.override-cabinet-flash',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var isEnabled = manualWorkingData.m_manualOverride.m_cabinetFlash;
				if (isEnabled) {
					ManualUI.setCabinetFlash(false);
				} else {
					ManualUI.setCabinetFlash(true);
				}
				ManualUI.updCabinetFlash();				
			}
			var thisObj = $(this);
			BaseUI.removeInverse(thisObj);
		});	
	},

	htmlCabinetFlash: function(isEnabled,isDiff) {
		var thisClass = 'override-cabinet-flash no-more';
		if (isEnabled) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}	
		var markup = '<li class=\'' + thisClass + '\'\><a href=\'#\'><span class=\'switch\'></span><span class=\'label\'>Cabinet Flash</span></a></li>';	
		return markup;	
	},



/****************************************************/
// STOP TIME

	getStopTime: function() {
		var isEnabled = manualWorkingData.m_manualOverride.m_stopTime;
		$('#manual-override-view').find('.override-stop-time').replaceWith(ManualUI.htmlStopTime(isEnabled));		
	},

	setStopTime: function(value) {
		manualWorkingData.m_manualOverride.m_stopTime = value;
	},

	updStopTime: function() {
	 	var isEnabled =  manualWorkingData.m_manualOverride.m_stopTime;
	 	var originalSetting = manualPristineData.m_manualOverride.m_stopTime;
	 	var isDiff = false;
	 	if (isEnabled !== originalSetting) {
	 		isDiff = true;
	 	}
	 	$('#manual-override-view').find('.override-stop-time').replaceWith(ManualUI.htmlStopTime(isEnabled,isDiff));		
	},

	toggleStopTime: function() {
		$('#manual-override-view').on('mousedown','.override-stop-time',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var isEnabled = manualWorkingData.m_manualOverride.m_stopTime;
				if (isEnabled) {
					ManualUI.setStopTime(false);
				} else {
					ManualUI.setStopTime(true);
				}
				ManualUI.updStopTime();				
			}
			var thisObj = $(this);
			BaseUI.removeInverse(thisObj);
		});	
	},

	htmlStopTime: function(isEnabled,isDiff) {
		var thisClass = 'override-stop-time no-more';
		if (isEnabled) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}	
		var markup = '<li class=\'' + thisClass + '\'\><a href=\'#\'><span class=\'switch\'></span><span class=\'label\'>Stop Time</span></a></li>';	
		return markup;	
	},



/****************************************************/
// VEHICLE PHASE CALLS

	toggleVehPhaseCalls: function() {
		$('#manual-override-vehicle-phase').find('.current-settings.phase-calls .values ul').on('mousedown','li', function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {			
				var thisObj = $(this);
				var thisIndex = thisObj.index();
				if (thisObj.hasClass('on')) {
					ManualUI.setVehPhaseCalls(thisIndex,false);
				} else {
					ManualUI.setVehPhaseCalls(thisIndex,true);
				}
				ManualUI.updVehPhaseCalls(thisIndex);	
			}		
		});
	},

	setVehPhaseCalls: function(phase,value) {
		manualWorkingData.m_manualOverride.m_vehPhaseCalls[phase] = value;
	},

	updVehPhaseCalls: function(phase) {
		var isEnabled = manualWorkingData.m_manualOverride.m_vehPhaseCalls[phase];
		var isDiff = '';
		if (manualWorkingData.m_manualOverride.m_vehPhaseCalls[phase] == manualPristineData.m_manualOverride.m_vehPhaseCalls[phase]) {
			isDiff = '';
		} else {
			isDiff = 'diff';
		}	

		var thisView = $('#manual-override-vehicle-phase');

		thisView.find('.current-settings.phase-calls .values ul li:eq(' + phase + ')').replaceWith(ManualUI.htmlVehPhaseCalls(isEnabled,isDiff));

		ManualUI.countVehiclePhaseOverrides();

	}, 	

	getVehPhaseCalls: function() {
		var isEnabled = false;
		var isDiff = '';
		for (var i = 0; i < manualWorkingData.m_manualOverride.m_vehPhaseCalls.length; i++) {
			if (manualWorkingData.m_manualOverride.m_vehPhaseCalls[i] == true) {
				isEnabled = true;
			} else {
				isEnabled = false;	
			}	
			$('#manual-override-vehicle-phase').find('.current-settings.phase-calls .values ul').append(ManualUI.htmlVehPhaseCalls(isEnabled,isDiff));			
		}			
	},

	htmlVehPhaseCalls: function(val,diff) {
		var markup = '';
		if (val == true) {
			markup = '<li class=\'switch on ' + diff + '\'><div><span></span></div></li>';
		} else {
			markup = '<li class=\'switch ' + diff + '\'><div><span></span></div></li>';
		}
		return markup;
	},	




/****************************************************/
// VEHICLE EXCLUSIVE CALLS

	toggleVehExclusiveCalls: function() {
		$('#manual-override-vehicle-phase').find('.current-settings.exclusive-calls .values ul').on('mousedown','li', function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {							
				var thisObj = $(this);
				var thisIndex = thisObj.index();
				if (thisObj.hasClass('on')) {
					ManualUI.setVehExclusiveCalls(thisIndex,false);
				} else {
					ManualUI.setVehExclusiveCalls(thisIndex,true);
				}
				ManualUI.updVehExclusiveCalls(thisIndex);
			}				
		});
	},

	setVehExclusiveCalls: function(phase,value) {
		manualWorkingData.m_manualOverride.m_vehPhaseCallsExclusive[phase] = value;
	},

	updVehExclusiveCalls: function(phase) {
		var isEnabled = manualWorkingData.m_manualOverride.m_vehPhaseCallsExclusive[phase];
		var isDiff = '';
		if (manualWorkingData.m_manualOverride.m_vehPhaseCallsExclusive[phase] == manualPristineData.m_manualOverride.m_vehPhaseCallsExclusive[phase]) {
			isDiff = '';
		} else {
			isDiff = 'diff';
		}	
		$('#manual-override-vehicle-phase').find('.current-settings.exclusive-calls .values ul li:eq(' + phase + ')').replaceWith(ManualUI.htmlVehExclusiveCalls(isEnabled,isDiff));

		ManualUI.countVehiclePhaseOverrides();

	}, 	

	getVehExclusiveCalls: function() {
		var isEnabled = false;
		var isDiff = '';
		for (var i = 0; i < manualWorkingData.m_manualOverride.m_vehPhaseCallsExclusive.length; i++) {
			if (manualWorkingData.m_manualOverride.m_vehPhaseCallsExclusive[i] == true) {
				isEnabled = true;
			} else {
				isEnabled = false;	
			}	
			$('#manual-override-vehicle-phase').find('.current-settings.exclusive-calls .values ul').append(ManualUI.htmlVehExclusiveCalls(isEnabled,isDiff));			
		}			
	},

	htmlVehExclusiveCalls: function(val,diff) {
		var markup = '';
		if (val == true) {
			markup = '<li class=\'switch on ' + diff + '\'><div><span></span></div></li>';
		} else {
			markup = '<li class=\'switch ' + diff + '\'><div><span></span></div></li>';
		}
		return markup;
	},	



/****************************************************/
// VEHICLE RECALLS

	getVehRecalls: function() {

		for (var i = 0; i < manualWorkingData.m_manualOverride.m_vehDetectorTriggers.length; i++) {
			var thisVal = manualWorkingData.m_manualOverride.m_vehPhaseRecall[i];
			var originalSetting = manualPristineData.m_manualOverride.m_vehPhaseRecall[i];		
			var isDiff = false;
			if (thisVal !== originalSetting) {
				isDiff = true;
			}
			$('#manual-override-vehicle-phase').find('.current-settings.vehicle.recalls .values ul').append(ManualUI.htmlVehRecalls(thisVal,isDiff));			
		}	


	},

	setVehRecalls: function(phase,value) {
		manualWorkingData.m_manualOverride.m_vehPhaseRecall[phase] = parseInt(value);
	},

	updVehRecalls: function(phase,value) {
		var thisVal = manualWorkingData.m_manualOverride.m_vehPhaseRecall[phase];
		var originalSetting = manualPristineData.m_manualOverride.m_vehPhaseRecall[phase];		
		var isDiff = false;
		if (thisVal !== originalSetting) {
			isDiff = true;
		}
		$('#manual-override-vehicle-phase').find('.current-settings.vehicle.recalls .values ul li:eq(' + phase + ')').replaceWith(ManualUI.htmlVehRecalls(thisVal,isDiff));

		ManualUI.countVehiclePhaseOverrides();

	},

	cycleVehRecalls: function() {
		$('#manual-override-vehicle-phase').find('.current-settings.recalls .values ul').on('mousedown','li',function() {

			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {		
				var thisObj = $(this);

					var thisIndex = thisObj.index();
					var thisRecall = parseInt(thisObj.attr('data-recall-selection'));

					if (thisRecall == 3) {
						thisRecall = 0;
					} else {
						thisRecall = parseInt(thisRecall + 1);
					}

					// TO BE REPLACED BY VALIDATOR ON WAYNE'S SIDE
					if (thisRecall > 3) {
						thisRecall = 0;
					}

					ManualUI.setVehRecalls(thisIndex,thisRecall);
					ManualUI.updVehRecalls(thisIndex,thisRecall);	
			}				

		});
	},

	htmlVehRecalls: function(val,isDiff) {

		var thisClass = '';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		// TO BE REPLACED BY VALIDATOR ON WAYNE'S SIDE
		if (val <= 3) {
			var thisClass = thisClass + ' ' + BaseUI.translateRecall(val);
		} else {
			var thisClass = thisClass + ' error'; 
		}

		var markup = '<li class=\''+ thisClass +'\' data-recall-selection=' + val + '><span></span></li>';
		return markup;
	},


/****************************************************/
	submitVehPhase: function() {
		$('#manual-override-vehicle-phase').find('.set').on('mousedown',function() {	
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				ManualUI.resubmitSetManualOverride();	
				ManualUI.setManualOverride();
			}
			
		});
	},	

/****************************************************/
// PED PHASE CALLS


	togglePedPhaseCalls: function() {
		$('#manual-override-ped-phase').find('.current-settings.phase-calls .values ul').on('mousedown','li', function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
				} else {					
					var thisObj = $(this);
					var thisIndex = thisObj.index();
					if (thisObj.hasClass('on')) {
						ManualUI.setPedPhaseCalls(thisIndex,false);
					} else {
						ManualUI.setPedPhaseCalls(thisIndex,true);
					}
					ManualUI.updPedPhaseCalls(thisIndex);			
			}
		});
	},

	setPedPhaseCalls: function(phase,value) {
		manualWorkingData.m_manualOverride.m_pedPhaseCalls[phase] = value;
	},

	updPedPhaseCalls: function(phase) {
		var isEnabled = manualWorkingData.m_manualOverride.m_pedPhaseCalls[phase];
		var isDiff = '';
		if (manualWorkingData.m_manualOverride.m_pedPhaseCalls[phase] == manualPristineData.m_manualOverride.m_pedPhaseCalls[phase]) {
			isDiff = '';
		} else {
			isDiff = 'diff';
		}	
		$('#manual-override-ped-phase').find('.current-settings.phase-calls .values ul li:eq(' + phase + ')').replaceWith(ManualUI.htmlPedPhaseCalls(isEnabled,isDiff));

		ManualUI.countPedPhaseOverrides();
	}, 	

	getPedPhaseCalls: function() {
		var isEnabled = false;
		var isDiff = '';
		for (var i = 0; i < manualWorkingData.m_manualOverride.m_pedPhaseCalls.length; i++) {
			if (manualWorkingData.m_manualOverride.m_pedPhaseCalls[i] == true) {
				isEnabled = true;
			} else {
				isEnabled = false;	
			}	
			$('#manual-override-ped-phase').find('.current-settings.phase-calls .values ul').append(ManualUI.htmlPedPhaseCalls(isEnabled,isDiff));			
		}			
	},

	htmlPedPhaseCalls: function(val,diff) {
		var markup = '';
		if (val == true) {
			markup = '<li class=\'switch on ' + diff + '\'><div><span></span></div></li>';
		} else {
			markup = '<li class=\'switch ' + diff + '\'><div><span></span></div></li>';
		}
		return markup;
	},		

/****************************************************/
// PED EXCLUSIVE CALLS

	togglePedExclusiveCalls: function() {
		$('#manual-override-ped-phase').find('.current-settings.exclusive-calls .values ul').on('mousedown','li', function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {		
				var thisObj = $(this);
				var thisIndex = thisObj.index();
				if (thisObj.hasClass('on')) {
					ManualUI.setPedExclusiveCalls(thisIndex,false);
				} else {
					ManualUI.setPedExclusiveCalls(thisIndex,true);
				}
				ManualUI.updPedExclusiveCalls(thisIndex);
			}				
		});
	},

	setPedExclusiveCalls: function(phase,value) {
		manualWorkingData.m_manualOverride.m_pedPhaseCallsExclusive[phase] = value;
	},

	updPedExclusiveCalls: function(phase) {
		var isEnabled = manualWorkingData.m_manualOverride.m_pedPhaseCallsExclusive[phase];
		var isDiff = '';
		if (manualWorkingData.m_manualOverride.m_pedPhaseCallsExclusive[phase] == manualPristineData.m_manualOverride.m_pedPhaseCallsExclusive[phase]) {
			isDiff = '';
		} else {
			isDiff = 'diff';
		}	
		$('#manual-override-ped-phase').find('.current-settings.exclusive-calls .values ul li:eq(' + phase + ')').replaceWith(ManualUI.htmlPedExclusiveCalls(isEnabled,isDiff));

		ManualUI.countPedPhaseOverrides();

	}, 	

	getPedExclusiveCalls: function() {
		var isEnabled = false;
		var isDiff = '';
		for (var i = 0; i < manualWorkingData.m_manualOverride.m_pedPhaseCallsExclusive.length; i++) {
			if (manualWorkingData.m_manualOverride.m_pedPhaseCallsExclusive[i] == true) {
				isEnabled = true;
			} else {
				isEnabled = false;	
			}	
			$('#manual-override-ped-phase').find('.current-settings.exclusive-calls .values ul').append(ManualUI.htmlPedExclusiveCalls(isEnabled,isDiff));			
		}			
	},

	htmlPedExclusiveCalls: function(val,diff) {
		var markup = '';
		if (val == true) {
			markup = '<li class=\'switch on ' + diff + '\'><div><span></span></div></li>';
		} else {
			markup = '<li class=\'switch ' + diff + '\'><div><span></span></div></li>';
		}
		return markup;
	},	

/****************************************************/
// PED RECALLS

	togglePedRecalls: function() {
		$('#manual-override-ped-phase').find('.current-settings.recalls .values ul').on('mousedown','li', function() {

			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {		

				var thisObj = $(this);
				var thisIndex = thisObj.index();
				if (thisObj.hasClass('on')) {
					ManualUI.setPedRecalls(thisIndex,false);
				} else {
					ManualUI.setPedRecalls(thisIndex,true);
				}
				ManualUI.updPedRecalls(thisIndex);			
			}	
		});
	},

	setPedRecalls: function(phase,value) {
		manualWorkingData.m_manualOverride.m_pedPhaseRecall[phase] = value;
	},

	updPedRecalls: function(phase) {
		var isEnabled = manualWorkingData.m_manualOverride.m_pedPhaseRecall[phase];
		var isDiff = '';
		if (manualWorkingData.m_manualOverride.m_pedPhaseRecall[phase] == manualPristineData.m_manualOverride.m_pedPhaseRecall[phase]) {
			isDiff = '';
		} else {
			isDiff = 'diff';
		}	
		$('#manual-override-ped-phase').find('.current-settings.recalls .values ul li:eq(' + phase + ')').replaceWith(ManualUI.htmlPedDetectors(isEnabled,isDiff));

		ManualUI.countPedPhaseOverrides();

	}, 	

	getPedRecalls: function() {
		var isEnabled = false;
		var isDiff = '';
		for (var i = 0; i < manualWorkingData.m_manualOverride.m_pedPhaseRecall.length; i++) {
			if (manualWorkingData.m_manualOverride.m_pedPhaseRecall[i] == true) {
				isEnabled = true;
			} else {
				isEnabled = false;	
			}	
			$('#manual-override-ped-phase').find('.current-settings.recalls .values ul').append(ManualUI.htmlPedDetectors(isEnabled,isDiff));			
		}			
	},

	htmlPedRecalls: function(val,diff) {
		var markup = '';
		if (val == true) {
			markup = '<li class=\'switch on ' + diff + '\'><div><span></span></div></li>';
		} else {
			markup = '<li class=\'switch ' + diff + '\'><div><span></span></div></li>';
		}
		return markup;
	},

// /****************************************************/

	submitPedPhase: function() {
		$('#manual-override-ped-phase').find('.set').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				ManualUI.resubmitSetManualOverride();	
				ManualUI.setManualOverride();
			}
		});
		
	},



// /****************************************************/
// // CONFIGURATION SELECTION
	selectConfigOverride: function() {
			var configListContainer = $('#manual-override-config-name').find('.config-selection ul');
			configListContainer.empty();
			var configListLen = allWorkingData.InSpire.m_controllerConfigurations.length;
			var markup = '<li><a data-config-loc=\'99\'><span>None<span></a></li>';
			for (var i = 0; i < configListLen;  i++) {
				if (allWorkingData.InSpire.m_controllerConfigurations[i].m_confStatus == 1) {	
					var confId = allWorkingData.InSpire.m_controllerConfigurations[i].m_confId;
					var confName = allWorkingData.InSpire.m_controllerConfigurations[i].m_configurationName;
					markup = markup + "<li><a data-config-loc=\'" + i +"\' data-config-id=\'" + confId + "\'><span>" + confName + "</span></a></li>";
				}
			}
			configListContainer.append(markup);
	},

	setConfigOverride: function() {
		var thisView = $('#manual-override-config-name');

		thisView.find('.config-selection ul').on('mousedown','a', function() {
			configLoc = $(this).attr('data-config-loc');
			thisView.find('.config-selection #selected-value').val(configLoc);
			thisView.find('ul li').removeClass('diff');
			$(this).parent().addClass('diff');
			if (configLoc != '99') {
				$('#manual-override-view').find('.override-config-name .current-config').text(ManualUI.getConfigName(configLoc));		
			} else {
				$('#manual-override-view').find('.override-config-name .current-config').text('None');
			}
					
		});

		thisView.find('.set').on('mousedown', function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				selConfig = thisView.find('#selected-value').val();
				if (selConfig < 99) { // 99 represents 'None' since this value represents the array location of the config instead of id
					manualWorkingData.m_manualOverride.m_confId = allWorkingData.InSpire.m_controllerConfigurations[selConfig].m_confId;
					$('#manual-override-view').find('.override-config-name .current-config').text(ManualUI.getConfigName(selConfig));				
				} else {
					manualWorkingData.m_manualOverride.m_confId = 0;
					$('#manual-override-view').find('.override-config-name .current-config').text('None');	
				}
				BaseUI.switchPanel('manual-override-view');
				ManualUI.resubmitSetManualOverride();	
				ManualUI.setManualOverride();
			}			

		});		
	},

	displayOvrConfigName: function() {
		if (activeConfigId > 0) { // set in the recurring operation status checks
			var ovrConfig = parseInt(manualWorkingData.m_manualOverride.m_confId);
			var isValidId = false;
			var configListLen = allWorkingData.InSpire.m_controllerConfigurations.length;
			for (var i = 0; i < configListLen;  i++) {
				if (ovrConfig === allWorkingData.InSpire.m_controllerConfigurations[i].m_confId) {
					isValidId = true;
					break;
				}
			}	

			if (isValidId && ovrConfig > 0) {
				var ovrConfigLoc = ConfigUI.convertConfigIdToLoc(ovrConfig);
				$('#manual-override-view').find('.override-config-name .current-config').text(ManualUI.getConfigName(ovrConfigLoc));			
			} else {
				$('#manual-override-view').find('.override-config-name .current-config').text('None');		
			}
		}
	},

	getConfigName: function(id) {
		var confName = allWorkingData.InSpire.m_controllerConfigurations[id].m_configurationName;
		return confName;
	},


/****************************************************/
// VEHICLE DETECTORS

	toggleVehDetectors: function() {
		$('#manual-override-vehicle-detect').find('.current-settings.vehicle.vehicle-detectors .values ul').on('mousedown','li', function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {		
				var thisObj = $(this);
				var thisIndex = thisObj.index();
				if (thisObj.hasClass('on')) {
					ManualUI.setVehDetectors(thisIndex,false);
				} else {
					ManualUI.setVehDetectors(thisIndex,true);
				}
				ManualUI.updVehDetectors(thisIndex);			
			}
		});
	},

	setVehDetectors: function(phase,value) {
		manualWorkingData.m_manualOverride.m_vehDetectorTriggers[phase] = value;
	},

	updVehDetectors: function(phase) {
		var isEnabled = manualWorkingData.m_manualOverride.m_vehDetectorTriggers[phase];
		var isDiff = '';
		if (manualWorkingData.m_manualOverride.m_vehDetectorTriggers[phase] == manualPristineData.m_manualOverride.m_vehDetectorTriggers[phase]) {
			isDiff = '';
		} else {
			isDiff = 'diff';
		}	
		$('#manual-override-vehicle-detect').find('.current-settings.vehicle-detectors .values ul li:eq(' + phase + ')').replaceWith(ManualUI.htmlVehDetectors(isEnabled,isDiff));

		ManualUI.countVehicleDetectors();
	}, 	

	getVehDetectors: function() {
		var isEnabled = false;
		var isDiff = '';
		for (var i = 0; i < manualWorkingData.m_manualOverride.m_vehDetectorTriggers.length; i++) {
			if (manualWorkingData.m_manualOverride.m_vehDetectorTriggers[i] == true) {
				isEnabled = true;
			} else {
				isEnabled = false;	
			}	
			$('#manual-override-vehicle-detect').find('.current-settings.vehicle-detectors .values ul').append(ManualUI.htmlVehDetectors(isEnabled,isDiff));			
		}			
	},

	htmlVehDetectors: function(val,diff) {
		var markup = '';
		if (val == true) {
			markup = '<li class=\'switch on ' + diff + '\'><div><span></span></div></li>';
		} else {
			markup = '<li class=\'switch ' + diff + '\'><div><span></span></div></li>';
		}
		return markup;
	},

	submitVehDetectors: function() {
		$('#manual-override-vehicle-detect').find('.set').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				ManualUI.resubmitSetManualOverride();	
				ManualUI.setManualOverride();
			}
		});
		
	},

/****************************************************/
// PED DETECTORS

	togglePedDetectors: function() {
		$('#manual-override-ped-detect').find('.current-settings.ped-detectors .values ul').on('mousedown','li', function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {					
				var thisObj = $(this);
				var thisIndex = thisObj.index();
				if (thisObj.hasClass('on')) {
					ManualUI.setPedDetectors(thisIndex,false);
				} else {
					ManualUI.setPedDetectors(thisIndex,true);
				}
				ManualUI.updPedDetectors(thisIndex);
			}			
		});
	},

	setPedDetectors: function(phase,value) {
		manualWorkingData.m_manualOverride.m_pedDetectorTriggers[phase] = value;
	},

	updPedDetectors: function(phase) {
		var isEnabled = manualWorkingData.m_manualOverride.m_pedDetectorTriggers[phase];
		var isDiff = '';
		if (manualWorkingData.m_manualOverride.m_pedDetectorTriggers[phase] == manualPristineData.m_manualOverride.m_pedDetectorTriggers[phase]) {
			isDiff = '';
		} else {
			isDiff = 'diff';
		}	
		$('#manual-override-ped-detect').find('.current-settings.ped-detectors .values ul li:eq(' + phase + ')').replaceWith(ManualUI.htmlPedDetectors(isEnabled,isDiff));

		ManualUI.countPedDetectors();
	}, 	

	getPedDetectors: function() {
		var isEnabled = false;
		var isDiff = '';
		for (var i = 0; i < manualWorkingData.m_manualOverride.m_pedDetectorTriggers.length; i++) {
			if (manualWorkingData.m_manualOverride.m_pedDetectorTriggers[i] == true) {
				isEnabled = true;
			} else {
				isEnabled = false;	
			}	
			$('#manual-override-ped-detect').find('.current-settings.ped-detectors .values ul').append(ManualUI.htmlPedDetectors(isEnabled,isDiff));			
		}			
	},

	htmlPedDetectors: function(val,diff) {
		var markup = '';
		if (val == true) {
			markup = '<li class=\'switch on ' + diff + '\'><div><span></span></div></li>';
		} else {
			markup = '<li class=\'switch ' + diff + '\'><div><span></span></div></li>';
		}
		return markup;
	},

	submitPedDetectors: function() {
		$('#manual-override-ped-detect').find('.set').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				ManualUI.resubmitSetManualOverride();	
				ManualUI.setManualOverride();
			}	
		});
		
	},

	countVehiclePhaseOverrides: function() {
		var overCount = $('#manual-override-vehicle-phase').find('.values .on').length;
		overCount = overCount + ($('#manual-override-vehicle-phase .recalls li').not('.none').length);
		var errorCount = ($('#manual-override-vehicle-phase .recalls li.error').length);

		overCount  = overCount - errorCount;

		if (errorCount > 0) {
			$('#manual-override-view').find('.override-vehicle-phase .errors-found').text(errorCount).show();
		} else {
			$('#manual-override-view').find('.override-vehicle-phase .errors-found').text(errorCount).hide();
		}

		if (overCount > 0) {
			$('#manual-override-view').find('.override-vehicle-phase .count').text(overCount).show();
		} else {
			$('#manual-override-view').find('.override-vehicle-phase .count').text(overCount).hide();
		}


		var diffCount = $('#manual-override-vehicle-phase').find('.diff').length;
		if (diffCount > 0) {
			$('#manual-override-view').find('.override-vehicle-phase').addClass('diff');
		} else {
			$('#manual-override-view').find('.override-vehicle-phase').removeClass('diff');
		}		
	},

	countPedPhaseOverrides: function() {
		var overCount = $('#manual-override-ped-phase').find('.values .on').length;
		if (overCount > 0) {
			$('#manual-override-view').find('.override-ped-phase .count').text(overCount).show();
		} else {
			$('#manual-override-view').find('.override-ped-phase .count').text(overCount).hide();
		}
		var diffCount = $('#manual-override-ped-phase').find('.diff').length;
		if (diffCount > 0) {
			$('#manual-override-view').find('.override-ped-phase').addClass('diff');
		} else {
			$('#manual-override-view').find('.override-ped-phase').removeClass('diff');
		}


	},

	countVehicleDetectors: function() {
		var overCount = $('#manual-override-vehicle-detect').find('.values .on').length;
		if (overCount > 0) {
			$('#manual-override-view').find('.override-vehicle-detect .count').text(overCount).show();
		} else {
			$('#manual-override-view').find('.override-vehicle-detect .count').text(overCount).hide();
		}
		var diffCount = $('#manual-override-vehicle-detect').find('.diff').length;
		if (diffCount > 0) {
			$('#manual-override-view').find('.override-vehicle-detect').addClass('diff');
		} else {
			$('#manual-override-view').find('.override-vehicle-detect').removeClass('diff');
		}

	},	

	countPedDetectors: function() {
		var overCount = $('#manual-override-ped-detect').find('.values .on').length;
		if (overCount > 0) {
			$('#manual-override-view').find('.override-ped-detect .count').text(overCount).show();
		} else {
			$('#manual-override-view').find('.override-ped-detect .count').text(overCount).hide();
		}
		var diffCount = $('#manual-override-ped-detect').find('.diff').length;
		if (diffCount > 0) {
			$('#manual-override-view').find('.override-ped-detect').addClass('diff');
		} else {
			$('#manual-override-view').find('.override-ped-detect').removeClass('diff');
		}
	},			

	resubmitSetManualOverride: function() {
		console.log('resubmitting manual override');
		window.setOverrideInterval = setInterval(function() {
			ManualUI.setManualOverride();
		}, 5000);
	},

	stopResubmitSetManualOverride: function() {
		clearInterval(window.setOverrideInterval);
	},
/**************************************/
// SCROLL UP / DOWN - Vehicle Phases
	scrollUpDown: function() {
		$('#manual-override-view').find('.page-down').on('mousedown',function() {
			var thisView = $('#manual-override-view');
			for (var i = 1; i < 10;  i++) {
				thisView.find('ul li:nth-child('+ i +')').hide();
			}	
			for (var i = 10; i < 11;  i++) {
				thisView.find('ul li:nth-child('+ i +')').show();
			}				
		});

		$('#manual-override-view').find('.page-up').on('mousedown',function() {
			var thisView = $('#manual-override-view');
			for (var i = 1; i < 10;  i++) {
				thisView.find('ul li:nth-child('+ i +')').show();
			}	
			for (var i = 10; i < 11;  i++) {
				thisView.find('ul li:nth-child('+ i +')').hide();
			}				
		});

	},	


	toggleAllVehPhaseCalls: function(e) {
		$('#manual-override-vehicle-phase').find('.current-settings.phase-calls .label .switch').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {				
				var phaseLen = manualWorkingData.m_manualOverride.m_vehPhaseCalls.length;
				var thisObj = $(this);
				if (thisObj.hasClass('on')) {
					thisObj.removeClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setVehPhaseCalls(i,false);
						ManualUI.updVehPhaseCalls(i);
					}					
				} else {
					thisObj.addClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setVehPhaseCalls(i,true);
						ManualUI.updVehPhaseCalls(i);
					}				
				}
			}
			//e.stopPropagation();
		});
	},

	toggleAllVehExclusiveCalls: function() {
		$('#manual-override-vehicle-phase').find('.current-settings.exclusive-calls .label .switch').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {			
				var phaseLen = manualWorkingData.m_manualOverride.m_vehPhaseCallsExclusive.length;
				var thisObj = $(this);
				if (thisObj.hasClass('on')) {
					thisObj.removeClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setVehExclusiveCalls(i,false);
						ManualUI.updVehExclusiveCalls(i);
					}					
				} else {
					thisObj.addClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setVehExclusiveCalls(i,true);
						ManualUI.updVehExclusiveCalls(i);
					}				
				}
			}
		});
	},	

	cycleAllVehRecalls: function() {
		$('#manual-override-vehicle-phase').find('.current-settings.recalls .label .cycler').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var phaseLen = manualWorkingData.m_manualOverride.m_vehPhaseRecall.length;		
				var thisObj = $(this);

					var thisRecall = parseInt(thisObj.attr('data-recall-selection'));

					if (thisRecall == 3) {
						thisRecall = 0;
					} else {
						thisRecall = parseInt(thisRecall + 1);
					}

					// TO BE REPLACED BY VALIDATOR ON WAYNE'S SIDE
					if (thisRecall > 3) {
						thisRecall = 0;
					}

					thisObj.removeClass('none min max soft').addClass(BaseUI.translateRecall(thisRecall)).attr('data-recall-selection',thisRecall);

					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setVehRecalls(i,thisRecall);
						ManualUI.updVehRecalls(i);	
					}						

					
			}				

		});
	},

	toggleAllPedPhaseCalls: function(e) {
		$('#manual-override-ped-phase').find('.current-settings.phase-calls .label .switch').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {				
				var phaseLen = manualWorkingData.m_manualOverride.m_pedPhaseCalls.length;
				var thisObj = $(this);
				if (thisObj.hasClass('on')) {
					thisObj.removeClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setPedPhaseCalls(i,false);
						ManualUI.updPedPhaseCalls(i);
					}					
				} else {
					thisObj.addClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setPedPhaseCalls(i,true);
						ManualUI.updPedPhaseCalls(i);
					}				
				}
				//e.stopPropagation();
			}
		});
	},

	toggleAllPedExclusiveCalls: function(e) {
		$('#manual-override-ped-phase').find('.current-settings.exclusive-calls .label .switch').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {			
				var phaseLen = manualWorkingData.m_manualOverride.m_pedPhaseCallsExclusive.length;
				var thisObj = $(this);
				if (thisObj.hasClass('on')) {
					thisObj.removeClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setPedExclusiveCalls(i,false);
						ManualUI.updPedExclusiveCalls(i);
					}					
				} else {
					thisObj.addClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setPedExclusiveCalls(i,true);
						ManualUI.updPedExclusiveCalls(i);
					}				
				}
				//e.stopPropagation();
			}
		});
	},	

	toggleAllPedRecalls: function(e) {
		$('#manual-override-ped-phase').find('.current-settings.recalls .label .switch').on('mousedown',function() {
			console.log('toggleAllPedRecalls');
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {				
				var phaseLen = manualWorkingData.m_manualOverride.m_pedPhaseRecall.length;
				var thisObj = $(this);
				if (thisObj.hasClass('on')) {
					thisObj.removeClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setPedRecalls(i,false);
						ManualUI.updPedRecalls(i);
					}					
				} else {
					thisObj.addClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setPedRecalls(i,true);
						ManualUI.updPedRecalls(i);
					}				
				}
			//	e.stopPropagation();
			}
		});
	},

	toggleAllVehDetectors: function(e) {
		$('#manual-override-vehicle-detect').find('.current-settings.vehicle-detectors .label .switch').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {				
				var phaseLen = manualWorkingData.m_manualOverride.m_vehDetectorTriggers.length;
				var thisObj = $(this);
				if (thisObj.hasClass('on')) {
					thisObj.removeClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setVehDetectors(i,false);
						ManualUI.updVehDetectors(i);
					}					
				} else {
					thisObj.addClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setVehDetectors(i,true);
						ManualUI.updVehDetectors(i);
					}				
				}
			//	e.stopPropagation();
			}
		});
	},	

	toggleAllPedDetectors: function(e) {
		$('#manual-override-ped-detect').find('.current-settings.ped-detectors .label .switch').on('mousedown',function() {
			if ($('#manual-override-view').hasClass('read-only')) {
				// ignore it
			} else {
				var isShowingFirstEight = $('#manual-override-ped-detect').find('.page-left').hasClass('disabled');			
				var phaseLen = manualWorkingData.m_manualOverride.m_pedDetectorTriggers.length;
				var thisObj = $(this);
				if (thisObj.hasClass('on')) {
					thisObj.removeClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setPedDetectors(i,false);
						ManualUI.updPedDetectors(i);
					}					
				} else {
					thisObj.addClass('on');
					for (var i = 0; i < phaseLen ;  i++) {
						ManualUI.setPedDetectors(i,true);
						ManualUI.updPedDetectors(i);
					}				
				}
			//	e.stopPropagation();

				if (isShowingFirstEight) {
					for (var i = 0; i < 8 ;  i++) {
						$('#manual-override-ped-detect').find('.ped-detectors .values li:nth-child(' + i + ')').show();
					}
					for (var i = 8; i < 16 ;  i++) {
						$('#manual-override-ped-detect').find('.ped-detectors .values li:nth-child(' + i + ')').hide();
					}						
				} else {
					for (var i = 0; i < 9 ;  i++) {
						$('#manual-override-ped-detect').find('.ped-detectors .values li:nth-child(' + i + ')').hide();
					}
					for (var i = 9; i < 16 ;  i++) {
						$('#manual-override-ped-detect').find('.ped-detectors .values li:nth-child(' + i + ')').show();
					}		
				}

			}
		});
	},	

	toggleAllControlAccess: function(e) {
		$('.man-ovr').find('.label').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('toggle-all-control')) {
				thisObj.removeClass('toggle-all-control');
			} else {
				thisObj.addClass('toggle-all-control');
			}
			//e.stopPropagation();
		});
	},

 } // end of ManualUI

//$(document).ready(ManualUI.initialize);