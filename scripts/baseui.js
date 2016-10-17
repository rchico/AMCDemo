var BaseUI = {

	initialize: function () {

		window.tempConfig = [];		
		window.loadedConfig = 0;
		window.isDetectorTimerOn = false;
		window.isStatusTimerOn = false;
		window.isScreenTimerOn = false;
		window.objectNameChange;
		window.manOvrSet = false;		

		window.userName = '';
		window.delayTime = '250';
		window.appMode = "dev"; // prod, dev 
		window.timeoutDelay = 500; //
		window.opsTimeoutDelay = 1000;
		window.screensaverTime = 1200000;
		window.isScreensaverOn = true;

		window.domainLoc = document.location.host;
		if (domainLoc == '') {
			domainLoc = "127.0.0.1"; // Front Panel
	 		BaseUI.detectCalibrationReset();
	 		$('body').addClass('front-panel');
	 		BaseUI.goToUIUpdate();
	 		

		} else {
			$('body').addClass('remote-browser');
			BaseUI.goToFirmwareUpdate();
			BaseUI.goToUIUpdate();
			// Prevents the screensaver from running when viewing in remote browser
			window.isScreensaverOn = false;
		}


		inspireUrl = "http://" + domainLoc  + "/service/config/inspire/controller";
		systemUrl = "http://" + domainLoc   + "/service/status/inspire/controller/system";
		intStatusUrl = "http://" + domainLoc   + "/service/status/inspire/controller/intersection";
		manualOverrideUrl = "http://" + domainLoc   + "/service/config/inspire/controller/global/manual";
		detectorStatusUrl = "http://" + domainLoc   + "/service/status/inspire/controller/detector";	
		settingsUrl = "http://" + domainLoc   + "/service/config/inspire/VF6";
		opsStatusUrl = "http://" + domainLoc   + "/service/status/inspire/controller/operation";
		defaultsUrl = "http://" + domainLoc   + "/service/config/inspire/controller/default";

		if (appMode == 'dev' && domainLoc !== '') {
			inspireUrl = "http://" + domainLoc  + "/scripts/fakedata/inspire.js";
			systemUrl = "http://" + domainLoc  + "/scripts/fakedata/system.js";
			intStatusUrl = "http://" + domainLoc  + "/scripts/fakedata/intersection.js";
			manualOverrideUrl = "http://" + domainLoc  + "/scripts/fakedata/manualoverride.js";
			detectorStatusUrl = "http://" + domainLoc  + "/scripts/fakedata/detectorstatus.js";
			settingsUrl = "http://" + domainLoc   + "/scripts/fakedata/vf6settings.js";
			opsStatusUrl = "http://" + domainLoc   + "/scripts/fakedata/operation.js";
			defaultsUrl = "http://" + domainLoc   + "/scripts/static/default-inspire.js";			
		}


		window.weekday = new Array(7);
		 	weekday[0]=  "Sun";
		 	weekday[1] = "Mon";
		 	weekday[2] = "Tue";
		 	weekday[3] = "Wed";
		 	weekday[4] = "Thu";
		 	weekday[5] = "Fri";
		 	weekday[6] = "Sa";


		BaseUI.loadVersionId();

	 	// BaseUI.showPasscode();


		// THIS IS IT!
		BaseUI.getAll();

	 	BaseUI.keyboardEntry();
	 	BaseUI.keyboardCharRemove();	
	 	BaseUI.keyboardClearEntry();	
	 	BaseUI.keyboardSet(); 	

		BaseUI.goBackOne();
		BaseUI.goStraightHome();
	 	BaseUI.pageNext();
	 	BaseUI.pagePrevious();


	 	BaseUI.gotoChannelCompatibilityView();
	 	BaseUI.gotoPhaseCompatibilityView();	 	
	 	BaseUI.showNetworkSettings();
	 	BaseUI.showDateTimeSettings();
	 	BaseUI.showSystemId();

	 	BaseUI.globalUndo();
	 	// BaseUI.sequenceStateSelection();
	 	// BaseUI.sequenceGroupStateSelection();

	 	BaseUI.showCurrentDate();
	 	BaseUI.turnOffScreensaver();

	 	BaseUI.checkBeforeLeaving();

	// 	BaseUI.toggleOffsetLocation();

	 	//activeInterval = setInterval('Config')

	 	

		$('body.remote-browser').keypress(function(e){
		  var thisChar = String.fromCharCode( e.which );

		  // KEYPAD ENTRY
		  if($('.overlay.timing').is(':visible')) {
		  	if (thisChar == '1' || thisChar == '2' || thisChar == '3' || thisChar == '4' || thisChar == '5' || thisChar == '6' || thisChar == '7' || thisChar == '8' || thisChar == '9' || thisChar == '0'){
				$('.overlay.timing ul.keypad li[data-keypad-num='+thisChar+']').trigger('mousedown');
		  	} else if (thisChar == '.') {
		  		$('.overlay.timing ul.keypad li:nth-child(10)').trigger('mousedown');
		  	}
		  	return false;
		  	// if (e.keyCode == 46) {
		  	// 	$('.overlay.timing ul.keypad li:nth-child(11)').trigger('mousedown');
		  	// 	return false;
		  	// }

	//	  	$('.overlay.timing ul.keypad li[data-keypad-num='+thisChar+']').trigger('mousedown');
		  	
		  }

		  // KEYBOARD ENTRY
		  if ($('#keyboard-panel').is(':visible')) {
		  		var keyCode = (e.keyCode ? e.keyCode : e.which);
		  		console.log(keyCode);
		  		if (keyCode >= 48 && keyCode <= 90) {
		  			$('#keyboard-panel').find('.keyboard ul li[data-key='+thisChar+'] a').trigger('click');	  			
		  		} else if (keyCode >= 97 && keyCode <= 122) {
		  			$('#keyboard-panel').find('.keyboard ul li[data-key='+thisChar+'] a').trigger('click');
		  		}	
		  }
		});

		$('body.remote-browser .keyboard').keydown(function(e){
		  		var keyCode = (e.keyCode ? e.keyCode : e.which);
		  		if (keyCode == 8) {
		  			var thisChar = 'del';
		  			$('#keyboard-panel').find('.keyboard ul li[data-key='+thisChar+'] a').trigger('click');	 
		  			e.preventDefault();
		  			console.log('delete!!!2');
		  			//return false;
		  		}			
		});		


		$('#home').find('.tabs-home .tab-1').on('click',function() {
			$('#home').find('.tabs-home .tab.active').removeClass('active');
			$(this).addClass('active');
			$('#home').find('.tab-content.active').removeClass('active');
			$('#home').find('.tab-content-1').addClass('active');
		});

		$('#home').find('.tabs-home .tab-2').on('click',function() {
			$('#home').find('.tabs-home .tab.active').removeClass('active');
			$(this).addClass('active');
			$('#home').find('.tab-content.active').removeClass('active');
			$('#home').find('.tab-content-2').addClass('active');
		});

		$('#home').find('.tabs-home .tab-3').on('click',function() {
			$('#home').find('.tabs-home .tab.active').removeClass('active');
			$(this).addClass('active');
			$('#home').find('.tab-content.active').removeClass('active');
			$('#home').find('.tab-content-3').addClass('active');
		});

		$('#home').find('.tabs-home .tab-4').on('click',function() {
			$('#home').find('.tabs-home .tab.active').removeClass('active');
			$(this).addClass('active');
			$('#home').find('.tab-content.active').removeClass('active');
			$('#home').find('.tab-content-4').addClass('active');
		});		

		$('#home').find('.tab-content-2 .scroll-right').on('click',function() {
			$('#home').find('.tab-content-2 li:nth-child(1)').hide();
			$('#home').find('.tab-content-2 li:nth-child(2)').hide();
			$('#home').find('.tab-content-2 li:nth-child(3)').hide();
			$('#home').find('.tab-content-2 li:nth-child(4)').hide();
			$('#home').find('.tab-content-2 li:nth-child(5)').show();
			$('#home').find('.tab-content-2 li:nth-child(6)').show();
			$('#home').find('.tab-content-2 li:nth-child(7)').show();
			$('#home').find('.tab-content-2 li:nth-child(8)').show();
		});	

		$('#home').find('.tab-content-2 .scroll-left').on('click',function() {
			$('#home').find('.tab-content-2 li:nth-child(1)').show();
			$('#home').find('.tab-content-2 li:nth-child(2)').show();
			$('#home').find('.tab-content-2 li:nth-child(3)').show();
			$('#home').find('.tab-content-2 li:nth-child(4)').show();
			$('#home').find('.tab-content-2 li:nth-child(5)').hide();
			$('#home').find('.tab-content-2 li:nth-child(6)').hide();
			$('#home').find('.tab-content-2 li:nth-child(7)').hide();
			$('#home').find('.tab-content-2 li:nth-child(8)').hide();			
		});				

		var defaultPanel = 'home';
		$('.overlay').hide();
		$('.panel').hide();
		$('#' + defaultPanel + '').show();


		$('.secret-reload').on('mousedown',function() {
			location.reload();
		});


		// SECRET MENU 

		$('body.remote-browser #home').find('.secret-menu-link').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('secret-menu') }, delayTime );				
			}
		});	

		$('body.remote-browser #secret-menu').find('.inspire-obj-to-text').on('mousedown',function() {
			BaseUI.inSpireObjToText();		
		});			

		$('body.remote-browser #secret-menu').find('.update-ui-working-object').on('mousedown',function() {
			BaseUI.refreshAfterSaveOrUndo();		
			BaseUI.showNotificationModal('success','UI should reflect updated workingdata object','Click here to close this modal');
		});		
		// $('.home .home-nav-right').on('mousedown',function() {
		// 	var thisObj = $(this);
		// 	BaseUI.showNextMenuSet(thisObj,'.home');
		// });
		// $('.home .home-nav-left').on('mousedown',function() {
		// 	var thisObj = $(this);
		// 	BaseUI.showPrevMenuSet(thisObj,'.home');
		// });


/**************************************/
// MAIN MENU ACTIONS

		// List of configurations
		$('#home').find('.base-config').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('config-list') }, delayTime );				
			}
		});	

		// Intersection status
		$('#home').find('.intersection-status').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('not-ready')) {
				// ignore
			} else {
			//	BaseUI.addInverse(thisObj);
				var statusTimeout = setTimeout(function() { BaseUI.updateStatus() }, timeoutDelay );
				setTimeout(function() { BaseUI.switchPanel('intersection-status-view') }, delayTime );
			}
		});		

		// Detection status
		$('#home').find('.detection-status').on('mousedown',function() {
			var thisObj = $(this);
			//BaseUI.addInverse(thisObj);
	 		window.detectorTimeout = setTimeout('BaseUI.updateDetectorStatus()', 500 );			
			setTimeout(function() { BaseUI.switchPanel('status-detectors') }, delayTime );

		});	

		// Active Config
		$('#home').find('.current-config').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// ignore it
			} else {
				//BaseUI.addInverse(thisObj);
				configLoc = thisObj.attr('data-loc');
				loadedConfig = configLoc;
				ConfigUI.emptyConfigShell();
				ConfigUI.loadConfigInfo(configLoc);
				ConfigUI.updateConfigNameDisplayed(ConfigUI.getConfigNameByLoc(configLoc));
				$('#config-detail-home').find('#go-straight-back').attr('data-panel','home');
				setTimeout(function() { BaseUI.switchPanel('config-detail-home') }, delayTime );	
			}
		});

		// Startup Config settings
		$('#home').find('.startup-config').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('startup-config-def') }, delayTime );				
			}
		});				

		// Manual override
		$('#home').find('.manual-override').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// ignore
			} else {
			//	BaseUI.addInverse(thisObj);
				//console.log(manualWorkingData.length);
				if (manOvrSet == false) {
					ManualUI.initialize();	
				} else {
					setTimeout(function() { BaseUI.switchPanel('manual-override-view') }, delayTime );	
				}
							
			}
		});	

		// Preempt List
		$('#home').find('.preempt-list-link').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('preempt-list') }, delayTime );				
			}

		});		

		$('.settings').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('general-settings') }, delayTime );				
			}					
		});	
	

		// Schedule List
		$('#home').find('.schedule-list').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// ignore
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('schedule-overview') }, delayTime );					
			}		
		});				

		// Phase Initialization / Global Definition of phases
		$('#home').find('.global-def').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('global-phase-def') }, delayTime );				
			}
		});	
		

		$('.bottom-strip .go-back').on('mousedown',function() {
			var thisObj = $(this);
			var thisPanel = thisObj.attr('data-panel');
			//BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel(thisPanel) }, delayTime );
			BaseUI.turnOffTimers();				
		});





      $('#home').find('.file-upload').on('mousedown',function() {
      		BaseUI.showNotificationModal('reset','File upload','now');
            if (domainLoc == "127.0.0.1")
               {
                window.location = "http://" + domainLoc + "/cgi-bin/kernel_upload_usb.pl";
            }
            else
            {
                window.location = "http://" + domainLoc + "/cgi-bin/kernel_upload_file.pl";
        	}
      });


 	$('#home').find('.perl-test-link').on('mousedown',function() {
 		if ($(this).hasClass('disabled')) {
 			// do nothing
 		} else {
 			BaseUI.switchPanel('perl-test');	
 		}

	});


	 	$('#home').find('.load-defaults').on('mousedown',function() {
	 		if ($(this).hasClass('disabled')) {
	 			// do nothing
	 		} else {
	 			var diffCount = BaseUI.countChangesMade('all');
	 			if (diffCount > 0) {
	 				$('#home').find('.confirm-load-defaults').show();
	 			} else {
		 			BaseUI.loadDefaults();	
		 			BaseUI.switchPanel('config-list');
	 			}

	 				
	 		}

		});

		$('#home').find('.confirm-load-defaults .set').on('mousedown',function() {
				BaseUI.loadDefaults();	
				BaseUI.resetOverlay();
				BaseUI.switchPanel('config-list');
		});	

		$('#home').find('.confirm-load-defaults .cancel').on('mousedown',function() {
				BaseUI.resetOverlay();
		});	



	$('#perl-test').find('.submit-perl input').on('click',function() {

		var val1 = $('#perl-test').find('.content #value1').val();
		var val2 = $('#perl-test').find('.content #value2').val();




		var jqxhr =
		    $.ajax({
				type: 'post',
		        url: "/cgi-bin/kernel_upload_file.pl",
		        data: "value1=" + val1 + "&value2" + val2
		    })
			  .done(function(data) {			    
			  	console.log('success');

			  })
			  .fail(function() {
			  		console.log('did not work');
			  })
			  .always(function() {

			  });
	});

	},


	checkBeforeLeaving: function() {
		$(window).bind('beforeunload',function(){
			var diffCount = BaseUI.countChangesMade('all');
			if (diffCount > 0) {
				if ($('body').hasClass('remote-browser')) {
					return 'You have ' + diffCount + ' unsaved change(s).';
				} else {
					return 'You have ' + diffCount + ' unsaved change(s). Proceed anyway?';
				}
				
			}
		});
	},

	countChangesMade: function(type) {
		var count = 0;
		if (type === 'all') {
			count = $('.diff').length;
		}
		return count;
	},

/**************************************/
// TRANSITION MODE

	showTransitionMode: function() {
		$('body').addClass('in-transition');
	},

	hideTransitionMode: function() {
		$('body').removeClass('in-transition');
	},

	globalUndo: function() {
	 	$('#home').find('.undo-changes').on('mousedown',function() {
	 		if ($(this).hasClass('disabled')) {
	 			// do nothing
	 		} else {
	 			$('#home').find('.confirm-undo').show();
	 		}
		}); 


		$('#home').find('.confirm-undo .set').on('mousedown',function() {
				BaseUI.replaceWorkingWithPristine();
				BaseUI.resetOverlay();
		});	

		$('#home').find('.confirm-undo .cancel').on('mousedown',function() {
				BaseUI.resetOverlay();
		});	


	},


	replaceWorkingWithPristine: function() {
		delete allWorkingData;
		delete allPristineData;
		window.allWorkingData = jQuery.extend(true, {}, allUnsavedData);
		window.allPristineData = jQuery.extend(true, {}, allUnsavedData);		
		BaseUI.refreshAfterSaveOrUndo();
		BaseUI.showNotificationModal('reset','Undo Successful','Changes made have been removed; all values reflect information from the last save',true);
	},

	refreshAfterSaveOrUndo: function() {
		ConfigUI.loadConfigList();
		ConfigUI.emptyConfigShell();
		ConfigUI.loadConfigInfo(loadedConfig);
		
		GlobalUI.loadChannelCompatibility();
		GlobalUI.reloadGlobalInfo();
	},

	refreshAll: function() {
	//	BaseUI.setActiveHome();
		GlobalUI.initialize();
		PreemptUI.initialize();
		ConfigUI.initialize();
		ScheduleUI.initialize();
		SettingsUI.initialize();
	},

	gotoChannelCompatibilityView: function() {
		$('#home').find('.channel-compatibility').on('mousedown',function() {
			// var thisObj = $(this);
			// BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('channel-compatibility-view') }, delayTime );			
		});
	},

	gotoPhaseCompatibilityView: function() {
		$('#home').find('.phase-compatibility-link').on('mousedown',function() {
			// var thisObj = $(this);
			// BaseUI.addInverse(thisObj);
			setTimeout(function() { BaseUI.switchPanel('phase-compatibility-view') }, delayTime );			
		});
	},	

	detectCalibrationReset: function() {
		var timer;	
		$('body').on("mousedown",function(){
		    timer = setTimeout(function(){
		    	$('.panel.calibration').show();
		        window.calibrationCountdown = 10;
		        window.calibrationTimeout = setTimeout('BaseUI.showCalibrationCountdown()', 1000 );
		    },5*1000);
		}).on("mouseup mouseleave",function(){
		    clearTimeout(timer);
		});

		$('.panel.calibration .abort').on('mousedown',function() {
			clearTimeout(calibrationTimeout);
			$('.panel.calibration').hide();
			$('.panel.calibration .copy span').text('10');		
		});
	},

	showCalibrationCountdown: function() {
		calibrationCountdown = parseInt(calibrationCountdown - 1);
		$('.panel.calibration .copy span').text(calibrationCountdown);
		clearTimeout(calibrationTimeout);
		if (calibrationCountdown <= 0) {
			window.location.href = "http://" + domainLoc + "/cgi-bin/execute_calibrate_touchscreen.pl";
		} else {
			window.calibrationTimeout = setTimeout('BaseUI.showCalibrationCountdown()', 1000 );
		}

	},




	goBackOne: function() {
		$('.go-straight-back').on('mousedown',function() {
			var thisObj = $(this);
			var thisPanel = thisObj.attr('data-panel');
			setTimeout(function() { BaseUI.switchPanel(thisPanel) }, delayTime );
			BaseUI.turnOffTimers();				
		});
	},

	goStraightHome: function() {
		$('.go-straight-home').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				// var thisObj = $(this);
				// BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('home') }, delayTime );	
				BaseUI.turnOffTimers();
			}		
		});
	},

	goToFirmwareUpdate: function() {
		if ($('body').hasClass('remote-browser')) {
			$('#home').find('.update-firmware').show();	
		}			
		$('#home').find('.update-firmware').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// don't do anything
			} else {	
    	     	window.location = "http://" + domainLoc + "/cgi-bin/firmware_upload_file.pl";				
			}

		});
	},

	goToUIUpdate: function() {		
		$('#home').find('.update-ui').on('mousedown',function() {
			if ($('body').hasClass('remote-browser')) {
				window.location = "http://" + domainLoc + "/cgi-bin/kernel_upload_file.pl";		
			} else {	
    	     	window.location = "http://127.0.0.1/cgi-bin/kernel_upload_usb.pl";				
			}

		});
	},	


	getAll: function() {
		var jqxhr =
		    $.ajax({
		        url: inspireUrl,
		        dataType: 'text'
		    })
			  .done(function(data) {	
			    $('#home').find('.manual-override').addClass('disabled');			    
			    window.allUnsavedData = $.parseJSON(data);
			    window.allWorkingData = jQuery.extend(true, {}, allUnsavedData);
			    window.allPristineData = jQuery.extend(true, {}, allUnsavedData);
			    BaseUI.refreshAll();

				var opsStatusTimeout = setTimeout(function() { BaseUI.opsUpdateStatus() }, timeoutDelay );

			  })
			  .fail(function(jqxhr, textStatus, error) {

			  })
			  .always(function() {

			  });
			 
			// Perform other work here ...
	},

	loadDefaults: function() {
		var jqxhr =
		    $.ajax({
		        url: defaultsUrl,
		        dataType: 'text'
		    })
			  .done(function(data) {			    

			  	delete allUnsavedData;
			    delete allPristineData;
				delete allWorkingData;


			    $('#home').find('.manual-override').addClass('disabled');			    
			    window.allUnsavedData = $.parseJSON(data);
			    window.allWorkingData = jQuery.extend(true, {}, allUnsavedData);
			    window.allPristineData = jQuery.extend(true, {}, allUnsavedData);
			    BaseUI.refreshAll();



				loadedConfig = 0;
		 		ConfigUI.loadConfigList();
		 		ConfigUI.loadConfigMenuItems();
		 		ConfigUI.selectConfigToLoad();


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

	
				ConfigUI.loadSequenceGroup();
				ConfigUI.loadSeqStateDefinitionByPhase();
				ConfigUI.loadSeqDefinition();	
			 	ConfigUI.changeConfigurationName();
			 	ConfigUI.changeSequenceGroupName();
			 	ConfigUI.updateSeqGroupSequence();
			 	ConfigUI.toggleYellowBlanking();

				GlobalUI.loadChannelCompatibility();
				GlobalUI.reloadGlobalInfo();

				PreemptUI.getPreemptList();
				PreemptUI.togglePreemptEnabled();
				PreemptUI.selSingleState();
				PreemptUI.setupNumChanges();
				PreemptUI.toggleVehOneCall();
				PreemptUI.togglePedOneCall();

			//	SettingsUI.updIntersectionName();

				$('#home').find('.preempt-list-link').removeClass('disabled');
				BaseUI.showNotificationModal('reset','Defaults Loaded','Changes made have been removed; all values reflect information from the last save',true);
			  })
			  .fail(function(jqxhr, textStatus, error) {

			  })
			  .always(function() {

			  });
	},



	pageNext: function() {
		$('.bottom-strip .page-right').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// ignore it
			} else {
				BaseUI.showNextEightPhases($(this).parents('.panel'));
			}
		});
	},

	pagePrevious: function() {
		$('.bottom-strip .page-left').on('mousedown',function() {
			if ($(this).hasClass('disabled')) {
				// do nothing
			} else {
				BaseUI.showPreviousEightPhases($(this).parents('.panel'));
			}
			
		});
	},	

	showCurrentDate: function() {
		var d = new Date();

		var month = d.getMonth()+1;
		var day = d.getDate();

		var output = d.getFullYear() + '-' +
		    ((''+month).length<2 ? '0' : '') + month + '-' +
		    ((''+day).length<2 ? '0' : '') + day;
	
			var weekday = new Array(7);
			weekday[0]=  "Sun";
			weekday[1] = "Mon";
			weekday[2] = "Tue";
			weekday[3] = "Wed";
			weekday[4] = "Thu";
			weekday[5] = "Fri";
			weekday[6] = "Sa";

			var dow = weekday[d.getDay()];

		 $('.date').html(dow + '  ' + output);

	},

	showNextEightPhases: function(obj) {
	
			var lastVisiblePhase  = parseInt($('.current-settings.phase ul li:visible:last').index()) + 1;
			console.log('lastVisiblePhase is ' + lastVisiblePhase);
			if (lastVisiblePhase == 8 ) {

				obj.find('.values li:nth-child(1)').hide();
				obj.find('.values li:nth-child(2)').hide();
				obj.find('.values li:nth-child(3)').hide();
				obj.find('.values li:nth-child(4)').hide();
				obj.find('.values li:nth-child(5)').hide();
				obj.find('.values li:nth-child(6)').hide();
				obj.find('.values li:nth-child(7)').hide();
				obj.find('.values li:nth-child(8)').hide();	

			} else {
				obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 0) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 1) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 2) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 3) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 4) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 5) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 6) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 7) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase - 8) +')').hide();	

			}
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase + 1) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase + 2) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase + 3) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase + 4) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase + 5) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase + 6) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase + 7) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(lastVisiblePhase + 8) +')').show();

			 var lastVisiblePhase  = parseInt(obj.find('.current-settings.phase ul li:visible:last').index()) + 1;
			 var countVisiblePhase = parseInt(obj.find('.current-settings.phase:nth-child(1) ul li').length);

			 obj.find('.bottom-strip .page-left').removeClass('disabled');
			  if (lastVisiblePhase == countVisiblePhase)	{
					obj.find('.bottom-strip .page-right').addClass('disabled');
					obj.find('.panel').find('.bottom-strip .page-left').removeClass('disabled');
			  }	
		

	},

	showPreviousEightPhases: function(obj) {
			var firstVisiblePhase  = parseInt($('.current-settings.phase ul li:visible:first').index()) + 1;	
			if (firstVisiblePhase == 1 ) {
				$(this).parents('.panel').find('.bottom-strip .page-right').removeClass('disabled');
				$(this).parents('.panel').find('.bottom-strip .page-left').addClass('disabled');

			} else {
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 0) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 1) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 2) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 3) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 4) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 5) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 6) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 7) +')').hide();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase + 8) +')').hide();	

			}
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase - 1) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase - 2) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase - 3) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase - 4) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase - 5) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase - 6) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase - 7) +')').show();
				 obj.find('.values li:nth-child(' + parseInt(firstVisiblePhase - 8) +')').show();


			obj.find('.bottom-strip .page-right').removeClass('disabled');
			var firstVisiblePhase  = parseInt($('.current-settings.phase ul li:visible:first').index()) + 1;	
			if (firstVisiblePhase == 1 ) {
				obj.find('.bottom-strip .page-right').removeClass('disabled');
				obj.find('.bottom-strip .page-left').addClass('disabled');
			}	
	},	

	addInverse: function(obj) {
		obj.addClass('inverse');
		BaseUI.removeInverse();
	},



/**************************************************/
// KEYBOARD FUNCTION

	keyboardClearEntry: function() {
		$('#keyboard-panel').find('.clear-entry').on('mousedown', function() {
		 	BaseUI.keyboardCharClear();
		});
	},

	keyboardCharClear: function() {
		$('#keyboard-panel').find('.keyboard-entry input.current-text').val('');
		$('#keyboard-panel').find('.keyboard-entry .current-entry').text('_');
	},

	keyboardCharRemove: function() {
		var curText = $('.keyboard-entry input.current-text').val();
		var newText = curText.substring(0,curText.length - 1);
		$('#keyboard-panel').find('.keyboard-entry input.current-text').val(newText);
		$('#keyboard-panel').find('.keyboard-entry .current-entry').text(newText + '_');	
	},

	keyboardSet: function() {
		$('#keyboard-panel').find('.set').on('mousedown',function() {
			var curText = $('.keyboard-entry input.current-text').val();
			var newText = curText.substring(0,curText.length - 1);	
				if (newText != '') {
					if ($('#keyboard-panel').find('.item-to-change').val() == 'intersection-name') {
						SettingsUI.setIntersectionName(curText);
						SettingsUI.updIntersectionName();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'configuration-name') {
						allWorkingData.InSpire.m_controllerConfigurations[loadedConfig].m_configurationName = curText;
						ConfigUI.updateConfigNameDisplayed(loadedConfig);
						ConfigUI.loadConfigList();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'serial-number') {
						SettingsUI.setSerialNumber(curText);
						SettingsUI.updSerialNumber();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'eth0-mac') {
						SettingsUI.setEth0Mac(curText);
						SettingsUI.updEth0Mac();					
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'host-name') {
						SettingsUI.setHostName(curText);
						SettingsUI.updHostName();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'eth0-ipv4') {
						SettingsUI.setEth0ipv4(curText);
						SettingsUI.updEth0ipv4();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'ntpserver-2') {
						SettingsUI.setNtpServer2(curText);
						SettingsUI.updNtpServer2();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'ipv6-gateway') {
						SettingsUI.setIpv6Gateway(curText);
						SettingsUI.updIpv6Gateway();					
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'eth0-ipv6-1') {
						SettingsUI.setEth0ipv61(curText);
						SettingsUI.updEth0ipv61();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'eth0-ipv6-2') {
						SettingsUI.setEth0ipv62(curText);
						SettingsUI.updEth0ipv62();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'nameserver-1') {
						SettingsUI.setNameserver1(curText);
						SettingsUI.updNameserver1();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'nameserver-2') {
						SettingsUI.setNameserver2(curText);
						SettingsUI.updNameserver2();
					} else if ($('#keyboard-panel').find('.item-to-change').val() == 'seq-group-name') {
						ConfigUI.setSequenceGroupName(curText);
						ConfigUI.updSequenceGroupName();
					}	

			}
			var backLoc = $('#keyboard-panel #go-straight-back').attr('data-panel');
			BaseUI.switchPanel(backLoc);		
		});
	},	

	keyboardCharAdd: function(char) {
		var curText = $('.keyboard-entry input.current-text').val();
		curText = curText + char;
		$('#keyboard-panel').find('.keyboard-entry input.current-text').val(curText);
		$('#keyboard-panel').find('.keyboard-entry .current-entry').text(curText + '_');
	},

	keyboardEntry: function() {
		$('#keyboard-panel').find('.keyboard ul li a').on('mousedown',function() {
			var thisObj = $(this);
			var thisPos = thisObj.position();
			
			BaseUI.addInverse(thisObj);
			var thisChar = $(this).parent().attr('data-key');
			if (thisChar == 'del') {
				BaseUI.keyboardCharRemove();
			} else if (thisChar == 'abc') {
				$('.keyboard-num').hide();
				$('.keyboard-ucase').hide();
				$('.keyboard-lcase').show();
			} else if (thisChar == 'ABC') {
				$('.keyboard-num').hide();
				$('.keyboard-lcase').hide();
				$('.keyboard-ucase').show();
			} else if (thisChar == 'num') {
				$('.keyboard-lcase').hide();
				$('.keyboard-ucase').hide();
				$('.keyboard-num').show();					
			} else {
				BaseUI.keyboardCharAdd(thisChar);	
				BaseUI.showLastTyped(thisObj,thisPos.left,thisPos.top,thisChar);
			}
		});
	},

	overlayKeypadEntry: function() {
		$('.overlay.keypad li[data-keypad-num]').on('mousedown',function() {
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);	
			var keypadEntry = thisObj.attr('data-keypad-num');
			var curVal = $('.overlay.keypad #value-entered').val();

			if (thisObj.find('a').hasClass('backspace')) {
				// backspace functions
				newVal = curVal.substring(0,curVal.length - 1);
				$(this).parents('.panel').find('.overlay.keypad #value-entered').val(newVal);	
				$(this).parents('.panel').find('.overlay.keypad .new-info .value span').text(newVal + '_');
			} else {
				$(this).parents('.panel').find('.overlay.keypad #value-entered').val(curVal + keypadEntry);	
				$(this).parents('.panel').find('.overlay.keypad .new-info .value span').text(curVal + keypadEntry + '_');				
			}
			
		});
	},


	removeInverse: function(obj) {
		setTimeout(function() { $('.inverse').removeClass('inverse'); }, 125 )
	},


	resetOverlay: function() {
		$('.blur-this').removeClass('blur-this');
		$('.overlay').hide();
	},

	removeLastTyped: function() {
		setTimeout(function() { $('.last-typed').hide(); }, 300 )
	},


	showLastTyped: function(obj,lPos,tPos,char) {
			var lastTyped = $('.last-typed');
			lastTyped.css({
				'left': lPos,
				'top': tPos - 62
			});
			lastTyped.find('span').text(char);
			lastTyped.show();
			BaseUI.removeLastTyped();
	},



	showPasscode: function() {
		$('.access-lock').on('mousedown',function() {
			// var thisObj = $(this);
			// if (thisObj.hasClass('disabled')) {
			// 	// ignore it
			// } else {
			// 	BaseUI.addInverse(thisObj);
			// 	setTimeout(function() { BaseUI.switchPanel('passcode') }, delayTime );				
			// }
		});
	},

	showNextMenuSet: function(obj,parent) {
		obj.parent().find('.main-selection-frame ul').css('left', '-683px');
		$(parent + ' .home-nav-left').removeClass('disabled');
		$(parent + ' .home-nav-right').addClass('disabled');
	},

	showPrevMenuSet: function(obj,parent) {
		obj.parent().find('.main-selection-frame ul').css('left', '1px');
		$(parent + ' .home-nav-left').addClass('disabled');
		$(parent + ' .home-nav-right').removeClass('disabled');	
	},

	switchPanel: function(newPanel) {
		$('.inverse').removeClass('inverse');
		$('.overlay').hide();
		$('.panel').hide();
		$('#' + newPanel + '').show();
		BaseUI.resetScreensaver();
	},

	showFirstEightOnly: function(newPanel) {
		$('#' + newPanel + '').find('.values ul li').css('display','none');
		for (g = 0; g < 9; g++) {
			$('#' + newPanel + '').find('.values ul li:nth-child(' + g + ')').css('display','block');
		}
	},	

	toggleHelpMode: function() {
		$('.help').on('mousedown',function() {
			var thisObj = $(this).find('a');
			if (thisObj.hasClass('on')) {
				$('body').removeClass('show-help-popup');
				thisObj.removeClass('on');
			} else {
				$('body').addClass('show-help-popup');
				thisObj.addClass('on');
			}
			// Start adding help-popup markers 

		});
	},

	toggleOffsetLocation: function() {
		$('.seq-coord .offset-location div span').on('mousedown',function() {
			$('.seq-coord .offset-location .switch').removeClass('on');
			$(this).parent().find('.switch').addClass('on');
		});
	},

	translateWidthPercent: function(remaining,total) {
		var width = 0;
		width = (remaining/total)*100;
		return width;
	},

/**************************************************/
// TRANSLATION FUNCTIONS

	translateTime: function(hours,minutes,seconds) {
	    if (minutes < 10) {minutes = "0"+minutes;}
	    var time    = hours+':'+minutes;
	    return time;
	} ,

	translateStartupConfig: function(val) {
		var startupArr = ['all-red','cabinet-flash'];
		var startup = startupArr[val];
		return startup;
	},


	translateDayOfWeek: function(val) {
		if (val == 1) {
			val = 0;
		} else if (val == 2) {
			val = 1;
		} else if (val == 4) {
			val = 2;
		} else if (val == 8) {
			val = 3;
		} else if (val == 16) {
			val = 4;
		} else if (val == 32) {
			val = 5;
		} else if (val == 64) {
			val = 6;
		}
		var dayArr = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
		var day = dayArr[val];
		return day;
	},

	translateMovement: function(val) {
		var movement = '';
		var movementArr = ['na','nl','nt','nr','sl','st','sr','el','et','er','wl','wt','wr'];
		if (val > 12) {
			val = 0;
		}
		movement = movementArr[val];
		return movement;
	},

	checkMovementCompatibility: function(first,second) {
		var compatibleArr = [
				[0],
				[2,4],
				[1,5],
				[8,11],
				[1,5],
				[2,4],
				[7,10],
				[8,10],
				[7,11],
				[1,4],
				[7,11],
				[8,10],
				[1,4]
			];
			console.log('iscompatible' + $.inArray(second,compatibleArr[1]));
		//	console.log($.inArray[second,compatibleArr[first][]]);
		//return $.inArray[second,compatibleArr[first]];
	},


	translateRecall: function(val) {
		var recall = '';

		if (val == 0) {
			recall = 'none';
		} else if (val == 1) {
			recall = 'min';
		} else if (val == 2) {
			recall = 'max';
		} else if (val == 3) {
			recall = 'soft';
		} 
		return recall;

	},


	translateVehicleStartup: function(val) {
		var startup = '';

		if (val == 0) {
			startup = 'red';
		} else if (val == 1) {
			startup = 'yellow';
		} else if (val == 2) {
			startup = 'green';
		} 
		return startup;

	},

	translateOverlapType: function(val) {
		var type = '';

		if (val == 0) {
			type = 'std';
		} else if (val == 1) {
			type = 'tmd';
		} 
		return type;
	},		

	translateStartupLight: function(val) {
		var light = '';

		if (val == 1) {
			light = 'red';
		} else if (val == 2) {
			light = 'yellow';
		} else if (val == 3) {
			light = 'green';
		} else {
			light = 'none'
		}
		return light;
	},	

	translateStartupPed: function(val) {
		var light = '';

		if (val == 0) {
			light = '';
		} else if (val == 1) {
			light = 'dont-walk';
		} else if (val == 2) {
			light = 'yellow';
		} else if (val == 3) {
			light = 'walk';
		}  
		return light;
	},		

	translateLeftTurn: function(val) {
		var mode = '';
		var modeArray = ['na','pr','pe','prpe'];
		if (val > 3) {
			val = 0;
		}
		mode = modeArray[val];
		return mode;

	},

	translatePreemptType: function(val) {
		var typeArr = ['rr','evp','tsp'];
		var type = typeArr[val];
		return type;

	},




	triggerRadio: function(thisObj) {
		BaseUI.addInverse(thisObj);
		thisObj.find('input').attr('checked','checked');
	},

	turnOffTimers: function() {
		if (typeof statusTimeout !== 'undefined') {
	    		clearTimeout(statusTimeout);
    	}		
		if (typeof detectorTimeout !== 'undefined') {
	    		clearTimeout(detectorTimeout);
    	}		
	},

	updateClock: function(year,month,day,hour,min,sec) {

	    $('.configuration-name-frame').removeClass('ajax-fail');


	    hour = ( hour > 12 ) ? hour - 12 : hour;
	    min = (min < 10 ? "0" : "" ) + min;
	    sec = (sec < 10 ? "0" : "" ) + sec;
	    var curTime = hour + ":" + min + ":" + sec;
	    
	    var dow = weekday[day];
 		var curDate = dow + ' ' + year + '-' + ((''+month).length<2 ? '0' : '') + month + '-' + ((''+day).length<2 ? '0' : '') + day;

		$('.clock').html(curDate + ' ' + curTime);
	
	},	

	updateDetectorStatus: function() {
		isDetectorTimerOn = true;
		var jqxhr =
		    $.ajax({
		       	url: detectorStatusUrl,
		        dataType: 'json'
		    })
			  .done(function(data) {
  			    $('#comm-status').removeClass('ajax-fail');			    
			//    var detectorData = $.parseJSON(data);
				var detectorData = data;

				//DETECTOR STATUS - Vehicle
				$('#status-detectors').find('.vehicle-status').empty();
				//$('.status-detectors .vehicle-status li div').removeClass('active');
				var markup = '';
				var vehDetActLen = detectorData.Status.m_vehicleDetectorStatus.m_vehDetectorActuation.length;
				for (var i = 0; i < vehDetActLen; i++) {
					var statusClass = '';
					var failClass = '';
					var lockClass = '';
					if (detectorData.Status.m_vehicleDetectorStatus.m_vehDetectorActuation[i] == true) {
						statusClass = statusClass + 'on';
					}
					if (detectorData.Status.m_vehicleDetectorStatus.m_vehDetectorFailOff[i] == true) {
						failClass = 'fail-off';
					}
					if (detectorData.Status.m_vehicleDetectorStatus.m_vehDetectorFailOn[i] == true) {
						failClass = 'fail-on';
					}
					if (detectorData.Status.m_vehicleDetectorStatus.m_vehDetectorLocked[i] == true) {
						lockClass = ' on';
					}					
					markup = markup + '<li class=' + statusClass + '><div class=\'active\'>'+
										'<span class=\'det-id\'>v' + (i + 1) + '</span>'+
										'<span class=\'det-status ' + failClass + '\'></span>'+
										'<span class=\'lock-status'+lockClass+'\'></span>'+
										'</div></li>';
															 
				}
				$('#status-detectors').find('.vehicle-status').append(markup);	

				//DETECTOR STATUS - Pedestrian
				$('#status-detectors').find('.pedestrian-status').empty();
				var markup = '';
				var pedDetActLen = detectorData.Status.m_pedDetectorStatus.m_pedDetectorActuation.length;
				for (var i = 0; i < pedDetActLen; i++) {
					var statusClass = '';
					var failClass = '';
					if (detectorData.Status.m_pedDetectorStatus.m_pedDetectorActuation[i] == true) {
						statusClass = statusClass + ' on';
					}
					if (detectorData.Status.m_pedDetectorStatus.m_pedDetectorFailOn[i] == true) {
						failClass = 'fail-on';
					}				
					markup = markup + '<li class=' + statusClass + '><div class=\'active\'>'+
										'<span class=\'det-id\'>p' + (i + 1) + '</span>'+
										'<span class=\'det-status ' + failClass + '\'></span>'+
										'</div></li>';
															 
				}
				$('#status-detectors').find('.pedestrian-status').append(markup);		


			  })
			  .fail(function() {
			    	$('#comm-status').addClass('ajax-fail');
			  })
			  .always(function() {
	 			  detectorTimeout = setTimeout('BaseUI.updateDetectorStatus()', timeoutDelay );	
			  });
			 
			// Perform other work here ...
			 
			// Set another completion function for the request above
			jqxhr.always(function() {
		//	  alert( "second complete" );
			});	

	},	

	opsUpdateStatus: function() {
		var jqxhr =
		    $.ajax({
		       	url: opsStatusUrl,
		        dataType: 'json'
		    })
			  .done(function(data) {
  			    $('#comm-status').removeClass('ajax-fail');			    
				var opsData = data;
				window.activeConfigId = opsData.Status.m_activeConfId;
				//window.activeConfigId = 1;
				if (activeConfigId > 0) {
					var activeConfigName = ConfigUI.getConfigNameById(activeConfigId);
					// KLUGE
					//activeConfigName = 'Active Config';
					if (opsData.Status.m_configurationTransition === true) {
						BaseUI.showTransitionMode();
						
					} else {
						BaseUI.hideTransitionMode();

					}
					// UPDATE LINK TO ACTIVE CONFIG ON HOME
					var activeConfigLoc = ConfigUI.getConfigArrayLoc(activeConfigId);
					ConfigUI.setActiveConfig(activeConfigLoc,activeConfigName);

					// UPDDATE LINK TO ACTIVE CONFIG ON CONFIG LIST
					ConfigUI.identifyActiveConfigOnList(activeConfigLoc);
					ConfigUI.updateConfigNameDisplayed(activeConfigName,true);
				}




				// UPDDATE CLOCK

				var day = opsData.Status.m_dateTime.m_date.m_day;
				var month = opsData.Status.m_dateTime.m_date.m_month;
				var year = opsData.Status.m_dateTime.m_date.m_year;

				var hour = opsData.Status.m_dateTime.m_time.m_hour24;
				var min =  opsData.Status.m_dateTime.m_time.m_min;
				var second = opsData.Status.m_dateTime.m_time.m_sec;

				BaseUI.updateClock(year,month,day,hour,min,second);

				opsStatusTimeout = setTimeout('BaseUI.opsUpdateStatus()', opsTimeoutDelay );	

			  })
			  .fail(function() {
			    	$('#comm-status').addClass('ajax-fail');
			  })
			  .always(function() {
	 			  
			  });
			 
			// Perform other work here ...
			 
			// Set another completion function for the request above
			jqxhr.always(function() {
		//	  alert( "second complete" );
			});	
	},

	updateStatus: function() {
		isStatusTimerOn = true;
		timeTrackerStart = new Date().getTime();
		var jqxhr =
		    $.ajax({
		       url: intStatusUrl,
		       dataType: 'json'
		    })
			  .done(function(data) {			
   			    
	 		    window.statusData = data;

   			    $('#comm-status').removeClass('ajax-fail');

				var interSectionStatusViewPanel = $('#intersection-status-view');


				// ACTIVE PREEMPT DETECTED
				// var thisObj = $('#preempt-info');
				// var thisPreemptId = statusData.Status.m_activePreemptId;
				// if (thisPreemptId > 0) {
				// 	var preemptRemainingTime = statusData.Status.m_preemptMaxTimer.m_msRemaining;
				// 	var preemptTotalTime = statusData.Status.m_preemptMaxTimer.m_msTime;
				// 	var newWidth = BaseUI.translateWidthPercent(preemptRemainingTime,preemptTotalTime);
				// 	thisObj.find('.bar').css('width',newWidth + '%');
				// 	thisObj.find('label').text('Preempt ' + thisPreemptId);
				// 	thisObj.find('.time-remaining').text((preemptRemainingTime/1000).toFixed(1));
				// 	thisObj.find('.total-time').text((preemptTotalTime/1000).toFixed(1));
				// 	thisObj.show();
				// } else {
				// 	thisObj.hide();
				// }

				var fullMarkup = '<div class=\'variable-info\'>';


				// STOP TIME DETECTED
				var isStopTimeOn = statusData.Status.m_stopTime;
				if (isStopTimeOn) {
					fullMarkup = fullMarkup + '<div id=\'stop-time\'><label>Stop Time</label></div>';
				}


				// ACTIVE PREEMPT DETECTED
				var thisPreemptId = statusData.Status.m_activePreemptId;
				if (thisPreemptId > 0) {

					var preemptRemainingTime = statusData.Status.m_preemptMaxTimer.m_msRemaining;
					var preemptTotalTime = statusData.Status.m_preemptMaxTimer.m_msTime;
					var newWidth = BaseUI.translateWidthPercent(preemptRemainingTime,preemptTotalTime);
					var timeRemaining = (preemptRemainingTime/1000).toFixed(1);
					var totalTime = (preemptTotalTime/1000).toFixed(1);

					fullMarkup = fullMarkup + '<div id=\'preempt-info\'><label>Preempt ' + thisPreemptId + '</label><div class=\'values\'>';
					fullMarkup = fullMarkup + '<div class=\'time-remaining\'>' + timeRemaining + '</div>';
					fullMarkup = fullMarkup + '<div class=\'graph\'><div class=\'bar\' style=\'width:' + newWidth + '%\'></div></div>';
					fullMarkup = fullMarkup + '<div class=\'total-time\'>' + totalTime + '</div>';
					fullMarkup = fullMarkup + '</div></div>'; // end of preempt-info
				}	




				fullMarkup = fullMarkup + '</div>'; // end of variable-info
				fullMarkup = fullMarkup + '<div class=\'channel-light-status\'><div class=\'channel-status-bar\'></div>' +
										'<div class=\'status-label\'>Channel Status</div>' +
										'<div class=\'values\'>';

				// CHANNEL STATUS
				//interSectionStatusViewPanel.find('.channel-light-status .values ul').detach(); 

				var redStatusLength = statusData.Status.m_channelRedStatus.length;
				var redStatusMarkup = '<ul class=\'row-1\'>';
				for (var i = 0; i < redStatusLength; i++) {
					if (statusData.Status.m_channelRedStatus[i] == true) {
						redStatusMarkup = redStatusMarkup + '<li><div class=\'on\'></div></li>';
					} else {
						redStatusMarkup = redStatusMarkup + '<li><div></div></li>';
					}
				}
				redStatusMarkup = redStatusMarkup + '</ul>';
			//	interSectionStatusViewPanel.find('.channel-light-status ul.row-1').html(redStatusMarkup);	

				var yellowStatusLength = statusData.Status.m_channelYellowStatus.length;
				var yellowStatusMarkup = '<ul class=\'row-2\'>';
				for (var i = 0; i < yellowStatusLength; i++) {
					if (statusData.Status.m_channelYellowStatus[i] == true) {
						yellowStatusMarkup = yellowStatusMarkup + '<li><div class=\'on\'></div></li>';
					} else {
						yellowStatusMarkup = yellowStatusMarkup + '<li><div></div></li>';
					}
				}
				yellowStatusMarkup = yellowStatusMarkup + '</ul>';
				//interSectionStatusViewPanel.find('.channel-light-status ul.row-2').html(yellowStatusMarkup);		

				var greenStatusLength = statusData.Status.m_channelGreenStatus.length;
				var greenStatusMarkup = '<ul class=\'row-3\'>';
				for (var i = 0; i < greenStatusLength; i++) {
					if (statusData.Status.m_channelGreenStatus[i] == true) {
						greenStatusMarkup = greenStatusMarkup + '<li><div class=\'on\'></div></li>';
					} else {
						greenStatusMarkup = greenStatusMarkup + '<li><div></div></li>';
					}
				}
				greenStatusMarkup = greenStatusMarkup + '</ul>';

				fullMarkup = fullMarkup + redStatusMarkup + yellowStatusMarkup + greenStatusMarkup + '</div>';

				channelStatusMarkup = '<div class=\'label\'><ul>';
				for (var i = 0; i < greenStatusLength; i++) {
					channelStatusMarkup =  channelStatusMarkup + '<li><div><span>' + (i + 1) + '</span></div></li>';
				}
				channelStatusMarkup = channelStatusMarkup + '</ul></div>';	

				fullMarkup = fullMarkup + channelStatusMarkup + '</div>';

				// VEHICLE PHASE 
				// On
//				interSectionStatusViewPanel.find('.vehicle-phase-calls ul').detach();
				var vehiclePhaseCallsMarkup = '<div class=\'vehicle-phase-label\'>Vehicle Phases</div><div class=\'vehicle-phase-calls\'><ul>';
				var vehiclePhaseOnLength = statusData.Status.m_vehPhaseOn.length;
				for (var i = 0; i < vehiclePhaseOnLength; i++) {
					var phaseIsOn = statusData.Status.m_vehPhaseOn[i];
					var phaseIsNext = statusData.Status.m_vehPhaseNext[i];
					var phaseIsCall = statusData.Status.m_vehPhaseCalls[i];
					var liClass = BaseUI.translateRecall(statusData.Status.m_vehPhaseRecalls[i]);
					if (phaseIsOn) {
						liClass = liClass + ' on';
					}
					if (phaseIsNext) {
						liClass = liClass + ' next';
					}
					if (phaseIsCall) {
						liClass = liClass + ' called';
					}
					vehiclePhaseCallsMarkup = vehiclePhaseCallsMarkup + '<li class=\'' + liClass + '\'><div class=\'call\'></div><div class=\'value\'>' + (i + 1) + '</div><span></span></li>';

				}	
				vehiclePhaseCallsMarkup = vehiclePhaseCallsMarkup + '</ul></div>';

				fullMarkup = fullMarkup + vehiclePhaseCallsMarkup;




				vehicleStateStatusMarkup = '<div class=\'state-status\'><div class=\'state\'>';

				var vehiclePhaseTimersLength = statusData.Status.m_vehiclePhaseTimers.length;

				for (var i = 0; i < vehiclePhaseTimersLength; i++) {
					var curPhase = statusData.Status.m_vehiclePhaseTimers[i].m_phaseNum;
					var curOutput = statusData.Status.m_vehiclePhaseTimers[i].m_timingSection;
						
					if (statusData.Status.m_vehiclePhaseTimers[i].m_active) {
						vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase phase-' + (i + 1) + '\'>';
						vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-value phase-value-' + (i + 1) + '\'>';
						
						if (activeConfigId > 0) {
							movement = allPristineData.InSpire.m_controllerConfigurations[loadedConfig].m_vehiclePhase[curPhase - 1].m_movementDirection;
							movementDir = BaseUI.translateMovement(movement);							
						} else {
							movementDir = 'na';
						}

						vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<span class=\'value dir-'+ movementDir +'\'>' + curPhase + '</span></div>';
						vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'status-times\'><ul>';
				
				 		if (curOutput == 4) {

							// MIN

							var minRemaining = statusData.Status.m_vehiclePhaseTimers[i].m_minGreenTimer.m_msRemaining;
								minRemaining = (minRemaining/1000).toFixed(1);
							var minTotal = statusData.Status.m_vehiclePhaseTimers[i].m_minGreenTimer.m_msTime;
								minTotal = (minTotal/1000).toFixed(1);

							vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'min-time\'><div>';
							vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Min</div>';
							vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + BaseUI.translateWidthPercent(minRemaining,minTotal) + '%\'></div></div>';
							vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>' + minTotal + '</div>';
							vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';

							// MAX

				 			var maxOut = statusData.Status.m_vehiclePhaseTimers[i].m_maxOut;
				 			if (maxOut) {
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'max-time\'><div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Max</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + 0 + '%\'></div></div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>OUT</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';

				 			} else {
				 				var maxRemaining = statusData.Status.m_vehiclePhaseTimers[i].m_maxGreenTimer.m_msRemaining;
				 				maxRemaining = (maxRemaining/1000).toFixed(1);
				 				var maxTotal = statusData.Status.m_vehiclePhaseTimers[i].m_maxGreenTimer.m_msTime;
				 				maxTotal = (maxTotal/1000).toFixed(1);
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'max-time\'><div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Max</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + BaseUI.translateWidthPercent(maxRemaining,maxTotal) + '%\'></div></div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>' + maxTotal + '</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';
				 			}

							// GAP/PASSAGE
							var gapOut = statusData.Status.m_vehiclePhaseTimers[i].m_gapOut;
							if (gapOut) {
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'gap-time\'><div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Gap</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + 0 + '%\'></div></div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>OUT</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';									
							} else {
								var gapRemaining = statusData.Status.m_vehiclePhaseTimers[i].m_passageTimer.m_msRemaining;
								gapRemaining = (gapRemaining/1000).toFixed(1);
								var gapTotal = statusData.Status.m_vehiclePhaseTimers[i].m_passageTimer.m_msTime;
								gapTotal = (gapTotal/1000).toFixed(1);
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'gap-time\'><div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Gap</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + BaseUI.translateWidthPercent(gapRemaining,gapTotal) + '%\'></div></div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>' + gapTotal + '</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';																
							}

						} else if (curOutput == 2) {
							// YELLOW
								var yellowRemaining = (statusData.Status.m_vehiclePhaseTimers[i].m_yellowTimer.m_msRemaining/1000).toFixed(1);
								var yellowTotal = (statusData.Status.m_vehiclePhaseTimers[i].m_yellowTimer.m_msTime/1000).toFixed(1);
									vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'amb-time\'><div>';
									vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Yel</div>';
									vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + BaseUI.translateWidthPercent(yellowRemaining,yellowTotal) + '%\'></div></div>';
									vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>' + yellowTotal + '</div>';
									vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';										

									var maxOut = statusData.Status.m_vehiclePhaseTimers[i].m_maxOut;
									if (maxOut) {
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'max-time\'><div>';
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Max</div>';
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + 0 + '%\'></div></div>';
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>OUT</div>';
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';
									}
									var gapOut = statusData.Status.m_vehiclePhaseTimers[i].m_gapOut;
									if (gapOut) {
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'gap-time\'><div>';
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Gap</div>';
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + 0 + '%\'></div></div>';
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>OUT</div>';
										vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';
									}										
						} else if (curOutput == 1) {
							// RED
								var redRemaining = (statusData.Status.m_vehiclePhaseTimers[i].m_redTimer.m_msRemaining/1000).toFixed(1);
								var redTotal = (statusData.Status.m_vehiclePhaseTimers[i].m_redTimer.m_msTime/1000).toFixed(1);
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<li class=\'red-time\'><div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'time-label\'>Red</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-graph\'><div style=\'width:' + BaseUI.translateWidthPercent(redRemaining,redTotal) + '%\'></div></div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '<div class=\'phase-total\'>' + redTotal + '</div>';
								vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></li>';					
						}

						//

						vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</ul></div></div>';
					}	
				}
				vehicleStateStatusMarkup = vehicleStateStatusMarkup + '</div></div>';

				// PED PHASE
				var pedPhaseCallsMarkup = '<div class=\'ped-phase-label\'>Pedestrian Phases</div><div class=\'ped-phase-calls\'><ul>';
				var pedPhaseOnLength = statusData.Status.m_pedPhaseOn.length;
				for (var i = 0; i < pedPhaseOnLength; i++) {
				 	var phaseIsOn = statusData.Status.m_pedPhaseOn[i];
				 	var phaseIsNext = statusData.Status.m_pedPhaseNext[i];
				 	var phaseIsCall = statusData.Status.m_pedPhaseCalls[i];
				 	var phaseNum = i + 1;
				 	var liClass = '';
				 	var isCallOn = '';
				 	if (phaseIsOn) {
				 		liClass = 'on';
				 	}
				 	if (phaseIsNext) {
				 		liClass = 'next';
				 	}
				 	if (phaseIsCall) {
				 		liClass = liClass + ' called';
				 	}					
				 	pedPhaseCallsMarkup = pedPhaseCallsMarkup + '<li class=\'' + liClass + '\'><div class=\'call\'></div><div class=\'value\'>' + phaseNum + '<span></span></div></li>';
				}
				pedPhaseCallsMarkup = pedPhaseCallsMarkup + '</ul></div>';

				// Get Active Ped Phase

				var pedStatusTimesMarkup = '<div class=\'ped-status-times\'>';

				for (var i = 0; i < 2; i++) {

				 	if(statusData.Status.m_pedPhaseTimers[i].m_active) {
				 		var phaseNum = i + 1;
						//console.log(phaseNum);
				 		var curPhase = statusData.Status.m_pedPhaseTimers[i].m_phaseNum;						
				 		if (statusData.Status.m_pedPhaseTimers[i].m_restingInWalk == true) {
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-'+ phaseNum +'\'>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-num\'>' + curPhase + '</div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<ul><li class=\'rest-walk-time\'>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<span class=\'time-label\'>Rest<div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '</div></span></li></ul></div>';

				 		} else {

				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-'+ phaseNum +'\'>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-num\'>' + curPhase + '</div><ul>';

				 			var walkTotalTime = statusData.Status.m_pedPhaseTimers[i].m_walkTimer.m_msTime;
				 				walkTotalTime = (walkTotalTime/1000).toFixed(1);
				 			var walkRemainTime = statusData.Status.m_pedPhaseTimers[i].m_walkTimer.m_msRemaining;
				 			 	walkRemainTime = (walkRemainTime/1000).toFixed(1);
				 			var walkNewWidth = BaseUI.translateWidthPercent(walkRemainTime,walkTotalTime);



				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<li class=\'walk-time\'>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<span class=\'time-label\'>Walk</span><div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-value\'>' + walkRemainTime + '</div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-graph\'><div style=\'width:' + walkNewWidth + '%\'></div></div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-total\'>' + walkTotalTime + '</div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '</li>';

				 		 	var clearanceTotalTime = statusData.Status.m_pedPhaseTimers[i].m_clearanceTimer.m_msTime;
				 			 	clearanceTotalTime = (clearanceTotalTime/1000).toFixed(1);
				 		 	var clearanceRemainTime = statusData.Status.m_pedPhaseTimers[i].m_clearanceTimer.m_msRemaining;
				 			 	clearanceRemainTime = (clearanceRemainTime/1000).toFixed(1);	
				 		 	var clearanceNewWidth = BaseUI.translateWidthPercent(clearanceRemainTime,clearanceTotalTime);					

				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<li class=\'clear-time\'>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<span class=\'time-label\'>Clear</span><div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-value\'>' + clearanceRemainTime + '</div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-graph\'><div style=\'width:' + clearanceNewWidth + '%\'></div></div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '<div class=\'phase-total\'>' + clearanceTotalTime + '</div>';
				 			pedStatusTimesMarkup = pedStatusTimesMarkup + '</li>';
							pedStatusTimesMarkup = pedStatusTimesMarkup + '</ul></div>';
				 		}	

				 	} 
				}					

				pedStatusTimesMarkup = pedStatusTimesMarkup + '</div>';

				// OVERLAP PHASE
				var ovrPhaseCallsMarkup = '<div class=\'overlap-phase-label\'>Overlaps</div><div class=\'overlap-phase-calls\'><ul>';
				var ovrPhaseOnLength = statusData.Status.m_overlapOn.length;
				for (var i = 0; i < ovrPhaseOnLength; i++) {
				 	var phaseIsOn = statusData.Status.m_overlapOn[i];
				 	var phaseIsNext = statusData.Status.m_overlapNext[i];
				 	var phaseNum = i + 1;
				 	var liClass = '';
				 	var isCallOn = '';
				 	if (phaseIsNext) {
				 		liClass = 'next';
				 	}	
				 	if (phaseIsOn) {
				 		liClass = 'on';
				 	}			
				 	ovrPhaseCallsMarkup = ovrPhaseCallsMarkup + '<li class=\'' + liClass + '\'><div class=\'value\'>' + phaseNum + '<span></span></div></li>';
				}
				ovrPhaseCallsMarkup = ovrPhaseCallsMarkup + '</ul></div>';

				// Get Active Overlap Phase
				// var ovrStatusTimesMarkup = '<div class=\'overlap-status-times\'>';

				// for (var i = 0; i < 2; i++) {

				//  	if(statusData.Status.m_pedPhaseTimers[i].m_active) {
				//  		var phaseNum = i + 1;
				//  		var curPhase = statusData.Status.m_pedPhaseTimers[i].m_phaseNum;						
				//  		// if (statusData.Status.m_pedPhaseTimers[i].m_restingInWalk == true) {
				//  		// 	ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-'+ phaseNum +'\'>';
				//  		// 	ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-num\'>' + curPhase + '</div>';
				//  		// 	ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<ul><li class=\'rest-walk-time\'>';
				//  		// 	ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<span class=\'time-label\'>Rest<div>';
				//  		// 	ovrStatusTimesMarkup = ovrStatusTimesMarkup + '</div></span></li></ul></div>';

				//  		// } else {

				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-'+ phaseNum +'\'>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-num\'>' + curPhase + '</div><ul>';

				//  			var minTotalTime = statusData.Status.m_timedOverlapTimers[i].m_walkTimer.m_msTime;
				//  				minTotalTime = (minTotalTime/1000).toFixed(1);
				//  			var walkRemainTime = statusData.Status.m_timedOverlapTimers[i].m_walkTimer.m_msRemaining;
				//  			 	walkRemainTime = (walkRemainTime/1000).toFixed(1);
				//  			var walkNewWidth = BaseUI.translateWidthPercent(walkRemainTime,walkTotalTime);



				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<li class=\'min-time\'>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<span class=\'time-label\'>Min</span><div>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-value\'>' + walkRemainTime + '</div>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-graph\'><div style=\'width:' + walkNewWidth + '%\'></div></div>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-total\'>' + walkTotalTime + '</div>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '</li>';

				//  		 	var clearanceTotalTime = statusData.Status.m_pedPhaseTimers[i].m_clearanceTimer.m_msTime;
				//  			 	clearanceTotalTime = (clearanceTotalTime/1000).toFixed(1);
				//  		 	var clearanceRemainTime = statusData.Status.m_pedPhaseTimers[i].m_clearanceTimer.m_msRemaining;
				//  			 	clearanceRemainTime = (clearanceRemainTime/1000).toFixed(1);	
				//  		 	var clearanceNewWidth = BaseUI.translateWidthPercent(clearanceRemainTime,clearanceTotalTime);					

				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<li class=\'clear-time\'>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<span class=\'time-label\'>Clear</span><div>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-value\'>' + clearanceRemainTime + '</div>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-graph\'><div style=\'width:' + clearanceNewWidth + '%\'></div></div>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '<div class=\'phase-total\'>' + clearanceTotalTime + '</div>';
				//  			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '</li>';
				// 			ovrStatusTimesMarkup = ovrStatusTimesMarkup + '</ul></div>';
				//  		//}	

				//  	} 
				// }	

				fullMarkup = fullMarkup + vehicleStateStatusMarkup + pedPhaseCallsMarkup + pedStatusTimesMarkup + ovrPhaseCallsMarkup;// + ovrStatusTimesMarkup;

				interSectionStatusViewPanel.find('.content').html(fullMarkup);

			  })
			  .fail(function() {
			    $('#comm-status').addClass('ajax-fail');
			    isStatusTimerOn = false;
 
			  })
			  .always(function() {
				  	statusTimeout = setTimeout(function() { BaseUI.updateStatus() }, timeoutDelay );	  			
			  });
	},



	updateCoordinationDefinition: function() {
		$('.seq-coord .coord-states .values .current').on('mousedown','.splits',function() {
			$('.seq-coord .overlay.splits .current-split .value span').text($(this).text());
			$('.seq-coord .overlay.splits .new-split .value span').text('_');
			$('.seq-coord .overlay.splits .state-container').empty();
			$(this).parent().clone().appendTo('.overlay.splits .state-container');
			$('.seq-coord .overlay.splits .keypad li[data-keypad-num]').removeClass('disabled');
			$('.seq-coord .overlay.splits #value-entered').removeAttr('value');						
			$('.seq-coord .overlay.splits').show();
		});	

		$('.seq-coord .overlay.splits li[data-keypad-num]').on('mousedown',function() {
			if (!$(this).hasClass('disabled')) {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);	
				var keypadEntry = thisObj.attr('data-keypad-num');
				var curVal = $('.overlay.splits #value-entered').val();

				if (thisObj.find('a').hasClass('backspace')) {
					// backspace functions
					newVal = curVal.substring(0,curVal.length - 1);
					$(this).parents('.panel').find('.overlay.splits #value-entered').val(newVal);	
					$(this).parents('.panel').find('.overlay.splits .new-split .value span').text(newVal + '_');
				} else {
					$(this).parents('.panel').find('.overlay.splits #value-entered').val(curVal + keypadEntry);	
					$(this).parents('.panel').find('.overlay.splits .new-split .value span').text(curVal + keypadEntry + '_');				
				}
				newVal = $('#value-entered').val();
				if (newVal > 300 || newVal.length == 3) {
					$('.seq-coord .overlay.splits .keypad li[data-keypad-num]').addClass('disabled');
					$('.seq-coord .overlay.splits .keypad li[data-keypad-num]:last-child').removeClass('disabled');
				} else {
					$('.seq-coord .overlay.splits .keypad li[data-keypad-num]').removeClass('disabled');
				}				
			}
		});	

		$('.seq-coord .overlay.splits .save').on('mousedown',function() {
			var stateToChange = $('.seq-coord .overlay.splits .current-state a').attr('data-state');
			$('.seq-coord .coord-states .values .current a[data-state=' + stateToChange + '] .splits').text($('.seq-coord .overlay.splits #value-entered').val());
			$(this).parents('.panel').find('.overlay.splits #value-entered').removeAttr('value');	
			BaseUI.resetOverlay();
		});	
		/**********************************/
		$('.seq-coord .current-offset .value').on('mousedown',function() {
			$('.seq-coord .overlay.offset-entry .current-offset-entry .value span').text($(this).text());
			$('.seq-coord .overlay.offset-entry .new-offset .value span').text('_');
			$('.seq-coord .overlay.offset-entry .keypad li[data-keypad-num]').removeClass('disabled');
			$('.seq-coord .overlay.offset-entry #value-entered').removeAttr('value');						
			$('.seq-coord .overlay.offset-entry').show();
		});	

		$('.seq-coord .overlay.offset-entry li[data-keypad-num]').on('mousedown',function() {
			if (!$(this).hasClass('disabled')) {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);	
				var keypadEntry = thisObj.attr('data-keypad-num');
				var curVal = $('.overlay.offset-entry #value-entered').val();

				if (thisObj.find('a').hasClass('backspace')) {
					// backspace functions
					newVal = curVal.substring(0,curVal.length - 1);
					$(this).parents('.panel').find('.overlay.offset-entry #value-entered').val(newVal);	
					$(this).parents('.panel').find('.overlay.offset-entry .new-offset .value span').text(newVal + '_');
				} else {
					$(this).parents('.panel').find('.overlay.offset-entry #value-entered').val(curVal + keypadEntry);	
					$(this).parents('.panel').find('.overlay.offset-entry .new-offset .value span').text(curVal + keypadEntry + '_');				
				}
				newVal = $('.overlay.offset-entry #value-entered').val();
				if (newVal > 300 || newVal.length == 3) {
					$('.seq-coord .overlay.offset-entry .keypad li[data-keypad-num]').addClass('disabled');
					$('.seq-coord .overlay.offset-entry .keypad li[data-keypad-num]:last-child').removeClass('disabled');
				} else {
					$('.seq-coord .overlay.offset-entry .keypad li[data-keypad-num]').removeClass('disabled');
				}				
			}
		});	

		$('.seq-coord .overlay.offset-entry .save').on('mousedown',function() {
			$(this).parents('.panel').find('.overlay.offset-entry #value-entered').removeAttr('value');	
			BaseUI.resetOverlay();
		});	
		/**********************************/
		$('.seq-coord .current-cycle-length .value').on('mousedown',function() {
			$('.seq-coord .overlay.cycle-entry .current-cycle-entry .value span').text($(this).text());
			$('.seq-coord .overlay.cycle-entry .new-cycle .value span').text('_');
			$('.seq-coord .overlay.cycle-entry .keypad li[data-keypad-num]').removeClass('disabled');
			$('.seq-coord .overlay.cycle-entry #value-entered').removeAttr('value');						
			$('.seq-coord .overlay.cycle-entry').show();
		});	

		$('.seq-coord .overlay.cycle-entry li[data-keypad-num]').on('mousedown',function() {
			if (!$(this).hasClass('disabled')) {
				var thisObj = $(this);
				BaseUI.addInverse(thisObj);	
				var keypadEntry = thisObj.attr('data-keypad-num');
				var curVal = $('.overlay.cycle-entry #value-entered').val();

				if (thisObj.find('a').hasClass('backspace')) {
					// backspace functions
					newVal = curVal.substring(0,curVal.length - 1);
					$(this).parents('.panel').find('.overlay.cycle-entry #value-entered').val(newVal);	
					$(this).parents('.panel').find('.overlay.cycle-entry .new-cycle .value span').text(newVal + '_');
				} else {
					$(this).parents('.panel').find('.overlay.cycle-entry #value-entered').val(curVal + keypadEntry);	
					$(this).parents('.panel').find('.overlay.cycle-entry .new-cycle .value span').text(curVal + keypadEntry + '_');				
				}
				newVal = $('.overlay.cycle-entry #value-entered').val();
				if (newVal > 300 || newVal.length == 3) {
					$('.seq-coord .overlay.cycle-entry .keypad li[data-keypad-num]').addClass('disabled');
					$('.seq-coord .overlay.cycle-entry .keypad li[data-keypad-num]:last-child').removeClass('disabled');
				} else {
					$('.seq-coord .overlay.cycle-entry .keypad li[data-keypad-num]').removeClass('disabled');
				}				
			}
		});	

		$('.seq-coord .overlay.cycle-entry .save').on('mousedown',function() {
			$(this).parents('.panel').find('.overlay.offset-entry #value-entered').removeAttr('value');	
			BaseUI.resetOverlay();
		});	

	},

	updateDefaultPhaseService: function() {
		$('.config-phase-service .overlay.default-service .available-states .state-container').on('mousedown','a',function() {
			$('.config-phase-service .overlay.default-service .available-states .state-container a.inverse').removeClass('inverse');
			$(this).addClass('inverse');
			var curPhase = parseInt($('.overlay.default-service .current-info .current-phase span').text());	
		});

		$('.config-phase-service .overlay.default-service .save').on('mousedown',function() {
			var curPhase = parseInt($('.overlay.default-service .current-info .current-phase span').text());
			data.configuration[curConfig].m_vehiclePhase[curPhase - 1].m_phaseService = $('.overlay.default-service .available-states a.inverse').text();
			BaseUI.loadDefaultPhaseService(curConfig);
			BaseUI.resetOverlay();
		});
	},


	loadVersionId: function() {
		var jqxhr =
		    $.ajax({
		        //url: "/service/status/inspire/operation",
		       	url: "version.js",
		        dataType: 'text'
		    })
			  .done(function(data) {
  			    $('#comm-status').removeClass('ajax-fail');			    
			    var versionData = $.parseJSON(data);
			   

				var versionUi = '';
			    for (a = 0; a < versionData.version_list.version_ui.length; a++) {
			    	versionUi = versionUi + versionData.version_list.version_ui[a] + '.';
			    }
			    versionUi = versionUi.slice(0,-1);
				$('.ui-version span').text(versionUi);			    

			  })
			  .fail(function() {
			    console.log( "error in version" );
			  })
			  .always(function() {
			//    alert( "complete" );
			  });
			 
		 var jqxhr2 =
		    $.ajax({
		       	url: systemUrl,
		        dataType: 'text'
		    })
			  .done(function(data) {			    
			    var boardVersionData = $.parseJSON(data);

			    var puppyUi = boardVersionData.Status.m_puppyFWVersion_m_majorVer + '.';
			    puppyUi = puppyUi + boardVersionData.Status.m_puppyFWVersion_m_minorVer + '.';
			    puppyUi = puppyUi + boardVersionData.Status.m_puppyFWVersion_m_minorMinorVer + '.';
			    puppyUi = puppyUi + boardVersionData.Status.m_puppyFWVersion_m_revisionVer;
				$('.puppy-version span').text(puppyUi);	

			    var archerUi = boardVersionData.Status.m_archerFWVersion_m_majorVer + '.';
			    archerUi = archerUi + boardVersionData.Status.m_archerFWVersion_m_minorVer + '.';
			    archerUi = archerUi + boardVersionData.Status.m_archerFWVersion_m_minorMinorVer + '.';
			    archerUi = archerUi + boardVersionData.Status.m_archerFWVersion_m_revisionVer;
				$('.archer-version span').text(archerUi);							    

			  })
			  .fail(function() {
			     $('#comm-status').addClass('ajax-fail');
			     //BaseUI.loadVersionId();
			  })
			  .always(function() {
			//    alert( "complete" );
			  });
			 
			// Set another completion function for the request above
			jqxhr.always(function() {
		//	  alert( "second complete" );
			});		
	},

	showNotificationModal: function(style,heading,subtext,fadeOut) {
		$('#modal').find('h1').text(heading);
		$('#modal').find('p').text(subtext);
		$('#modal').removeClass('success fail reset warning').addClass(style).fadeIn('fast');
		if (fadeOut) {
			var modalTimer = function() {
				$('#modal').fadeOut('fast');
			};
			setTimeout(modalTimer,3000);			
		}

		$('body').on('mousedown','#modal',function() {
			clearTimeout(modalTimer);
			BaseUI.hideNotificationModal();
		});

	},

	hideNotificationModal: function() {
		$('#modal').hide();
	},


	showDateTimeSettings: function() {
		$('#home').find('.date-settings-link').on('mousedown',function() {
			var thisObj = $(this);
			setTimeout(function() { BaseUI.switchPanel('date-time-settings') }, delayTime );
			
		});			
	},

	showNetworkSettings: function() {
		$('#home').find('.vf6-settings').on('mousedown',function() {
			var thisObj = $(this);
			setTimeout(function() { BaseUI.switchPanel('vf6-settings') }, delayTime );
			
		});				
	},	

	showSystemId: function() {
		$('#home').find('.system-id-link').on('mousedown',function() {
			var thisObj = $(this);
			setTimeout(function() { BaseUI.switchPanel('system-id-settings') }, delayTime );
			
		});				
	},		

	startScreensaver: function() {
		window.screenTimer = setTimeout(function() { 
			if ($('#intersection-status-view').is(':visible')) {
				$('#intersection-status-view').find('.go-straight-back').trigger('mousedown').trigger('mouseup');
			} else if ($('#status-detectors').is(':visible')) {
				$('#intersection-status-view').find('.go-straight-back').trigger('mousedown').trigger('mouseup');
			} else {
				var defaultPanel = 'home';
				$('.overlay').hide();
				$('.panel').hide();
				$('#' + defaultPanel + '').show();
			}		
		}, screensaverTime );	
	},

	resetScreensaver: function() {
		    if (typeof calibrationTimeout !== 'undefined') {
	    		clearTimeout(calibrationTimeout);
    		}
    		if (typeof screenTimer !== 'undefined') {
	    		clearTimeout(screenTimer);
    		}
    		if (isScreensaverOn) {
    			screenTimer = setTimeout(BaseUI.startScreensaver, screensaverTime);
    		}
    		
	},

	turnOffScreensaver: function() {
		$('#home').find('.screensaver').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('off')) {
				BaseUI.startScreensaver();
				thisObj.removeClass('off');
				isScreensaverOn = true;
			} else {
				BaseUI.resetScreensaver();
				thisObj.addClass('off');
				isScreensaverOn = false;
			}
		});
	},

	inSpireObjToText: function() {
		var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(allWorkingData));
		window.open(url, '_blank');
		window.focus();		
	},
		

} // end of BaseUI

$(document).ready(BaseUI.initialize);
