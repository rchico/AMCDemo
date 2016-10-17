var SettingsUI = {
	initialize: function() {

		window.timeZoneArray = ["US/Eastern","US/Central","US/Mountain","US/Pacific","US/Arizona","US/Alaska","US/Hawaii","US/East-Indiana","US/Indiana-Starke","US/Michigan"];
		window.subnetMaskArray = [
			"0.0.0.0",
			"128.0.0.0",
			"192.0.0.0",
			"224.0.0.0",
			"240.0.0.0",
			"248.0.0.0",
			"252.0.0.0",
			"254.0.0.0",
			"255.0.0.0",
			"255.128.0.0",
			"255.192.0.0",
			"255.224.0.0",
			"255.240.0.0",
			"255.248.0.0",
			"255.252.0.0",
			"255.254.0.0",
			"255.255.0.0",
			"255.255.128.0",
			"255.255.192.0",
			"255.255.224.0",
			"255.255.240.0",
			"255.255.248.0",
			"255.255.252.0",
			"255.255.254.0",
			"255.255.255.0 ",
			"255.255.255.128",
			"255.255.255.192",
			"255.255.255.224",
			"255.255.255.240",
			"255.255.255.248",
			"255.255.255.252",
			"255.255.255.254",
			"255.255.255.255"
		];

		SettingsUI.getSettings();



		SettingsUI.pageScroll();


		if (!$('body').hasClass('read-only')) {
			SettingsUI.cycleTimeZones();
			SettingsUI.updateVF6Keypad();
		//	SettingsUI.keyboardSerialNumber();
			SettingsUI.keyboardHostName();
		//	SettingsUI.keyboardEth0Mac();
			SettingsUI.keyboardIntersectionName();
		//	SettingsUI.keyboardEth0ipv61();
		//	SettingsUI.keyboardEth0ipv62();
			SettingsUI.keyboardNtpServer1();
			SettingsUI.keyboardNtpServer2();
		//	SettingsUI.keyboardNameserver1();
		//	SettingsUI.keyboardNameserver2();
		//	SettingsUI.keyboardIpv6Gateway();			
		}		


		$('#vf6-settings').find('> .set').on('mousedown',function() {
			SettingsUI.setChanges();
		});
		$('#date-time-settings').find('> .set').on('mousedown',function() {
			SettingsUI.setChanges();
		});		
		$('#system-id-settings').find('> .set').on('mousedown',function() {
			SettingsUI.setChanges();
		});


	},	

/****************************************************/
// SET CHANGES
	setChanges: function() {
		var errorsFound = SettingsUI.countErrorsFound();
		if (errorsFound > 0) {
			BaseUI.showNotificationModal('fail','Uh Oh','Found at least one Settings error');
		} else {
			SettingsUI.setSettings();
		}
	} ,

/****************************************************/
// COUNT NUMBER OF ERRORS FOUND
	countErrorsFound: function() {
		var count = 0;
		count = count + parseInt($('#vf6-settings').find('.error').length); 
		count = count + parseInt($('#date-time-settings').find('.error').length); 
		count = count + parseInt($('#system-id-settings').find('.error').length); 
		return count;
	},


/****************************************************/
// TRANSLATE CDR TO SUBNET
	translateCDRtoSubnet: function(val) {
		var subnet = subnetMaskArray[val];
		return subnet;
	},


/****************************************************/
// TRANSLATE SUBNET TO CDR
	translateSubnetToCDR: function(val) {
		var cdr = subnetMaskArray.indexOf(val);
		return cdr;
	},

/****************************************************/
// SET VF6 SETTINGS

	setSettings: function() {
		var jqxhr =
		    $.ajax({
		    	type: 'post',
		        url: settingsUrl,
		        contentType: "text/plain;charset=utf-8",
		        data: JSON.stringify(settingsWorkingData),
	            contentType: "application/json; charset=utf-8",
	            traditional: true,		        
		    })
			.done(function(data, textStatus, jqxhr) {

			})
			.fail(function(data, textStatus, jqxhr) {

			})
			.always(function(data, textStatus, jqxhr) {
                if (data.status == '200') {
                	SettingsUI.replacePristineWithWorking();
                	SettingsUI.removeDiff();
                	BaseUI.showNotificationModal('success','Yay','Save worked!');
                } else {
					BaseUI.showNotificationModal('fail','Aw snap!','Something terribly wrong went during an attempt to save');
                }
                
			});	
	},	

	removeDiff: function() {
		$('#vf6-settings').find('.diff').removeClass('diff');
		$('#date-time-settings').find('.diff').removeClass('diff');
		$('#system-id-settings').find('.diff').removeClass('diff');
	},

	replacePristineWithWorking: function() {
		delete settingsPristineData;
		window.settingsPristineData = jQuery.extend(true, {}, settingsWorkingData);
	},



/****************************************************/
// GET VF6 SETTINGS

	getSettings: function() {
		var jqxhr =
		    $.ajax({
		        url: settingsUrl,
		        dataType: 'text'
		    })
			  .done(function(data) {			    
			    window.settingsWorkingData = $.parseJSON(data);
			    window.settingsPristineData = $.parseJSON(data);
			    SettingsUI.loadVF6Settings();
			  })
			  .fail(function() {
			    //alert( "error" );
			  })
			  .always(function() {
			//    alert( "complete" );
			  });
			 
			// Perform other work here ...
			 
			// Set another completion function for the request above
			jqxhr.always(function() {
		//	  alert( "second complete" );
			});
	},






/****************************************************/
// LOAD VF6 SETTINGS

	loadVF6Settings: function() {

		SettingsUI.updSerialNumber();

		var intName = settingsWorkingData.VF6_SETTINGS.INTERSECTION_NAME;
		$('#system-id-settings').find('.intersection-name-setting .values div').text(intName);	


		SettingsUI.identifyIntersection(intName);	

		SettingsUI.updHostName();
		SettingsUI.updTimeZones();
		SettingsUI.updVF6Timeout();
		SettingsUI.updEth0Mac();
		SettingsUI.updEth0ipv4();
		SettingsUI.getSubnetMask();
	//	SettingsUI.updEth0ipv61();
	//	SettingsUI.updEth0ipv62();
		SettingsUI.updIpv4Gateway();
	//	SettingsUI.updIpv6Gateway();
	//	SettingsUI.updNameserver1();
	//	SettingsUI.updNameserver2();
	//	SettingsUI.updNtpServer1();
	//	SettingsUI.updNtpServer2();

		if(settingsWorkingData.VF6_SETTINGS.hasOwnProperty('NTP_SERVER_ADDRESS')){
			// moving on
		} else {
			var defaultArray = ['0.0.0.0','my.butt.itches'];
			settingsWorkingData.VF6_SETTINGS["NTP_SERVER_ADDRESS"] = defaultArray;
			settingsPristineData.VF6_SETTINGS["NTP_SERVER_ADDRESS"] = defaultArray;
		}
			SettingsUI.updNtpServer1();
			SettingsUI.updNtpServer2();
	},


	identifyIntersection: function(val) {
		$('.intersection-name-frame span').text(val);	
	},


/**************************************/
// VF6 HOST NAME

	setHostName: function(value) {
		settingsWorkingData.VF6_SETTINGS.HOSTNAME = value;
	},


	updHostName: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.HOSTNAME;
		var originalSetting = settingsPristineData.VF6_SETTINGS.HOSTNAME;
		if (thisSetting != originalSetting) {
			$('#system-id-settings').find('.host-name').addClass('diff');
		} else {
			$('#system-id-settings').find('.host-name').removeClass('diff');
		}
		$('#system-id-settings').find('.host-name .values > div').text(thisSetting);
		
	},

	keyboardHostName: function() {
		$('#system-id-settings').find('.host-name .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.HOSTNAME;
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit Host Name');
			thisView.find('.item-to-change').val('host-name');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','system-id-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},		

/**************************************/
// VF6 SERIAL NUMBER

	setSerialNumber: function(value) {
		settingsWorkingData.VF6_SETTINGS.INSPIRE_SERIAL_NUMBER = value;
	},


	updSerialNumber: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.INSPIRE_SERIAL_NUMBER;
		var originalSetting = settingsPristineData.VF6_SETTINGS.INSPIRE_SERIAL_NUMBER;
		if (thisSetting != originalSetting) {
			$('#system-id-settings').find('.serial-number').addClass('diff');
		} else {
			$('#system-id-settings').find('.serial-number').removeClass('diff');
		}
		$('#system-id-settings').find('.serial-number .values > div').text(thisSetting);
		
	},

	keyboardSerialNumber: function() {
		$('#system-id-settings').find('.serial-number .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.INSPIRE_SERIAL_NUMBER;
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit Serial Number');
			thisView.find('.item-to-change').val('serial-number');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','system-id-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},


/**************************************/
// VF6 INTERSECTION NAME

	setIntersectionName: function(value) {
		settingsWorkingData.VF6_SETTINGS.INTERSECTION_NAME = value;
	},

	updIntersectionName: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.INTERSECTION_NAME;
		var originalSetting = settingsPristineData.VF6_SETTINGS.INTERSECTION_NAME;
		if (thisSetting != originalSetting) {
			$('#system-id-settings').find('.intersection-name-setting').addClass('diff');
		} else {
			$('#system-id-settings').find('.intersection-name-setting').removeClass('diff');
		}
		$('#system-id-settings').find('.intersection-name-setting .values > div').text(thisSetting);	
	},

	keyboardIntersectionName: function() {
		$('#system-id-settings').find('.intersection-name-setting').on('mousedown',function() {
			var intersectionName = settingsWorkingData.VF6_SETTINGS.INTERSECTION_NAME;
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit Intersection Name');
			thisView.find('.item-to-change').val('intersection-name');
			thisView.find('.current-text').val(intersectionName);
			thisView.find('.current-entry').text(intersectionName + '_');
			thisView.find('.go-straight-back').attr('data-panel','system-id-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},

/**************************************/
// VF6 TIMEOUT

	setVF6Timeout: function(value) {
		settingsWorkingData.VF6_SETTINGS.FRONT_PANEL_TIMEOUT = value.toString();
	},

	updVF6Timeout: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.FRONT_PANEL_TIMEOUT;
		var originalSetting = settingsPristineData.VF6_SETTINGS.FRONT_PANEL_TIMEOUT;
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.time-out').addClass('diff');
		} else {
			$('#vf6-settings').find('.time-out').removeClass('diff');
		}
		$('#vf6-settings').find('.time-out .values > div').text(thisSetting);
		
	},


/**************************************/
// VF6 IPV4 GATEWAY

	setIpv4Gateway: function(value) {
		settingsWorkingData.VF6_SETTINGS.IPV4_GATEWAY = value;
	},

	updIpv4Gateway: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.IPV4_GATEWAY;
		var originalSetting = settingsPristineData.VF6_SETTINGS.IPV4_GATEWAY;
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.ipv4-gateway').addClass('diff');
		} else {
			$('#vf6-settings').find('.ipv4-gateway').removeClass('diff');
		}
		$('#vf6-settings').find('.ipv4-gateway .values > div').text(thisSetting);
	},


/**************************************/
// VF6 NTP SERVER

	setNtpServer1: function(value) {
		settingsWorkingData.VF6_SETTINGS.NTP_SERVER_ADDRESS[0] = value;
	},

	updNtpServer1: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.NTP_SERVER_ADDRESS[0];
		var originalSetting = settingsPristineData.VF6_SETTINGS.NTP_SERVER_ADDRESS[0];
		if (thisSetting != originalSetting) {
			$('#date-time-settings').find('.ntp-server-1').addClass('diff');
		} else {
			$('#date-time-settings').find('.ntp-server-1').removeClass('diff');
		}
		$('#date-time-settings').find('.ntp-server-1 .values > div').text(thisSetting);
	},

	keyboardNtpServer1: function() {
		$('#date-time-settings').find('.ntp-server-1 .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.NTP_SERVER_ADDRESS[0];
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit NTP Server Address (1)');
			thisView.find('.item-to-change').val('ntp-server-1');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','date-time-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},	

/**************************************/
// VF6 ETH0 MAC

	setEth0Mac: function(value) {
		settingsWorkingData.VF6_SETTINGS.ETH0_MAC_ADDRESS = value;
	},

	updEth0Mac: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.ETH0_MAC_ADDRESS;
		var originalSetting = settingsPristineData.VF6_SETTINGS.ETH0_MAC_ADDRESS;
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.eth0-mac').addClass('diff');
		} else {
			$('#vf6-settings').find('.eth0-mac').removeClass('diff');
		}
		$('#vf6-settings').find('.eth0-mac .values > div').text(thisSetting);
	},


	keyboardEth0Mac: function() {
		$('#vf6-settings').find('.eth0-mac .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.ETH0_MAC_ADDRESS;
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit ETH0 Mac Address');
			thisView.find('.item-to-change').val('eth0-mac');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','vf6-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},	


/**************************************/
// VF6 ETH0 IPV4

	setEth0ipv4: function(value) {
		var thisSubnet = $('#vf6-settings').find('.eth0-ipv4-subnet .values > div').text();
		var thisCDR = SettingsUI.translateSubnetToCDR(thisSubnet);
		var combinedIP = value + '/' + thisCDR;
		settingsWorkingData.VF6_SETTINGS.ETH0_IPV4_ADDRESS = combinedIP.toString();
	},

	updEth0ipv4: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.ETH0_IPV4_ADDRESS;
		var slashLoc = thisSetting.indexOf('/');
		var valLength = thisSetting.length;
		thisSetting = thisSetting.substring(0,slashLoc);

		var originalSetting = settingsPristineData.VF6_SETTINGS.ETH0_IPV4_ADDRESS;		
		var slashLoc = originalSetting.indexOf('/');
		var valLength = originalSetting.length;
		originalSetting = originalSetting.substring(0,slashLoc);		
		

		//console.log(thisSetting.substring(slashLoc,valLength));
		
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.eth0-ipv4').addClass('diff');
		} else {
			$('#vf6-settings').find('.eth0-ipv4').removeClass('diff');
		}

		$('#vf6-settings').find('.eth0-ipv4 .values > div').text(thisSetting);

		// Update IP address on home
		$('#home').find('.ip-address span').text(thisSetting);
	},

/**************************************/
// VF6 ETH0 IPV4 SUBNET MASK

	getSubnetMask: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.ETH0_IPV4_ADDRESS;
		var slashLoc = thisSetting.indexOf('/');
		var valLength = thisSetting.length;
		var thisCDR = thisSetting.substring(slashLoc + 1,valLength);
		$('#vf6-settings').find('.eth0-ipv4-subnet .values > div').text(SettingsUI.translateCDRtoSubnet(parseInt(thisCDR)));
	},


	updSubnetMask: function(val) {
		var originalSetting = settingsPristineData.VF6_SETTINGS.ETH0_IPV4_ADDRESS;
		var slashLoc = originalSetting.indexOf('/');
		var valLength = originalSetting.length;
		originalSetting = originalSetting.substring(0,slashLoc);

		if (val != originalSetting) {
			$('#vf6-settings').find('.eth0-ipv4-subnet').addClass('diff');
		} else {
			$('#vf6-settings').find('.eth0-ipv4-subnet').removeClass('diff');
		}
		$('#vf6-settings').find('.eth0-ipv4-subnet .values > div').text(val);


		var thisIP = settingsWorkingData.VF6_SETTINGS.ETH0_IPV4_ADDRESS;
		var slashLoc = thisIP.indexOf('/');
		var valLength = thisIP.length;
		thisIP = thisIP.substring(0,slashLoc);

		var thisSubnet = val;
		var thisCDR = SettingsUI.translateSubnetToCDR(thisSubnet);
		if (thisCDR != '-1') {
			var combinedIP = thisIP + '/' + thisCDR;
			settingsWorkingData.VF6_SETTINGS.ETH0_IPV4_ADDRESS = combinedIP;		
			$('#vf6-settings').find('.eth0-ipv4-subnet').removeClass('error');	
		} else {
			$('#vf6-settings').find('.eth0-ipv4-subnet').addClass('error');
		}
	},

/**************************************/
// VF6 TIME ZONE

	setTimeZones: function(value) {
		settingsWorkingData.VF6_SETTINGS.TIMEZONE = value;
	},

	updTimeZones: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.TIMEZONE;
		var originalSetting = settingsPristineData.VF6_SETTINGS.TIMEZONE;
		if (thisSetting != originalSetting) {
			$('#date-time-settings').find('.time-zone').addClass('diff');
		} else {
			$('#date-time-settings').find('.time-zone').removeClass('diff');
		}
		$('#date-time-settings').find('.time-zone .values > div').text(thisSetting);
	},


	cycleTimeZones: function() {
		$('#date-time-settings').find('.time-zone .values').on('mousedown',function() {
			var curTimeZone = $(this).find('div').text();
			var arrayLoc = $.inArray(curTimeZone,timeZoneArray);
			if (arrayLoc < timeZoneArray.length - 1) {
				arrayLoc = arrayLoc + 1;
			} else {
				arrayLoc = 0;
			}
			var newTimeZone = timeZoneArray[arrayLoc];
			settingsWorkingData.VF6_SETTINGS.TIMEZONE = newTimeZone;
			SettingsUI.updTimeZones();
		});
	},


/**************************************/
// VF6 ETH0 IPV6 1

	setEth0ipv61: function(value) {
		settingsWorkingData.VF6_SETTINGS.ETH0_IPV6_ADDRESS[0] = value;
	},

	updEth0ipv61: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.ETH0_IPV6_ADDRESS[0];
		var originalSetting = settingsPristineData.VF6_SETTINGS.ETH0_IPV6_ADDRESS[0];
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.eth0-ipv6-1').addClass('diff');
		} else {
			$('#vf6-settings').find('.eth0-ipv6-1').removeClass('diff');
		}
		$('#vf6-settings').find('.eth0-ipv6-1 .values > div').text(thisSetting);
	},


	keyboardEth0ipv61: function() {
		$('#vf6-settings').find('.eth0-ipv6-1 .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.ETH0_IPV6_ADDRESS[0];
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit ETH0 IPV6 Address (1)');
			thisView.find('.item-to-change').val('eth0-ipv6-1');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','vf6-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},	

/**************************************/
// VF6 ETH0 IPV6 2

	setEth0ipv62: function(value) {
		settingsWorkingData.VF6_SETTINGS.ETH0_IPV6_ADDRESS[1] = value;
	},

	updEth0ipv62: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.ETH0_IPV6_ADDRESS[1];
		var originalSetting = settingsPristineData.VF6_SETTINGS.ETH0_IPV6_ADDRESS[1];
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.eth0-ipv6-2').addClass('diff');
		} else {
			$('#vf6-settings').find('.eth0-ipv6-2').removeClass('diff');
		}
		$('#vf6-settings').find('.eth0-ipv6-2 .values > div').text(thisSetting);
	},


	keyboardEth0ipv62: function() {
		$('#vf6-settings').find('.eth0-ipv6-2 .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.ETH0_IPV6_ADDRESS[1];
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit ETH0 IPV6 Address (2)');
			thisView.find('.item-to-change').val('eth0-ipv6-2');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','vf6-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},	

/**************************************/
// VF6 IPV6 GATEWAY

	setIpv6Gateway: function(value) {
		settingsWorkingData.VF6_SETTINGS.IPV6_GATEWAY = value;
	},

	updIpv6Gateway: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.IPV6_GATEWAY;
		var originalSetting = settingsPristineData.VF6_SETTINGS.IPV6_GATEWAY;
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.ipv6-gateway').addClass('diff');
		} else {
			$('#vf6-settings').find('.ipv6-gateway').removeClass('diff');
		}
		$('#vf6-settings').find('.ipv6-gateway .values > div').text(thisSetting);
	},


	keyboardIpv6Gateway: function() {
		$('#vf6-settings').find('.ipv6-gateway .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.IPV6_GATEWAY;
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit IPV6 Gateway');
			thisView.find('.item-to-change').val('ipv6-gateway');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','vf6-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},		

/**************************************/
// VF6 NTP SERVER 2

	setNtpServer2: function(value) {
		settingsWorkingData.VF6_SETTINGS.NTP_SERVER_ADDRESS[1] = value;
	},

	updNtpServer2: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.NTP_SERVER_ADDRESS[1];
		var originalSetting = settingsPristineData.VF6_SETTINGS.NTP_SERVER_ADDRESS[1];
		if (thisSetting != originalSetting) {
			$('#date-time-settings').find('.ntp-server-2').addClass('diff');
		} else {
			$('#date-time-settings').find('.ntp-server-2').removeClass('diff');
		}
		$('#date-time-settings').find('.ntp-server-2 .values > div').text(thisSetting);
	},


	keyboardNtpServer2: function() {
		$('#date-time-settings').find('.ntp-server-2 .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.NTP_SERVER_ADDRESS[1];
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit NTP Server Address (2)');
			thisView.find('.item-to-change').val('ntp-server-2');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','date-time-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},	

/**************************************/
// VF6 NAMESERVER 1

	setNameserver1: function(value) {
		settingsWorkingData.VF6_SETTINGS.NAMESERVER_ADDRESS[0] = value;
	},

	updNameserver1: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.NAMESERVER_ADDRESS[0];
		var originalSetting = settingsPristineData.VF6_SETTINGS.NAMESERVER_ADDRESS[0];
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.nameserver-1').addClass('diff');
		} else {
			$('#vf6-settings').find('.nameserver-1').removeClass('diff');
		}
		$('#vf6-settings').find('.nameserver-1 .values > div').text(thisSetting);
	},


	keyboardNameserver1: function() {
		$('#vf6-settings').find('.nameserver-1 .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.NAMESERVER_ADDRESS[0];
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit Nameserver Address (1)');
			thisView.find('.item-to-change').val('nameserver-1');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','vf6-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},	

/**************************************/
// VF6 NAMESERVER 2

	setNameserver2: function(value) {
		settingsWorkingData.VF6_SETTINGS.NAMESERVER_ADDRESS[1] = value;
	},

	updNameserver2: function() {
		var thisSetting = settingsWorkingData.VF6_SETTINGS.NAMESERVER_ADDRESS[1];
		var originalSetting = settingsPristineData.VF6_SETTINGS.NAMESERVER_ADDRESS[1];
		if (thisSetting != originalSetting) {
			$('#vf6-settings').find('.nameserver-2').addClass('diff');
		} else {
			$('#vf6-settings').find('.nameserver-2').removeClass('diff');
		}
		$('#vf6-settings').find('.nameserver-2 .values > div').text(thisSetting);
	},


	keyboardNameserver2: function() {
		$('#vf6-settings').find('.nameserver-2 .values').on('mousedown',function() {
			var thisVal = settingsWorkingData.VF6_SETTINGS.NAMESERVER_ADDRESS[1];
			var thisView = $('#keyboard-panel');
			thisView.find('.edit-name-frame').text('Edit Nameserver Address (2)');
			thisView.find('.item-to-change').val('nameserver-2');
			thisView.find('.current-text').val(thisVal);
			thisView.find('.current-entry').text(thisVal + '_');
			thisView.find('.go-straight-back').attr('data-panel','vf6-settings');
			setTimeout(function() { BaseUI.switchPanel('keyboard-panel') }, delayTime );
		});
	},

/**************************************/
// VF6 PAGE SCROLL

	pageScroll: function() {
		$('#vf6-settings .page-down').on('mousedown',function() {
		 	for (a = 0; a < 8; a++) {	
		 		$('#vf6-settings').find('.current-settings:eq(' + a +')').hide();
		 	}	
		 	for (b = 8; b < 16; b++) {	
		 		$('#vf6-settings').find('.current-settings:eq(' + b +')').show();
		 	}			 	
		});		
		$('#vf6-settings .page-up').on('mousedown',function() {
		 	for (a = 0; a < 8; a++) {	
		 		$('#vf6-settings').find('.current-settings:eq(' + a +')').show();
		 	}	
		 	for (b = 8; b < 16; b++) {	
		 		$('#vf6-settings').find('.current-settings:eq(' + b +')').hide();
		 	}			 	
		});		

	},	

/**************************************/	

	updateVF6Keypad: function() {

		var thisView = $('#vf6-settings');

		 thisView.find('.current-settings.keypad').on('mousedown','.values',function() {
		 	$(this).parents('.panel').find('.overlay.timing #value-entered').val('');
		 	thisView.find('.overlay.timing .keypad li.disabled').removeClass('disabled');
		 	thisView.find('.overlay.timing li[data-keypad-num=\'.\']').removeAttr('style');							
		 	var thisObj = $(this);
		 	var thisTiming = thisObj.parents('.current-settings').attr('class');
		 	var thisVal = thisObj.text();
		 	var thisPhase = thisObj.index();
		 	thisView.find('.overlay.timing .current-timing-entry .value span').text(thisVal);
		 	if (thisObj.parents('.current-settings').hasClass('ipv4-gateway')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current IPV4 Gateway:');
				thisView.find('.overlay.timing .new-timing label').text('New IPV4 Gateway:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('ipv4-gateway');
		 	} else if (thisObj.parents('.current-settings').hasClass('time-out')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Screen Saver Timeout');
				thisView.find('.overlay.timing .new-timing label').text('New Screen Saver Timeout:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('time-out');
		 	} else if (thisObj.parents('.current-settings').hasClass('ntpserver-1')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current NTP Server (1)');
				thisView.find('.overlay.timing .new-timing label').text('New NTP Server (1):');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('ntpserver-1');
		 	} else if (thisObj.parents('.current-settings').hasClass('eth0-ipv4')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current IP Address:');
				thisView.find('.overlay.timing .new-timing label').text('New IP Address:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('eth0-ipv4');
		 	} else if (thisObj.parents('.current-settings').hasClass('eth0-ipv4-subnet')){
				thisView.find('.overlay.timing .current-timing-entry label').text('Current Subnet Mask:');
				thisView.find('.overlay.timing .new-timing label').text('New Subnet Mask:');
				thisView.find('.overlay.timing .new-timing .value span').text('_');
				thisView.find('.overlay.timing #item-to-update').val('eth0-ipv4-subnet');
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
				if (newVal.length == 18) {
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
				if(thisView.find('.overlay.timing #item-to-update').val() == 'time-out') {
					SettingsUI.setVF6Timeout(curVal);
					SettingsUI.updVF6Timeout();
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'ntpserver-1') {
					SettingsUI.setNtpServer1(curVal);
					SettingsUI.updNtpServer1();	
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'ipv4-gateway') {
					SettingsUI.setIpv4Gateway(curVal);
					SettingsUI.updIpv4Gateway();	
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'eth0-ipv4') {
					SettingsUI.setEth0ipv4(curVal);
					SettingsUI.updEth0ipv4();	
				} else if(thisView.find('.overlay.timing #item-to-update').val() == 'eth0-ipv4-subnet') {
					SettingsUI.updSubnetMask(curVal);	
				}		
			}

	
			$(this).parents('.panel').find('.overlay.timing #value-entered').removeAttr('value');		
			BaseUI.resetOverlay();
		});	

		thisView.find('.overlay.timing .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});	

	},


 } // end of SettingsUI

//$(document).ready(SettingsUI.initialize);