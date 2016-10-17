var PreemptUI = {

	initialize: function () {

		window.loadedPreemptId = null;
		window.loadedPreemptLoc = 0;


		if (!$('body').hasClass('read-only')) {	
			PreemptUI.togglePreemptEnabled();
			PreemptUI.selSingleState();
			PreemptUI.setupNumChanges();
			PreemptUI.toggleVehOneCall();
			PreemptUI.togglePedOneCall();
		}
//		PreemptUI.getPreempt();	
		PreemptUI.getPreemptList();
		// PreemptUI.rotateCycleState();

		//PreemptUI.cyclePreemptType();
		
		// PreemptUI.toggleExitCalls();
		// PreemptUI.toggleTypePreempt();
		// PreemptUI.toggleOutputPreempt();
		// PreemptUI.selectMaxCall();
		// PreemptUI.selectChannel();
		// PreemptUI.updateMaxCall();
		// PreemptUI.updatePhaseTiming();

		// PreemptUI.cyclePhaseTimingRecall();
		// PreemptUI.cycleLeftTurnMode();


		// PreemptUI.changeVehiclePhaseTiming();
		// PreemptUI.changePedDefTiming();
		// PreemptUI.togglePedNonActuated();
		// PreemptUI.togglePedRestInWalk();
		// PreemptUI.togglePedClearYellow();
		// PreemptUI.changeLeftTurnPermissive();

		PreemptUI.loadPreemtMenuItems();


		$('#preempt-setup').find('.page-down').on('mousedown',function() {
			PreemptUI.preemptSetupScrollDown();
		});	

		$('#preempt-setup').find('.page-up').on('mousedown',function() {
			PreemptUI.preemptSetupScrollUp();
		});		


	},

	loadPreemtMenuItems: function() {
		$('#preempt-list').find('.content ul.list').on('mousedown','li',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			loadedPreemptLoc = thisObj.attr('data-preempt-array-loc');
			PreemptUI.getPreempt(loadedPreemptLoc); // using array location to get info faster
			preemptId = thisObj.attr('data-preempt-id');
			PreemptUI.updatePreemptNameDisplayed('Preempt ' + preemptId);
			setTimeout(function() { BaseUI.switchPanel('preempt-detail-home') }, delayTime );	
		});

		$('#preempt-detail-home').find('.content ul li.preempt-setup-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			PreemptUI.preemptSetupScrollUp();
			setTimeout(function() { BaseUI.switchPanel('preempt-setup') }, delayTime );	
		});		


		$('.preempt-list .content ul li.preempt-setup-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('preempt-setup') }, delayTime );	
		});		

		$('.preempt-detail-home .content ul li.phase-startup-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('preempt-phase-startup') }, delayTime );	
		});		

		$('.preempt-list .content ul li.dwell-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('preempt-dwell') }, delayTime );	
		});

		$('.preempt-detail-home .content ul li.left-turn-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('preempt-left') }, delayTime );	
		});	

		$('.preempt-detail-home .content ul li.phase-timing-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('preempt-vehicle-phase-timing') }, delayTime );	
		});				

		$('.preempt-detail-home .content ul li.ped-preempt').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('preempt-ped-phase-def') }, delayTime );	
		});	

		$('.preempt-detail-home .content ul li.ped-detector-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('preempt-ped-detectors') }, delayTime );	
		});	

		$('.preempt-detail-home .content ul li.vehicle-detector-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('preempt-vehicle-detectors') }, delayTime );	
		});								

	},


	preemptSetupScrollDown: function() {
			$('#preempt-setup').find('.current-settings:nth-child(2)').hide();
			$('#preempt-setup').find('.current-settings:nth-child(3)').hide();
			$('#preempt-setup').find('.current-settings:nth-child(4)').hide();
			$('#preempt-setup').find('.current-settings:nth-child(5)').hide();
			$('#preempt-setup').find('.current-settings:nth-child(6)').hide();
			$('#preempt-setup').find('.current-settings:nth-child(7)').hide();
			$('#preempt-setup').find('.current-settings:nth-child(8)').hide();
			$('#preempt-setup').find('.current-settings:nth-child(9)').show();
			$('#preempt-setup').find('.current-settings:nth-child(10)').show();
	},

	preemptSetupScrollUp: function() {
			$('#preempt-setup').find('.current-settings:nth-child(2)').show();
			$('#preempt-setup').find('.current-settings:nth-child(3)').show();
			$('#preempt-setup').find('.current-settings:nth-child(4)').show();
			$('#preempt-setup').find('.current-settings:nth-child(5)').show();
			$('#preempt-setup').find('.current-settings:nth-child(6)').show();
			$('#preempt-setup').find('.current-settings:nth-child(7)').show();
			$('#preempt-setup').find('.current-settings:nth-child(8)').show();
			$('#preempt-setup').find('.current-settings:nth-child(9)').hide();
			$('#preempt-setup').find('.current-settings:nth-child(10)').hide();
	},	

	getPreemptList: function() {
		$('#preempt-list').find('.content ul.list').empty();
		var markup = '';
		var preemptLen = allWorkingData.InSpire.m_preemptConfiguration.m_preempt.length;
		var enabledClass = '';
		for (var i = 0; i < preemptLen;  i++) {
			var thisClass = BaseUI.translatePreemptType(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[i].m_preemptType);
			var thisId = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[i].m_preemptId;
			var isEnabled = BaseUI.translatePreemptType(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[i].m_enabled);
			if (isEnabled) {
				enabledClass = 'enabled';
			}
			markup = markup + '<li class=\'' + thisClass + ' ' + enabledClass + '\' data-preempt-array-loc='+i+' data-preempt-id=' + thisId + '><span class=\'preempt-icon\'></span><span class="preempt-label">Preempt '+ thisId  +'</span><span class=\'preempt-enabled\'></span></li>'
	 		PreemptUI.getPreemptId(i);
		}	
		 $('#preempt-list').find('.content ul.list').append(markup);
	 //  	// Preempt Setup


	 //  	for (var i = 0; i < allWorkingData.InSpire.m_preemptConfiguration.m_preempt.length; i++) {

	 //  		// Preempt List

		// 	//PreemptUI.getPreemptType(i);  Um, not in the object, dude.


		// 	// PreemptUI.getCycleState(i,0);
		// 	PreemptUI.getExitState(i);

	 //  	}


	},

	emptyPreemptShell: function() {
		$('#preempt-setup').find('.current-settings .values ul').empty();
	},	

	getPreempt: function(id) {
		console.log('id is ' + id);
		PreemptUI.emptyPreemptShell();
		PreemptUI.getPreemptIdHeader(id);
		PreemptUI.getPreemptEnabled(id);
		PreemptUI.getPreemptType(id);
		PreemptUI.getInputNum(id);
		PreemptUI.getMaxCall(id);
		PreemptUI.getDwellState(id);
		PreemptUI.getCycleState(id);
		PreemptUI.getExitState(id);
		PreemptUI.getVehOneCall(id);
		PreemptUI.getPedOneCall(id);
		PreemptUI.getMinGreenEnter(id);
		PreemptUI.getDelay(id);
		// Getting the array location of the ID for efficiency
		// for (var i = 0; i < allWorkingData.InSpire.m_preemptConfiguration.m_preempt.length; i++) {
		// 	 if (allWorkingData.InSpire.m_preemptConfiguration.m_preempt[i].m_preemptId == id) {
		// 		id = i;
		// 		//PreemptUI.updatePreemptNameDisplayed('PreEMPT ' + id);
		// 	 }
		// }


	    // Vehicle Phase
	 //    var vehPhaseLen = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[id].m_preemptPhaseConfiguration.m_vehPhase.length;
		// for (var i = 0; i < vehPhaseLen; i++) {	

		//  PreemptUI.getVehiclePhase(id,i);
		// 	PreemptUI.getVehicleEnabled(id,i);
		// 	PreemptUI.getVehicleChannel(id,i);
		// 	PreemptUI.getVehicleLeftPermissive(id,i);
		// 	PreemptUI.getVehicleFlashingOutput(id,i);
		// 	PreemptUI.getVehicleLeftTurnMode(id,i);
		// 	PreemptUI.getVehicleMaxGreen(id,i);
		// 	PreemptUI.getVehicleMinGreen(id,i);
		// 	PreemptUI.getVehiclePassage(id,i);
		// 	PreemptUI.getVehicleRecall(id,i);
		// 	PreemptUI.getVehicleRed(id,i);
		// 	PreemptUI.getVehicleYellow(id,i);

			
		// }
		// // Pedestrian Phase
		// for (var i = 0; i < allWorkingData.InSpire.m_preemptConfiguration.m_preempt[id].m_preemptPhaseConfiguration.m_pedPhase.length; i++) {
	
		// 	PreemptUI.getPedClearanceTiming(id,i);
		// 	PreemptUI.getPedClearanceYellow(id,i);
		// 	PreemptUI.getPedPhase(id,i);
		//  	PreemptUI.getPedEnabled(id,i);
		//  	PreemptUI.getPedChannel(id,i);
		//  	PreemptUI.getPedNonActuated(id,i);
		//  	PreemptUI.getPedRestInWalk(id,i);
		// 	PreemptUI.getPedWalkTiming(id,i);
		// }

		// // Pedestrian Detectors
		// for (var i = 0; i < allWorkingData.InSpire.m_preemptConfiguration.m_preempt[id].m_preemptPhaseConfiguration.m_pedDetector.length; i++) {
		// 	PreemptUI.getDetectorPedDetNumber(id,i);
		// 	PreemptUI.getDetectorPedPhasAssignment(id,i);
		// }

		// 	// Vehicle Detectors
	 // 	for (var i = 0; i < allWorkingData.InSpire.m_preemptConfiguration.m_preempt[id].m_preemptPhaseConfiguration.m_vehicleDetector.length; i++) {
	 // 		PreemptUI.getDetectorVehicleDetNumber(id,i);
	 // 		PreemptUI.getDetectorVehicleDelay(id,i);
	 // 		PreemptUI.getDetectorVehicleExtend(id,i);
	 // 		PreemptUI.getDetectorVehicleLockDetection(id,i);
	 // 		PreemptUI.getDetectorVehicleStuckOff(id,i);
	 // 		PreemptUI.getDetectorVehicleStuckOn(id,i);
	 // 		PreemptUI.getDetectorVehiclePhaseAssignment(id,i);
	 // 		PreemptUI.getDetectorVehicleCallFailure(id,i);		
	 // 	}

		// BaseUI.showFirstEightOnly('preempt-vehicle-phase-timing');
		// BaseUI.showFirstEightOnly('preempt-ped-phase-def');
		// BaseUI.showFirstEightOnly('preempt-left');
		// BaseUI.showFirstEightOnly('preempt-vehicle-detectors');
		// BaseUI.showFirstEightOnly('preempt-ped-detectors');
		// BaseUI.showFirstEightOnly('preempt-phase-startup');

		$('#home').find('.preempt-list-link').removeClass('disabled');
	},


/*******************************************/
// PREEMPT ID for HEADERS

	getPreemptIdHeader: function(preempt) {
		var preemptID = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptId;
		var markup = '<ul><li class=\'has-phase\'><div><span>' + preemptID + '</span></div></li></ul>';
  		$('#preempt-setup').find('.preempt-id .values ul').replaceWith(markup);
	},


/*******************************************/
// PREEMPT ENABLED


	setPreemptEnabled: function(preempt,value) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_enabled = value;
	},

	getPreemptEnabled: function(preempt) {
		var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_enabled;
		$('#preempt-setup').find('.preempt-enabled ul').append(PreemptUI.htmlPreemptEnabled(isEnabled));		
	},

	updPreemptEnabled: function(preempt,val) {
	 	var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_enabled;
	 	var originalSetting = allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_enabled;
	 	var isDiff = false;
	 	if (isEnabled !== originalSetting) {
	 		isDiff = true;
	 	}
	 	$('#preempt-setup').find('.current-settings.preempt-enabled ul li').replaceWith(PreemptUI.htmlPreemptEnabled(isEnabled,isDiff));
	},	

	htmlPreemptEnabled: function(isEnabled,isDiff) {
		var thisClass = 'switch';
		if (isEnabled) {
			thisClass = thisClass + ' on';
		} 
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}	
		var markup = '<li class=\'' + thisClass + '\'\></li>';
		return markup;
	},

	togglePreemptEnabled: function() {
		$('#preempt-setup').find('.current-settings.preempt-enabled .values ul').on('mousedown','li',function() {
			var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[loadedPreemptLoc].m_enabled;
			if (isEnabled) {
				PreemptUI.setPreemptEnabled(loadedPreemptLoc,false);
			} else {
				PreemptUI.setPreemptEnabled(loadedPreemptLoc,true);
			}
			PreemptUI.updPreemptEnabled(loadedPreemptLoc,isEnabled);
		});
	},	

/*******************************************/
// PREEMPT TYPE

	setPreemptType: function(preempt,value) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptType = parseInt(value);
	},

	getPreemptType: function(preempt) {
		var thisType = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptType;
		$('#preempt-setup').find('.preempt-type ul').append(PreemptUI.htmlPreemptType(thisType));		
	},

	updPreemptType: function(preempt,val) {
	 	var thisType = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptType;
	 	var originalSetting = allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptType;
	 	var isDiff = false;
	 	if (thisType !== originalSetting) {
	 		isDiff = true;
	 	}
	 	$('#preempt-setup').find('.current-settings.preempt-type ul li').replaceWith(PreemptUI.htmlPreemptType(thisType,isDiff));
	},	

	htmlPreemptType: function(val,isDiff) {
		var thisClass = BaseUI.translatePreemptType(val);
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\'has-popup '+ thisClass +'\' data-preempt-type=\'' + val + '\'><div></div></li>';
		return markup;
	},

	cyclePreemptType: function() {
		$('#preempt-setup').find('.current-settings.preempt-type .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			var thisType = parseInt(thisObj.attr('data-preempt-type'));
			if (thisType == 2) {
				thisType = 0;
			} else {
				thisType = parseInt(thisType + 1);
			}
			PreemptUI.setPreemptType(loadedPreemptLoc,thisType);
			PreemptUI.updPreemptType(loadedPreemptLoc,thisType);
		});
	},

	// selPreemptType: function() {
	// 	$('#preempt-setup').find('.current-settings.preempt-type ul').on('mousedown','li',function() {
	// 		var thisId = $('#preempt-setup').find('.current-settings.preempt-id ul li').text();
	// 		$('#preempt-setup').find('.overlay.preempt-type-selection #current-phase').val(thisId);			
	// 		$('#preempt-setup').find('.overlay.preempt-type-selection').show();
	// 	});

	// 	$('#manual-override-vehicle-phase').find('.overlay.vehicle-recalls-selection ul li').on('mousedown',function() {
	// 		var thisObj = $(this);
	// 		var thisRecall = parseInt(thisObj.attr('data-recall-selection'));
	// 		var thisPhase = $('#manual-override-vehicle-phase').find('.overlay.vehicle-recalls-selection #current-phase').val();
	// 		// NOT THIS SHIT
	// 		// ManualUI.setManualOverrideVehRecalls(thisPhase,thisRecall);
	// 		// var readRecall = manualWorkingData.m_manualOverride.m_vehPhaseRecall[thisPhase];
	// 		// ManualUI.updManualOverrideVehRecalls(thisPhase,BaseUI.translateRecall(readRecall));
	// 		BaseUI.resetOverlay();
	// 	});

	// 	$('#preempt-setup').find('.overlay.preempt-type-selection .cancel').on('mousedown',function() {
	// 		BaseUI.resetOverlay();
	// 	});		

	// },	




	setupNumChanges: function() {
		var thisView = $('#preempt-setup');

		thisView.find('.current-settings.keypad .values ul').on('mousedown','li',function() {
			$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
			thisView.find('.overlay.timing .keypad li.disabled').removeClass('disabled');
			thisView.find('.overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
			var thisObj = $(this);
			var thisTiming = thisObj.parents('.current-settings').attr('class');
			var thisVal = thisObj.find('span').text();
			var thisPhase = thisObj.index();
			thisView.find('.overlay.timing .has-phase div').empty();
			thisView.find('.current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo(thisView.find('.overlay.timing .has-phase div'));
			thisView.find('.overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
			thisView.find('.overlay.timing .current-timing-entry .value span').text(thisVal);
			if (thisObj.parents('.current-settings').hasClass('preempt-max-call')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Max Call:');
				thisView.find('.overlay.timing .new-timing label').text('New Max Call:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('preempt-max-call');
			} else if (thisObj.parents('.current-settings').hasClass('preempt-input-num')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Preempt Input:');
				thisView.find('.overlay.timing .new-timing label').text('New Preempt Input:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('preempt-input-num');
			} else if (thisObj.parents('.current-settings').hasClass('min-green-enter')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Min Green To Enter Preempt:');
				thisView.find('.overlay.timing .new-timing label').text('New Min Green To Enter Preempt:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('min-green-enter');
			} else if (thisObj.parents('.current-settings').hasClass('delay')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Delay:');
				thisView.find('.overlay.timing .new-timing label').text('New Delay:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('delay');
			} 
			thisView.find('.overlay.timing').show();
		});
 
		thisView.find('.overlay.timing li[data-keypad-num]').on('mousedown',function() {
			if (!$(this).hasClass('disabled')) {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);	
				var keypadEntry = thisObj.attr('data-keypad-num');
				var curVal = thisView.find('.overlay.timing #value-entered').val();

				if (thisObj.find('a').hasClass('backspace')) {
					// backspace functions
					newVal = curVal.substring(0,curVal.length - 1);
					$(this).parents('.panel').find('.overlay.timing #value-entered').val(newVal);	
					$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(newVal + '_');
				} else {
					$(this).parents('.panel').find('.overlay.timing #value-entered').val(curVal + keypadEntry);	
					$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(curVal + keypadEntry + '_');				
				}
				newVal = thisView.find('.overlay.timing #value-entered').val();
				if (newVal.length == 4) {
					thisView.find('.overlay.timing .keypad li[data-keypad-num]').addClass('disabled');
					thisView.find('.overlay.timing .keypad li[data-keypad-num]:last-child').removeClass('disabled');
				} else {
					thisView.find('.overlay.timing .keypad li[data-keypad-num]').removeClass('disabled');
				}				
			}
		});	

		thisView.find('.overlay.timing .set').on('mousedown',function() {
			var curPhase = parseInt(thisView.find('.overlay.timing .current-info .has-phase > div').attr('data-phase-loc'));
			var curVal = thisView.find('.overlay.timing #value-entered').val();
			if (curVal != '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'preempt-max-call') {
					PreemptUI.setMaxCall(loadedPreemptLoc,curVal);
					PreemptUI.updMaxCall(loadedPreemptLoc);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'preempt-input-num') {
					PreemptUI.setInputNum(loadedPreemptLoc,curVal);
					PreemptUI.updInputNum(loadedPreemptLoc);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'min-green-enter') {
					PreemptUI.setMinGreenEnter(loadedPreemptLoc,curVal);
					PreemptUI.updMinGreenEnter(loadedPreemptLoc);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'delay') {
					PreemptUI.setDelay(loadedPreemptLoc,curVal);
					PreemptUI.updDelay(loadedPreemptLoc);		
				}
				$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');					
			}
	
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {	
			BaseUI.resetOverlay();
		});	
	},


/*******************************************/
// PREEMPT INPUT NUMBER

	setInputNum: function(preempt,value) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptInputNum = parseInt(value);
	},

	getInputNum: function(preempt) {
		var thisTiming = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptInputNum;
		$('#preempt-setup').find('.preempt-input-num ul').append(PreemptUI.htmlInputNum(thisTiming));		
	},

	updInputNum: function(preempt) {
	 	var thisTiming = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptInputNum;
	 	var originalSetting = allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptInputNum;
	 	var diff = false;
	 	if (thisTiming !== originalSetting) {
	 		diff = true;
	 	}
	 	$('#preempt-setup').find('.current-settings.preempt-input-num ul li').replaceWith(PreemptUI.htmlInputNum(thisTiming,diff));
	},	

	htmlInputNum: function(val,isDiff) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},


/*******************************************/
// PREEMPT MAX CALL

	setMaxCall: function(preempt,value) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_maxCallSec = parseInt(value);
	},

	getMaxCall: function(preempt) {
		var thisTiming = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_maxCallSec;
		$('#preempt-setup').find('.preempt-max-call ul').append(PreemptUI.htmlMaxCall(thisTiming));		
	},

	updMaxCall: function(preempt) {
	 	var thisTiming = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_maxCallSec;
	 	var originalSetting = allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_maxCallSec;
	 	var diff = false;
	 	if (thisTiming !== originalSetting) {
	 		diff = true;
	 	}
	 	$('#preempt-setup').find('.current-settings.preempt-max-call ul li').replaceWith(PreemptUI.htmlMaxCall(thisTiming,diff));
	},	

	htmlMaxCall: function(val,isDiff) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},



	selSingleState: function() {
		thisView = $('#preempt-setup');

		thisView.find('.current-settings.single-state .values ul').on('mousedown','li',function() {	
			var thisObj = $(this);
			var thisMarkup = thisObj.html();
			var thisIndex = thisObj.index();
			var thisId = thisView.find('.current-settings.preempt-id ul li').text();
			thisObj.parents('.panel').find('.overlay.single-state-definition #phase-1-entered').val('0');
			thisObj.parents('.panel').find('.overlay.single-state-definition #phase-2-entered').val('0');
			thisObj.parents('.panel').find('.overlay.single-state-definition #item-index').val(thisIndex);

			thisView.find('.new-state .phase span').removeAttr('class').text('0');

			if (thisObj.parents('.current-settings').hasClass('preempt-dwell')) {
				thisView.find('.overlay.single-state-definition .current-state label').text('Current Dwell State:');
				thisView.find('.overlay.single-state-definition .new-state label').text('New Dwell State:');
				thisView.find('.overlay.single-state-definition .current-state .state').html(thisMarkup);	
				thisView.find('.overlay.single-state-definition .current-info .has-phase div').text(thisId);
				thisView.find('.overlay.single-state-definition #item-to-update').val('dwell');		
				thisView.find('.overlay.single-state-definition .phase span').removeAttr('class').text('0');	
			} else if (thisObj.parents('.current-settings').hasClass('preempt-exit')) {
				thisView.find('.overlay.single-state-definition .current-state label').text('Current Exit State:');
				thisView.find('.overlay.single-state-definition .new-state label').text('New Exit State:');
				thisView.find('.overlay.single-state-definition .current-state .state').html(thisMarkup);	
				thisView.find('.overlay.single-state-definition .current-info .has-phase div').text(thisId);
				thisView.find('.overlay.single-state-definition #item-to-update').val('exit');	
			} else if (thisObj.parents('.current-settings').hasClass('preempt-cycle')) {
				thisView.find('.overlay.single-state-definition .current-state label').text('Current Cycle State:');
				thisView.find('.overlay.single-state-definition .new-state label').text('New Cycle State:');
				thisView.find('.overlay.single-state-definition .current-state .state').html(thisMarkup);	
				thisView.find('.overlay.single-state-definition .current-info .has-phase div').text(thisId);
				thisView.find('.overlay.single-state-definition #item-to-update').val('cycle');	
			}	

			thisView.find('.overlay.single-state-definition').show();

		});


		thisView.find('.overlay.single-state-definition .phase-1 .up').on('mousedown',function() {
			var phase1Val = parseInt(thisView.find('.single-state-definition #phase-1-entered').val());
			phase1Val = phase1Val + 1;
			thisView.find('.single-state-definition #phase-1-entered').val(phase1Val);
			thisView.find('.overlay.single-state-definition .phase-1 span').text(phase1Val);
			var vehPhaseCount = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase.length;
			if (phase1Val <= vehPhaseCount) {
				var movementVal = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase1Val - 1];
				var movementClass = 'dir-' + BaseUI.translateMovement(movementVal);
			} else {
				var movementClass = 'dir-na';
			}
			thisView.find('.single-state-definition .phase-1 span').removeAttr('class').addClass(movementClass);
		});	


		thisView.find('.overlay.single-state-definition .phase-2 .up').on('mousedown',function() {
			var phase2Val = parseInt(thisView.find('.single-state-definition #phase-2-entered').val());
			phase2Val = phase2Val + 1;
			thisView.find('.single-state-definition #phase-2-entered').val(phase2Val);
			thisView.find('.overlay.single-state-definition .phase-2 span').text(phase2Val);
			var vehPhaseCount = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase.length;
			if (phase2Val <= vehPhaseCount) {
				var movementVal = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase2Val - 1];
				var movementClass = 'dir-' + BaseUI.translateMovement(movementVal);
			} else {
				var movementClass = 'dir-na';
			}
			thisView.find('.single-state-definition .phase-2 span').removeAttr('class').addClass(movementClass);
		});			


		thisView.find('.overlay.single-state-definition .phase-1 .down').on('mousedown',function() {
			var phase1Val = parseInt(thisView.find('.single-state-definition #phase-1-entered').val());
			if (phase1Val > 0) {
				phase1Val = phase1Val - 1;
				thisView.find('.single-state-definition #phase-1-entered').val(phase1Val);
				thisView.find('.overlay.single-state-definition .phase-1 span').text(phase1Val);

				if (phase1Val > 0) {
					var vehPhaseCount = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase.length;
					if (phase1Val <= vehPhaseCount) {
						var movementVal = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase1Val - 1];
						var movementClass = 'dir-' + BaseUI.translateMovement(movementVal);
					} else {
						var movementClass = 'dir-na';
					}					
				} else {
					var movementClass = 'dir-na';
				}
				thisView.find('.single-state-definition .phase-1 span').removeAttr('class').addClass(movementClass);				
			}
		});			


		thisView.find('.overlay.single-state-definition .phase-2 .down').on('mousedown',function() {
			var phase2Val = parseInt(thisView.find('.single-state-definition #phase-2-entered').val());
			if (phase2Val > 0) {
				phase2Val = phase2Val - 1;
				thisView.find('.single-state-definition #phase-2-entered').val(phase2Val);
				thisView.find('.overlay.single-state-definition .phase-2 span').text(phase2Val);

				if (phase2Val > 0) {
					var vehPhaseCount = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase.length;
					if (phase2Val <= vehPhaseCount) {
						var movementVal = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase2Val - 1];
						var movementClass = 'dir-' + BaseUI.translateMovement(movementVal);
					} else {
						var movementClass = 'dir-na';
					}					
				} else {
					var movementClass = 'dir-na';
				}
				thisView.find('.single-state-definition .phase-2 span').removeAttr('class').addClass(movementClass);				
			}
		});		

		thisView.find('.overlay.single-state-definition .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.single-state-definition .set').on('mousedown',function() {

			var phase1 = thisView.find('.overlay.single-state-definition #phase-1-entered').val();
			var phase2 = thisView.find('.overlay.single-state-definition #phase-2-entered').val();
			var thisIndex = thisView.find('.overlay.single-state-definition #item-index').val();
			if (phase1 == 0) {
				phase1 = phase2;
			}
			if (phase1 == phase2) {
				phase2 = 0;
			}			
			if (thisView.find('.overlay.single-state-definition #item-to-update').val() == 'dwell') {
				PreemptUI.setDwellState(loadedPreemptLoc,phase1,phase2);
				PreemptUI.updDwellState(loadedPreemptLoc,thisIndex);
			} else if (thisView.find('.overlay.single-state-definition #item-to-update').val() == 'exit') {
				PreemptUI.setExitState(loadedPreemptLoc,phase1,phase2);
				PreemptUI.updExitState(loadedPreemptLoc,thisIndex);
			} else if (thisView.find('.overlay.single-state-definition #item-to-update').val() == 'cycle') {
				PreemptUI.setCycleState(loadedPreemptLoc,phase1,phase2,thisIndex);
				PreemptUI.updCycleState(loadedPreemptLoc,thisIndex);
			}
			BaseUI.resetOverlay();
		});	

	},


/*******************************************/
// PREEMPT DWELL

	setDwellState: function(preempt,value1,value2,index) {
		allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_dwellState.m_phases[0] = parseInt(value1);
		allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_dwellState.m_phases[1] = parseInt(value2);
	},

	getDwellState: function(preempt) {
		var firstPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_dwellState.m_phases[0]);
		var secondPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_dwellState.m_phases[1]);
		$('#preempt-setup').find('.preempt-dwell ul').append(PreemptUI.htmlDwellState(firstPhase,secondPhase));		
	},

	updDwellState: function(preempt,val) {
		var firstPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_dwellState.m_phases[0]);
		var secondPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_dwellState.m_phases[1]);
		var isDiff = false;
		var firstPhaseOriginal = parseInt(allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_dwellState.m_phases[0]);
		var secondPhaseOriginal = parseInt(allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_dwellState.m_phases[1]);
		if (firstPhase !== firstPhaseOriginal) {
			isDiff = true;
		}
		if (secondPhase !== secondPhaseOriginal) {
			isDiff = true;
		}	
	 	$('#preempt-setup').find('.preempt-dwell ul li:eq(' + val + ')').replaceWith(PreemptUI.htmlDwellState(firstPhase,secondPhase,isDiff));	
	},	

	htmlDwellState: function(firstPhase,secondPhase,isDiff) {
		var firstMovement, secondMovement, markup;
		var vehPhaseCount = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase.length;
		var thisClass = 'state';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (firstPhase > 0) {
			if (firstPhase <= vehPhaseCount) {
				firstMovement = BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[firstPhase - 1]);
				//var thisDir = 'dir-' + BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase]);
			} else {
				firstMovement = 'na';
			}
			
		} else {
			firstMovement = 'na';
		}
		if (secondPhase > 0) {		
			if (secondPhase <= vehPhaseCount) {
				secondMovement = BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[secondPhase - 1]);
				markup = '<li class=\'' + thisClass + '\'><div class=\'dir-' + firstMovement + '\'></div><div class=\'dir-' + secondMovement + '\'></div><span class=\'phase-num-1\'>' + firstPhase + '</span><span class=\'phase-num-2\'>' + secondPhase + '</span></li>';
			} else {
				secondMovement = 'na';
			}

		} else {
			thisClass = thisClass + ' single-state';
			if (firstPhase == 0) {
				firstPhase = '-';
			}
			markup = '<li class=\'' + thisClass + '\'><div class=\'dir-' + firstMovement + '\'></div><span class=\'phase-num-1\'>' + firstPhase + '</span></li>';
		}
		return markup;
	},




/*******************************************/
// PREEMPT EXIT

	setExitState: function(preempt,value1,value2,index) {
		allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_exitState.m_phases[0] = parseInt(value1);
		allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_exitState.m_phases[1] = parseInt(value2);
	},

	getExitState: function(preempt) {
		var firstPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_exitState.m_phases[0]);
		var secondPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_exitState.m_phases[1]);
		$('#preempt-setup').find('.preempt-exit ul').append(PreemptUI.htmlExitState(firstPhase,secondPhase));			
	},

	updExitState: function(preempt,val) {
		var firstPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_exitState.m_phases[0]);
		var secondPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_exitState.m_phases[1]);
		var isDiff = false;
		var firstPhaseOriginal = parseInt(allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_exitState.m_phases[0]);
		var secondPhaseOriginal = parseInt(allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_exitState.m_phases[1]);
		if (firstPhase !== firstPhaseOriginal) {
			isDiff = true;
		}
		if (secondPhase !== secondPhaseOriginal) {
			isDiff = true;
		}		
	 	$('#preempt-setup').find('.preempt-exit ul li:eq(' + val + ')').replaceWith(PreemptUI.htmlExitState(firstPhase,secondPhase,isDiff));	
	},	

	htmlExitState: function(firstPhase,secondPhase,isDiff) {
		var firstMovement, secondMovement;
		var vehPhaseCount = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase.length;
		var thisClass = 'state';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (firstPhase > 0) {
			firstMovement = BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[firstPhase - 1]);
		} else {
			firstMovement = 'na';
		}
		if (secondPhase > 0) {	
			if (secondPhase <= vehPhaseCount) {
				secondMovement = BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[secondPhase - 1]);
			} else {
				secondMovement = 'na';
			}
			markup = '<li class=\'' + thisClass + '\'><div class=\'dir-' + firstMovement + '\'></div><div class=\'dir-' + secondMovement + '\'></div><span class=\'phase-num-1\'>' + firstPhase + '</span><span class=\'phase-num-2\'>' + secondPhase + '</span></li>';
		} else {
			thisClass = thisClass + ' single-state';
			if (firstPhase == 0) {
				firstPhase = '-';
			}			
			markup = '<li class=\'' + thisClass + '\'><div class=\'dir-' + firstMovement + '\'></div><span class=\'phase-num-1\'>' + firstPhase + '</span></li>';
		}
		return markup;
	},


/*******************************************/
// PREEMPT CYCLE

	setCycleState: function(preempt,value1,value2,index) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState[index].m_phases[0] = parseInt(value1);
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState[index].m_phases[1] = parseInt(value2);
	},

	getCycleState: function(preempt) {
		var cycleStateLen = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState.length;
		for (var i = 0; i <  cycleStateLen; i++) {
			var firstPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState[i].m_phases[0]);
			var secondPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState[i].m_phases[1]);
			$('#preempt-setup').find('.preempt-cycle ul').append(PreemptUI.htmlCycleState(firstPhase,secondPhase));	
		}	
	},

	updCycleState: function(preempt,val) {
		var firstPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState[val].m_phases[0]);
		var secondPhase = parseInt(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState[val].m_phases[1]);
		var isDiff = false;
		var firstPhaseOriginal = parseInt(allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState[val].m_phases[0]);
		var secondPhaseOriginal = parseInt(allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_cycleState[val].m_phases[1]);
		if (firstPhase !== firstPhaseOriginal) {
			isDiff = true;
		}
		if (secondPhase !== secondPhaseOriginal) {
			isDiff = true;
		}		
	 	$('#preempt-setup').find('.preempt-cycle ul li:eq(' + val + ')').replaceWith(PreemptUI.htmlExitState(firstPhase,secondPhase,isDiff));	
	},	

	htmlCycleState: function(firstPhase,secondPhase,isDiff) {
		var firstMovement, secondMovement, markup;
		var vehPhaseCount = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase.length;
		var thisClass = 'state';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (firstPhase > 0) {
			if (firstPhase <= vehPhaseCount) {
				firstMovement = BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[firstPhase - 1]);
			} else {
				firstMovement = 'na';
			}
			
		} else {
			firstMovement = 'na';
		}
		if (secondPhase > 0) {		
			if (secondPhase <= vehPhaseCount) {
				secondMovement = BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[secondPhase - 1]);
				markup = '<li class=\'' + thisClass + '\'><div class=\'dir-' + firstMovement + '\'></div><div class=\'dir-' + secondMovement + '\'></div><span class=\'phase-num-1\'>' + firstPhase + '</span><span class=\'phase-num-2\'>' + secondPhase + '</span></li>';
			} else {
				secondMovement = 'na';
			}

		} else {
			thisClass = thisClass + ' single-state';
			if (firstPhase == 0) {
				firstPhase = '-';
			}		
			markup = '<li class=\'' + thisClass + '\'><div class=\'dir-' + firstMovement + '\'></div><span class=\'phase-num-1\'>' + firstPhase + '</span></li>';
		}
		return markup;
	},


/*******************************************/
// PREEMPT ONE CALL VEHICLE

	setVehOneCall: function(preempt,value) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_oneCallVehiclePhasesOnExit = value;
	},

	getVehOneCall: function(preempt) {
		var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_oneCallVehiclePhasesOnExit;
		$('#preempt-setup').find('.one-call-vehicle ul').append(PreemptUI.htmlVehOneCall(isEnabled));		
	},

	updVehOneCall: function(preempt,val) {
	 	var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_oneCallVehiclePhasesOnExit;
	 	var originalSetting = allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_oneCallVehOnExit;
	 	var isDiff = false;
	 	if (isEnabled !== originalSetting) {
	 		isDiff = true;
	 	}
	 	$('#preempt-setup').find('.current-settings.one-call-vehicle ul li').replaceWith(PreemptUI.htmlVehOneCall(isEnabled,isDiff));
	},	

	htmlVehOneCall: function(isEnabled,isDiff) {
		var thisClass = 'switch';
		if (isEnabled) {
			thisClass = thisClass + ' on';
		} 
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}	
		var markup = '<li class=\'' + thisClass + '\'\></li>';
		return markup;
	},

	toggleVehOneCall: function() {
		$('#preempt-setup').find('.current-settings.one-call-vehicle .values ul').on('mousedown','li',function() {
			var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[loadedPreemptLoc].m_oneCallVehiclePhasesOnExit;
			if (isEnabled) {
				PreemptUI.setVehOneCall(loadedPreemptLoc,false);
			} else {
				PreemptUI.setVehOneCall(loadedPreemptLoc,true);
			}
			PreemptUI.updVehOneCall(loadedPreemptLoc,isEnabled);
		});
	},	

/*******************************************/
// PREEMPT ONE CALL PED

	setPedOneCall: function(preempt,value) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_oneCallPedPhasesOnExit = value;
	},

	getPedOneCall: function(preempt) {
		var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_oneCallPedPhasesOnExit;
		$('#preempt-setup').find('.one-call-ped ul').append(PreemptUI.htmlPedOneCall(isEnabled));		
	},

	updPedOneCall: function(preempt,val) {
	 	var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_oneCallPedPhasesOnExit;
	 	var originalSetting = allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_oneCallPedPhasesOnExit;
	 	var isDiff = false;
	 	if (isEnabled !== originalSetting) {
	 		isDiff = true;
	 	}
	 	$('#preempt-setup').find('.current-settings.one-call-ped ul li').replaceWith(PreemptUI.htmlPedOneCall(isEnabled,isDiff));
	},	

	htmlPedOneCall: function(isEnabled,isDiff) {
		var thisClass = 'switch';
		if (isEnabled) {
			thisClass = thisClass + ' on';
		} 
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}	
		var markup = '<li class=\'' + thisClass + '\'\></li>';
		return markup;
	},

	togglePedOneCall: function() {
		$('#preempt-setup').find('.current-settings.one-call-ped .values ul').on('mousedown','li',function() {
			var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[loadedPreemptLoc].m_oneCallPedPhasesOnExit;
			if (isEnabled) {
				PreemptUI.setPedOneCall(loadedPreemptLoc,false);
			} else {
				PreemptUI.setPedOneCall(loadedPreemptLoc,true);
			}
			PreemptUI.updPedOneCall(loadedPreemptLoc,isEnabled);
		});
	},	


/*******************************************/
// PREEMPT MIN GREEN TO ENTER PREEMPT

	setMinGreenEnter: function(preempt,value) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_minGreenToEnterPreempt = parseInt(value);
	},

	getMinGreenEnter: function(preempt) {
		var thisTiming = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_minGreenToEnterPreempt;
		$('#preempt-setup').find('.min-green-enter ul').append(PreemptUI.htmlMinGreenEnter(thisTiming));		
	},

	updMinGreenEnter: function(preempt) {
	 	var thisTiming = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_minGreenToEnterPreempt;
	 	var originalSetting = allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_minGreenToEnterPreempt;
	 	var diff = false;
	 	if (thisTiming !== originalSetting) {
	 		diff = true;
	 	}
	 	$('#preempt-setup').find('.current-settings.min-green-enter ul li').replaceWith(PreemptUI.htmlMinGreenEnter(thisTiming,diff));
	},	

	htmlMinGreenEnter: function(val,isDiff) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},

/*******************************************/
// PREEMPT DELAY

	setDelay: function(preempt,value) {
	 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_delay = parseInt(value);
	},

	getDelay: function(preempt) {
		var thisTiming = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_delay;
		$('#preempt-setup').find('.delay ul').append(PreemptUI.htmlDelay(thisTiming));		
	},

	updDelay: function(preempt) {
	 	var thisTiming = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_delay;
	 	var originalSetting = allPristineData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_delay;
	 	var diff = false;
	 	if (thisTiming !== originalSetting) {
	 		diff = true;
	 	}
	 	$('#preempt-setup').find('.current-settings.delay ul li').replaceWith(PreemptUI.htmlDelay(thisTiming,diff));
	},	

	htmlDelay: function(val,isDiff) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},


/*******************************************/

	getPreemptId: function(preempt) {
		var markup = '<li class=\'has-phase\'><div><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptId + '</span></div></li>';
  	//	$('#preempt-setup').find('.preempt-id .values ul').append(markup);
  		$('#preempt-dwell').find('.preempt-id .values ul').append(markup);
		
	},




	getDetectorPedDetNumber: function(preempt, det) {
		var markup = '<li class=\'not-available\'><div><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedDetector[det].m_detectorNum +'</span></div></li>';
 		$('#preempt-ped-detectors').find('.detector ul').append(markup);
	},	

	getDetectorPedPhasAssignment: function(preempt, det) {
		var markup = '<li class=\'not-available\'><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedDetector[det].m_phaseAssignment +'</span></li>';
		$('#preempt-ped-detectors').find('.phase-assignment ul').append(markup);
	},

	getDetectorVehicleCallFailure: function(preempt, det) {
		var markup = '';
		if (allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehicleDetector[det].m_triggerOnFailure == true) {
			markup = '<li class=\'switch on not-available\'><span></span></li>';
		} else {
			markup = '<li class=\'switch not-available\'><span></span></li>';
		}
		$('#preempt-vehicle-detectors').find('.enable-call ul').append(markup);


	},

	getDetectorVehicleDetNumber: function(preempt, det) {
		var markup = '<li><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehicleDetector[det].m_detectorNum + '</span></li>';
 		$('#preempt-vehicle-detectors').find('.detector ul').append(markup);
	},

	getDetectorVehicleDelay: function(preempt, det) {
		var markup = '<li class=\'not-available\'><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehicleDetector[det].m_delaySec + '</span></li>';
 		$('#preempt-vehicle-detectors').find('.delay ul').append(markup);

	},	

	getDetectorVehicleExtend: function(preempt, det) {
		var markup = '<li class=\'not-available\'><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehicleDetector[det].m_extendSec + '</span></li>';
 		$('#preempt-vehicle-detectors').find('.extend ul').append(markup);

	},	

	getDetectorVehicleLockDetection: function(preempt, det) {
		var markup = '';
		if (allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehicleDetector[det].m_lock == true) {
			markup = '<li class=\'switch on not-available\'><span></span></li>';
		} else {
			markup = '<li class=\'switch not-available\'><span></span></li>';
		}
		$('#preempt-vehicle-detectors').find('.lock-detection ul').append(markup);

	},

	getDetectorVehiclePhaseAssignment: function(preempt, det) {
		var markup = '<li class=\'not-available\'><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehicleDetector[det].m_phaseAssignment +'</span></li>';		
		$('#preempt-vehicle-detectors').find('.phase-assignment ul').append(markup);
	},		

	getDetectorVehicleStuckOff: function(preempt, det) {
		var markup = '<li class=\'not-available\'><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehicleDetector[det].m_stuckOffFailureThresholdMinutes +'</span></li>';		
 		$('#preempt-vehicle-detectors').find('.stuck-off ul').append(markup);
	},	

	getDetectorVehicleStuckOn: function(preempt, det) {
		var markup = '<li class=\'not-available\'><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehicleDetector[det].m_stuckOnFailureThresholdMinutes +'</span></li>';
 		$('#preempt-vehicle-detectors').find('.stuck-on ul').append(markup);
	},				


	getPedChannel: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><div><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_outputChannel+'</span></div></li>';
		$('#preempt-phase-startup').find('.ped-channel ul').append(markup);
	},	

	getPedClearanceTiming: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_clearanceTiming +'</span></li>';
		$('#preempt-ped-phase-def').find('.current-settings.clear-timing ul').append(markup);
	},		



	getPedEnabled: function(preempt,phase) {
		var markup = '';
		var isEnabled = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_enabled;
		if (isEnabled) {
			markup = '<li class=\'switch on not-available\'></li>';
		} else {
			markup = '<li class=\'switch not-available\'></li>';
		}
		$('#preempt-phase-startup').find('.ped-enabled ul').append(markup);
	},

	getPedNonActuated: function(preempt,phase) {
		var markup = '';
		var isNonActuated = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_nonActuated;
		if (isNonActuated) {
			markup = '<li class=\'switch on not-available\'></li>';
		} else {
			markup = '<li class=\'switch not-available\'></li>';
		}
		$('#preempt-ped-phase-def').find('.non-actuated ul').append(markup);
	},

	getPedRestInWalk: function(preempt,phase) {
		var markup = '';
		var isRestInWalk = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_restInWalk;
		if (isRestInWalk) {
			markup = '<li class=\'switch on not-available\'></li>';
		} else {
			markup = '<li class=\'switch not-available\'></li>';
		}
		$('#preempt-ped-phase-def').find('.rest-in-walk ul').append(markup);
	},	

	getPedClearanceYellow: function(preempt,phase) {
		var markup = '';
		var isClearWithYellow = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_pedClearanceTimesWithVehicleYellow;
		if (isClearWithYellow) {
			markup = '<li class=\'switch on not-available\'></li>';
		} else {
			markup = '<li class=\'switch not-available\'></li>';
		}
		$('#preempt-ped-phase-def').find('.clear-yellow ul').append(markup);
	},			

	getPedPhase: function(preempt,phase) {
		var markup = '<li class=\'has-popup has-phase not-available\'><div><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_phaseNum+'</span></div></li>';
	 	$('#preempt-phase-startup').find('.ped.phase ul').append(markup);
	 	$('#preempt-ped-phase-def').find('.ped.phase ul').append(markup);
	},



	getPedWalkTiming: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_walkTiming +'</span></li>';
		$('#preempt-ped-phase-def').find('.walk-timing ul').append(markup);
	},		

	getVehicleChannel: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><div><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_outputChannel+'</span></div></li>';
		$('.preempt-phase-startup .vehicle-channel ul').append(markup);
	},

	getVehicleEnabled: function(preempt,phase) {
		var markup = '';
		if (allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_enabled == true) {
			markup = '<li class=\'switch on not-available\'></li>';
		} else {
			markup = '<li class=\'switch not-available\'></li>';
		}
		$('#preempt-phase-startup').find('.vehicle-enabled ul').append(markup);

	},

	getVehicleFlashingOutput: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>' +allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_flashingOutputChannelSection+'</span></li>';
		$('#preempt-left').find('.flashing-output ul').append(markup);		
	},

	getVehicleLeftPermissive: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_permissiveStartPhase+'</span></li>';
		$('#preempt-left').find('.permissive-start ul').append(markup);
	},

	getVehicleLeftTurnMode: function(preempt,phase) {
		var thisLeft = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_leftTurnMode;
		var modeClass = BaseUI.translateLeftTurn(thisLeft);
		var markup = '<li class=' + modeClass + ' data-left-turn='+ thisLeft +'><span></span></li>';
		$('#preempt-left').find('.left-turn-mode ul').append(markup);
	},



	getVehicleRecall: function(preempt,phase) {
		var thisRecall = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_recall;
		var thisClass = 'not-available';
		thisClass = thisClass + ' ' + BaseUI.translateRecall(thisRecall);
		var markup = '<li data-recall-value='  + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_recall + ' class=' + thisClass + '><span></span></li>';
		$('#preempt-vehicle-phase-timing').find('.recall ul').append(markup);
	},

	getVehicleMinGreen: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_minGreenTimingSec+'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.min-green-timing ul').append(markup);
	},	

	getVehicleMaxGreen: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_maxGreenTimingSec+'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.max-green-timing ul').append(markup);
	},	

	getVehicleYellow: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_yellowTimingSec+'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.yellow-timing ul').append(markup);
	},

	getVehicleRed: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_redTimingSec+'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.red-timing ul').append(markup);
	},	

	getVehiclePassage: function(preempt,phase) {
		var markup = '<li class=\'has-popup not-available\'><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_passageTimeSec +'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.passage-time ul').append(markup); 
	},

	getVehiclePhase: function(preempt,phase) {
		var markup = '<li class=\'has-phase not-available\'><div><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_phaseNum+'</span></div></li>';
		$('#preempt-phase-startup').find('.vehicle.phase .values ul').append(markup);
		$('#preempt-left').find('.vehicle.phase ul').append(markup);
		$('#preempt-vehicle-phase-timing').find('.vehicle.phase ul').append(markup);
	},







	// rotateCycleState: function() {
	// 	$('.preempt-dwell .current-settings.cycle-state .values ul li').on('mousedown',function() {
	// 		var thisObj = $(this);
	// 		var thisSet = thisObj.attr('data-set');
	// 		var thisPreempt = thisObj.index();

	// 		if (thisSet == 0) {
	// 		 	PreemptUI.getCycleState(thisPreempt,1);
	// 		} else if (thisSet == 1) {
	// 			PreemptUI.getCycleState(thisPreempt,0);
	// 		}
	// 	});
		
	// },

	// selectChannel: function() {
	// 	$('.preempt-setup .preempt-channel .values li').on('mousedown',function() {
	// 		var thisObj = $(this);
	// 		var thisChannel = thisObj.find('span.value').text();
	// 		var thisLight = thisObj.find('span.light').text();
	// 		var thisPreempt = $('.preempt-setup .preempt-id li:nth-child(' + parseInt(thisObj.index() + 1) +'').text();
	// 		$('.preempt-setup .overlay.channel .this-preempt').text(thisPreempt);
	// 		$('.preempt-setup .overlay.channel .current-info .value span').text(thisChannel + '.' + thisLight);
	// 		$('.preempt-setup .overlay.channel').show();
	// 	});
	// 	$('.preempt-setup .overlay.channel .light-selection li div').on('mousedown',function() {

	// 		$('.preempt-setup .overlay.channel .light-selection li div').removeClass('selected');
	// 		var thisObj = $(this);
	// 		thisObj.addClass('selected');
	// 	});		
	// },



	/*************************************/

	// toggleEnabledPreempt: function() {
	// 	$('.preempt-setup .preempt-enabled .values ul .switch').on('mousedown',function() {
	// 		var thisObj = $(this);
	// 		var thisIndex = thisObj.index();
	// 		if (thisObj.hasClass('on')) {
	// 			PreemptUI.setEnabledPreempt(thisIndex,false);
	// 		} else {
	// 			PreemptUI.setEnabledPreempt(thisIndex,true);
	// 		}
	// 		PreemptUI.updEnabledPreempt(thisIndex);	
	// 	});
	// },

	// setEnabledPreempt: function(preempt,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_enabled = value;
	// },	

	// updEnabledPreempt: function(preempt) {
	// 	$('.preempt-setup .preempt-enabled .values ul li:eq(' + preempt + ')').removeClass('on');
	// 	if (allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_enabled == true) {
	// 		$('.preempt-setup .preempt-enabled .values ul li:eq(' + preempt + ')').addClass('on');
	// 	} 
	// }, 

	/*************************************/






	// },

	updatePreemptNameDisplayed: function(name) {
		$('.preempt-name-frame span').text(name);
	},	

	// updatePhaseTiming: function() {
	// 	$('.preempt-phase-timing .current-settings.keypad .values .has-popup').on('click',function() {
	// 		$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
	// 		$('.preempt-phase-timing .overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
	// 		var thisObj = $(this);
	// 		var thisTiming = thisObj.parents('.current-settings').attr('class');
	// 		var thisVal = thisObj.find('span').text();
	// 		var thisPhase = thisObj.index();
	// 		$('.preempt-phase-timing .overlay.timing .has-phase div').empty();
	// 		$('.preempt-phase-timing .current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo($('.preempt-phase-timing .overlay.timing .has-phase div'));
	// 		$('.preempt-phase-timing .overlay.timing .current-timing-entry .value span').text(thisVal);
	// 		if (thisObj.parents('.current-settings').hasClass('max-green-timing')){
	// 			$('.preempt-phase-timing .overlay.timing .current-timing-entry label').text('Current Max Green Timing:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing label').text('New Max Green Timing:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-phase-timing .overlay.timing #item-to-update').val('max-green-timing');
	// 		} else if (thisObj.parents('.current-settings').hasClass('min-green-timing')){
	// 			$('.preempt-phase-timing .overlay.timing .current-timing-entry label').text('Current Min Green Timing:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing label').text('New Min Green Timing:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-phase-timing .overlay.timing #item-to-update').val('min-green-timing');
	// 		} else if (thisObj.parents('.current-settings').hasClass('yellow-timing')){
	// 			$('.preempt-phase-timing .overlay.timing .current-timing-entry label').text('Current Yellow Timing:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing label').text('New Yellow Timing:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-phase-timing .overlay.timing #item-to-update').val('yellow-timing');
	// 		} else if (thisObj.parents('.current-settings').hasClass('red-timing')){
	// 			$('.preempt-phase-timing .overlay.timing .current-timing-entry label').text('Current Red Timing:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing label').text('New Red Timing:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-phase-timing .overlay.timing #item-to-update').val('red-timing');						
	// 		} else if (thisObj.parents('.current-settings').hasClass('passage-time')){
	// 			$('.preempt-phase-timing .overlay.timing li[data-keypad-num=\'.\']').css('visibility','visible');											
	// 			$('.preempt-phase-timing .overlay.timing .current-timing-entry label').text('Current Passage Time:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing label').text('New Passage Time:');
	// 			$('.preempt-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-phase-timing .overlay.timing #item-to-update').val('passage-time');
	// 		}	
	// 		//alert(thisTiming +' and ' + thisVal + ' and phase is ' + thisPhase);
	// 		$('.preempt-phase-timing .overlay.timing').show();
	// 	});

	// 	$('.preempt-phase-timing .overlay.timing li[data-keypad-num]').on('mousedown',function() {
	// 		if (!$(this).hasClass('disabled')) {
	// 			var thisObj = $(this);
	// 			BaseUI.addInverse(thisObj);	
	// 			var keypadEntry = thisObj.attr('data-keypad-num');
	// 			var curVal = $('.overlay.timing #value-entered').val();

	// 			if (thisObj.find('a').hasClass('backspace')) {
	// 				// backspace functions
	// 				newVal = curVal.substring(0,curVal.length - 1);
	// 				$(this).parents('.panel').find('.overlay.timing #value-entered').val(newVal);	
	// 				$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(newVal + '_');
	// 			} else {
	// 				$(this).parents('.panel').find('.overlay.timing #value-entered').val(curVal + keypadEntry);	
	// 				$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(curVal + keypadEntry + '_');				
	// 			}
	// 			newVal = $('.overlay.timing #value-entered').val();
	// 			if (newVal.length == 4) {
	// 				$('.preempt-phase-timing .overlay.timing .keypad li[data-keypad-num]').addClass('disabled');
	// 				$('.preempt-phase-timing .overlay.timing .keypad li[data-keypad-num]:last-child').removeClass('disabled');
	// 			} else {
	// 				$('.preempt-phase-timing .overlay.timing .keypad li[data-keypad-num]').removeClass('disabled');
	// 			}				
	// 		}
	// 	});	

	// 	$('.preempt-phase-timing .overlay.timing .save').on('mousedown',function() {
	// 		var curPhase = parseInt($('.overlay.timing .current-info .has-phase span').text());
	// 		if($('.preempt-phase-timing .overlay.timing #item-to-update').val() == 'min-green-timing') {
	// 			data.configuration[curConfig].m_vehiclePhase[curPhase - 1].m_minGreenTimingSec = $('.overlay.timing #value-entered').val();
	// 			BaseUI.loadMinGreenTiming(curConfig);		
	// 		} else if($('.preempt-phase-timing .overlay.timing #item-to-update').val() == 'max-green-timing') {
	// 			data.configuration[curConfig].m_vehiclePhase[curPhase - 1].m_maxGreenTimingSec = $('.overlay.timing #value-entered').val();
	// 			BaseUI.loadMaxGreenTiming(curConfig);	
	// 		} else if($('.preempt-phase-timing .overlay.timing #item-to-update').val() == 'yellow-timing') {
	// 			data.configuration[curConfig].m_vehiclePhase[curPhase - 1].m_yellowTimingSec = $('.overlay.timing #value-entered').val();
	// 			BaseUI.loadYellowTiming(curConfig);
	// 		} else if($('.preempt-phase-timing .overlay.timing #item-to-update').val() == 'red-timing') {
	// 			data.configuration[curConfig].m_vehiclePhase[curPhase - 1].m_redTimingSec = $('.overlay.timing #value-entered').val();
	// 			BaseUI.loadRedTiming(curConfig);	
	// 		} else if($('.preempt-phase-timing .overlay.timing #item-to-update').val() == 'passage-time') {
	// 			data.configuration[curConfig].m_vehiclePhase[curPhase - 1].m_passageTimeSec = $('.overlay.timing #value-entered').val();
	// 			BaseUI.loadPassageTime(curConfig);	
	// 		}								
	
	// 		$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
	// 		BaseUI.resetOverlay();
	// 	});	



	// },	


/****************************************************/

	// cyclePhaseTimingRecall: function() {
	// 	$('.preempt-vehicle-phase-timing .current-settings.recall .values ul').on('mousedown','li',function() {
	// 		var thisObj = $(this);
	// 		var thisIndex = thisObj.index();
	// 		var thisRecall = parseInt(thisObj.attr('data-recall-value'));
	// 		if (thisRecall == 3) {
	// 			thisRecall = 0;
	// 		} else {
	// 			thisRecall = parseInt(thisRecall + 1);
	// 		}
			
	// 		PreemptUI.setPhaseTimingRecall(loadedPreemptId,thisIndex,thisRecall);
	// 		PreemptUI.updPhaseTimingRecall(loadedPreemptId,thisIndex);
	// 	});
	// },

	// setPhaseTimingRecall: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase.m_recall = value;
	// },

	updPhaseTimingRecall: function(preempt,phase) {

		// var thisObj = $('.preempt-vehicle-phase-timing .current-settings.recall .values ul li:eq(' + phase + ')');
		// var thisClass = BaseUI.translateRecall(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase.m_recall);
		// thisObj.removeClass('min max soft none').addClass(thisClass).removeAttr('data-recall-value').attr('data-recall-value',allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase.m_recall);

		var markup = '';
		var recallVal = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase.m_recall;	
		markup = '<li data-recall-value=' + recallVal + ' class='+ BaseUI.translateRecall(recallVal) +'><div><span></span></div></li>';
		$('#preempt-vehicle-phase-timing').find('.recall ul').append(markup);

	},	

/****************************************************/
	

	// changeVehiclePhaseTiming: function() {
	// 	$('.preempt-vehicle-phase-timing .current-settings.keypad .values ul').on('mousedown','li',function() {
	// 		$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
	// 		$('.preempt-vehicle-phase-timing .overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
	// 		var thisObj = $(this);
	// 		var thisTiming = thisObj.parents('.current-settings').attr('class');
	// 		var thisVal = thisObj.find('span').text();
	// 		var thisPhase = thisObj.index();
	// 		$('.preempt-vehicle-phase-timing .overlay.timing .has-phase div').empty();
	// 		$('.preempt-vehicle-phase-timing .current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo($('.preempt-vehicle-phase-timing .overlay.timing .has-phase div'));
	// 		$('.preempt-vehicle-phase-timing .overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
	// 		$('.preempt-vehicle-phase-timing .overlay.timing .current-timing-entry .value span').text(thisVal);
	// 		if (thisObj.parents('.current-settings').hasClass('max-green-timing')){
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .current-timing-entry label').text('Current Max Green Timing:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing label').text('New Max Green Timing:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val('max-green-timing');
	// 		} else if (thisObj.parents('.current-settings').hasClass('min-green-timing')){
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .current-timing-entry label').text('Current Min Green Timing:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing label').text('New Min Green Timing:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val('min-green-timing');
	// 		} else if (thisObj.parents('.current-settings').hasClass('yellow-timing')){
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .current-timing-entry label').text('Current Yellow Timing:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing label').text('New Yellow Timing:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val('yellow-timing');
	// 		} else if (thisObj.parents('.current-settings').hasClass('red-timing')){
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .current-timing-entry label').text('Current Red Timing:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing label').text('New Red Timing:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val('red-timing');						
	// 		} else if (thisObj.parents('.current-settings').hasClass('passage-time')){
	// 			$('.preempt-vehicle-phase-timing .overlay.timing li[data-keypad-num=\'.\']').css('visibility','visible');											
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .current-timing-entry label').text('Current Passage Time:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing label').text('New Passage Time:');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val('passage-time');
	// 		}	
	// 		//alert(thisTiming +' and ' + thisVal + ' and phase is ' + thisPhase);
	// 		$('.preempt-vehicle-phase-timing .overlay.timing').show();
	// 	});

	// 	$('.preempt-vehicle-phase-timing .overlay.timing li[data-keypad-num]').on('mousedown',function() {
	// 		if (!$(this).hasClass('disabled')) {
	// 			var thisObj = $(this);
	// 			BaseUI.addInverse(thisObj);	
	// 			var keypadEntry = thisObj.attr('data-keypad-num');
	// 			var curVal = $('.preempt-vehicle-phase-timing .overlay.timing #value-entered').val();

	// 			if (thisObj.find('a').hasClass('backspace')) {
	// 				// backspace functions
	// 				newVal = curVal.substring(0,curVal.length - 1);
	// 				$(this).parents('.panel').find('.overlay.timing #value-entered').val(newVal);	
	// 				$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(newVal + '_');
	// 			} else {
	// 				$(this).parents('.panel').find('.overlay.timing #value-entered').val(curVal + keypadEntry);	
	// 				$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(curVal + keypadEntry + '_');				
	// 			}
	// 			newVal = $('.overlay.timing #value-entered').val();
	// 			if (newVal.length == 4) {
	// 				$('.preempt-vehicle-phase-timing .overlay.timing .keypad li[data-keypad-num]').addClass('disabled');
	// 				$('.preempt-vehicle-phase-timing .overlay.timing .keypad li[data-keypad-num]:last-child').removeClass('disabled');
	// 			} else {
	// 				$('.preempt-vehicle-phase-timing .overlay.timing .keypad li[data-keypad-num]').removeClass('disabled');
	// 			}				
	// 		}
	// 	});	

	// 	$('.preempt-vehicle-phase-timing .overlay.timing .save').on('mousedown',function() {
	// 		var curPhase = parseInt($('.preempt-vehicle-phase-timing .overlay.timing .current-info .has-phase > div').attr('data-phase-loc'));
	// 		var curVal = $('.preempt-vehicle-phase-timing .overlay.timing #value-entered').val();
	// 		if($('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val() == 'min-green-timing') {
	// 			PreemptUI.setMinGreenTiming(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.updMinGreenTiming(loadedPreemptId,curPhase);		
	// 		} else if($('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val() == 'max-green-timing') {
	// 			PreemptUI.setMaxGreenTiming(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.updMaxGreenTiming(loadedPreemptId,curPhase);
	// 		} else if($('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val() == 'yellow-timing') {
	// 			PreemptUI.setYellowTiming(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.updYellowTiming(loadedPreemptId,curPhase);
	// 		} else if($('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val() == 'red-timing') {
	// 			PreemptUI.setRedTiming(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.updRedTiming(loadedPreemptId,curPhase);
	// 		} else if($('.preempt-vehicle-phase-timing .overlay.timing #item-to-update').val() == 'passage-time') {
	// 			PreemptUI.setPassageTime(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.updPassageTime(loadedPreemptId,curPhase);
	// 		}								
	
	// 		$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
	// 		BaseUI.resetOverlay();
	// 	});	
	// },

/****************************************************/

	// setMinGreenTiming: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_minGreenTimingSec = value;
	// },

	updMinGreenTiming: function(preempt,phase) {
		var markup = '<li><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_minGreenTimingSec +'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.min-green-timing ul').append(markup);
	},

/****************************************************/

	// setMaxGreenTiming: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_maxGreenTimingSec = value;
	// },

	updMaxGreenTiming: function(preempt,phase) {
		var markup = '<li><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_maxGreenTimingSec +'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.max-green-timing ul').append(markup);
	},

/****************************************************/

	// setYellowTiming: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_yellowTimingSec = value;
	// },

	updYellowTiming: function(preempt,phase) {
		var markup = '<li><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_yellowTimingSec + '</span></li>';
		$('#preempt-vehicle-phase-timing').find('.yellow-timing ul').append(markup);
	},

/****************************************************/

	// setRedTiming: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_redTimingSec = value;
	// },

	updRedTiming: function(preempt,phase) {
		var markup = '<li><span>'+ allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_redTimingSec +'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.red-timing ul').append(markup);
	},	

/****************************************************/

	// setPassageTime: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_passageTimeSec = value;
	// },

	updPassageTime: function(preempt,phase) {
		var markup = '<li><span>'+allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_vehPhase[phase].m_passageTimeSec+'</span></li>';
		$('#preempt-vehicle-phase-timing').find('.passage-time ul').append(markup);
	},

/****************************************************/

	// togglePedNonActuated: function() {
	// 	$('.preempt-ped-phase-def .current-settings.non-actuated .values ul').on('mousedown','li',function() {
	// 		var thisObj = $(this);
	// 		var thisIndex = thisObj.index();
	// 		if (thisObj.hasClass('on')) {
	// 			PreemptUI.setPedNonActuated(loadedPreemptId,thisIndex,false);
	// 		} else {
	// 			PreemptUI.setPedNonActuated(loadedPreemptId,thisIndex,true);
	// 		}
	// 		PreemptUI.updPedNonActuated(loadedPreemptId,thisIndex);			
	// 	});
	// },

	// setPedNonActuated: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_nonActuated = value;
	// },


	updPedNonActuated: function(preempt,phase) {
		var markup = '<li><span></span></li>';
		if (allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_nonActuated == true) {
			$('.preempt-ped-phase-def .current-settings.non-actuated .values ul li:eq(' + phase + ')').addClass('on');
		} else {
			$('.preempt-ped-phase-def .current-settings.non-actuated .values ul li:eq(' + phase + ')').removeClass('on');
		}
	},


/****************************************************/

	// togglePedRestInWalk: function() {
	// 	$('.preempt-ped-phase-def .current-settings.rest-in-walk .values ul').on('mousedown','li',function() {
	// 		var thisObj = $(this);
	// 		var thisIndex = thisObj.index();
	// 		if (thisObj.hasClass('on')) {
	// 			PreemptUI.setPedRestInWalk(loadedPreemptId,thisIndex,false);
	// 		} else {
	// 			PreemptUI.setPedRestInWalk(loadedPreemptId,thisIndex,true);
	// 		}
	// 		PreemptUI.updPedRestInWalk(loadedPreemptId,thisIndex);			
	// 	});
	// },

	// setPedRestInWalk: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_restInWalk = value;
	// },


	updPedRestInWalk: function(preempt,phase) {
		var markup = '<li><span></span></li>';
		if (allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_restInWalk == true) {
			$('.preempt-ped-phase-def .current-settings.rest-in-walk .values ul li:eq(' + phase + ')').addClass('on');
		} else {
			$('.preempt-ped-phase-def .current-settings.rest-in-walk .values ul li:eq(' + phase + ')').removeClass('on');
		}
	},


/****************************************************/

	// togglePedClearYellow: function() {
	// 	$('.preempt-ped-phase-def .current-settings.clear-yellow .values ul').on('mousedown','li',function() {
	// 		var thisObj = $(this);
	// 		var thisIndex = thisObj.index();
	// 		if (thisObj.hasClass('on')) {
	// 			PreemptUI.setPedClearYellow(loadedPreemptId,thisIndex,false);
	// 		} else {
	// 			PreemptUI.setPedClearYellow(loadedPreemptId,thisIndex,true);
	// 		}
	// 		PreemptUI.updPedClearYellow(loadedPreemptId,thisIndex);			
	// 	});
	// },

	// setPedClearYellow: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_pedClearanceTimesWithVehicleYellow = value;
	// },


	updPedClearYellow: function(preempt,phase) {
		var markup = '<li><span></span></li>';
		if (allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_pedClearanceTimesWithVehicleYellow == true) {
			$('.preempt-ped-phase-def .current-settings.clear-yellow .values ul li:eq(' + phase + ')').addClass('on');
		} else {
			$('.preempt-ped-phase-def .current-settings.clear-yellow .values ul li:eq(' + phase + ')').removeClass('on');
		}
	},


/****************************************************/

	// changePedDefTiming: function() {
	// 	$('.preempt-ped-phase-def .current-settings.keypad .values ul').on('mousedown','li',function() {
	// 		$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
	// 		$('.preempt-ped-phase-def .overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
	// 		var thisObj = $(this);
	// 		var thisTiming = thisObj.parents('.current-settings').attr('class');
	// 		var thisVal = thisObj.find('span').text();
	// 		var thisPhase = thisObj.index();
	// 		$('.preempt-ped-phase-def .overlay.timing .has-phase div').empty();
	// 		$('.preempt-ped-phase-def .current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo($('.preempt-ped-phase-def .overlay.timing .has-phase div'));
	// 		$('.preempt-ped-phase-def .overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
	// 		$('.preempt-ped-phase-def .overlay.timing .current-timing-entry .value span').text(thisVal);
	// 		if (thisObj.parents('.current-settings').hasClass('walk-timing')){
	// 			$('.preempt-ped-phase-def .overlay.timing .current-timing-entry label').text('Current Ped Walk Timing:');
	// 			$('.preempt-ped-phase-def .overlay.timing .new-timing label').text('New Ped Walk Timing:');
	// 			$('.preempt-ped-phase-def .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-ped-phase-def .overlay.timing #item-to-update').val('walk-timing');
	// 		} else if (thisObj.parents('.current-settings').hasClass('clear-timing')){
	// 			$('.preempt-ped-phase-def .overlay.timing .current-timing-entry label').text('Current Ped Clear Timing:');
	// 			$('.preempt-ped-phase-def .overlay.timing .new-timing label').text('New Ped Clear Timing:');
	// 			$('.preempt-ped-phase-def .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-ped-phase-def .overlay.timing #item-to-update').val('clear-timing');
	// 		} 
	// 		$('.preempt-ped-phase-def .overlay.timing').show();
	// 	});

	// 	$('.preempt-ped-phase-def .overlay.timing li[data-keypad-num]').on('mousedown',function() {
	// 		if (!$(this).hasClass('disabled')) {
	// 			var thisObj = $(this);
	// 			BaseUI.addInverse(thisObj);	
	// 			var keypadEntry = thisObj.attr('data-keypad-num');
	// 			var curVal = $('.preempt-ped-phase-def .overlay.timing #value-entered').val();

	// 			if (thisObj.find('a').hasClass('backspace')) {
	// 				// backspace functions
	// 				newVal = curVal.substring(0,curVal.length - 1);
	// 				$(this).parents('.panel').find('.overlay.timing #value-entered').val(newVal);	
	// 				$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(newVal + '_');
	// 			} else {
	// 				$(this).parents('.panel').find('.overlay.timing #value-entered').val(curVal + keypadEntry);	
	// 				$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(curVal + keypadEntry + '_');				
	// 			}
	// 			newVal = $('.preempt-ped-phase-def .overlay.timing #value-entered').val();
	// 			if (newVal.length == 4) {
	// 				$('.preempt-ped-phase-def .overlay.timing .keypad li[data-keypad-num]').addClass('disabled');
	// 				$('.preempt-ped-phase-def .overlay.timing .keypad li[data-keypad-num]:last-child').removeClass('disabled');
	// 			} else {
	// 				$('.preempt-ped-phase-def .overlay.timing .keypad li[data-keypad-num]').removeClass('disabled');
	// 			}				
	// 		}
	// 	});	

	// 	$('.preempt-ped-phase-def .overlay.timing .save').on('mousedown',function() {
	// 		var curPhase = parseInt($('.preempt-ped-phase-def .overlay.timing .current-info .has-phase > div').attr('data-phase-loc'));
	// 		var curVal = $('.preempt-ped-phase-def .overlay.timing #value-entered').val();
	// 		if($('.preempt-ped-phase-def .overlay.timing #item-to-update').val() == 'walk-timing') {
	// 			PreemptUI.setPedWalkTiming(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.getPedWalkTiming(loadedPreemptId,curPhase);		
	// 		} else if($('.preempt-ped-phase-def .overlay.timing #item-to-update').val() == 'clear-timing') {
	// 			PreemptUI.setPedClearTiming(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.updPedClearTiming(loadedPreemptId,curPhase);	
	// 		}
	
	// 		$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
	// 		BaseUI.resetOverlay();
	// 	});	
	// },

/****************************************************/

	// setPedWalkTiming: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_walkTiming = value;
	// },

	// getPedWalkTiming: function(preempt,phase) {
	// 	var markup = '<li><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_walkTiming + '</span></li>';
	// 	$('#preempt-ped-phase-def').find('.walk-timing ul').append(markup);
	// },

/****************************************************/

	// setPedClearTiming: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_clearanceTiming = value;
	// },

	getPedClearTiming: function(preempt,phase) {
		var markup = '<li><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_clearanceTiming + '</span></li>';
		$('#preempt-ped-phase-def').find('.current-settings.clear-timing ul').append(markup);
	},

/****************************************************/

	// changeLeftTurnPermissive: function() {
	// 	$('.preempt-left .current-settings.keypad .values ul').on('mousedown','li',function() {
	// 		$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
	// 		$('.preempt-left .overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
	// 		var thisObj = $(this);
	// 		var thisTiming = thisObj.parents('.current-settings').attr('class');
	// 		var thisVal = thisObj.find('span').text();
	// 		var thisPhase = thisObj.index();
	// 		$('.preempt-left .overlay.timing .has-phase div').empty();
	// 		$('.preempt-left .current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo($('.preempt-left .overlay.timing .has-phase div'));
	// 		$('.preempt-left .overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
	// 		$('.preempt-left .overlay.timing .current-timing-entry .value span').text(thisVal);
	// 		if (thisObj.parents('.current-settings').hasClass('permissive-start')){
	// 			$('.preempt-left .overlay.timing .current-timing-entry label').text('Current Permissive Start:');
	// 			$('.preempt-left .overlay.timing .new-timing label').text('New Permissive Start:');
	// 			$('.preempt-left .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-left .overlay.timing #item-to-update').val('permissive-start');
	// 		} else if (thisObj.parents('.current-settings').hasClass('flashing-output')){
	// 			$('.preempt-left .overlay.timing .current-timing-entry label').text('Current Flashing Output:');
	// 			$('.preempt-left .overlay.timing .new-timing label').text('New Flashing Output:');
	// 			$('.preempt-left .overlay.timing .new-timing .value span').text('_');
	// 			$('.preempt-left .overlay.timing #item-to-update').val('flashing-output');
	// 		} 
	// 		$('.preempt-left .overlay.timing').show();
	// 	});

	// 	$('.preempt-left .overlay.timing li[data-keypad-num]').on('mousedown',function() {
	// 		if (!$(this).hasClass('disabled')) {
	// 			var thisObj = $(this);
	// 			BaseUI.addInverse(thisObj);	
	// 			var keypadEntry = thisObj.attr('data-keypad-num');
	// 			var curVal = $('.preempt-left .overlay.timing #value-entered').val();

	// 			if (thisObj.find('a').hasClass('backspace')) {
	// 				// backspace functions
	// 				newVal = curVal.substring(0,curVal.length - 1);
	// 				$(this).parents('.panel').find('.overlay.timing #value-entered').val(newVal);	
	// 				$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(newVal + '_');
	// 			} else {
	// 				$(this).parents('.panel').find('.overlay.timing #value-entered').val(curVal + keypadEntry);	
	// 				$(this).parents('.panel').find('.overlay.timing .new-timing .value span').text(curVal + keypadEntry + '_');				
	// 			}
	// 			newVal = $('.preempt-left .overlay.timing #value-entered').val();
	// 			if (newVal.length == 4) {
	// 				$('.preempt-left .overlay.timing .keypad li[data-keypad-num]').addClass('disabled');
	// 				$('.preempt-left .overlay.timing .keypad li[data-keypad-num]:last-child').removeClass('disabled');
	// 			} else {
	// 				$('.preempt-left .overlay.timing .keypad li[data-keypad-num]').removeClass('disabled');
	// 			}				
	// 		}
	// 	});	

	// 	$('.preempt-left .overlay.timing .save').on('mousedown',function() {
	// 		var curPhase = parseInt($('.preempt-left .overlay.timing .current-info .has-phase > div').attr('data-phase-loc'));
	// 		var curVal = $('.preempt-left .overlay.timing #value-entered').val();
	// 		if($('.preempt-left .overlay.timing #item-to-update').val() == 'permissive-start') {
	// 			PreemptUI.setLeftTurnPermissiveStartPhase(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.getLeftTurnPermissiveStartPhase(loadedPreemptId,curPhase);		
	// 		} else if($('.preempt-left .overlay.timing #item-to-update').val() == 'flashing-output') {
	// 			PreemptUI.setLeftTurnPermissiveFlashingOutput(loadedPreemptId,curPhase,curVal);
	// 			PreemptUI.updLeftTurnPermissiveFlashingOutput(loadedPreemptId,curPhase);
	// 		}
	
	// 		$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
	// 		BaseUI.resetOverlay();
	// 	});	
	// },

/****************************************************/

	// setLeftTurnPermissiveStartPhase: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_permissiveStartPhase = value;
	// },

	getLeftTurnPermissiveStartPhase: function(preempt,phase) {
		var markup = '<li><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_permissiveStartPhase + '</span></span>';
		$('#preempt-left').find('.permissive-start ul').append(markup);
	},

/****************************************************/

	// setLeftTurnPermissiveFlashingOutput: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_flashingOutputChannelSection = value;
	// },

	getLeftTurnPermissiveFlashingOutput: function(preempt,phase) {
		var markup = '<li><span>' + allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_flashingOutputChannelSection + '</span></span>';
		$('#preempt-left').find('.flashing-output ul').append(markup);
	},

/****************************************************/

	// cycleLeftTurnMode: function() {
	// 	$('.preempt-left .current-settings.left-turn-mode .values ul').on('mousedown','li',function() {
	// 		var thisObj = $(this);
	// 		var thisIndex = thisObj.index();
	// 		var thisLeft = parseInt(thisObj.attr('data-left-turn'));
	// 		if (thisLeft == 3) {
	// 			thisLeft = 0;
	// 		} else {
	// 			thisLeft = parseInt(thisLeft + 1);
	// 		}
			
	// 		PreemptUI.setLeftTurnMode(loadedPreemptId,thisIndex,thisLeft);
	// 		PreemptUI.updLeftTurnMode(loadedPreemptId,thisIndex);
	// 	});
	// },

	// setLeftTurnMode: function(preempt,phase,value) {
	// 	allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_leftTurnMode = value;
	// },

	getLeftTurnMode: function(preempt,phase) {
		// var thisObj = $('.preempt-left .current-settings.left-turn-mode .values ul li:eq(' + phase + ')');
		// var thisClass = BaseUI.translateLeftTurn(allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_leftTurnMode);
		// thisObj.removeClass('pr pe prpe na').addClass(thisClass).removeAttr('data-left-turn').attr('data-left-turn',allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_leftTurnMode);
		
		var thisMode = allWorkingData.InSpire.m_preemptConfiguration.m_preempt[preempt].m_preemptPhaseConfiguration.m_pedPhase[phase].m_leftTurnMode;
		var modeClass = BaseUI.translateLeftTurn(thisMode);
		var markup = '<li class='+ modeClass + ' data-left-turn=' + thisMode + '><span>' + modeClass + '</span></li>';
		$('#preempt-left').find('.left-turn-mode ul').append(markup);
	},	

/****************************************************/

} // end of PreemptUI

//$(document).ready(PreemptUI.initialize);