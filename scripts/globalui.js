var GlobalUI = {

	initialize: function () {
		$('#home').find('.startup-config').addClass('disabled');

		if (!$('body').hasClass('read-only')) {
			GlobalUI.selectChannelCompatibility();
			GlobalUI.selectPhaseCompatibility();			
			GlobalUI.setChannelCompatibility();
			GlobalUI.toggleEditChannelCompatibility();
			GlobalUI.toggleEditPhaseCompatibility();			
			GlobalUI.loadChannelCompatibility();
			GlobalUI.loadPhaseCompatibility();
			GlobalUI.toggleDetectionStatus();
			GlobalUI.paginationChannelCompatibility();	

			GlobalUI.changeVehMovement();
			GlobalUI.cycleStartupVehicleLight();
			GlobalUI.changeVehiclePedChannel();
			GlobalUI.cycleStartupPedLight();
			GlobalUI.cycleStartupState();
			GlobalUI.changeStartupTime();	
		}


		var vehiclePhaseLen = allWorkingData.InSpire.m_vehiclePhaseOutput.length;
		for (var i = 0; i <  vehiclePhaseLen; i++) {
			GlobalUI.getVehicleChannel(i);		
		}	

		var vehicleInitLen = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit.length;
		for (var i = 0; i <  vehicleInitLen; i++) {
			GlobalUI.getStartupVehicleLight(i);
			GlobalUI.getVehHeader(i);		
		}	

		var vehicleDirLen = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection.length;
		for (var i = 0; i <  vehicleDirLen; i++) {
			GlobalUI.getVehiclePhaseNumber(i);	
			GlobalUI.getVehMovement(i);	
		}	

		var pedPhaseLen = allWorkingData.InSpire.m_pedPhaseOutput.length;
		for (var i = 0; i <  pedPhaseLen; i++) {
			GlobalUI.getPedChannel(i);
			GlobalUI.getPedPhaseNumber(i);		
		}	

		var pedInitLen = allWorkingData.InSpire.m_phaseInitialization.m_pedDriverInit.length;
		for (var i = 0; i <  pedInitLen; i++) {
			GlobalUI.getStartupPedLight(i);		
		}

		GlobalUI.getStartupState();	
		GlobalUI.getStartupTime();	
		GlobalUI.getRedRevert();				
		
		$('#home').find('.startup-config').removeClass('disabled');
	},


	reloadGlobalInfo: function() {
		$('#home').find('.startup-config').addClass('disabled');		
		GlobalUI.emptyGlobalShell();

		var vehiclePhaseLen = allWorkingData.InSpire.m_vehiclePhaseOutput.length;
		for (var i = 0; i <  vehiclePhaseLen; i++) {
			GlobalUI.getVehicleChannel(i);		
		}	

		var vehicleInitLen = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit.length;
		for (var i = 0; i <  vehicleInitLen; i++) {
			GlobalUI.getStartupVehicleLight(i);
			GlobalUI.getVehHeader(i);		
		}	

		var vehicleDirLen = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection.length;
		for (var i = 0; i <  vehicleDirLen; i++) {
			GlobalUI.getVehiclePhaseNumber(i);	
			GlobalUI.getVehMovement(i);	
		}	

		var pedPhaseLen = allWorkingData.InSpire.m_pedPhaseOutput.length;
		for (var i = 0; i <  pedPhaseLen; i++) {
			GlobalUI.getPedChannel(i);
			GlobalUI.getPedPhaseNumber(i);		
		}	

		var pedInitLen = allWorkingData.InSpire.m_phaseInitialization.m_pedDriverInit.length;
		for (var i = 0; i <  pedInitLen; i++) {
			GlobalUI.getStartupPedLight(i);		
		}

		GlobalUI.getStartupState();	
		GlobalUI.getStartupTime();	
		GlobalUI.getRedRevert();	

		$('#home').find('.startup-config').removeClass('disabled');
		
	},

	emptyGlobalShell: function() {
		$('.panel.global .current-settings').each(function() {
			$(this).find('.values ul').empty();
		});
		$('#config-vehicle-phase-timing').find('.vehicle.phase ul').empty();
		$('#config-dynamic-max-green').find('.vehicle.phase ul').empty();
		$('#config-vehicle-phase-left').find('.vehicle.phase ul').empty();
		$('#seq-group-state-def').find('.vehicle.phase ul').empty();	
	},


/****************************************************/
// STARTUP TIME 

	setStartupTime: function(value) {
		allWorkingData.InSpire.m_startupConfiguration.m_startupTimeSec = value;
	},

	getStartupTime: function() {
		var thisTiming = allWorkingData.InSpire.m_startupConfiguration.m_startupTimeSec;
		var originalSetting = allPristineData.InSpire.m_startupConfiguration.m_startupTimeSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#startup-config-def').find('.startup-time ul').append(GlobalUI.htmlStartupTime(thisTiming,isDiff));
	},	

	updStartupTime: function() {
		var thisTiming = allWorkingData.InSpire.m_startupConfiguration.m_startupTimeSec;
		var originalSetting = allPristineData.InSpire.m_startupConfiguration.m_startupTimeSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#startup-config-def').find('.current-settings.startup-time ul li').replaceWith(GlobalUI.htmlStartupTime(thisTiming,isDiff));
	},

	htmlStartupTime: function(val,isDiff) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\''+ thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},		

	changeStartupTime: function() {

		var thisView = $('#startup-config-def');

		thisView.find('.current-settings.keypad .values ul').on('mousedown','li',function() {
			$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
			thisView.find('.overlay.timing .keypad li.disabled').removeClass('disabled');
			thisView.find('.overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
			var thisObj = $(this);
			var thisTiming = thisObj.parents('.current-settings').attr('class');
			var thisVal = thisObj.find('span').text();

			thisView.find('.overlay.timing .current-timing-entry .value span').text(thisVal);
			if (thisObj.parents('.current-settings').hasClass('startup-time')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Startup Time:');
				thisView.find('.overlay.timing .new-timing label').text('New Startup Time:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('startup-time');
			} else if (thisObj.parents('.current-settings').hasClass('red-revert')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Red Revert:');
				thisView.find('.overlay.timing .new-timing label').text('New Red Revert:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('red-revert');
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
			var curVal = thisView.find('.overlay.timing #value-entered').val();
			if (curVal != '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'startup-time') {
					GlobalUI.setStartupTime(curVal);
					GlobalUI.updStartupTime();		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'red-revert') {
					curVal = curVal * 10;
					GlobalUI.setRedRevert(curVal);
					GlobalUI.updRedRevert();		
				}
				$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');					
			}
	
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {	
			BaseUI.resetOverlay();
		});	

	},

/****************************************************/
// RED REVERT  

	setRedRevert: function(value) {
		allWorkingData.InSpire.m_startupConfiguration.m_redRevertTenthSec = value;
	},

	getRedRevert: function() {
		var thisTiming = allWorkingData.InSpire.m_startupConfiguration.m_redRevertTenthSec;
		var originalSetting = allPristineData.InSpire.m_startupConfiguration.m_redRevertTenthSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#startup-config-def').find('.red-revert ul').append(GlobalUI.htmlRedRevert(thisTiming,isDiff));
	},	

	updRedRevert: function() {
		var thisTiming = allWorkingData.InSpire.m_startupConfiguration.m_redRevertTenthSec;
		var originalSetting = allPristineData.InSpire.m_startupConfiguration.m_redRevertTenthSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#startup-config-def').find('.current-settings.red-revert ul li').replaceWith(GlobalUI.htmlRedRevert(thisTiming,isDiff));
	},

	htmlRedRevert: function(val,isDiff) {
		val = parseFloat(val/10).toFixed(1);
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\''+ thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},		


/****************************************************/
// STARTUP STATE 

	getStartupState: function() {
		var thisStartup = allWorkingData.InSpire.m_startupConfiguration.m_startupState;
		var originalSetting = allPristineData.InSpire.m_startupConfiguration.m_startupState;
		var isDiff = false;
		if (thisStartup !== originalSetting) {
			isDiff = true;
		}
		$('#startup-config-def').find('.startup-state ul').append(GlobalUI.htmlStartupState(thisStartup,isDiff)); 
	},


	cycleStartupState: function() {
		$('#startup-config-def').find('.current-settings.startup-state .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
				var thisIndex = thisObj.index();
				var thisStartup = parseInt(thisObj.attr('data-startup-ind'));
				if (thisStartup == 1) {
					thisStartup = 0;
				} else {
					thisStartup = parseInt(thisStartup + 1);
				}
				GlobalUI.setStartupState(thisStartup);
				GlobalUI.updStartupState();				
		});
	},


	updStartupState: function() {
		var thisStartup = allWorkingData.InSpire.m_startupConfiguration.m_startupState;
		var originalSetting = allPristineData.InSpire.m_startupConfiguration.m_startupState;
		var isDiff = false;
		if (thisStartup !== originalSetting) {
			isDiff = true;
		}
		$('#startup-config-def').find('.startup-state ul li').replaceWith(GlobalUI.htmlStartupState(thisStartup,isDiff)); 
	},

	htmlStartupState: function(val,isDiff) {
		var thisStartup = BaseUI.translateStartupConfig(val);
		var thisClass = thisStartup;
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}		
		var markup = '<li data-startup-ind=' + val + '\' class=\'' + thisClass + '\'><span></span></li>';	
		return markup;
	},		

	setStartupState: function(value) {
		allWorkingData.InSpire.m_startupConfiguration.m_startupState = parseInt(value);
	},


/**************************************/
// VEHICLE PHASE NUMBER for HEADERS 	

	getVehiclePhaseNumber: function(phase) {
		var markup = '<li class=\'has-phase has-popup\'><div><span>' + (phase + 1) + '</span></div></li>';
		$('#global-phase-def').find('.vehicle.init.phase ul').append(markup);	
	},

/**************************************/
// PED PHASE NUMBER for HEADERS 		

	getPedPhaseNumber: function(phase) {
		var markup = '<li class=\'has-phase\'><div><span>' + (phase + 1) + '</span></div></li>';
		$('#global-phase-def').find('.ped.phase ul').append(markup);	
	},

/**************************************/
// VEHICLE MOVEMENT ASSIGNMENT

	changeVehMovement: function() {
		 var thisView = $('#global-phase-def');
		 thisView.find('.set-movement .values ul').on('mousedown','li',function() {
		 	$(this).parents('.panel').find('.overlay.direction #value-entered').val('');					
		 	var thisObj = $(this);
		 	var thisVal = thisObj.find('span').text();
		 	var thisPhase = thisObj.index();
		 	thisView.find('.overlay.direction .has-phase div').empty();

			var thisMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[thisPhase];
			var thisDir = BaseUI.translateMovement(thisMovement);
		 	thisView.find('.current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo(thisView.find('.overlay.direction .current-movement div').removeAttr('class').addClass('dir-' + thisDir));

		 	thisView.find('.overlay.direction .current-timing-entry > div').attr('data-phase-loc',thisPhase);
		 	thisView.find('.overlay.direction .current-timing-entry .value span').text(thisVal);
		 	thisView.find('.overlay.direction .direction-selection #phase-selected').val(thisVal);
		 	thisView.find('.overlay.direction .new-direction div').removeAttr('class').append('<span>'+thisVal+'</span>');
		 	thisView.find('.overlay.direction .direction-selection li div.diff').removeClass('diff');
	 		thisView.find('.overlay.direction').show();
		});

		 thisView.find('.overlay.direction .direction-selection li div').on('mousedown',function() {
		 	thisView.find('.overlay.direction .direction-selection li div.diff').removeClass('diff');
		 	var thisObj = $(this);
		 	var thisDir = thisObj.attr('class');
		 	thisView.find('.overlay.direction .new-direction div').removeAttr('class').addClass(thisDir);
		 	thisView.find('.overlay.direction .direction-selection #direction-selected').val(thisObj.attr('data-movement'));
		 	$(this).addClass('diff');
		 });

		 thisView.find('.overlay.direction .set').on('mousedown',function() {
		 	var thisPhase = parseInt(thisView.find('#phase-selected').val());
		 	thisPhase = thisPhase - 1;
		 	var thisMovement = thisView.find('.overlay.direction .direction-selection #direction-selected').val();
		 	GlobalUI.setVehMovement(thisPhase,thisMovement);
		 	GlobalUI.updVehMovement(thisPhase);

		 	//Need to check if change in vehicle movement switches that phase to a left turn (or vice versa)

		 	// THIS IS TEMPORARY UNTIL WAYNE UDPATES THE VALIDATION TO GLOBAL
		 	allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase[thisPhase].m_movementDirection = thisMovement;

		 	ConfigUI.updLeftTurnMode(loadedConfig,thisPhase);
		 	ConfigUI.updLeftTurnPermissiveStartPhase(loadedConfig,thisPhase);
		 	ConfigUI.updLeftTurnPermissiveFlashingOutput(loadedConfig,thisPhase);
		 	ConfigUI.updOpposingThruPhase(loadedConfig,thisPhase);


		 	BaseUI.resetOverlay();
		 });

		 thisView.find('.overlay.direction .cancel').on('mousedown',function() {
		 	BaseUI.resetOverlay();
		 });
	},

	setVehMovement: function(phase,value) {
		allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase] = value;
		console.log(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase]);
	},

	getVehMovement: function(phase) {
		var thisDir = 'dir-' + BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase]);
		var markup = '<li class=\'has-phase has-popup\'><div class=' + thisDir +'><span>' + (phase + 1) + '</span></div></li>';
		$('#global-phase-def').find('.set-movement ul').append(markup);	
	},

	updVehMovement: function(phase) {
		var thisMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase];
		var originalSetting = allPristineData.InSpire.m_phaseInitialization.m_movementDirection[phase];
		var isDiff = false;
		if (thisMovement != originalSetting) {
			isDiff = true;
		}

		var thisDir = 'dir-' + BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase]);
		$('#global-phase-def').find('.set-movement ul li:eq(' + phase + ')').replaceWith(GlobalUI.htmlVehMovement(thisDir,phase,isDiff));

		GlobalUI.updVehHeader(phase);	
	},

	htmlVehMovement: function(dir,phase,isDiff) {
		var thisClass = 'has-phase has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><div class=' + dir +'><span>' + (phase + 1) + '</span></div></li>';
		return markup;
	},


/****************************************************/
// UPDATE VEHICLE PHASE HEADERS

	getVehHeader: function(phase,isDiff) {
		var thisClass = 'has-phase has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var thisDir = 'dir-' + BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase]);
	 	var thisStartup = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
	 	var thisLight = BaseUI.translateVehicleStartup(thisStartup - 1);		

		var markup = '<li class=\'' + thisClass + '\'><div class=' + thisDir +'><span>' + (phase + 1) + '</span><span class="startup ' + thisLight + '"></span></div></li>';

		$('#config-vehicle-phase-timing').find('.vehicle.phase ul').append(markup);
		$('#config-dynamic-max-green').find('.vehicle.phase ul').append(markup);
		$('#config-vehicle-phase-left').find('.vehicle.phase ul').append(markup);
		$('#seq-group-state-def').find('.vehicle.phase ul').append(markup);	

	},

	updVehHeader: function(phase) {

		var isDiff = false;

		var thisClass = 'has-phase has-popup';

		var thisStartup = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
		var originalSetting = allPristineData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
		if (thisStartup !== originalSetting) {
			thisClass = thisClass + ' diff';
		}
		var thisMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase];
		var originalSetting = allPristineData.InSpire.m_phaseInitialization.m_movementDirection[phase];
		if (thisMovement != originalSetting) {
			thisClass = thisClass + ' diff';
		}

		var thisDir = 'dir-' + BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase]);
	 	var thisStartup = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
	 	var thisLight = BaseUI.translateVehicleStartup(thisStartup - 1);		

		var markup = '<li class=\'' + thisClass + '\'><div class=' + thisDir +'><span>' + (phase + 1) + '</span><span class="startup ' + thisLight + '"></span></div></li>';

		$('#config-vehicle-phase-timing').find('.vehicle.phase ul li:eq(' + phase + ')').replaceWith(markup);
		$('#config-dynamic-max-green').find('.vehicle.phase ul li:eq(' + phase + ')').replaceWith(markup);
		$('#config-vehicle-phase-left').find('.vehicle.phase ul li:eq(' + phase + ')').replaceWith(markup);
		$('#seq-group-state-def').find('.vehicle.phase ul li:eq(' + phase + ')').replaceWith(markup);	
	},

/****************************************************/
// VEHICLE STARTUP LIGHT 

	getStartupVehicleLight: function(phase) {
		var thisStartup = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
		var originalSetting = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
		var isDiff = false;
		if (thisStartup !== originalSetting) {
			isDiff = true;
		}
		$('#global-phase-def').find('.vehicle-startup ul').append(GlobalUI.htmlStartupVehicleLight(thisStartup,isDiff)); 
	},


	cycleStartupVehicleLight: function() {
		$('#global-phase-def').find('.current-settings.vehicle-startup .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
				var thisIndex = thisObj.index();
				var thisStartup = parseInt(thisObj.attr('data-startup-ind'));
				if (thisStartup == 3) {
					thisStartup = 0;
				} else {
					thisStartup = parseInt(thisStartup + 1);
				}
				GlobalUI.setVehicleStartupLight(thisIndex,thisStartup);
				GlobalUI.updStartupVehicleLight(thisIndex);			
		});
	},


	updStartupVehicleLight: function(phase) {
		var thisStartup = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
		var originalSetting = allPristineData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
		var isDiff = false;
		if (thisStartup !== originalSetting) {
			isDiff = true;
		}		
		$('#global-phase-def').find('.vehicle-startup ul li:eq(' + phase + ')').replaceWith(GlobalUI.htmlStartupVehicleLight(thisStartup,isDiff)); 
		GlobalUI.updVehHeader(phase);		
	},

	htmlStartupVehicleLight: function(val,isDiff) {
		var thisLight = BaseUI.translateStartupLight(val);
		var thisClass = thisLight;
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}		
		var markup = '<li data-startup-ind=' + val + '\' class=\'' + thisClass + '\'></li>';	
		return markup;
	},		

	setVehicleStartupLight: function(phase,value) {
		allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit[phase] = parseInt(value);
	},


/****************************************************/
// PED PHASE STARTUP - Done

	setPedStartupLight: function(phase,value) {
		allWorkingData.InSpire.m_phaseInitialization.m_pedDriverInit[phase] = value;
	},

	getStartupPedLight: function(phase) {
		var markup = '';
		var startupInd = allWorkingData.InSpire.m_phaseInitialization.m_pedDriverInit[phase];
		$('#global-phase-def').find('.ped-startup ul').append(GlobalUI.htmlStartupPedLight(parseInt(startupInd)));		
	},

	htmlStartupPedLight: function(val,isDiff) {
		var markup = '';	
		var thisClass = BaseUI.translateStartupPed(val);
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		markup = '<li data-startup-ind=\'' + val + '\' class=\'' + thisClass + '\'\><div><span class=\'light\'></span></div></li>';		
		return markup;
	},

	cycleStartupPedLight: function() {
		$('#global-phase-def').find('.current-settings.ped-startup .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
				var thisIndex = thisObj.index();
				
				var thisStartup = parseInt(thisObj.attr('data-startup-ind'));
				if (thisStartup == 3) {
					thisStartup = 0;
				} else if (thisStartup == 1) {
					thisStartup = 3;
				} else {
					thisStartup = parseInt(thisStartup + 1);
				}
				GlobalUI.setPedStartupLight(thisIndex,thisStartup);
				GlobalUI.updStartupPedLight(thisIndex);				

		});
	},

	updStartupPedLight: function(phase) {
		var thisStartup = allWorkingData.InSpire.m_phaseInitialization.m_pedDriverInit[phase];
		var originalSetting = allPristineData.InSpire.m_phaseInitialization.m_pedDriverInit[phase];
		var isDiff = false;
		if (thisStartup !== originalSetting) {
			isDiff = true;
		}
		$('#global-phase-def').find('.ped-startup ul li:eq(' + phase + ')').replaceWith(GlobalUI.htmlStartupPedLight(thisStartup,isDiff)); 
	},		


/****************************************************/
// VEHICLE AND PED CHANNEL


	changeVehiclePedChannel: function() {
		var thisView = $('#global-phase-def');

		thisView.find('.current-settings.keypad .values ul').on('mousedown','li',function() {
			$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
			thisView.find('.overlay.timing .keypad li.disabled').removeClass('disabled');
			thisView.find('.overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
			var thisObj = $(this);
			var thisTiming = thisObj.parents('.current-settings').attr('class');
			var thisVal = thisObj.find('span').text();
			var thisPhase = thisObj.index();
			thisView.find('.overlay.timing .has-phase div').empty();
			thisView.find('.current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo($('#global-phase-def .overlay.timing .has-phase div'));
			thisView.find('.overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
			thisView.find('.overlay.timing .current-timing-entry .value span').text(thisVal);
			if (thisObj.parents('.current-settings').hasClass('vehicle-channel')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Vehicle Channel:');
				thisView.find('.overlay.timing .new-timing label').text('New Vehicle Channel:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('vehicle-channel');
			} else if (thisObj.parents('.current-settings').hasClass('ped-channel')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Pedestrian Channel:');
				thisView.find('.overlay.timing .new-timing label').text('New Pedestrian Channel:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('ped-channel');
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
				newVal = $('.overlay.timing #value-entered').val();
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
			if (curVal !== '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'vehicle-channel') {
					GlobalUI.setVehicleChannel(curPhase,curVal);
					GlobalUI.updVehicleChannel(curPhase);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'ped-channel') {
					GlobalUI.setPedChannel(curPhase,curVal);
					GlobalUI.updPedChannel(curPhase);
				}					
				$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
			}
	
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});	

	},


	setVehicleChannel: function(phase,value) {
		allWorkingData.InSpire.m_vehiclePhaseOutput[phase].m_redChannelNum = value;
		allWorkingData.InSpire.m_vehiclePhaseOutput[phase].m_yellowChannelNum = value;
		allWorkingData.InSpire.m_vehiclePhaseOutput[phase].m_greenChannelNum = value;
		allWorkingData.InSpire.m_vehiclePhaseOutput[phase].m_redSignalDriver = 1;
		allWorkingData.InSpire.m_vehiclePhaseOutput[phase].m_yellowSignalDriver = 2;
		allWorkingData.InSpire.m_vehiclePhaseOutput[phase].m_greenSignalDriver = 3;


	},

	getVehicleChannel: function(phase) {
		var channelVal = allWorkingData.InSpire.m_vehiclePhaseOutput[phase].m_redChannelNum; // TO BE CHANGED BY A3
		$('#global-phase-def').find('.vehicle-channel ul').append(GlobalUI.htmlVehiclePedChannel(channelVal));
	},

	htmlVehiclePedChannel: function(val,isDiff) {
		var thisClass = '';
		if (val == 0) {
			thisClass = thisClass + ' zero';
		}		
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><span>'+ val +'</span></li>';
		return markup;
	},

	updVehicleChannel: function(phase) {
		var channelVal = parseInt(allWorkingData.InSpire.m_vehiclePhaseOutput[phase].m_redChannelNum);
		var originalSetting = parseInt(allPristineData.InSpire.m_vehiclePhaseOutput[phase].m_redChannelNum);
		var isDiff = false;
		if (channelVal !== originalSetting) {
			isDiff = true;
		}
		$('#global-phase-def').find('.vehicle-channel ul li:eq(' + phase + ')').replaceWith(GlobalUI.htmlVehiclePedChannel(channelVal,isDiff));
	},

/****************************************************/

	setPedChannel: function(phase,value) {
		allWorkingData.InSpire.m_pedPhaseOutput[phase].m_redChannelNum = value;
		allWorkingData.InSpire.m_pedPhaseOutput[phase].m_yellowChannelNum = value;
		allWorkingData.InSpire.m_pedPhaseOutput[phase].m_greenChannelNum = value;
		allWorkingData.InSpire.m_pedPhaseOutput[phase].m_redSignalDriver = 1;
		allWorkingData.InSpire.m_pedPhaseOutput[phase].m_yellowSignalDriver = 2;
		allWorkingData.InSpire.m_pedPhaseOutput[phase].m_greenSignalDriver = 3;
	},

	getPedChannel: function(phase) {
		var channelVal = allWorkingData.InSpire.m_pedPhaseOutput[phase].m_redChannelNum;
		$('#global-phase-def').find('.ped-channel ul').append(GlobalUI.htmlVehiclePedChannel(channelVal));
	},

	updPedChannel: function(phase) {
		var channelVal = allWorkingData.InSpire.m_pedPhaseOutput[phase].m_redChannelNum;
		var originalSetting = allPristineData.InSpire.m_pedPhaseOutput[phase].m_redChannelNum;
		var isDiff = false;
		if (channelVal !== originalSetting) {
			isDiff = true;
		}		
		$('#global-phase-def').find('.ped-channel ul li:eq(' + phase + ')').replaceWith(GlobalUI.htmlVehiclePedChannel(channelVal,isDiff));
	},	

/****************************************************/	
// PHASE COMPATIBILITY

	loadPhaseCompatibility: function() {

		 	var markup = '';

		 	for (a = 0; a < 8; a++) {
		 		if (a == 0) {
		 			markup = markup + '<ul class=\'current\'>';
		 		} else {
		 			markup = markup + '<ul>';
		 		}


		 		for (b = 0; b < 8; b++) {
		 			markup = markup + '<li><div>';
		 			var curValue = GlobalUI.getPhaseCompatibility(a,b);
		 			if (a == b) {
		 				markup = markup + '<a class=\'not-available\'><span>'+ (a + 1) +'</span></a></div></li>';
		 			} else if (curValue == true) {
		 				markup = markup + '<a class=\'selected\'><span><sup>'+ (a + 1) + '</sup><sub>' + (b + 1) +'</sub></span></a></div></li>';
		 			} else {
		 				markup = markup + '<a><span><sup>'+ (a + 1) + '</sup><sub>' + (b + 1) +'</sub></span></a></div></li>';
		 			}
		 		}
		 		markup = markup + '</ul>';
		 	}

		 	$('#phase-compatibility-view').find('.content').html(markup);
			
	},

	getPhaseCompatibility: function(row,col) {
		var compatibilityVal = allWorkingData.InSpire.m_phaseCompatibility.m_bArrPhaseCompatibility[row][col];
		return compatibilityVal;
	},	

/****************************************************/	

	loadChannelCompatibility: function() {

		 	var markup = '';

		 	for (a = 0; a < 16; a++) {
		 		if (a == 0) {
		 			markup = markup + '<ul class=\'current\'>';
		 		} else {
		 			markup = markup + '<ul>';
		 		}


		 		for (b = 0; b < 16; b++) {
		 			markup = markup + '<li><div>';
		 			var curValue = GlobalUI.getChannelCompatibility(a,b);
		 			if (a == b) {
		 				markup = markup + '<a class=\'not-available\'><span>'+ (a + 1) +'</span></a></div></li>';
		 			} else if (curValue == true) {
		 				markup = markup + '<a class=\'selected\'><span><sup>'+ (a + 1) + '</sup><sub>' + (b + 1) +'</sub></span></a></div></li>';
		 			} else {
		 				markup = markup + '<a><span><sup>'+ (a + 1) + '</sup><sub>' + (b + 1) +'</sub></span></a></div></li>';
		 			}
		 		}
		 		markup = markup + '</ul>';
		 	}

		 	$('#channel-compatibility-view').find('.content').html(markup);
			
	},

	getChannelCompatibility: function(row,col) {
		var compatibilityVal = allWorkingData.InSpire.m_channelCompatibility.m_bArrChannelCompatibility[row][col];
		return compatibilityVal;
	},


	paginationChannelCompatibility: function() {
		$('.channel-compatibility-view .page-up').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				var thisObj = $('.channel-compatibility-view');
				var curPos = thisObj.find('ul.current').index();
				if (curPos == 0) {
					// ignore it
				} else {
					thisObj.find('ul.current').removeClass('current');
					thisObj.find('ul:nth-child(' + (curPos) + ')').addClass('current');
				}				
			}

		});
		$('.channel-compatibility-view .page-down').on('mousedown',function() {
			var thisObj = $('.channel-compatibility-view');
			var curPos = thisObj.find('ul.current').index();
			if (curPos == 15) {
				// ignore it 
			} else {
				thisObj.find('ul.current').removeClass('current');
				thisObj.find('ul:nth-child(' + (curPos + 2) + ')').addClass('current');
			}
		});		
	},

	selectChannelCompatibility: function() {
		$('.channel-compatibility-view').on('mousedown','.content ul li div a',function() {
			var thisObj = $(this);

			if (thisObj.parents('.content').hasClass('read-only')) {
				// ignore it
			} else {
				if (thisObj.parent().parent().parent().hasClass('current')) {
					var thisRow = (thisObj.parent().parent().parent().index()) + 1 ;
					var thisCol = (thisObj.parent().parent().index()) + 1;			
					if (thisObj.hasClass('selected')) {
						thisObj.removeClass('selected');
						$('.channel-compatibility-view .content ul:nth-child(' + thisCol + ') li:nth-child(' + thisRow +') div a').removeClass('selected');
						$('.channel-compatibility-view .bottom-strip .channel-selections .label').text('Removed');
						GlobalUI.setChannelCompatibility(thisRow,thisCol,'remove');
						
						var thisSetting = allWorkingData.InSpire.m_channelCompatibility.m_bArrChannelCompatibility[thisRow - 1][thisCol - 1];
						var pristineSetting = allPristineData.InSpire.m_channelCompatibility.m_bArrChannelCompatibility[thisRow - 1][thisCol - 1];

						if (thisSetting !== pristineSetting) {
							thisObj.addClass('diff');
						} else {
							thisObj.removeClass('diff');
						}

					} else {
						thisObj.addClass('selected');
						$('.channel-compatibility-view .content ul:nth-child(' + thisCol + ') li:nth-child(' + thisRow +') div a').addClass('selected');			
						$('.channel-compatibility-view .bottom-strip .channel-selections .label').text('Added');
						GlobalUI.setChannelCompatibility(thisRow,thisCol,'add');

						var thisSetting = allWorkingData.InSpire.m_channelCompatibility.m_bArrChannelCompatibility[thisRow - 1][thisCol - 1];
						var pristineSetting = allPristineData.InSpire.m_channelCompatibility.m_bArrChannelCompatibility[thisRow - 1][thisCol - 1];

						if (thisSetting !== pristineSetting) {
							thisObj.addClass('diff');
						} else {
							thisObj.removeClass('diff');
						}

					}
					$('.channel-compatibility-view .bottom-strip .channel-selections .value').text(thisRow +',' + thisCol);
				} else {
					$('.channel-compatibility-view .content ul').removeClass('current');
					thisObj.parent().parent().parent().addClass('current');
				}				
			}


		});
	},

	// set values to config file from markup
	setChannelCompatibility: function(row,col,action) {
		if (action == "add") {
			allWorkingData.InSpire.m_channelCompatibility.m_bArrChannelCompatibility[row - 1][col - 1] = true;
		} else if (action == "remove") {
			allWorkingData.InSpire.m_channelCompatibility.m_bArrChannelCompatibility[row - 1][col - 1] = false;
		}
	},

	showChannelCompatibility: function() {
		$('#home').find('.channel-compatibility').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// ignore
			} else {
				BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('channel-compatibility-view') }, delayTime );					
			}
			
		});				
	},


	selectPhaseCompatibility: function() {
		$('.phase-compatibility-view').on('mousedown','.content ul li div a',function() {

			var thisObj = $(this);

			if (thisObj.parents('.content').hasClass('read-only')) {
				// ignore it
			} else {
		//		if (thisObj.parent().parent().parent().hasClass('current')) {
					var thisRow = (thisObj.parent().parent().parent().index()) + 1 ;
					var thisCol = (thisObj.parent().parent().index()) + 1;			
					if (thisObj.hasClass('selected')) {
						thisObj.removeClass('selected');
						$('.phase-compatibility-view .content ul:nth-child(' + thisCol + ') li:nth-child(' + thisRow +') div a').removeClass('selected');
						$('.phase-compatibility-view .bottom-strip .channel-selections .label').text('Removed');
						GlobalUI.setPhaseCompatibility(thisRow,thisCol,'remove');
						
						var thisSetting = allWorkingData.InSpire.m_phaseCompatibility.m_bArrPhaseCompatibility[thisRow - 1][thisCol - 1];
						var pristineSetting = allPristineData.InSpire.m_phaseCompatibility.m_bArrPhaseCompatibility[thisRow - 1][thisCol - 1];

						if (thisSetting !== pristineSetting) {
							thisObj.addClass('diff');
						} else {
							thisObj.removeClass('diff');
						}

					} else {
						thisObj.addClass('selected');
						$('.phase-compatibility-view .content ul:nth-child(' + thisCol + ') li:nth-child(' + thisRow +') div a').addClass('selected');			
						$('.phase-compatibility-view .bottom-strip .channel-selections .label').text('Added');
						GlobalUI.setPhaseCompatibility(thisRow,thisCol,'add');

						var thisSetting = allWorkingData.InSpire.m_phaseCompatibility.m_bArrPhaseCompatibility[thisRow - 1][thisCol - 1];
						var pristineSetting = allPristineData.InSpire.m_phaseCompatibility.m_bArrPhaseCompatibility[thisRow - 1][thisCol - 1];

						if (thisSetting !== pristineSetting) {
							thisObj.addClass('diff');
						} else {
							thisObj.removeClass('diff');
						}

					}
					$('.phase-compatibility-view .bottom-strip .channel-selections .value').text(thisRow +',' + thisCol);
		//	} else {
		//			$('.phase-compatibility-view .content ul').removeClass('current');
		//			thisObj.parent().parent().parent().addClass('current');
		//		}				
			}
		});
	},

	// set values to config file from markup
	setPhaseCompatibility: function(row,col,action) {
		if (action == "add") {
			allWorkingData.InSpire.m_phaseCompatibility.m_bArrPhaseCompatibility[row - 1][col - 1] = true;
		} else if (action == "remove") {
			allWorkingData.InSpire.m_phaseCompatibility.m_bArrPhaseCompatibility[row - 1][col - 1] = false;
		}
	},



	toggleDetectionStatus: function() {
		$('#status-detectors').find('.show-vehicle-detection a').on('mousedown',function () {
			 $('.status-detectors .pedestrian-status').hide();
			 $('.status-detectors .vehicle-status').show();
			 $('.status-detectors .show-ped-detection').removeClass('on');
			 $('.status-detectors .show-vehicle-detection').addClass('on');
		});
		$('#status-detectors').find('.show-ped-detection a').on('mousedown',function () {
			 $('.status-detectors .vehicle-status').hide();
			 $('.status-detectors .pedestrian-status').show();
			 $('.status-detectors .show-vehicle-detection').removeClass('on');
			 $('.status-detectors .show-ped-detection').addClass('on');
		});
	
	},

	toggleEditChannelCompatibility: function() {
		$('.channel-compatibility-view .edit-toggle').on('mousedown', function() {
			thisObj = $(this);
			if (thisObj.hasClass('on')) {
				thisObj.removeClass('on');
				$('.channel-compatibility-view .content').addClass('read-only');
			} else {
				thisObj.addClass('on');
				$('.channel-compatibility-view .content').removeClass('read-only');
			}
		});
	},

	toggleEditPhaseCompatibility: function() {
		$('.phase-compatibility-view .edit-toggle').on('mousedown', function() {
			thisObj = $(this);
			if (thisObj.hasClass('on')) {
				thisObj.removeClass('on');
				$('.phase-compatibility-view .content').addClass('read-only');
			} else {
				thisObj.addClass('on');
				$('.phase-compatibility-view .content').removeClass('read-only');
			}
		});
	},	




} // end of GlobalUI

//$(document).ready(GlobalUI.initialize);