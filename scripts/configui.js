var ConfigUI = {

	initialize: function () {

		window.configToDelete = 0;

		$('#home').find('.current-config').addClass('disabled');

		ConfigUI.loadConfigList();
		ConfigUI.loadConfigMenuItems();
		ConfigUI.selectConfigToLoad();	


		if (!$('body').hasClass('read-only')) {
			ConfigUI.toggleVehicleEnabled();
			ConfigUI.toggleOneCallVeh();
			ConfigUI.togglePedEnabled();
			ConfigUI.toggleOneCallPed();
			ConfigUI.togglePedNonActuated();
			ConfigUI.togglePedRestInWalk();
			ConfigUI.togglePedClearYellow();
			ConfigUI.toggleVehDetectorsLock();
			ConfigUI.toggleVehDetectorsCall();
			ConfigUI.changeVehDetectors();
			ConfigUI.changeVehicleOverlap();
		 	ConfigUI.changeVehiclePhaseTiming();
		 	ConfigUI.changeLeftTurnPermissive();
		  	ConfigUI.changeDynamicMaxGreenTiming();	
			ConfigUI.cyclePhaseTimingRecall();
			ConfigUI.cycleLeftTurnMode();		  				
			ConfigUI.changePedDefTiming();
			ConfigUI.changePedDetectorPhase();
			ConfigUI.toggleDynamicMaxGreenEnabled();
			ConfigUI.toggleFlashingOutput();

	
			ConfigUI.loadSequenceGroup();
			ConfigUI.loadSeqStateDefinitionByPhase();
			ConfigUI.loadSeqDefinition();	
		 	ConfigUI.changeConfigurationName();
		 	ConfigUI.changeSequenceGroupName();
		 	ConfigUI.updateSeqGroupSequence();
		 	ConfigUI.toggleYellowBlanking();
		}

		ConfigUI.scrollUpDownVehPhase();
		ConfigUI.scrollUpDownSeqGroupDetail();


		$('#home').find('.manual-override').removeClass('disabled');		


	}, // end of initialize


	loadConfigMenuItems: function() {
	/**************************************/
	// CONFIG MENU OPTIONS

		// Sequence Group List
		$('#config-detail-home').find('.sequence-groups-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('seq-group-list') }, delayTime );		
		});	

		// Vehicle Phases / Timing
		$('#config-detail-home').find('.phase-timing').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('config-vehicle-phase-timing') }, delayTime );			
		});	

		// Ped Phases / Timing
		$('#config-detail-home').find('.ped-config').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('config-ped-phase-def') }, delayTime );
		});

		// Left Turn Permissive
		$('#config-detail-home').find('.left-turn-permissive').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('config-vehicle-phase-left') }, delayTime );			
		});

		// Dynamic Max Green
		$('#config-detail-home').find('.dynamic-max-green').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('config-dynamic-max-green') }, delayTime );			
		});							

		// Vehicle Detectors
		$('#config-detail-home').find('.veh-detector-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('config-vehicle-detectors') }, delayTime );			
		});	

		// Ped Detectors
		$('#config-detail-home').find('.ped-detector-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('config-ped-detectors') }, delayTime );			
		});		

		// Sequence Group List
		$('#config-detail-home').find('.sequence-groups-link').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('seq-group-list') }, delayTime );		
		});		


		$('#config-list').find('ul').on('mousedown','.copy-config',function() {
			if ($('#config-list').find('.content ul li').length < 32) {
				var configLoc = $(this).parent().attr('data-config-loc'); // location of config in array of configs
				ConfigUI.copyConfig(configLoc);			
			} else {
				// ignoring it based on the assumption that you can only create up to 32 configs
			}

			return false;
		});	

		$('#config-list').find('ul').on('mousedown','.delete-config',function() {
			if ($('#config-list').find('ul li').length == 1) {
				BaseUI.showNotificationModal('fail','Delete Not Allowed','At least one configuration is required.',true);	
			} else {
				if ($(this).hasClass('in-use')) {
					BaseUI.showNotificationModal('fail','Delete Not Allowed','This configuration is currently associated with a schedule.',true);	
				} else {
					configToDelete = $(this).parent().attr('data-config-loc'); // location of config in array of configs
					$('#config-list').find('.overlay.confirm-config-delete').show();
				}				
			}
			return false;
		});			


		$('#config-list').find('.overlay .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});


		$('#config-list').find('.overlay .set').on('mousedown',function() {
			ConfigUI.deleteConfig(configToDelete);
			BaseUI.resetOverlay();
		});

		$('#config-list').find('.page-up').on('mousedown',function() {
			ConfigUI.pageUpConfigList();
		});

		$('#config-list').find('.page-down').on('mousedown',function() {
			ConfigUI.pageDownConfigList();
		});

	},

/**************************************/
// 
	getFirstAvailableConfigId: function() {
		var configCount = allWorkingData.InSpire.m_controllerConfigurations.length;
		var confId = 0;
		for (var i = 0; i < configCount;  i++) {
			confId = allWorkingData.InSpire.m_controllerConfigurations[i].m_confId;
			if (i < (confId - 1)) {
				confId = i;
				break;
			}
		}
		if (confId == 0) {
			confId = configCount + 1;
		}
		confId = configCount + 1;
//		console.log('configCount is ' + configCount);
//		console.log('confId is ' + confId);
		return confId;
	},

	getNextAvailableConfigId: function() {
		var configCount = allWorkingData.InSpire.m_controllerConfigurations.length;
		var confIdArr = [];
		for (var i = 0; i < configCount;  i++) {
			confId = parseInt(allWorkingData.InSpire.m_controllerConfigurations[i].m_confId);
			confIdArr.push(confId);
		}
		confIdArr.sort(sortNumber);

		var highestConfId = confIdArr[confIdArr.length -1];

		if (configCount == highestConfId) {
			var availableId = highestConfId + 1;
		} else {
			for (var i = 0; i < configCount;  i++) {
				if((i + 1) < confIdArr[i]) {
					var availableId = i + 1;
					break;
				}
			}	
		}
		return availableId;	

		function sortNumber(a,b) {
			return a - b;
		}
	},

/**************************************/
// COPY CONFIG to New
	copyConfig: function(loc) {

		var newConfig = jQuery.extend(true, {}, allWorkingData.InSpire.m_controllerConfigurations[loc]);
		var newConfId = ConfigUI.getNextAvailableConfigId();

		newConfig.m_confId = newConfId;	
		newConfig.m_configurationName = newConfig.m_configurationName + ' Copy';

		// Doing this to prevent copying references
		var newConfigCopy = jQuery.extend(true, {}, newConfig);

		allWorkingData.InSpire.m_controllerConfigurations.push(newConfig);
		allPristineData.InSpire.m_controllerConfigurations.push(newConfigCopy);

		var configCount = allWorkingData.InSpire.m_controllerConfigurations.length;

		ConfigUI.loadConfigList();

	},


/**************************************/
// DELETE CONFIG 
	deleteConfig: function(loc) {
		allWorkingData.InSpire.m_controllerConfigurations.splice(loc,1);
		allPristineData.InSpire.m_controllerConfigurations.splice(loc,1);
		ConfigUI.loadConfigList();
		BaseUI.resetOverlay();
	},


/**************************************/
// SCROLL UP / DOWN - Vehicle Phases
	scrollUpDownVehPhase: function() {
		$('#config-vehicle-phase-timing').find('.page-down').on('mousedown',function() {
			var thisView = $('#config-vehicle-phase-timing');
			for (var i = 2; i < 9;  i++) {
				thisView.find('.current-settings:nth-child('+ i +')').hide();
			}	
			for (var i = 9; i < 10;  i++) {
				thisView.find('.current-settings:nth-child('+ i +')').show();
			}				
		});

		$('#config-vehicle-phase-timing').find('.page-up').on('mousedown',function() {
			var thisView = $('#config-vehicle-phase-timing');
			for (var i = 2; i < 9;  i++) {
				thisView.find('.current-settings:nth-child('+ i +')').show();
			}	
			for (var i = 9; i < 10;  i++) {
				thisView.find('.current-settings:nth-child('+ i +')').hide();
			}				
		});

	},

/**************************************/
// SCROLL UP / DOWN - Vehicle Phases
	scrollUpDownSeqGroupDetail: function() {
		$('#seq-group-detail').find('.page-down').on('mousedown',function() {
			var thisView = $('#seq-group-detail');
			for (var i = 3; i < 9;  i++) {
				thisView.find('.current-settings:nth-child('+ i +')').hide();
			}	
			for (var i = 10; i < 11;  i++) {
				thisView.find('.current-settings:nth-child('+ i +')').show();
			}	
		});

		$('#seq-group-detail').find('.page-up').on('mousedown',function() {
			var thisView = $('#seq-group-detail');
			for (var i = 3; i < 9;  i++) {
				thisView.find('.current-settings:nth-child('+ i +')').show();
			}	
			for (var i = 10; i < 11;  i++) {
				thisView.find('.current-settings:nth-child('+ i +')').hide();
			}				
		});

	},	

/**************************************/
// UPDATE HOME WITH LINK TO ACTIVE CCONFIG

	setActiveConfig: function(loc,configName) {
		var home = $('#home');		
			home.find('.current-config')
				.attr({
  					'data-loc': loc,
				}).find('span').text(configName);
		$('#home').find('.current-config').removeClass('disabled');
		$('#home').find('.base-config').removeClass('disabled');				
	},

/**************************************/
// MARK ITEM ON CONFIG LIST THE ACTIVE ONE

	identifyActiveConfigOnList: function(loc) {
		var thisView = $('#config-list')
		thisView.find('.content ul li').removeClass('active');
		thisView.find('.content ul li:eq('+ loc +')').addClass('active');	
	},

/**************************************/
// LOAD CONFIGURATION LIST

	loadConfigList: function() {
		var configListContainer = $('#config-list').find('.content ul');
		configListContainer.empty();
		var configListLen = allWorkingData.InSpire.m_controllerConfigurations.length;
		var markup = '';
		var liClass = '';
		for (var i = 0; i < configListLen;  i++) {
			var confName = allWorkingData.InSpire.m_controllerConfigurations[i].m_configurationName;
			var confId = allWorkingData.InSpire.m_controllerConfigurations[i].m_confId;
			if (ScheduleUI.isConfigOnSchedule(confId)) {
				var delMarkup = '<span class=\'delete-config in-use\'>Delete</span>';
				liClass = liClass + 'hide scheduled-config';
			} else {
				var delMarkup = '<span class=\'delete-config\'>Delete</span>';
				liClass = 'hide';
			}
			markup = markup + "<li class=\'" + liClass + "\'><a data-config-loc=\'" + i +"\'><span class=\'conf-id\'>"+confId+"</span><span class=\'conf-name\'>" + confName + "</span><span class=\'status\'></span>" + delMarkup + "<span class=\'copy-config\'>Copy</span></a></li>";
		}
		configListContainer.empty().append(markup).bind('mousedown mouseup click');		
		if (configListLen >= 25 && configListLen <= 32) {
			// for (var j = 25; j < configListLen;  j++) {
				$('#config-list').find('.content ul li:nth-child(25)').removeClass('hide');	
				$('#config-list').find('.content ul li:nth-child(26)').removeClass('hide');	
				$('#config-list').find('.content ul li:nth-child(27)').removeClass('hide');	
				$('#config-list').find('.content ul li:nth-child(28)').removeClass('hide');	
				$('#config-list').find('.content ul li:nth-child(29)').removeClass('hide');	
				$('#config-list').find('.content ul li:nth-child(30)').removeClass('hide');					
				$('#config-list').find('.content ul li:nth-child(31)').removeClass('hide');	
				$('#config-list').find('.content ul li:nth-child(32)').removeClass('hide');	
			// }
		} else if (configListLen >= 17 && configListLen < 25) {
			for (var j = 17; j < 25;  j++) {
				$('#config-list').find('.content ul li:nth-child('+j+')').removeClass('hide');				
			}
		} else if (configListLen >= 9 && configListLen < 17) {
			for (var j = 9; j < 17;  j++) {
				$('#config-list').find('.content ul li:nth-child('+j+')').removeClass('hide');				
			}						
		} else if (configListLen >= 1 && configListLen < 9) {
			for (var j = 1; j < 9;  j++) {
				$('#config-list').find('.content ul li:nth-child('+j+')').removeClass('hide');				
			}
		}




		$('#home').find('.base-config').removeClass('disabled');

		ManualUI.selectConfigOverride();		
		ManualUI.setConfigOverride();	

	},

	pageUpConfigList: function() {
		
		if ($('#config-list').find('.content ul li:nth-child(1)').is(':visible')) {
			$('#config-list').find('.content ul li').addClass('hide');
			$('#config-list').find('.content ul li:nth-child(1)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(2)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(3)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(4)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(5)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(6)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(7)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(8)').removeClass('hide');

		} else if ($('#config-list').find('.content ul li:nth-child(9)').is(':visible')) {
			$('#config-list').find('.content ul li').addClass('hide');
			$('#config-list').find('.content ul li:nth-child(1)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(2)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(3)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(4)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(5)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(6)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(7)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(8)').removeClass('hide');

		 } else if ($('#config-list').find('.content ul li:nth-child(17)').is(':visible')) {
		 	$('#config-list').find('.content ul li').addClass('hide');
			$('#config-list').find('.content ul li:nth-child(9)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(10)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(11)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(12)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(13)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(14)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(15)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(16)').removeClass('hide');

		 } else if ($('#config-list').find('.content ul li:nth-child(25)').is(':visible')) {
			$('#config-list').find('.content ul li:nth-child(17)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(18)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(19)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(20)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(21)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(22)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(23)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(24)').removeClass('hide');
		}
	},

	pageDownConfigList: function() {
		var configLen = $('#config-list').find('.content ul li').length;
		if ($('#config-list').find('.content ul li:nth-child(1)').is(':visible') && configLen > 8) {
			$('#config-list').find('.content ul li').addClass('hide');
			$('#config-list').find('.content ul li:nth-child(9)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(10)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(11)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(12)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(13)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(14)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(15)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(16)').removeClass('hide');

		} else if ($('#config-list').find('.content ul li:nth-child(9)').is(':visible') && configLen > 16) {
			$('#config-list').find('.content ul li').addClass('hide');
			$('#config-list').find('.content ul li:nth-child(17)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(18)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(19)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(20)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(21)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(22)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(23)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(24)').removeClass('hide');

		 } else if ($('#config-list').find('.content ul li:nth-child(17)').is(':visible') && configLen > 24) {
		 	$('#config-list').find('.content ul li').addClass('hide');
			$('#config-list').find('.content ul li:nth-child(25)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(26)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(27)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(28)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(29)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(30)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(31)').removeClass('hide');
			$('#config-list').find('.content ul li:nth-child(32)').removeClass('hide');
		}
	},	

/**************************************/
// ADD TO CONFIGURATION LIST

	addToConfigList: function() {
		var configListContainer = $('#config-list').find('.content ul');

		var configListLen = allWorkingData.InSpire.m_controllerConfigurations.length;
		var markup = '';
		var confName = 'Default';
		markup = markup + "<li><a data-config-loc=\'" + configListLen +"\'><span>" + confName + "</span><span class=\'status\'></span></a></li>";

		configListContainer.append(markup).bind('mousedown mouseup click');


		ManualUI.selectConfigOverride();		
		ManualUI.setConfigOverride();	

	},

/**************************************/
// LOAD CONFIGURATION INFO

	emptyConfigShell: function() {
		$('.panel.config .current-settings').each(function() {
			if ($(this).hasClass('header')) {
				// ignore
			} else {
				$(this).find('.values ul').empty();
			}
		});
		$('.panel.preempt .current-settings').each(function() {
			if ($(this).hasClass('header')) {
				// ignore
			} else {
				$(this).find('.values ul').empty();
			}
		});		
	},


	// LOADS CONFIG INFO USING CONFIG ID LOCATION IN ARRAY
	loadConfigInfo: function(loc) {

		var vehiclePhaseLen = allWorkingData.InSpire.m_controllerConfigurations[loc].m_vehiclePhase.length;

		for (var i = 0; i <  vehiclePhaseLen; i++) {

			ConfigUI.getStartupVehicleEnabled(loc,i);
			ConfigUI.getOneCallVeh(loc,i);
			ConfigUI.getPhaseTimingRecall(loc,i);
			ConfigUI.getMinGreenTiming(loc,i);
			ConfigUI.getMaxGreenTiming(loc,i);
			ConfigUI.getPassageTime(loc,i);
			ConfigUI.getRedTiming(loc,i);
			ConfigUI.getYellowTiming(loc,i);
			ConfigUI.getDynamicMaxGreenEnabled(loc,i);
			ConfigUI.getDynamicMaxGreenMaxGreen(loc,i);
			ConfigUI.getDynamicMaxGreenAdjustmentUp(loc,i);
			ConfigUI.getDynamicMaxGreenAdjustmentDown(loc,i);

			ConfigUI.getLeftTurnPermissiveStartPhase(loc,i);
			ConfigUI.getLeftTurnPermissiveFlashingOutput(loc,i);
			ConfigUI.getOpposingThruPhase(loc,i);
			ConfigUI.getLeftTurnMode(loc,i);
			ConfigUI.getYellowBlanking(loc,i);

		}	

		var overlapLen = allWorkingData.InSpire.m_controllerConfigurations[loc].m_overlap.length;

		for (var i = 0; i <  overlapLen; i++) {
			ConfigUI.getOverlapNumber(loc,i);
			ConfigUI.getOverlapType(loc,i);
			ConfigUI.getOverlapChannel(loc,i);
			ConfigUI.getOverlapMinGreen(loc,i);
			ConfigUI.getOverlapExtendGreen(loc,i);
			ConfigUI.getOverlapYellowTiming(loc,i);
			ConfigUI.getOverlapRedTiming(loc,i);
		}

		var pedPhaseLen = allWorkingData.InSpire.m_controllerConfigurations[loc].m_pedPhase.length;

		for (var i = 0; i <  pedPhaseLen; i++) {

			ConfigUI.getPedPhaseNumber(loc,i);

			ConfigUI.getStartupPedEnabled(loc,i);
			ConfigUI.getOneCallPed(loc,i);
			ConfigUI.getPedWalkTiming(loc,i);
			ConfigUI.getPedClearTiming(loc,i);
			ConfigUI.getPedNonActuated(loc,i);
			ConfigUI.getPedRestInWalk(loc,i);
			ConfigUI.getPedClearYellow(loc,i);


		}	

		var vehDetectorLen = allWorkingData.InSpire.m_controllerConfigurations[loc].m_vehDetector.length;

		for (var i = 0; i <  vehDetectorLen; i++) {
			ConfigUI.getVehDetectors(loc,i);
			ConfigUI.getVehDetectorsLock(loc,i);
			ConfigUI.getVehDetectorsCall(loc,i);
			ConfigUI.getVehDetectorsDelay(loc,i);
			ConfigUI.getVehDetectorsExtend(loc,i);
			ConfigUI.getVehDetectorsStuckOn(loc,i);
			ConfigUI.getVehDetectorsStuckOff(loc,i);
			ConfigUI.getVehDetectorsPhaseAssignment(loc,i);

		}		

		var pedDetectorLen = allWorkingData.InSpire.m_controllerConfigurations[loc].m_pedDetector.length;

		for (var i = 0; i <  pedDetectorLen; i++) {
			ConfigUI.getPedDetectors(loc,i);
			ConfigUI.getPedDetectorPhase(loc,i);
		}

		if (pedDetectorLen > 8) {
			BaseUI.showFirstEightOnly('config-ped-detectors');
		}

		var seqGroupLen = allWorkingData.InSpire.m_controllerConfigurations[loc].m_sequenceGroup.length;

		ConfigUI.emptySeqeuenceGroupList();
		for (var i = 0; i <  seqGroupLen; i++) {
			ConfigUI.getSequenceGroupList(loc,i);
		}	



	},

	updateConfigNameDisplayed: function(name,isActive) {
		if (isActive) {
			$('#intersection-status-view').find('.configuration-name-frame span').text(name);
			$('#status-detectors').find('.configuration-name-frame span').text(name);
		} else {
			$('.panel .configuration-name-frame span').text(name);
		}
	},




/**************************************/
// CHANGE CONFIGURATION NAME 

	changeConfigurationName: function() {
		$('#config-detail-home').find('.configuration-name-edit').on('mousedown',function() {
			var thisObj = $(this);
			var configurationName = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_configurationName;
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit Configuration Name');
			thisView.find('.item-to-change').val('configuration-name');
			thisView.find('.current-text').val(configurationName);
			thisView.find('.current-entry').text(configurationName + '_');
			thisView.find('.go-straight-back').attr('data-panel','config-detail-home');
			BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},	

/**************************************/
// VEHICLE PHASE NUMBER for HEADERS (CONFIG AND PREEMPTS ONLY) 	

	 getVehiclePhaseNumber: function(phase) {
		var thisDir = 'dir-' + BaseUI.translateMovement(allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phase]);
		var thisStartup = allWorkingData.InSpire.m_phaseInitialization.m_vehDriverInit[phase];
		var thisLight = BaseUI.translateVehicleStartup(thisStartup - 1);
		var markup = '<li class=\'has-phase has-popup\'><div class=' + thisDir +'><span>' + (phase + 1) + '</span><span class="startup ' + thisLight + '"></span></div></li>';

		$('#config-vehicle-phase-timing').find('.vehicle.phase ul').append(markup);
		$('#config-dynamic-max-green').find('.vehicle.phase ul').append(markup);
		$('#config-vehicle-phase-left').find('.vehicle.phase ul').append(markup);	
		$('#config-timed-overlap').find('.vehicle.phase ul').append(markup);	
		$('#seq-group-state-def').find('.vehicle.phase ul').append(markup);	
	},

/**************************************/
// PED PHASE NUMBER for HEADERS 		

	getPedPhaseNumber: function(config,phase) {
		var markup = '<li class=\'has-phase\'><div><span>' + allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_phaseNum + '</span></div></li>';
		$('#config-vehicle-phase-def').find('.ped.phase ul').append(markup);
		$('#config-ped-phase-def').find('.ped.phase ul').append(markup);	
	},




/**************************************/
// CONVERT CONFIG ID TO CONFIG LOCATION IN ARRAY 	

	convertConfigIdToLoc: function(id) {
			var configLoc = 0;
			var configListLen = allWorkingData.InSpire.m_controllerConfigurations.length;
			for (var i = 0; i < configListLen;  i++) {
				if (allWorkingData.InSpire.m_controllerConfigurations[i].m_confId == id) {	
					configLoc = i;
				}
			}
			return configLoc;
	},


/**************************************/
// LOAD SEQUENCE GROUP LIST

	updateSeqGroupTitle: function(text) {
		$('#seq-group-detail').find('.title span').text('Sequence Group: '  + text);
	},

/**************************************/
// DYNAMIC MAX GREEN TIMING - Enabled

	toggleDynamicMaxGreenEnabled: function() {
		$('#config-dynamic-max-green').find('.current-settings.enabled .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			if (thisObj.hasClass('on')) {
				ConfigUI.setDynamicMaxGreenEnabled(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setDynamicMaxGreenEnabled(loadedConfig,thisIndex,true);
			}
			ConfigUI.updDynamicMaxGreenEnabled(loadedConfig,thisIndex);
		});		
	},

	setDynamicMaxGreenEnabled: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_enabled = value;
	},

	htmlDynamicMaxGreenEnabled: function(val,isDiff) {
		var thisClass = 'switch';
		if (val) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\'' + thisClass + '\'\></li>';
		return markup;
 	},				

	updDynamicMaxGreenEnabled: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_enabled;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_enabled;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-dynamic-max-green').find('.current-settings.enabled ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlDynamicMaxGreenEnabled(isEnabled,isDiff));	
	},

	getDynamicMaxGreenEnabled: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_enabled;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_enabled;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-dynamic-max-green').find('.current-settings.enabled ul').append(ConfigUI.htmlDynamicMaxGreenEnabled(isEnabled,isDiff));	
	},

/**************************************/
// DYNAMIC MAX GREEN TIMING - Max Dynamic Max

	getDynamicMaxGreenMaxGreen: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_maxDynamicMaxGreenTimeSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_maxDynamicMaxGreenTimeSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-dynamic-max-green').find('.max-green ul').append(ConfigUI.htmlDynamicMaxMaxGreen(thisTiming,isDiff));



	},

	updDynamicMaxMaxGreen: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_maxDynamicMaxGreenTimeSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_maxDynamicMaxGreenTimeSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase]);

		var	errorObj = VehValidator.CheckDynamicGreenMax();    
        	$('#config-dynamic-max-green').find('.current-settings.max-green ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlDynamicMaxMaxGreen(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));

	},

	setDynamicMaxMaxGreen: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_maxDynamicMaxGreenTimeSec = parseInt(value);
	},

	htmlDynamicMaxMaxGreen: function(val,isDiff,isError,errMsg) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}		
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},

/**************************************/
// DYNAMIC MAX GREEN TIMING - Adjustment Step Up

	getDynamicMaxGreenAdjustmentUp: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepUpSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepUpSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-dynamic-max-green').find('.adjustment-step-up ul').append(ConfigUI.htmlDynamicMaxAdjustmentStepUp(thisTiming,isDiff));
	},	

	setDynamicMaxAdjustmentStepUp: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepUpSec = parseInt(value);
	},

	updDynamicMaxAdjustmentStepUp: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepUpSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepUpSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase]);

		var	errorObj = VehValidator.CheckDynamicGreenAdjustStep();    
        	$('#config-dynamic-max-green').find('.current-settings.adjustment-step-up ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlDynamicMaxAdjustmentStepUp(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlDynamicMaxAdjustmentStepUp: function(val,isDiff,isError,errMsg) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}		
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},


/**************************************/
// DYNAMIC MAX GREEN TIMING - Adjustment Step Down

	getDynamicMaxGreenAdjustmentDown: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepDownSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepDownSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-dynamic-max-green').find('.adjustment-step-down ul').append(ConfigUI.htmlDynamicMaxAdjustmentStepDown(thisTiming,isDiff));
	},	

	setDynamicMaxAdjustmentStepDown: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepDownSec = parseInt(value);
	},

	updDynamicMaxAdjustmentStepDown: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepDownSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase].m_adjustStepDownSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_dynamicMax[phase]);

		var	errorObj = VehValidator.CheckDynamicGreenAdjustStep();    
        	$('#config-dynamic-max-green').find('.current-settings.adjustment-step-down ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlDynamicMaxAdjustmentStepDown(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlDynamicMaxAdjustmentStepDown: function(val,isDiff,isError,errMsg) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}		
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},

	changeDynamicMaxGreenTiming: function() {

		var thisView = $('#config-dynamic-max-green');

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
			if (thisObj.parents('.current-settings').hasClass('max-green')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Max Green:');
				thisView.find('.overlay.timing .new-timing label').text('New Max Green:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('max-green');
			} else if (thisObj.parents('.current-settings').hasClass('adjustment-step-up')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Adjustment Step Up:');
				thisView.find('.overlay.timing .new-timing label').text('New Adjustment Step Up:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('adjustment-step-up');
			} else if (thisObj.parents('.current-settings').hasClass('adjustment-step-down')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Adjustment Step Down:');
				thisView.find('.overlay.timing .new-timing label').text('New Adjustment Step Down:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('adjustment-step-down');
			} 

		 	thisView.find('.overlay.timing .message').text(thisObj.attr('data-msg')).removeClass('error');
			 if (thisObj.hasClass('error')) {
			 	thisView.find('.overlay.timing .message').addClass('error');
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
			var curVal = parseInt(thisView.find('.overlay.timing #value-entered').val()) * 1;
			if (curVal !== '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'max-green') {
					ConfigUI.setDynamicMaxMaxGreen(loadedConfig,curPhase,curVal);
					ConfigUI.updDynamicMaxMaxGreen(loadedConfig,curPhase);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'adjustment-step-up') {
					ConfigUI.setDynamicMaxAdjustmentStepUp(loadedConfig,curPhase,curVal);
					ConfigUI.updDynamicMaxAdjustmentStepUp(loadedConfig,curPhase);
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'adjustment-step-down') {
					ConfigUI.setDynamicMaxAdjustmentStepDown(loadedConfig,curPhase,curVal);
					ConfigUI.updDynamicMaxAdjustmentStepDown(loadedConfig,curPhase);
				}
				$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');					
			}
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {	
			BaseUI.resetOverlay();
		});	

	},


	getOverlapNumber: function(config,phase) {
		$('#config-standard-overlap').find('.current-settings.overlap.phase .values  ul').append('<li class=\'has-phase\'><div><span>' + (phase + 1) + '</span></div></li>');
		$('#config-timed-overlap').find('.current-settings.overlap.phase .values  ul').append('<li class=\'has-phase\'><div><span>' + (phase + 1) + '</span></div></li>');
	},

	getOverlapType: function(config,phase) {
		var thisClass = BaseUI.translateOverlapType(allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_type);
		$('#config-timed-overlap').find('.current-settings.type .values ul').append('<li class=' + thisClass + ' data-overlap-type=' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_type + '><span></span></li>');
	},

	getOverlapChannel: function(config,phase) {
		$('#config-timed-overlap').find('.current-settings.channel .values ul').append('<li class=\'has-popup\'><span> ' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_outputChannel + '</span></li>');
	},

	getOverlapMinGreen: function(config,phase) {
		$('#config-timed-overlap').find('.current-settings.min-green-timing .values ul').append('<li class=\'has-popup\'><span> ' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_minGreenTiming + '</span></li>');
	},	

	getOverlapExtendGreen: function(config,phase) {
		$('#config-timed-overlap').find('.current-settings.extend-green .values ul').append('<li class=\'has-popup\'><span> ' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_extendGreen + '</span></li>');
	},		

	getOverlapYellowTiming: function(config,phase) {
		$('#config-timed-overlap').find('.current-settings.yellow-timing .values ul').append('<li class=\'has-popup\'><span> ' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_yellowTiming + '</span></li>');
	},	

	getOverlapRedTiming: function(config,phase) {
		$('#config-timed-overlap').find('.current-settings.red-timing .values ul').append('<li class=\'has-popup\'><span> ' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_redTiming + '</span></li>');
	},	






/**************************************/
// VEHICLE DETECTORS - Enable Call on Failure

	getVehDetectorsCall: function(config,detector) {
		var markup = '';
		var isTriggerOnFailure = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_triggerOnFailure;
		if (isTriggerOnFailure) {
			markup = '<li class=\'switch on\'\></li>';
		} else {
			markup = '<li class=\'switch\'\></li>';
		}
		$('#config-vehicle-detectors').find('.enable-call ul').append(markup);
	},	





	selectConfigToLoad: function() {
		$('#config-list').find('.content').on('mousedown','li',function() {
			var thisObj = $(this);
			configLoc = thisObj.find('a').attr('data-config-loc');

			BaseUI.addInverse(thisObj);
			ConfigUI.emptyConfigShell();
			ConfigUI.loadConfigInfo(configLoc);

			ConfigUI.updateConfigNameDisplayed(ConfigUI.getConfigNameByLoc(configLoc),false);
			loadedConfig = configLoc;
			
			$('#config-detail-home').find('.bottom-strip .go-back').attr('data-panel','config-list');
			setTimeout(function() { BaseUI.switchPanel('config-detail-home') }, delayTime );	
		});		
	},



/****************************************************/
// VEHICLE PHASE STARTUP ENABLED

	getStartupVehicleEnabled: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_enabled;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_enabled;

		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-vehicle-phase-timing').find('.vehicle-enabled ul').append(ConfigUI.htmlStartupVehicleEnabled(isEnabled,isDiff));
	}, 

	htmlStartupVehicleEnabled: function(isEnabled, isDiff) {
		var thisClass = 'switch';
		var markup = '';		

		if (isEnabled) {
			thisClass = thisClass + ' on';
		} 
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		markup = '<li class=\''+ thisClass +'\'\></li>';
		return markup;
	},

	setStartupVehicleEnabled: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_enabled = value;
	},

	updStartupVehicleEnabled: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_enabled;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_enabled;
		console.log(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		console.log(allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);		
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-vehicle-phase-timing').find('.vehicle-enabled ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlStartupVehicleEnabled(isEnabled,isDiff));
	},	

	toggleVehicleEnabled: function() {
		$('#config-vehicle-phase-timing').find('.current-settings.vehicle-enabled .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();

			if (thisObj.hasClass('on')) {
				ConfigUI.setStartupVehicleEnabled(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setStartupVehicleEnabled(loadedConfig,thisIndex,true);
			}		
			ConfigUI.updStartupVehicleEnabled(loadedConfig,thisIndex);
		});
	},	


/****************************************************/
// VEHICLE ONE CALL ON STARTUP

	getOneCallVeh: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_initOneCall;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_initOneCall;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-vehicle-phase-timing').find('.one-call ul').append(ConfigUI.htmlOneCallVeh(isEnabled,isDiff));
	}, 

	htmlOneCallVeh: function(isEnabled, isDiff) {
		var thisClass = 'switch';
		var markup = '';		

		if (isEnabled) {
			thisClass = thisClass + ' on';
		} 
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		markup = '<li class=\''+ thisClass +'\'\></li>';
		return markup;
	},

	setOneCallVeh: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_initOneCall = value;
	},

	updOneCallVeh: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_initOneCall;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_initOneCall;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-vehicle-phase-timing').find('.one-call ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlOneCallVeh(isEnabled,isDiff));
	},	

	toggleOneCallVeh: function() {
		$('#config-vehicle-phase-timing').find('.current-settings.one-call .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();

			if (thisObj.hasClass('on')) {
				ConfigUI.setOneCallVeh(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setOneCallVeh(loadedConfig,thisIndex,true);
			}		
			ConfigUI.updOneCallVeh(loadedConfig,thisIndex);
		});
	},	



/****************************************************/
// PED PHASE STARTUP ENABLED

	getStartupPedEnabled: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_enabled;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_enabled;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-ped-phase-def').find('.ped-enabled ul').append(ConfigUI.htmlStartupPedEnabled(isEnabled,isDiff));	
	}, 

	htmlStartupPedEnabled: function(isEnabled,isDiff) {
		var thisClass = 'switch';
		var markup = '';		

		if (isEnabled) {
			thisClass = thisClass + ' on';
		} 
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		markup = '<li class=\''+ thisClass +'\'\></li>';
		return markup;
	},

	setStartupPedEnabled: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_enabled = value;
	},

	updStartupPedEnabled: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_enabled;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_enabled;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-ped-phase-def').find('.ped-enabled ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlStartupVehicleEnabled(isEnabled,isDiff));
	},		

	togglePedEnabled: function() {
		$('#config-ped-phase-def').find('.current-settings.ped-enabled .values ul').on('mousedown','li',function() {

			var thisObj = $(this);
			var thisIndex = thisObj.index();

			if (thisObj.hasClass('on')) {
				ConfigUI.setStartupPedEnabled(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setStartupPedEnabled(loadedConfig,thisIndex,true);
			}
			ConfigUI.updStartupPedEnabled(loadedConfig,thisIndex);
		});
	},


/****************************************************/
// PED ONE CALL ON STARTUP

	getOneCallPed: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_initOneCall;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_initOneCall;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-ped-phase-def').find('.one-call ul').append(ConfigUI.htmlOneCallPed(isEnabled,isDiff));
	}, 

	htmlOneCallPed: function(isEnabled, isDiff) {
		var thisClass = 'switch';
		var markup = '';		

		if (isEnabled) {
			thisClass = thisClass + ' on';
		} 
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		markup = '<li class=\''+ thisClass +'\'\></li>';
		return markup;
	},

	setOneCallPed: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_initOneCall = value;
	},

	updOneCallPed: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_initOneCall;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_initOneCall;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-ped-phase-def').find('.one-call ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlOneCallPed(isEnabled,isDiff));
	},	

	toggleOneCallPed: function() {
		$('#config-ped-phase-def').find('.current-settings.one-call .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();

			if (thisObj.hasClass('on')) {
				ConfigUI.setOneCallPed(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setOneCallPed(loadedConfig,thisIndex,true);
			}		
			ConfigUI.updOneCallPed(loadedConfig,thisIndex);
		});
	},	

/****************************************************/


	cyclePhaseTimingRecall: function() {
		$('#config-vehicle-phase-timing').find('.current-settings.recall .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			var thisRecall = parseInt(thisObj.attr('data-recall-value'));
			if (thisRecall == 3) {
				thisRecall = 0;
			} else {
				thisRecall = parseInt(thisRecall + 1);
			}
			
			ConfigUI.setPhaseTimingRecall(loadedConfig,thisIndex,thisRecall);
			ConfigUI.updPhaseTimingRecall(loadedConfig,thisIndex);
		});
	},

	setPhaseTimingRecall: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_recall = parseInt(value);
	},

	getPhaseTimingRecall: function(config,phase) {
		var thisRecall = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_recall;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_recall;
		var isDiff = false;
		if (thisRecall != originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-phase-timing').find('.recall ul').append(ConfigUI.htmlPhaseTimingRecall(thisRecall,isDiff));
	},	

	updPhaseTimingRecall: function(config,phase) {
		var thisRecall = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_recall;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_recall;
		var isDiff = false;
		if (thisRecall != originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-phase-timing').find('.recall ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlPhaseTimingRecall(thisRecall,isDiff));
	},	

	htmlPhaseTimingRecall: function(recallVal,isDiff) {
		var thisClass = BaseUI.translateRecall(recallVal);
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li data-recall-value=\''+recallVal+'\' class=\''+thisClass+'\'><div><span></span></div></li>';
		return markup;
	},

/****************************************************/
// KEYPAD FOR THE VEHICLE TIMING VIEW

	changeVehiclePhaseTiming: function() {

		var thisView = $('#config-vehicle-phase-timing');

		thisView.find('.current-settings.keypad .values ul').on('mousedown','li',function() {
			$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
			$('.overlay.timing .keypad li.disabled').removeClass('disabled');
			$('.config-vehicle-phase-timing .overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
			var thisObj = $(this);
			var thisTiming = thisObj.parents('.current-settings').attr('class');
			var thisVal = thisObj.find('span').text();
			var thisPhase = thisObj.index();
			thisView.find('.overlay.timing .has-phase div').empty();
			thisView.find('.current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo($('.config-vehicle-phase-timing .overlay.timing .has-phase div'));
			thisView.find('.overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
			thisView.find('.overlay.timing .current-timing-entry .value span').text(thisVal);
			if (thisObj.parents('.current-settings').hasClass('max-green-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Max Green Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Max Green Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('max-green-timing');
			} else if (thisObj.parents('.current-settings').hasClass('min-green-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Min Green Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Min Green Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('min-green-timing');
			} else if (thisObj.parents('.current-settings').hasClass('yellow-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Yellow Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Yellow Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('yellow-timing');
				thisView.find('.overlay.timing .keypad li:nth-child(10)').css('visibility','visible');
			} else if (thisObj.parents('.current-settings').hasClass('red-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Red Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Red Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('red-timing');
				thisView.find('.overlay.timing .keypad li:nth-child(10)').css('visibility','visible');						
			} else if (thisObj.parents('.current-settings').hasClass('passage-time')){
				thisView.find('.overlay.timing li[data-keypad-num=\'.\']').css('visibility','visible');											
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Passage Time:');
				thisView.find('.overlay.timing .new-timing label').text('New Passage Time:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('passage-time');
				thisView.find('.overlay.timing .keypad li:nth-child(10)').css('visibility','visible');
			}	

		 	thisView.find('.overlay.timing .message').text(thisObj.attr('data-msg')).removeClass('error');
			 if (thisObj.hasClass('error')) {
			 	thisView.find('.overlay.timing .message').addClass('error');
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
			if (curVal !== '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'min-green-timing') {
					ConfigUI.setMinGreenTiming(loadedConfig,curPhase,curVal);
					ConfigUI.updMinGreenTiming(loadedConfig,curPhase);
					// recheck related settings
					ConfigUI.updMaxGreenTiming(loadedConfig,curPhase);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'max-green-timing') {
					ConfigUI.setMaxGreenTiming(loadedConfig,curPhase,curVal);
					ConfigUI.updMaxGreenTiming(loadedConfig,curPhase);
					// recheck related settings
					ConfigUI.updMinGreenTiming(loadedConfig,curPhase);	
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'yellow-timing') {
					curVal = curVal * 10;
					ConfigUI.setYellowTiming(loadedConfig,curPhase,curVal);
					ConfigUI.updYellowTiming(loadedConfig,curPhase);
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'red-timing') {
					curVal = curVal * 10;
					ConfigUI.setRedTiming(loadedConfig,curPhase,curVal);
					ConfigUI.updRedTiming(loadedConfig,curPhase);
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'passage-time') {
					curVal = curVal * 10;
					ConfigUI.setPassageTime(loadedConfig,curPhase,curVal);
					ConfigUI.updPassageTime(loadedConfig,curPhase);
				}	
			}
							
			$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
			BaseUI.resetOverlay();
		});

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});	

	},

/****************************************************/

	// getPhaseTimingMinGreen: function(config,phase) {
	// 	var markup = '<li class=\'has-popup\'><span>' + allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_minGreenTimingSec + '</span></li>';
	// 	$('#config-vehicle-phase-timing').find('.min-green-timing ul').append(markup);
	// },


	setMinGreenTiming: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_minGreenTimingSec = parseInt(value);
	},

	getMinGreenTiming: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_minGreenTimingSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_minGreenTimingSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-phase-timing').find('.current-settings.min-green-timing ul').append(ConfigUI.htmlMinGreenTiming(thisTiming,isDiff));
	},

	updMinGreenTiming: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_minGreenTimingSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_minGreenTimingSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);

        var errorObj = VehValidator.CheckGreenTimingMin();
            $('#config-vehicle-phase-timing').find('.current-settings.min-green-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlMinGreenTiming(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlMinGreenTiming: function(val,isDiff,isError,errMsg) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}		
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},

/****************************************************/

	setMaxGreenTiming: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_maxGreenTimingSec = parseInt(value);
	},

	getMaxGreenTiming: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_maxGreenTimingSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_maxGreenTimingSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}		
		$('#config-vehicle-phase-timing').find('.max-green-timing ul').append(ConfigUI.htmlMaxGreenTiming(thisTiming,isDiff));
	},

	updMaxGreenTiming: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_maxGreenTimingSec);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_maxGreenTimingSec);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}		

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);

		var	errorObj = VehValidator.CheckGreenTimingMax();    
        	$('#config-vehicle-phase-timing').find('.current-settings.max-green-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlMaxGreenTiming(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlMaxGreenTiming: function(val,isDiff,isError,errMsg) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}		
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},	

/****************************************************/

	setYellowTiming: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowTimingTenthSec = parseInt(value);
	},

	getYellowTiming: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowTimingTenthSec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowTimingTenthSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}	
		$('#config-vehicle-phase-timing').find('.yellow-timing ul').append(ConfigUI.htmlYellowTiming(thisTiming),isDiff);
	},

	updYellowTiming: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowTimingTenthSec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowTimingTenthSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}		

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);

		var	errorObj = VehValidator.CheckYellowTiming();    
        	$('#config-vehicle-phase-timing').find('.current-settings.yellow-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlYellowTiming(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlYellowTiming: function(val,isDiff,isError,errMsg) {
		val = parseFloat(val/10).toFixed(1);
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}		
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},	

/****************************************************/

	setRedTiming: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_redTimingTenthSec = parseInt(value);
	},

	getRedTiming: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_redTimingTenthSec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_redTimingTenthSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-phase-timing').find('.red-timing ul').append(ConfigUI.htmlRedTiming(thisTiming,isDiff));
	},	

	updRedTiming: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_redTimingTenthSec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_redTimingTenthSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);

		var	errorObj = VehValidator.CheckRedTiming();    
        	$('#config-vehicle-phase-timing').find('.current-settings.red-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlYellowTiming(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlRedTiming: function(val,isDiff,isError,errMsg) {
		val = parseFloat(val/10).toFixed(1);
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}		
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},	

/****************************************************/

	setPassageTime: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_passageTimeTenthSec = parseInt(value);
	},

	getPassageTime: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_passageTimeTenthSec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_passageTimeTenthSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}	
		$('#config-vehicle-phase-timing').find('.passage-time ul').append(ConfigUI.htmlPassageTime(thisTiming,isDiff));
	},

	updPassageTime: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_passageTimeTenthSec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_passageTimeTenthSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}	

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);

		var	errorObj = VehValidator.CheckPassageTime();    
        	$('#config-vehicle-phase-timing').find('.current-settings.passage-time ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlPassageTime(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlPassageTime: function(val,isDiff,isError,errMsg) {
		val = parseFloat(val/10).toFixed(1);
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}		
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},			

/****************************************************/

			



/****************************************************/

	changeLeftTurnPermissive: function() {

		var thisView = $('#config-vehicle-phase-left');

		thisView.find('.current-settings.keypad .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			if (!thisObj.hasClass('not-available')) {
				$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
				thisView.find('.overlay.timing .keypad li.disabled').removeClass('disabled');
				$('.config-vehicle-phase-left .overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
				var thisTiming = thisObj.parents('.current-settings').attr('class');
				var thisVal = thisObj.find('span').text();
				var thisPhase = thisObj.index();
				thisView.find('.overlay.timing .has-phase div').empty();
				thisView.find('.current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo(thisView.find('.overlay.timing .has-phase div'));
				thisView.find('.overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
				thisView.find('.overlay.timing .current-timing-entry .value span').text(thisVal);
				if (thisObj.parents('.current-settings').hasClass('permissive-start')){
					thisView.find('.overlay.timing .current-timing-entry label').text('Current Permissive Start:');
					thisView.find('.overlay.timing .new-timing label').text('New Permissive Start:');
					thisView.find('.overlay.timing .new-timing .value span').text('_');
					thisView.find('.overlay.timing #item-to-update').val('permissive-start');
				} else if (thisObj.parents('.current-settings').hasClass('flashing-output')){
					thisView.find('.overlay.timing .current-timing-entry label').text('Current Flashing Output:');
					thisView.find('.overlay.timing .new-timing label').text('New Flashing Output:');
					thisView.find('.overlay.timing .new-timing .value span').text('_');
					thisView.find('.overlay.timing #item-to-update').val('flashing-output');
				} else if (thisObj.parents('.current-settings').hasClass('opposing-thru-phase')){
					thisView.find('.overlay.timing .current-timing-entry label').text('Current Opposing Thru Phase:');
					thisView.find('.overlay.timing .new-timing label').text('New Opposing Thru Phase:');
					thisView.find('.overlay.timing .new-timing .value span').text('_');
					thisView.find('.overlay.timing #item-to-update').val('opposing-thru-phase');
				} 
				thisView.find('.overlay.timing').show();				
			}

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
			if (curVal !== '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'permissive-start') {
					ConfigUI.setLeftTurnPermissiveStartPhase(loadedConfig,curPhase,curVal);
					ConfigUI.updLeftTurnPermissiveStartPhase(loadedConfig,curPhase);		
				// } else if(thisView.find('.overlay.timing #item-to-update').val() == 'flashing-output') {
				// 	ConfigUI.setLeftTurnPermissiveFlashingOutput(loadedConfig,curPhase,curVal);
				// 	ConfigUI.updLeftTurnPermissiveFlashingOutput(loadedConfig,curPhase);
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'opposing-thru-phase') {
					ConfigUI.setOpposingThruPhase(loadedConfig,curPhase,curVal);
					ConfigUI.updOpposingThruPhase(loadedConfig,curPhase);
				}				
			}

	
			$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});	
		
	},

/****************************************************/
// LEFT TURN - PERMISSIVE START PHASE

	setLeftTurnPermissiveStartPhase: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_permissiveStartPhase = parseInt(value);
	},

	getLeftTurnPermissiveStartPhase: function(config,phase) {	
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_permissiveStartPhase);
		var originalData = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_permissiveStartPhase);
		var isDiff, isLeft = false;
		if (thisTiming !== originalData) {
			isDiff = true;
		} 
		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;
		
		$('#config-vehicle-phase-left').find('.current-settings.permissive-start ul').append(ConfigUI.htmlLeftTurnPermissiveStartPhase(thisTiming,isDiff,isLeft));
	},

	updLeftTurnPermissiveStartPhase: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_permissiveStartPhase);
		var originalData = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_permissiveStartPhase);
		var isDiff, isLeft = false;
		if (thisTiming !== originalData) {
			isDiff = true;
		} 			
		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;

		$('#config-vehicle-phase-left').find('.current-settings.permissive-start ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlLeftTurnPermissiveStartPhase(thisTiming,isDiff,isLeft));
	},

	// 	var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);

	// 	var	errorObj = VehValidator.CheckYellowTiming();    
 //        	$('#config-vehicle-phase-timing').find('.current-settings.yellow-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlYellowTiming(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	// },

	// htmlYellowTiming: function(val,isDiff,isError,errMsg) {

	htmlLeftTurnPermissiveStartPhase: function(val,isDiff,isLeft) {
		var thisClass = 'has-popup';
		if (isDiff == true) {
			thisClass = thisClass + ' diff';
		}
		if (isLeft) {
			// ignore
		} else {
			thisClass = thisClass + ' not-available';
		}
		if (val == 0) {
			val = '-';
		}					
		var markup = '<li class=\''+ thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},

/****************************************************/
//LEFT TURN - FLASHING OUTPUT

	toggleFlashingOutput: function() {
		$('#config-vehicle-phase-left').find('.current-settings.flashing-output .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			if (thisObj.hasClass('on')) {
				ConfigUI.setLeftTurnPermissiveFlashingOutput(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setLeftTurnPermissiveFlashingOutput(loadedConfig,thisIndex,true);
			}
			ConfigUI.updLeftTurnPermissiveFlashingOutput(loadedConfig,thisIndex);
		});		
	},


	setLeftTurnPermissiveFlashingOutput: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_flashingYellowArrowEnabled = value;
	},

	getLeftTurnPermissiveFlashingOutput: function(config,phase) {	
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_flashingYellowArrowEnabled;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_flashingYellowArrowEnabled;
		var isDiff, isLeft = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}

		//var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;


		$('#config-vehicle-phase-left').find('.flashing-output ul').append(ConfigUI.htmlLeftTurnPermissiveFlashingOutput(thisTiming,isDiff,isLeft));
	},

	updLeftTurnPermissiveFlashingOutput: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_flashingYellowArrowEnabled;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_flashingYellowArrowEnabled;
		var isDiff, isLeft = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}


		//var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;

		$('#config-vehicle-phase-left').find('.current-settings.flashing-output ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlLeftTurnPermissiveFlashingOutput(thisTiming,isDiff,isLeft));
	},

	htmlLeftTurnPermissiveFlashingOutput: function(val,isDiff,isLeft) {
		var thisClass = 'switch';	
		if (val) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}		
		markup = '<li class=\'' + thisClass + '\'\></li>';	
		return markup;
	},

/****************************************************/
// LEFT TURN - OPPOSING THRU PHASE

	setOpposingThruPhase: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_opposingThruPhase = parseInt(value);
	},

	getOpposingThruPhase: function(config,phase) {	
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_opposingThruPhase;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_opposingThruPhase;
		var isDiff, isLeft = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}

		//var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;
		
		$('#config-vehicle-phase-left').find('.opposing-thru-phase ul').append(ConfigUI.htmlOpposingThruPhase(thisTiming,isDiff,isLeft));
	},

	updOpposingThruPhase: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_opposingThruPhase;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_opposingThruPhase;
		var isDiff, isLeft = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}	

		// var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;
		

		$('#config-vehicle-phase-left').find('.current-settings.opposing-thru-phase ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlOpposingThruPhase(thisTiming,isDiff,isLeft));
	},

	htmlOpposingThruPhase: function(val,isDiff,isLeft) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isLeft) {
			// ignore it
		} else {	
			thisClass = thisClass + ' not-available';
		}
		if (val == 0) {
			val = '-';
		}					
		var markup = '<li class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},

/****************************************************/
// LEFT TURN MODE

	cycleLeftTurnMode: function() {
		$('#config-vehicle-phase-left').find('.current-settings.left-turn-mode .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			if (!thisObj.hasClass('not-available')) {
				var thisIndex = thisObj.index();
				var thisLeft = parseInt(thisObj.attr('data-left-turn'));
				if (thisLeft == 3) {
					thisLeft = 0;
				} else {
					thisLeft = parseInt(thisLeft + 1);
				}
				// if (thisLeft > 1) {
				// 	ConfigUI.permissiveStartPhaseAvailability(thisIndex,true);
				// 	ConfigUI.flashingOutputAvailability(thisIndex,true);
				// 	ConfigUI.opposingThruAvailability(thisIndex,true);
				// } else {
				// 	ConfigUI.permissiveStartPhaseAvailability(thisIndex,false);
				// 	ConfigUI.flashingOutputAvailability(thisIndex,false);
				// 	ConfigUI.opposingThruAvailability(thisIndex,false);
				// }
				ConfigUI.setLeftTurnMode(loadedConfig,thisIndex,thisLeft);
				ConfigUI.updLeftTurnMode(loadedConfig,thisIndex);				
			}
		});
	},

	setLeftTurnMode: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_leftTurnMode = parseInt(value);
	},

	getLeftTurnMode: function(config,phase) {
		var leftTurnMode = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_leftTurnMode;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_leftTurnMode;
		var isDiff, isLeft = false;
		if (leftTurnMode !== originalSetting) {
			isDiff = true;
		}
		// if (leftTurnMode > 1) {
		// 	ConfigUI.permissiveStartPhaseAvailability(phase,true);
		// 	ConfigUI.flashingOutputAvailability(phase,true);
		// 	ConfigUI.opposingThruAvailability(phase,true);
		// } else {
		// 	ConfigUI.permissiveStartPhaseAvailability(phase,false);
		// 	ConfigUI.flashingOutputAvailability(phase,false);
		// 	ConfigUI.opposingThruAvailability(phase,false);
		// }		

		// var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
			isLeft = true;


		$('#config-vehicle-phase-left').find('.left-turn-mode ul').append(ConfigUI.htmlLeftTurnMode(leftTurnMode,isDiff,isLeft));
	},


	updLeftTurnMode: function(config,phase) {
		var leftTurnMode = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_leftTurnMode;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_leftTurnMode;
		var isDiff, isLeft = false;
		if (leftTurnMode !== originalSetting) {
			isDiff = true;
		}

		// var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;
		// var	errorObj = VehValidator.CheckLeftTurnMode(leftTurnMode);    
		// console.log(errorObj);
 //       	$('#config-vehicle-phase-timing').find('.current-settings.yellow-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlYellowTiming(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));

		$('#config-vehicle-phase-left').find('.left-turn-mode ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlLeftTurnMode(leftTurnMode,isDiff,isLeft));
	},		

	htmlLeftTurnMode: function(val,isDiff,isLeft) {
		var thisClass = '';
		var leftTurnClass = BaseUI.translateLeftTurn(val);
		thisClass = thisClass + ' ' + leftTurnClass; 
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isLeft) {
			// ignore
		} else {
			thisClass = thisClass + ' not-available';
		}			
		var markup = '<li class=\''+ thisClass +'\' data-left-turn=' + val + '><span></span></li>';
		return markup;
	},	



/**************************************/
// YELLOW BLANKING - Enabled

	toggleYellowBlanking: function() {
		$('#config-vehicle-phase-left').find('.current-settings.yellow-blanking .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			if (thisObj.hasClass('on')) {
				ConfigUI.setYellowBlanking(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setYellowBlanking(loadedConfig,thisIndex,true);
			}
			ConfigUI.updYellowBlanking(loadedConfig,thisIndex);
		});		
	},

	setYellowBlanking: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowBlanking = value;
	},

	htmlYellowBlanking: function(val,isDiff,isLeft) {
		var thisClass = 'switch';
		if (val) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isLeft) {
			// ignore
		} else {
			thisClass = thisClass + ' not-available';
		}		
		var markup = '<li class=\'' + thisClass + '\'\></li>';
		return markup;
 	},				

	updYellowBlanking: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowBlanking;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowBlanking;
		var isDiff, isLeft = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;

		$('#config-vehicle-phase-left').find('.current-settings.yellow-blanking ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlYellowBlanking(isEnabled,isDiff,isLeft));	
	},

	getYellowBlanking: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowBlanking;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase].m_yellowBlanking;
		var isDiff, isLeft = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}

		var VehValidator = new com.RhythmTraffic.ConfigurationLibrary.VehiclePhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_vehiclePhase[phase]);
		// if(VehValidator.IsLeftTurn()) {
		// 	isLeft = true;
		// }
		isLeft = true;

		$('#config-vehicle-phase-left').find('.current-settings.yellow-blanking ul').append(ConfigUI.htmlYellowBlanking(isEnabled,isDiff,isLeft));	
	},



/****************************************************/
// TOGGLE AVAILABILITY

	leftTurnModeAvailability: function(phase,isAvailable) {
		if (isAvailable) {
			$('#config-vehicle-phase-left').find('.left-turn-mode .values ul li:eq(' + phase + ')').removeClass('not-available');
		} else {
			$('#config-vehicle-phase-left').find('.left-turn-mode .values ul li:eq(' + phase + ')').addClass('not-available');
		}
	},

	permissiveStartPhaseAvailability: function(phase,isAvailable) {
		if (isAvailable) {
			$('#config-vehicle-phase-left').find('.permissive-start .values ul li:eq(' + phase + ')').removeClass('not-available');
		} else {
			$('#config-vehicle-phase-left').find('.permissive-start .values ul li:eq(' + phase + ')').addClass('not-available');
		}
	},

	flashingOutputAvailability: function(phase,isAvailable) {
		if (isAvailable) {
			$('#config-vehicle-phase-left').find('.flashing-output .values ul li:eq(' + phase + ')').removeClass('not-available');
		} else {
			$('#config-vehicle-phase-left').find('.flashing-output .values ul li:eq(' + phase + ')').addClass('not-available');
		}
	},	

	opposingThruAvailability: function(phase,isAvailable) {
		if (isAvailable) {
			$('#config-vehicle-phase-left').find('.opposing-thru-phase .values ul li:eq(' + phase + ')').removeClass('not-available');
		} else {
			$('#config-vehicle-phase-left').find('.opposing-thru-phase .values ul li:eq(' + phase + ')').addClass('not-available');
		}
	},		

/****************************************************/
// PED PHASE NONACTUATED

	setPedNonActuated: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_nonActuated = value;
	},

	htmlPedNonActuated: function(isEnabled,isDiff) {
		var thisClass = 'switch';	
		if (isEnabled) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}		
		markup = '<li class=\'' + thisClass + '\'\></li>';	
		return markup;
	},

	getPedNonActuated: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_nonActuated;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_nonActuated;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-ped-phase-def').find('.non-actuated ul').append(ConfigUI.htmlPedNonActuated(isEnabled,isDiff));		
	},

	updPedNonActuated: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_nonActuated;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_nonActuated;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-ped-phase-def').find('.current-settings.non-actuated ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlPedNonActuated(isEnabled,isDiff));
	},	

	togglePedNonActuated: function() {
		$('#config-ped-phase-def').find('.current-settings.non-actuated .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			if (thisObj.hasClass('on')) {
				ConfigUI.setPedNonActuated(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setPedNonActuated(loadedConfig,thisIndex,true);
			}
			ConfigUI.updPedNonActuated(loadedConfig,thisIndex);
		});
	},	

/****************************************************/
// PED PHASE REST IN WALK


	setPedRestInWalk: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_restInWalk = value;
	},

	getPedRestInWalk: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_restInWalk;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_restInWalk;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-ped-phase-def').find('.rest-in-walk ul').append(ConfigUI.htmlPedRestInWalk(isEnabled,isDiff));		
	},

	updPedRestInWalk: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_restInWalk;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_restInWalk;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-ped-phase-def').find('.current-settings.rest-in-walk ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlPedRestInWalk(isEnabled,isDiff));
	},	

	htmlPedRestInWalk: function(isEnabled,isDiff) {
		var thisClass = 'switch';	
		if (isEnabled) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\' '+ thisClass + '\'\></li>';
		return markup;
	},

	togglePedRestInWalk: function() {
		$('#config-ped-phase-def').find('.current-settings.rest-in-walk .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			if (thisObj.hasClass('on')) {
				ConfigUI.setPedRestInWalk(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setPedRestInWalk(loadedConfig,thisIndex,true);
			}
			ConfigUI.updPedRestInWalk(loadedConfig,thisIndex);
		});
	},	


/****************************************************/
// PED PHASE CLEAR TIMES WITH YELLOW

	setPedClearYellow: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_pedClearanceTimesWithVehicleYellow = value;
	},

	getPedClearYellow: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_pedClearanceTimesWithVehicleYellow;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_pedClearanceTimesWithVehicleYellow;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-ped-phase-def').find('.ped-clear-yellow ul').append(ConfigUI.htmlPedClearYellow(isEnabled,isDiff));		
	},

	updPedClearYellow: function(config,phase) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_pedClearanceTimesWithVehicleYellow;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_pedClearanceTimesWithVehicleYellow;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}		
		$('#config-ped-phase-def').find('.current-settings.ped-clear-yellow ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlPedClearYellow(isEnabled,isDiff));
	},	

	htmlPedClearYellow: function(isEnabled,isDiff) {
		var thisClass = 'switch';	
		if (isEnabled) {
			thisClass = thisClass + ' on';
		}
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		var markup = '<li class=\' '+ thisClass + '\'\></li>';
		return markup;
	},

	togglePedClearYellow: function() {
		$('#config-ped-phase-def').find('.current-settings.ped-clear-yellow .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			if (thisObj.hasClass('on')) {
				ConfigUI.setPedClearYellow(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setPedClearYellow(loadedConfig,thisIndex,true);
			}
			ConfigUI.updPedClearYellow(loadedConfig,thisIndex);
		});
	},	



/****************************************************/
// PED PHASE KEYPAD

	changePedDefTiming: function() {

		var thisView = $('#config-ped-phase-def');

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
		 	if (thisObj.parents('.current-settings').hasClass('walk-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Ped Walk Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Ped Walk Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('walk-timing');
		 	} else if (thisObj.parents('.current-settings').hasClass('clear-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Ped Clear Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Ped Clear Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('clear-timing');
		 	}
		 	
		 	thisView.find('.overlay.timing .message').text(thisObj.attr('data-msg')).removeClass('error');
		 	if (thisObj.hasClass('error')) {
		 		thisView.find('.overlay.timing .message').addClass('error');
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
			if (curVal !== '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'walk-timing') {
					ConfigUI.setPedWalkTiming(loadedConfig,curPhase,curVal);
					ConfigUI.updPedWalkTiming(loadedConfig,curPhase);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'clear-timing') {
					ConfigUI.setPedClearTiming(loadedConfig,curPhase,curVal);
					ConfigUI.updPedClearTiming(loadedConfig,curPhase);	
				}				
			}

			$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});	

	},

/****************************************************/
// PED WALK TIMING

	setPedWalkTiming: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_walkTiming = parseInt(value);
	},

	getPedWalkTiming: function(config,phase) {	
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_walkTiming);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_walkTiming);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-ped-phase-def').find('.walk-timing ul').append(ConfigUI.htmlPedWalkTiming(thisTiming,isDiff));
	},

	updPedWalkTiming: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_walkTiming);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_walkTiming);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}

		var PedValidator = new com.RhythmTraffic.ConfigurationLibrary.PedestrianPhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase]);

		var	errorObj = PedValidator.CheckWalkTiming();    
        	$('#config-ped-phase-def').find('.current-settings.walk-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlPedWalkTiming(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlPedWalkTiming: function(val,isDiff,isError,errMsg) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}	
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},	


/****************************************************/
// PED CLEAR TIMING

	setPedClearTiming: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_clearanceTiming = parseInt(value);
	},

	getPedClearTiming: function(config,phase) {	
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_clearanceTiming;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_clearanceTiming;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}		
		$('#config-ped-phase-def').find('.current-settings.clear-timing ul').append(ConfigUI.htmlPedClearTiming(thisTiming,isDiff));
	},

	updPedClearTiming: function(config,phase) {
		var thisTiming = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_clearanceTiming);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase].m_clearanceTiming);
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}	

		var PedValidator = new com.RhythmTraffic.ConfigurationLibrary.PedestrianPhaseValidation(allWorkingData.InSpire.m_controllerConfigurations[config].m_pedPhase[phase]);

		var	errorObj = PedValidator.CheckClearanceTiming();    
        	$('#config-ped-phase-def').find('.current-settings.clear-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlPedClearTiming(thisTiming, isDiff, errorObj.IsError(), errorObj.getMessage()));
	},

	htmlPedClearTiming: function(val,isDiff,isError,errMsg) {
		var thisClass = 'has-popup';
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}
		if (isError) {
			thisClass = thisClass + ' error';
		}
		if (errMsg == undefined) {
			errMsg = '';
		}	
		var markup = '<li data-msg=\'' + errMsg + '\' class=\''+ thisClass +'\'><span>' + val + '</span></li>';
		return markup;
	},		

/****************************************************/
// OVERLAP KEYPAD 

	changeVehicleOverlap: function() {

		var thisView = $('#config-timed-overlap');

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
			if (thisObj.parents('.current-settings').hasClass('channel')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Channel:');
				thisView.find('.overlay.timing .new-timing label').text('New Channel:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('channel');
			} else if (thisObj.parents('.current-settings').hasClass('min-green-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Min Green Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Min Green Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('min-green-timing');
			} else if (thisObj.parents('.current-settings').hasClass('yellow-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Yellow Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Yellow Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('yellow-timing');
			} else if (thisObj.parents('.current-settings').hasClass('red-timing')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Red Timing:');
				thisView.find('.overlay.timing .new-timing label').text('New Red Timing:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('red-timing');						
			} else if (thisObj.parents('.current-settings').hasClass('extend-green')){
				thisView.find('.overlay.timing li[data-keypad-num=\'.\']').css('visibility','visible');											
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Extend Green:');
				thisView.find('.overlay.timing .new-timing label').text('New Extend Green:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('extend-green');
			}	

		 	thisView.find('.overlay.timing .message').text(thisObj.attr('data-msg')).removeClass('error');
			 if (thisObj.hasClass('error')) {
			 	thisView.find('.overlay.timing .message').addClass('error');
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
			if (curVal !== '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'channel') {
					ConfigUI.setChannelOverlap(loadedConfig,curPhase,curVal);
					ConfigUI.updChannelOverlap(loadedConfig,curPhase);	
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'min-green-timing') {
					ConfigUI.setMinGreenOverlap(loadedConfig,curPhase,curVal);
					ConfigUI.updMinGreenOverlap(loadedConfig,curPhase);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'extend-green') {
					ConfigUI.setExtendGreenOverlap(loadedConfig,curPhase,curVal);
					ConfigUI.updExtendGreenOverlap(loadedConfig,curPhase);
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'yellow-timing') {
					ConfigUI.setYellowOverlap(loadedConfig,curPhase,curVal);
					ConfigUI.updYellowOverlap(loadedConfig,curPhase);
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'red-timing') {
					ConfigUI.setRedOverlap(loadedConfig,curPhase,curVal);
					ConfigUI.updRedOverlap(loadedConfig,curPhase);
				} 				
			}

	
			$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});	

	},

/****************************************************/

	setChannelOverlap: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_outputChannel = parseInt(value);
	},

	getChannelOverlap: function(config,phase) {	
		var markup = '<li class\'has-popup\'><span>'+allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_outputChannel+'</span></li>';
		$('#config-timed-overlap').find('.channel ul').append(markup);
	},

	updChannelOverlap: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_outputChannel;
		$('#config-timed-overlap').find('.current-settings.channel ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlChannelOverlap(thisTiming));
	},

	htmlChannelOverlap: function(val) {
		var markup = '';
		var thisClass = 'has-popup';
		if (!ValidateUI.isValidChannel(val)) {
			thisClass = thisClass + ' error';
		} 
		if (!ValidateUI.isInt(val)) {
			thisClass = thisClass + ' error';
		} else {
			val = parseInt(val);
		}
		var markup = '<li class=\''+ thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},	

/****************************************************/

	setMinGreenOverlap: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_minGreenTiming = parseInt(value);
	},

	getMinGreenOverlap: function(config,phase) {	
		var markup = '<li><span>' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_minGreenTiming + '</span></li>';
		$('#config-timed-overlap').find('.min-green-timing ul').append(markup);
	},

	updMinGreenOverlap: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_minGreenTiming;
		$('#config-timed-overlap').find('.current-settings.min-green-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlMinGreenOverlap(thisTiming));
	},

	htmlMinGreenOverlap: function(val) {
		var markup = '<li><span>' + val + '</span></li>';
		return markup;
	},		

/****************************************************/

	setYellowOverlap: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_yellowTiming = parseInt(value);
	},

	getYellowOverlap: function(config,phase) {	
		var markup = '<li><span>' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_yellowTiming + '</span></li>';
		$('#config-timed-overlap').find('.yellow-timing ul').append(markup);
	},

	updYellowOverlap: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_yellowTiming;
		$('#config-timed-overlap').find('.current-settings.yellow-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlYellowOverlap(thisTiming));
	},

	htmlYellowOverlap: function(val) {
		var markup = '<li><span>' + val + '</span></li>';
		return markup;
	},		

/****************************************************/

	setRedOverlap: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_redTiming = parseInt(value);
	},

	getRedOverlap: function(config,phase) {	
		var markup = '<li><span>' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_redTiming + '</span></li>';
		$('#config-timed-overlap').find('.red-timing ul').append(markup);
	},

	updRedOverlap: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_redTiming;
		$('#config-timed-overlap').find('.current-settings.red-timing ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlRedOverlap(thisTiming));
	},

	htmlRedOverlap: function(val) {
		var markup = '<li><span>' + val + '</span></li>';
		return markup;
	},		


/****************************************************/

	setExtendGreenOverlap: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_extendGreen = parseInt(value);
	},

	getExtendGreenOverlap: function(config,phase) {	
		var markup = '<li><span>' + allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_extendGreen + '</span></li>';
		$('#config-timed-overlap').find('.extend-green ul').append(markup);
	},

	updExtendGreenOverlap: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_overlap[phase].m_extendGreen;
		$('#config-timed-overlap').find('.current-settings.extend-green ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlExtendGreenOverlap(thisTiming));
	},

	htmlExtendGreenOverlap: function(val) {
		var markup = '<li><span>' + val + '</span></li>';
		return markup;
	},		





	

/****************************************************/	
// PED DETECTORS

	// HEADER
	getPedDetectors: function(config,detector) {
		var markup = '<li class=\'has-phase\'><div><span> ' + allWorkingData.InSpire.m_controllerConfigurations[config].m_pedDetector[detector].m_detectorNum + '</span></div></li>';
		$('#config-ped-detectors').find('.detectors ul').append(markup);
	},

	changePedDetectorPhase: function() {

		var thisView = $('#config-ped-detectors');

		thisView.find('.current-settings.keypad .values ul').on('mousedown','li',function() {
			$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
			$('.overlay.timing .keypad li.disabled').removeClass('disabled');
			thisView.find('.overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
			var thisObj = $(this);
			var thisTiming = thisObj.parents('.current-settings').attr('class');
			var thisVal = thisObj.find('span').text();
			var thisPhase = thisObj.index();
			thisView.find('.overlay.timing .has-phase div').empty();
			thisView.find('.overlay.timing .has-phase div').text(thisPhase + 1);
			thisView.find('.overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
			thisView.find('.overlay.timing .current-timing-entry .value span').text(thisVal);
			if (thisObj.parents('.current-settings').hasClass('phase-assignment')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Phase Assignment:');
				thisView.find('.overlay.timing .new-timing label').text('New Phase Assignment:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('phase-assignment');
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
			var curDetector = parseInt(thisView.find('.overlay.timing .current-info .has-phase > div').attr('data-phase-loc'));
			var curVal = thisView.find('.overlay.timing #value-entered').val();
			if (curVal !== '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'phase-assignment') {
					ConfigUI.setPedDetectorPhase(loadedConfig,curDetector,curVal);
					ConfigUI.updPedDetectorPhase(loadedConfig,curDetector);		
				} 
			}	
			$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});
	},

/****************************************************/
// PED DETECTORS

	setPedDetectorPhase: function(config,detector,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_pedDetector[detector].m_phaseAssignment = parseInt(value);
	},

	getPedDetectorPhase: function(config,detector) {
		var thisPhase = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_pedDetector[detector].m_phaseAssignment);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_pedDetector[detector].m_phaseAssignment);
		var isDiff = false;
		if (thisPhase !== originalSetting)  {
			isDiff = true;
		}
		$('#config-ped-detectors').find('.phase-assignment ul').append(ConfigUI.htmlPedDetectorPhase(thisPhase,isDiff));
	},

	updPedDetectorPhase: function(config,detector) {
		var thisPhase = parseInt(allWorkingData.InSpire.m_controllerConfigurations[config].m_pedDetector[detector].m_phaseAssignment);
		var originalSetting = parseInt(allPristineData.InSpire.m_controllerConfigurations[config].m_pedDetector[detector].m_phaseAssignment);
		var isDiff = false;
		if (thisPhase !== originalSetting)  {
			isDiff = true;
		}
		$('#config-ped-detectors').find('.current-settings.phase-assignment ul li:eq(' + detector + ')').replaceWith(ConfigUI.htmlPedDetectorPhase(thisPhase,isDiff));
	},

	htmlPedDetectorPhase: function(val,isDiff) {
		var thisClass = '';
		if (isDiff) {
			thisClass = 'diff';
		}
		if (val == 0) {
			val = '-';
		}			
		var markup = '<li class=\'' + thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},		


/****************************************************/	
// VEHICLE DETECTORS HEADER

	getVehDetectors: function(config,detector) {
		var markup = '<li class=\'has-phase\'><div><span>' + allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_detectorNum + '</span></div></li>';
		$('#config-vehicle-detectors').find('.detectors ul').append(markup);
	},

/****************************************************/	
// VEHICLE DETECTORS LOCK

	setVehDetectorsLock: function(config,detector,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_lock = value;
	},

	getVehDetectorsLock: function(config,detector) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_lock;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_lock;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.lock-detection ul').append(ConfigUI.htmlVehDetectorsLock(isEnabled,isDiff));		
	},

	updVehDetectorsLock: function(config,detector) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_lock;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_lock;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.current-settings.lock-detection ul li:eq(' + detector + ')').replaceWith(ConfigUI.htmlVehDetectorsLock(isEnabled,isDiff));
	},	

	htmlVehDetectorsLock: function(isEnabled,isDiff) {
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

	toggleVehDetectorsLock: function() {
		$('#config-vehicle-detectors').find('.current-settings.lock-detection .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			if (thisObj.hasClass('on')) {
				ConfigUI.setVehDetectorsLock(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setVehDetectorsLock(loadedConfig,thisIndex,true);
			}
			ConfigUI.updVehDetectorsLock(loadedConfig,thisIndex);
		});
	},	


/****************************************************/	
// VEHICLE DETECTORS ENABLE CALL ON FAILURE

	setVehDetectorsCall: function(config,detector,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_triggerOnFailure = value;
	},

	getVehDetectorsCall: function(config,detector) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_triggerOnFailure;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_triggerOnFailure;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.enable-call ul').append(ConfigUI.htmlVehDetectorsCall(isEnabled,isDiff));		
	},

	updVehDetectorsCall: function(config,detector) {
		var isEnabled = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_triggerOnFailure;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[detector].m_triggerOnFailure;
		var isDiff = false;
		if (isEnabled !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.current-settings.enable-call ul li:eq(' + detector + ')').replaceWith(ConfigUI.htmlVehDetectorsCall(isEnabled,isDiff));
	},	

	htmlVehDetectorsCall: function(isEnabled,isDiff) {
		var thisClass = 'switch';		
		if (isEnabled) {
			thisClass = thisClass + ' on';
		}	
		if (isDiff) {
			thisClass = thisClass + ' diff';
		}			
		markup = '<li class=\'' + thisClass + '\'\></li>';
		return markup;
	},

	toggleVehDetectorsCall: function() {
		$('#config-vehicle-detectors').find('.current-settings.enable-call .values ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			if (thisObj.hasClass('on')) {
				ConfigUI.setVehDetectorsCall(loadedConfig,thisIndex,false);
			} else {
				ConfigUI.setVehDetectorsCall(loadedConfig,thisIndex,true);
			}
			ConfigUI.updVehDetectorsCall(loadedConfig,thisIndex);
		});
	},	

/****************************************************/

	changeVehDetectors: function() {

		var thisView = $('#config-vehicle-detectors');

		thisView.find('.current-settings.keypad .values ul').on('mousedown','li',function() {
			$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
			thisView.find('.overlay.timing .keypad li.disabled').removeClass('disabled');
			thisView.find('.overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
			var thisObj = $(this);
			var thisTiming = thisObj.parents('.current-settings').attr('class');
			var thisVal = thisObj.find('span').text();
			var thisPhase = thisObj.index();
			thisView.find('.overlay.timing .has-phase div').empty();
			thisView.find('.current-settings.phase .values ul li:eq('+ thisPhase +') div').clone().appendTo($('#config-vehicle-detectors').find('.overlay.timing .has-phase div'));
			thisView.find('.overlay.timing .has-phase > div').attr('data-phase-loc',thisPhase);
			thisView.find('.overlay.timing .current-timing-entry .value span').text(thisVal);
			if (thisObj.parents('.current-settings').hasClass('delay')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Delay:');
				thisView.find('.overlay.timing .new-timing label').text('New Delay:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('delay');
			} else if (thisObj.parents('.current-settings').hasClass('extend')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Extend:');
				thisView.find('.overlay.timing .new-timing label').text('New Extend:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('extend');
			} else if (thisObj.parents('.current-settings').hasClass('stuck-on')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Stuck ON:');
				thisView.find('.overlay.timing .new-timing label').text('New Stuck ON:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('stuck-on');
			} else if (thisObj.parents('.current-settings').hasClass('stuck-off')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Stuck OFF:');
				thisView.find('.overlay.timing .new-timing label').text('New Stuck OFF:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('stuck-off');
			} else if (thisObj.parents('.current-settings').hasClass('phase-assignment')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Phase Assignment:');
				thisView.find('.overlay.timing .new-timing label').text('New Phase Assignment:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('phase-assignment');
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
			var curDetector = parseInt(thisView.find('.overlay.timing .current-info .has-phase > div').attr('data-phase-loc'));
			var curVal = thisView.find('.overlay.timing #value-entered').val();
			if (curVal !== '') {
				if(thisView.find('.overlay.timing #item-to-update').val() == 'delay') {
					ConfigUI.setVehDetectorsDelay(loadedConfig,curDetector,curVal);
					ConfigUI.updVehDetectorsDelay(loadedConfig,curDetector);		
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'extend') {
					ConfigUI.setVehDetectorsExtend(loadedConfig,curDetector,curVal);
					ConfigUI.updVehDetectorsExtend(loadedConfig,curDetector);	
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'stuck-on') {
					ConfigUI.setVehDetectorsStuckOn(loadedConfig,curDetector,curVal);
					ConfigUI.updVehDetectorsStuckOn(loadedConfig,curDetector);	
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'stuck-off') {
					ConfigUI.setVehDetectorsStuckOff(loadedConfig,curDetector,curVal);
					ConfigUI.updVehDetectorsStuckOff(loadedConfig,curDetector);	
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'phase-assignment') {
					ConfigUI.setVehDetectorsPhaseAssignment(loadedConfig,curDetector,curVal);
					ConfigUI.updVehDetectorsPhaseAssignment(loadedConfig,curDetector);	
				}				
			}
	
			$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {	
			BaseUI.resetOverlay();
		});	

	},

/****************************************************/

	setVehDetectorsDelay: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_delaySec = parseInt(value);
	},

	getVehDetectorsDelay: function(config,phase) {
		var thisTiming =  allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_delaySec;
		$('#config-vehicle-detectors').find('.delay ul').append(ConfigUI.htmlVehDetectorsDelay(thisTiming));
	},

	updVehDetectorsDelay: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_delaySec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_delaySec;
		var diff = false;
		if (thisTiming !== originalSetting) {
			diff = true;
		}
		$('#config-vehicle-detectors').find('.current-settings.delay ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlVehDetectorsDelay(thisTiming,diff));
	},

	htmlVehDetectorsDelay: function(val,isDiff) {
		var thisClass = '';
		if (isDiff) {
			thisClass = 'diff';
		}
		var markup = '<li class=\''+thisClass+'\'><span>' + val + '</span></li>';
		return markup;
	},		

/****************************************************/
// VEHICLE DETECTORS EXTEND

	setVehDetectorsExtend: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_extendSec = parseInt(value);
	},

	getVehDetectorsExtend: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_extendSec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_extendSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.extend ul').append(ConfigUI.htmlVehDetectorsDelay(thisTiming));
	},

	updVehDetectorsExtend: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_extendSec;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_extendSec;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.current-settings.extend ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlVehDetectorsExtend(thisTiming,isDiff));
	},

	htmlVehDetectorsExtend: function(val,isDiff) {
		var thisClass = '';
		if (isDiff) {
			thisClass = 'diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},		

/****************************************************/
// VEHICLE DETECTORS STUCK ON: ELAPSED TIME

	setVehDetectorsStuckOn: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOnFailureThresholdMinutes = parseInt(value);
	},

	getVehDetectorsStuckOn: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOnFailureThresholdMinutes;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOnFailureThresholdMinutes;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.stuck-on ul').append(ConfigUI.htmlVehDetectorsStuckOn(thisTiming,isDiff));
	},

	updVehDetectorsStuckOn: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOnFailureThresholdMinutes;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOnFailureThresholdMinutes;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.current-settings.stuck-on ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlVehDetectorsStuckOn(thisTiming,isDiff));
	},

	htmlVehDetectorsStuckOn: function(val,isDiff) {
		var thisClass = '';
		if (isDiff) {
			thisClass = 'diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},	

/****************************************************/
// VEHICLE DETECTORS STUCK OFF: ELAPSED TIME

	setVehDetectorsStuckOff: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOffFailureThresholdMinutes = parseInt(value);
	},

	getVehDetectorsStuckOff: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOffFailureThresholdMinutes;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOffFailureThresholdMinutes;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.stuck-off ul').append(ConfigUI.htmlVehDetectorsStuckOff(thisTiming,isDiff));
	},

	updVehDetectorsStuckOff: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOffFailureThresholdMinutes;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_stuckOffFailureThresholdMinutes;
		var isDiff = false;
		if (thisTiming !== originalSetting) {
			isDiff = true;
		}
		$('#config-vehicle-detectors').find('.current-settings.stuck-off ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlVehDetectorsStuckOff(thisTiming,isDiff));
	},

	htmlVehDetectorsStuckOff: function(val,isDiff) {
		var thisClass = '';
		if (isDiff) {
			thisClass = 'diff';
		}
		var markup = '<li class=\'' + thisClass + '\'><span>' + val + '</span></li>';
		return markup;
	},		

/****************************************************/
// VEHICLE DETECTORS PHASE ASSIGNMENT

	setVehDetectorsPhaseAssignment: function(config,phase,value) {
		allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_phaseAssignment = parseInt(value);
	},

	getVehDetectorsPhaseAssignment: function(config,phase) {
		var thisTiming =  allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_phaseAssignment;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_phaseAssignment;
		var diff = false;
		if (thisTiming !== originalSetting) {
			diff = true;
		}
		$('#config-vehicle-detectors').find('.phase-assignment ul').append(ConfigUI.htmlVehDetectorsPhaseAssignment(thisTiming,diff));
	},

	updVehDetectorsPhaseAssignment: function(config,phase) {
		var thisTiming = allWorkingData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_phaseAssignment;
		var originalSetting = allPristineData.InSpire.m_controllerConfigurations[config].m_vehDetector[phase].m_phaseAssignment;
		var diff = false;
		if (thisTiming !== originalSetting) {
			diff = true;
		}
		$('#config-vehicle-detectors').find('.current-settings.phase-assignment ul li:eq(' + phase + ')').replaceWith(ConfigUI.htmlVehDetectorsPhaseAssignment(thisTiming,diff));
	},

	htmlVehDetectorsPhaseAssignment: function(val,isDiff) {
		var thisClass = '';
		if (isDiff) {
			thisClass = 'diff';
		}
		if (val == 0) {
			val = '-';
		}			
		var markup = '<li class=\''+thisClass+'\'><span>' + val + '</span></li>';
		return markup;
	},		


/****************************************************/
// GET CONFIG NAME BY ID

	getConfigNameById: function(id) {
		var configListLen = allWorkingData.InSpire.m_controllerConfigurations.length;
		for (var i = 0; i < configListLen;  i++) {
			if (allWorkingData.InSpire.m_controllerConfigurations[i].m_confId == id) {	
				var configName = allWorkingData.InSpire.m_controllerConfigurations[i].m_configurationName;
				break;
			}
		}		
		return configName;
	},

/****************************************************/
// GET CONFIG NAME BY LOC

	getConfigNameByLoc: function(loc) {
		var configName = allWorkingData.InSpire.m_controllerConfigurations[loc].m_configurationName;	
		return configName;
	},


/****************************************************/
// GET CONFIG ARRAY LOC

	getConfigArrayLoc: function(id) {
		var configListLen = allWorkingData.InSpire.m_controllerConfigurations.length;
		for (var i = 0; i < configListLen;  i++) {
			if (allWorkingData.InSpire.m_controllerConfigurations[i].m_confId == id) {	
				var configArrayLoc = i;
				break;
			}
		}		
		return configArrayLoc;
	},	


/****************************************************/
// SEQUENCE GROUP LIST

	emptySeqeuenceGroupList: function() {
		$('#seq-group-list').find('.content ul').empty();
	},


	getSequenceGroupList: function(config,seqgroup) {
		var thisView = $('#seq-group-list');
		var thisSeqGroup =  allWorkingData.InSpire.m_controllerConfigurations[config].m_sequenceGroup[seqgroup].m_name;
		thisView.find('.content ul').append(ConfigUI.htmlSequenceGroupList(thisSeqGroup,seqgroup));
	},

	htmlSequenceGroupList: function(val,seqGroupLoc) {
		var thisClass = '';
		var markup = '<li data-seq-loc=\''+ seqGroupLoc +'\' class=\''+thisClass+'\'><a><span>' + val + '</span></a></li>';
		return markup;
	},		


	updSeqPhaseSelected: function(seqGroup) {
		// DISPLAY PHASES SELECTED USED TO GENERATE STATES
		$('#seq-group-detail').find('.phase-selected .values ul').empty();
		var phaseLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_phases.length;
		var unsetPhase = 0;
		for (var i = 0; i < phaseLen; i++) {
			var phaseNum = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_phases[i];
			if (phaseNum > 0) {
				var thisMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[phaseNum - 1];
				var thisClass = BaseUI.translateMovement(thisMovement);
				$('#seq-group-detail').find('.phase-selected .values ul').append('<li class=\'dir-' + thisClass + '\'>' + phaseNum +'</li>');
			} else {
				unsetPhase = unsetPhase + 1;
			}
		}
		if (unsetPhase == phaseLen) {
			$('#seq-group-detail').find('.phase-selected .values ul').append('<li>-</li>');
		}
	},

/****************************************************/
// RETURNS HTML BASED ON ARRAY OF VALID STATES

	generateStateMarkup: function(validStates,selectedPhases,curSeq) {
		var markup = '';
		var validStatesLen = validStates.length;
		 for (h = 0; h < validStatesLen; h++) {

			
			var tempText = validStates[h];
	     	tempString = validStates[h].split(':');
	     	firstPhase = parseInt(tempString[0]);
	     	firstMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[firstPhase - 1];
	     	firstPhaseDir = 'dir-' + BaseUI.translateMovement(firstMovement);
	     	markup = markup + '';


	     	secondPhase = parseInt(tempString[1]);
	     	if (secondPhase > 0) {
		   		secondMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[secondPhase - 1];
	     		secondPhaseDir = 'dir-' + BaseUI.translateMovement(secondMovement);
	     		markup = markup + '<li class=\'state\'><div class=\''+firstPhaseDir+'\'></div><div class=\''+secondPhaseDir+'\'></div><span class=\'phase-num-1\'>'+ firstPhase +'</span><span class=\'phase-num-2\'>' + secondPhase + '</span></li>';		
	     	} else {
	     		markup = markup + '<li class=\'state single-state\'><div class=\''+firstPhaseDir+'\'></div><span class=\'phase-num-1\'>'+ firstPhase +'</span></li>';		
	     	}

	     }

		 return markup;
	},


	loadSequenceGroup: function() {
		$('#seq-group-list').find('ul').on('mousedown','li',function() {
			var thisSeqArrayLoc = $(this).attr('data-seq-loc');

			// GET SEQ GROUP NAME
			$('#seq-group-detail').find('.seq-group-name .values ul li').text(ConfigUI.getSequenceGroupName(loadedConfig,thisSeqArrayLoc));
			$('#seq-group-state-def').find('.current-settings.seq-group .label span').text(ConfigUI.getSequenceGroupName(loadedConfig,thisSeqArrayLoc));

			ConfigUI.updSeqPhaseSelected(thisSeqArrayLoc);

			// DISPLAY CURRENT SEQUENCES
			$('#seq-group-detail').find('.current-settings.sequence').remove();
			var markup = '';
			var availableSeq = 9;
			var seqGroupLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_arrSequence.length;
			for (var i = 0; i < seqGroupLen; i++) {

			//	if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_arrSequence[i].m_enabled) {
					markup = markup + '<div class=\'current-settings sequence\' data-arr-seq-loc=\'' + i + '\'><div class=\'label\'><span>Sequence ' + parseInt(i + 1) + ':</span></div>';
					markup = markup + '<div class=\'values\'><ul>';
					var seqLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_arrSequence[i].m_arrPhaseState.length;
					for (var j = 0; j < seqLen; j++) {
						if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_arrSequence[i].m_arrPhaseState[j].m_enabled) {
							var firstStatePhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_arrSequence[i].m_arrPhaseState[j].m_phases[0];
							var firstMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[firstStatePhase - 1];
							var firstStateDir = 'dir-' + BaseUI.translateMovement(firstMovement);
							var secondStatePhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_arrSequence[i].m_arrPhaseState[j].m_phases[1];
							var secondMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[secondStatePhase - 1];
							var secondStateDir = 'dir-' + BaseUI.translateMovement(secondMovement);				
							if (secondStatePhase > 0) {
								markup = markup + '<li class=\'state\'><div class=\''+ firstStateDir +'\'></div><div class=\''+ secondStateDir +'\'></div><span class=\'phase-num-1\'>'+firstStatePhase+'</span><span class=\'phase-num-2\'>'+secondStatePhase+'</span></li>';
							} else {
								markup = markup + '<li class=\'state single-state\'><div class=\''+ firstStateDir +'\'></div><span class=\'phase-num-1\'>'+firstStatePhase+'</span></li>';
							}
						}
						
					}	
					
					markup = markup + '</ul></div>';
					markup = markup + '</div>'; // end of .current-settings.sequence 					
				
					availableSeq = availableSeq - 1;

			//	}
			}

			$('#seq-group-detail').find('.current-settings.new-sequence-link').remove();
			// if (availableSeq > 0) {
			// 	markup = markup + '<div class=\'current-settings new-sequence-link\'><div class=\'label\'><span></span></div><div class=\'values\'><ul><li>Add New Sequence</li></ul></div>';
			// }

			$('#seq-group-detail').find('.content').append(markup);
			$('#seq-group-detail').find('#seq-group-loc').val(thisSeqArrayLoc);

			//seqName = $(this).find('span').text();
			// ConfigUI.updateSeqGroupTitle(seqName);
			setTimeout(function() { BaseUI.switchPanel('seq-group-detail') }, delayTime );	


		});		
	},

/****************************************************/
// SEQUENCE GROUP NAME

	getSequenceGroupName: function(config,seqGroupLoc) {
		var seqGroupName = allWorkingData.InSpire.m_controllerConfigurations[config].m_sequenceGroup[seqGroupLoc].m_name;
		return seqGroupName;
	},

	setSequenceGroupName: function(val) {
		var thisSeqArrayLoc = $('#seq-group-detail').find('#seq-group-loc').val();
		allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_name = val;
	},

	updSequenceGroupName: function(val) {
		var thisSeqArrayLoc = $('#seq-group-detail').find('#seq-group-loc').val();
		var seqGroupName = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_name;
		$('#seq-group-list').find('.content ul li:eq(' + thisSeqArrayLoc + ') a span').text(seqGroupName);
		$('#seq-group-detail').find('.seq-group-name .values ul li').text(seqGroupName);
	},	

/**************************************/
// CHANGE SEQUENCE GROUP NAME 

	changeSequenceGroupName: function() {
		$('#seq-group-detail').find('.seq-group-name').on('mousedown',function() {
			var thisSeqArrayLoc = $('#seq-group-detail').find('#seq-group-loc').val();
			var seqGroupName = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_name;
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit Sequence Group Name');
			thisView.find('.item-to-change').val('seq-group-name');
			thisView.find('.current-text').val(seqGroupName);
			thisView.find('.current-entry').text(seqGroupName + '_');
			thisView.find('.go-straight-back').attr('data-panel','seq-group-detail');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},	




/****************************************************/
// SEQUENCE STATE SELECTION

	loadSeqDefinition: function() {
		$('#seq-group-detail').find('.content').on('mousedown','.sequence',function() {

			var thisSeqGroup = parseInt($('#seq-group-detail').find('#seq-group-loc').val());
			var thisSeqArray = parseInt($(this).attr('data-arr-seq-loc'));

			var markup = ConfigUI.generateSeqMarkup(thisSeqGroup,thisSeqArray);

			$('#seq-group-seq-def').find('.content .current-settings').replaceWith(markup);

			var selectedPhases = [];
			var phaseLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_phases.length;
			for (var i = 0; i < phaseLen; i++) {
				var phaseNum = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_phases[i];
				if (phaseNum !== 0) {
					selectedPhases.push(phaseNum);
				}
			}	

			var validStates = ConfigUI.identifyValidStates(selectedPhases);

			var filteredStates = validStates;
			var validStatesLen = validStates.length;
			var activeStateCount = 0;

			// Compare against states already defined in the sequence group
			for (h = 0; h < validStatesLen; h++) { 
	    	 	var stateLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeqArray].m_arrPhaseState.length;
	    	 	for (j = 0; j < stateLen; j++) {
	    	 		if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeqArray].m_arrPhaseState[j].m_enabled == true) {
	    	 			activeStateCount = activeStateCount + 1;
	    	 			var arrFirstPhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeqArray].m_arrPhaseState[j].m_phases[0];
		    	 		var arrSecondPhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeqArray].m_arrPhaseState[j].m_phases[1];
		    	 		var tempState = (arrFirstPhase + ':' + arrSecondPhase).toString();

		    	 		// if state being evaluated in the sequence group matches the state that is being filtered, then remove it from the filtered state
						if (tempState == validStates[h]) {
							var removeItem = 2; 
							 
							filteredStates = jQuery.grep(filteredStates, function(value) {
							    return value != tempState;
							});
						}
	    	 		}

	    	 	}

			}
			var availableMarkup = ConfigUI.generateStateMarkup(filteredStates,selectedPhases,thisSeqArray);
			$('#seq-group-seq-def').find('.available-states .values ul').empty().append(availableMarkup);
			setTimeout(function() { BaseUI.switchPanel('seq-group-seq-def') }, delayTime );	
		});
	},


/****************************************************/
// GENERATE SEQUENCE MARKUP: 
	generateSeqMarkup: function(seqGroup,seqArray) {
			// DISPLAY CURRENT SEQUENCES
			var markup = '';
			//	if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seqArray].m_enabled) {
					markup = markup + '<div class=\'current-settings sequence\' data-arr-seq-loc=\'' + seqArray + '\'><div class=\'label\'><span>Sequence ' + parseInt(seqArray + 1) + ':</span></div>';
					markup = markup + '<div class=\'values\'><ul>';
					var seqLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seqArray].m_arrPhaseState.length;
					for (var j = 0; j < seqLen; j++) {
						if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seqArray].m_arrPhaseState[j].m_enabled) {

							var firstStatePhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seqArray].m_arrPhaseState[j].m_phases[0];
							var firstMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[firstStatePhase - 1];
							var firstStateDir = 'dir-' + BaseUI.translateMovement(firstMovement);
							var secondStatePhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seqArray].m_arrPhaseState[j].m_phases[1];
							var secondMovement = allWorkingData.InSpire.m_phaseInitialization.m_movementDirection[secondStatePhase - 1];
							var secondStateDir = 'dir-' + BaseUI.translateMovement(secondMovement);		
							if (secondStatePhase > 0) {
								markup = markup + '<li class=\'state\'><div class=\''+ firstStateDir +'\'></div><div class=\''+ secondStateDir +'\'></div><span class=\'phase-num-1\'>'+firstStatePhase+'</span><span class=\'phase-num-2\'>'+secondStatePhase+'</span></li>';
							} else {
								markup = markup + '<li class=\'state single-state\'><div class=\''+ firstStateDir +'\'></div><span class=\'phase-num-1\'>'+firstStatePhase+'</span></li>';
							}
						}
						
					}	
					
					markup = markup + '</ul></div>';
					markup = markup + '</div>'; // end of .current-settings.sequence 					
				
			//	}
			return markup;
	},

/****************************************************/
// SEQUENCE GROUP PHASE SELECTION 
	
	loadSeqStateDefinitionByPhase: function() {
		$('#seq-group-detail').find('.content .phase-selected').on('mousedown',function() {
			var thisSeqArrayLoc = $('#seq-group-detail').find('#seq-group-loc').val();

			var markup = '';
			var selectedPhases = [];
			$('#seq-group-state-def').find('.seq-group .values ul').empty();
			var phaseLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_phases.length;
			for (var i = 0; i < phaseLen; i++) {
				if ($.inArray((i + 1),allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_phases) != '-1' ) {
					markup = markup + '<li class=\'switch on\'></li>';
					selectedPhases.push(i + 1);
				} else {
					markup = markup + '<li class=\'switch\'></li>';
				}
			}	
			$('#seq-group-state-def').find('.seq-group .values ul').append(markup);

			var validStates = ConfigUI.identifyValidStates(selectedPhases);
			var markup = ConfigUI.generateStateMarkup(validStates,selectedPhases,thisSeqArrayLoc);
			$('#seq-group-state-def').find('.available-states ul').empty().append(markup);			
			setTimeout(function() { BaseUI.switchPanel('seq-group-state-def') }, delayTime );	
		});

		$('#seq-group-state-def').find('.seq-group ul').on('mousedown','li',function() {
			var thisObj = $(this);
			var thisIndex = thisObj.index();
			var thisSeqArrayLoc = $('#seq-group-detail').find('#seq-group-loc').val();
			if ($(this).parents('ul').find('.checked').length <= 8) {
				if ($(this).parent().parent().hasClass('not-available')) {
					// ignore it
				} else {
					if($(this).hasClass('on')) {
						if (ConfigUI.phaseIsInASequence(thisSeqArrayLoc,thisIndex + 1)) {
							$('#seq-group-state-def').find('.overlay #phase-selected').val(thisIndex);
							$('#seq-group-state-def').find('.overlay.confirm-discard').show();
						} else {
							$(this).removeClass('on');
							ConfigUI.updSeqGroupPhases();
							ConfigUI.updSeqPhaseSelected(thisSeqArrayLoc);
						}
					} else {
						$(this).addClass('on');
						ConfigUI.updSeqGroupPhases();
						ConfigUI.updSeqPhaseSelected(thisSeqArrayLoc);
					}
					
					
				}				
			} else {
				console.log('temporary limit');
			}
		});

		$('#seq-group-state-def').find('.overlay .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});

		$('#seq-group-state-def').find('.overlay .set').on('mousedown',function() {
			var phaseToDiscard = $('#seq-group-state-def').find('.overlay.confirm-discard #phase-selected').val();
			$('#seq-group-state-def').find('.seq-group ul li:eq(' + phaseToDiscard + ')').removeClass('on');
			ConfigUI.updSeqGroupPhases();
			var thisSeqArrayLoc = $('#seq-group-detail').find('#seq-group-loc').val();
			ConfigUI.removeAllSequences(thisSeqArrayLoc);
			$('#seq-group-detail').find('.current-settings.sequence .values ul').empty();
			ConfigUI.updSeqPhaseSelected(thisSeqArrayLoc);
			BaseUI.resetOverlay();
		});		

	},

	phaseIsInASequence: function(seqGroup,phase) {
		var seqLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence.length;
		for (var i = 0; i < seqLen; i++) {
			var stateLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[i].m_arrPhaseState.length;
			for (var j = 0; j < stateLen; j++) {
				var phaseLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[i].m_arrPhaseState[j].m_phases.length;
				for (var k = 0; k < phaseLen; k++) {
					var curPhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[i].m_arrPhaseState[j].m_phases[k];
					if (curPhase == phase) {
						return true;
					}
				}	
			}	
		}	
	},

	updSeqGroupPhases: function() {
		var phaseLen = $('#seq-group-state-def').find('.seq-group .values ul li').length;
		var thisSeqArrayLoc = $('#seq-group-detail').find('#seq-group-loc').val();
		var selectedPhases = [];
		for (var i = 0; i < phaseLen; i++) {
			if ($('#seq-group-state-def').find('.seq-group .values ul li:eq('+i+')').hasClass('on')) {
				allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_phases[i] = i + 1;
				selectedPhases.push(i + 1);
			} else {
				allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqArrayLoc].m_phases[i] = 0;
			}			
		}

		var validStates = ConfigUI.identifyValidStates(selectedPhases);
		var markup = ConfigUI.generateStateMarkup(validStates,selectedPhases,thisSeqArrayLoc);

		$('#seq-group-state-def').find('.available-states ul').empty().append(markup);
	},

/*******************************************/
// REMOVES ALL SEQUENCES FROM CURRENT SEQUENCE GROUP OF CURRENT CONFIG

	removeAllSequences: function(seqGroup) {
		var seqLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence.length;
		for (var i = 0; i < seqLen; i++) {
			allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_enabled = false;
			var seqLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence.length;
			for (var h = 0; h < seqLen; h++) {
				allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[h].m_enabled = false;
				var stateLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[i].m_arrPhaseState.length;
				for (var j = 0; j < stateLen; j++) {
					allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[i].m_arrPhaseState[j].m_enabled = false;
					var phaseLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[i].m_arrPhaseState[j].m_phases.length;			
					for (var k = 0; k < phaseLen; k++) {
						allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[i].m_arrPhaseState[j].m_phases[k] = 0;
					}	
				}					
			}	
		}
	},


/*******************************************/
// CHECK IF SEQ GROUP HAVE ACTIVE SEQUENCE; IF NONE, SET m_enabled TO FALSE
	checkSeqGroupForActiveSeq: function(seqGroup) {
		var seqLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence.length;
		activeSeqCount = 0;
		for (var i = 0; i < seqLen; i++) {
			if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[i].m_enabled === true ) {
				activeSeqCount = activeSeqCount + 1;
			}
		}

		if (activeSeqCount > 0) {
			allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_enabled = true;
		} else {
			allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_enabled = false;
		}
	},


/*******************************************/
// UPDATE A SEQUENCE GROUP SEQUENCE
	updateSeqGroupSequence: function() {

		// REMOVE STATE FROM CURRENT SEQUENCE

		$('#seq-group-seq-def').find('.content').on('mousedown','.current-settings .state',function() {
			var thisSeqGroup = parseInt($('#seq-group-detail').find('#seq-group-loc').val());
			var thisSeq = parseInt($('#seq-group-seq-def').find('.current-settings').attr('data-arr-seq-loc'));
			var thisState = $(this).index();
			allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[thisState].m_enabled = false;
			allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState.splice(thisState,1);

			ConfigUI.removeStateFromSeqGroup(thisSeqGroup,thisSeq,thisState);

 			var thisMarkup = $('#seq-group-seq-def').find('.current-settings').html();

 			$('#seq-group-detail').find('.current-settings.sequence:eq(' + thisSeq + ')').html($('#seq-group-seq-def').find('.current-settings').html());

			// Add empty state to compensate for the removal of the selected state	
			allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState.push({
				m_enabled: false,
				m_phases: [0,0]
			});

			// Set Sequence m_enabled to false if there are no active states
			var stateLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState.length;
			var activeStateCount = 0;	
			for (var i = 0; i < stateLen; i++) {
				if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_enabled == true) {
					activeStateCount = activeStateCount + 1;
				}
			}
			if (activeStateCount === 0) {
				allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_enabled = false;
				ConfigUI.checkSeqGroupForActiveSeq(thisSeqGroup);
			}

		});

		// ADD STATE TO CURRENT SEQUENCE
		$('#seq-group-seq-def').find('.available-states').on('mousedown','.state',function() {

			var thisObj = $(this);

			if (thisObj.hasClass('disabled')) {
				// ignore
			} else {

				var thisSeqGroup = $('#seq-group-detail').find('#seq-group-loc').val();
				var thisSeq = $('#seq-group-seq-def').find('.current-settings').attr('data-arr-seq-loc');
			
				if (thisObj.hasClass('single-state')) {
					var thisPhase = parseInt(thisObj.find('.phase-num-1').text());
					var stateLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState.length;	
					for (var i = 0; i < stateLen; i++) {
						if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_enabled == false) {
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_enabled = true;
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_phases[0] = thisPhase;
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_phases[1] = 0;
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_enabled = true;
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_enabled = true;
							break;
						}
					}	

				} else {
					var thisPhase1 = parseInt(thisObj.find('.phase-num-1').text());
					var thisPhase2 = parseInt(thisObj.find('.phase-num-2').text());
					var stateLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState.length;	
					for (var i = 0; i < stateLen; i++) {
						if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_enabled == false) {
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_enabled = true;
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_phases[0] = thisPhase1;
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_phases[1] = thisPhase2;
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_enabled = true;
							allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_enabled = true;
							break;
						}
					}	
				}

				$('#seq-group-seq-def').find('.content .current-settings').replaceWith(ConfigUI.generateSeqMarkup(thisSeqGroup,parseInt(thisSeq)));
				thisObj.remove();			

				var stateLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState.length;	
				var inactiveState = 0;
				for (var i = 0; i < stateLen; i++) {
					if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[thisSeqGroup].m_arrSequence[thisSeq].m_arrPhaseState[i].m_enabled == false) {
						inactiveState = inactiveState + 1;
					}
				}			

				if (inactiveState > 0) {
					$('#seq-group-seq-def').find('.available-states .state').removeClass('disabled');
				} else {
					$('#seq-group-seq-def').find('.available-states .state').addClass('disabled');
				}

				$('#seq-group-detail').find('.current-settings.sequence:eq(' + thisSeq + ')').html($('#seq-group-seq-def').find('.current-settings').html());				

			}

		});
	},

/*******************************************/
// REMOVES A STATE FROM A SEQUENCE GROUP
	removeStateFromSeqGroup: function(seqGroup,seq,state) {
			$('#seq-group-seq-def').find('.content .current-settings').replaceWith(ConfigUI.generateSeqMarkup(seqGroup,seq));
			
			// Make an array of selected phases
			var selectedPhases = [];
			var phaseLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_phases.length;
			for (var i = 0; i < phaseLen; i++) {
				var phaseNum = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_phases[i];
				if (phaseNum !== 0) {
					selectedPhases.push(phaseNum);
				}
			}	
			
			var validStates = ConfigUI.identifyValidStates(selectedPhases);

			var filteredStates = validStates;
			var validStatesLen = validStates.length;
			for (h = 0; h < validStatesLen; h++) {

	    	 	var stateLen = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seq].m_arrPhaseState.length;
	    	 	for (j = 0; j < stateLen; j++) {
	    	 		if (allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seq].m_arrPhaseState[j].m_enabled) {
	    	 			var arrFirstPhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seq].m_arrPhaseState[j].m_phases[0];
		    	 		var arrSecondPhase = allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_sequenceGroup[seqGroup].m_arrSequence[seq].m_arrPhaseState[j].m_phases[1];
		    	 		var tempState = (arrFirstPhase + ':' + arrSecondPhase).toString();

						if (tempState == validStates[h]) {
							var removeItem = 2; 
							 
							filteredStates = jQuery.grep(filteredStates, function(value) {
							    return value != tempState;
							});
						}

		    	 			    	 			
	    	 		}

	    	 	}

			}
			
			var availableMarkup = ConfigUI.generateStateMarkup(filteredStates,selectedPhases,seq);
			$('#seq-group-seq-def').find('.available-states .values ul').empty().append(availableMarkup);


	},


/*******************************************/
// GENERATES AN ARRAY OF VALID STATES BASED ON COMPATIBLE PHASE NUMBERS

	identifyValidStates: function(array) { // Array needs to be actualy phase numbers

		availableStates = xpermute(array);
		availableStates.sort();
		var validStates = [];
		// var curText, markup = '';
		 var availableStatesLen = availableStates.length;
		 for (h = 0; h < availableStatesLen; h++) {
			var tempText = availableStates[h];
	     	tempString = availableStates[h].split(':');
	     	firstPhase = parseInt(tempString[0]);
	     	secondPhase = parseInt(tempString[1]);

	     	var isCompatible = allWorkingData.InSpire.m_phaseCompatibility.m_bArrPhaseCompatibility[firstPhase - 1][secondPhase - 1];
	     	// ONLY INCLUDE IF PHASE COMPATIBLE
	     	if (isCompatible) {
	     		validStates.push(availableStates[h]);	     	
	     	}

		}	

		// Add single phase states
		 for (g = 0; g < array.length; g++) {
		 	validStates.push((array[g] + ':' + '0').toString());
		 }	


		return validStates;

		function swap(array, i, j) {
		    if (i != j) {
		        var swap = array[i];
		        array[i] = array[j];
		        array[j] = swap;
		    }
		}

		function permute_rec(res, str, array) {
		    if (array.length == 0) {

	    		if ((str.split(':').length - 1) == 2) { 
	    			str = str.substring(1);
	    			tempString = str.split(':');
	    			supVal = parseInt(tempString[0]);
	    			subVal = parseInt(tempString[1]);
	    			if (supVal < subVal) {
	    				res.push(str);
	    			}
	    		}

		    } else {
		        for (var i = 0; i < array.length; i++) {
		            swap(array, 0, i);
		            permute_rec(res, str + ':' + array[0], array.slice(1));
		            swap(array, 0, i);
		        }
		    }
		}

		function permute(array) {
		    var res = [];

		    permute_rec(res, "", array);
		    return res;
		}


		function xpermute_rec(res, sub, array) {
		    if (array.length == 0) {
		        if (sub.length > 0) permute_rec(res, "", sub);
		    } else {
		        xpermute_rec(res, sub, array.slice(1));
		        xpermute_rec(res, sub.concat(array[0]), array.slice(1));
		    }
		}

		function xpermute(array) {
		    var res = [];

		    xpermute_rec(res, [], array);
	    	return res;

		}

	},


	// calculateValidStates: function(array) {	

	// 	availableStates = xpermute(array);


	// 	availableStates.sort();

	// 	// Add single phase states
	// 	// for (g = 0; g < array.length; g++) {
	// 	//  	availableStates.push(array[g.toString()]);
	// 	// }	

	// 			console.log(availableStates);
	// 	console.log('state count ' + availableStates.length);

	// 	var curText = '';
	// 	var availableStatesLen = availableStates.length;
	// 	 for (h = 0; h < availableStatesLen; h++) {
	// 		var tempText = availableStates[h];
	// 	     	tempString = availableStates[h].split(':');
	// 	     	supVal = parseInt(tempString[0]);
	// 	     	subVal = parseInt(tempString[1]);
	// 	}

	// 	function swap(array, i, j) {
	// 	    if (i != j) {
	// 	        var swap = array[i];
	// 	        array[i] = array[j];
	// 	        array[j] = swap;
	// 	    }
	// 	}

	// 	function permute_rec(res, str, array) {
	// 	    if (array.length == 0) {

	//     		if ((str.split(':').length - 1) == 2) { 
	//     			str = str.substring(1);
	//     			tempString = str.split(':');
	//     			supVal = parseInt(tempString[0]);
	//     			subVal = parseInt(tempString[1]);
	//     			if (supVal < subVal) {
	//     				res.push(str);
	//     			}
	//     		}

	// 	    } else {
	// 	        for (var i = 0; i < array.length; i++) {
	// 	            swap(array, 0, i);
	// 	            permute_rec(res, str + ':' + array[0], array.slice(1));
	// 	            swap(array, 0, i);
	// 	        }
	// 	    }
	// 	}

	// 	function permute(array) {
	// 	    var res = [];

	// 	    permute_rec(res, "", array);
	// 	    return res;
	// 	}


	// 	function xpermute_rec(res, sub, array) {
	// 	    if (array.length == 0) {
	// 	        if (sub.length > 0) permute_rec(res, "", sub);
	// 	    } else {
	// 	        xpermute_rec(res, sub, array.slice(1));
	// 	        xpermute_rec(res, sub.concat(array[0]), array.slice(1));
	// 	    }
	// 	}

	// 	function xpermute(array) {
	// 	    var res = [];

	// 	    xpermute_rec(res, [], array);
	//     	return res;
	// 	}
	// },


	// checkifUSBisDetected: function() {
	// 	if (isUSBdetected == 'TRUE') {
	// 		$('.home .usb-options').removeClass('disabled');
	// 	} else {
	// 		$('.home .usb-options').addClass('disabled');
	// 	}
	
	// },

	// cycleStateCoordination: function() {
	// 	$('.seq-coord .bottom-strip .page-up-1').on('mousedown',function() {
	// 		var curSeq = $('.seq-coord .coord-set-1 .seq-group li.current').index();
	// 		$('.seq-coord .coord-set-1 .seq-group li.current').removeClass('current');
	// 		$('.seq-coord .coord-set-1 .coord-states .values div.current').removeClass('current');
	// 		if (curSeq == 0) {
	// 			$('.seq-coord .coord-set-1 .seq-group li:last-child').addClass('current');
	// 			$('.seq-coord .coord-set-1 .coord-states .values div:last-child').addClass('current');
	// 		} else {
	// 			curSeq = curSeq - 1;
	// 			$('.seq-coord .coord-set-1 .seq-group li:eq(' + curSeq + ')').addClass('current');
	// 			$('.seq-coord .coord-set-1 .coord-states .values div:eq(' + curSeq +')').addClass('current');
	// 		}
	// 	});
	// 	$('.seq-coord .bottom-strip .page-down-1').on('mousedown',function() {
	// 		var curSeq = $('.seq-coord .coord-set-1 .seq-group li.current').index();
	// 		$('.seq-coord .coord-set-1 .seq-group li.current').removeClass('current');
	// 		$('.seq-coord .coord-set-1 .coord-states .values div.current').removeClass('current');
	// 		if (curSeq == 2) {
	// 			$('.seq-coord .coord-set-1 .seq-group li:first-child').addClass('current');
	// 			$('.seq-coord .coord-set-1 .coord-states .values div:first-child').addClass('current');
	// 		} else {
	// 			curSeq = curSeq + 1;
	// 			$('.seq-coord .coord-set-1 .seq-group li:eq(' + curSeq + ')').addClass('current');
	// 			$('.seq-coord .coord-set-1 .coord-states .values div:eq(' + curSeq +')').addClass('current');
	// 		}		
	// 	});	
	// 	$('.seq-coord .bottom-strip .page-up-2').on('mousedown',function() {
	// 		var curSeq = $('.seq-coord .coord-set-2 .seq-group li.current').index();
	// 		$('.seq-coord .coord-set-2 .seq-group li.current').removeClass('current');
	// 		$('.seq-coord .coord-set-2 .coord-states .values div.current').removeClass('current');
	// 		if (curSeq == 0) {
	// 			$('.seq-coord .coord-set-2 .seq-group li:last-child').addClass('current');
	// 			$('.seq-coord .coord-set-2 .coord-states .values div:last-child').addClass('current');
	// 		} else {
	// 			curSeq = curSeq - 1;
	// 			$('.seq-coord .coord-set-2 .seq-group li:eq(' + curSeq + ')').addClass('current');
	// 			$('.seq-coord .coord-set-2 .coord-states .values div:eq(' + curSeq +')').addClass('current');
	// 		}
	// 	});
	// 	$('.seq-coord .bottom-strip .page-down-2').on('mousedown',function() {
	// 		var curSeq = $('.seq-coord .coord-set-2 .seq-group li.current').index();
	// 		$('.seq-coord .coord-set-2 .seq-group li.current').removeClass('current');
	// 		$('.seq-coord .coord-set-2 .coord-states .values div.current').removeClass('current');
	// 		if (curSeq == 2) {
	// 			$('.seq-coord .coord-set-2 .seq-group li:first-child').addClass('current');
	// 			$('.seq-coord .coord-set-2 .coord-states .values div:first-child').addClass('current');
	// 		} else {
	// 			curSeq = curSeq + 1;
	// 			$('.seq-coord .coord-set-2 .seq-group li:eq(' + curSeq + ')').addClass('current');
	// 			$('.seq-coord .coord-set-2 .coord-states .values div:eq(' + curSeq +')').addClass('current');
	// 		}	
	// 	});				
	// },



	// // get values from config file and render markup
	// getSequenceGroup: function() {
	// 	var markup = '';
	// 	for (a = 0; a < data.sequencegroup.length; a++) {

	// 		markup = markup + '<ul data-sg-id=' + (a + 1) + '>';

	// 		for (b = 0; b < 16; b++) {
	// 			markup = markup + '<li><div>';
	// 			var curValue = data.sequencegroup[a][b];
	// 			if (curValue == 1) {
	// 				markup = markup + '<span data-phase='+ (a + 1) + ' class=\'checked\'></span></div></li>';
	// 			} else {
	// 				markup = markup + '<span data-phase='+ (a + 1) + '></span></div></li>';
	// 			}
	// 		}
	// 		markup = markup + '</ul>';
	// 	}
	// 	$('.seq-group-assign .content .seq-group:nth-child('+ a +') .values').html(markup);
	// },



} // end of ConfigUI

//$(document).ready(ConfigUI.initialize);