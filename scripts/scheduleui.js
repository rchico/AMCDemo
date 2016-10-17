var ScheduleUI = {

	initialize: function () {

		window.scheduleToDelete = 0;

		ScheduleUI.getWeeklyList();
		ScheduleUI.getSpecialList();
		ScheduleUI.addWeeklySchedule();
		ScheduleUI.addSpecialEvent();
		ScheduleUI.filterDow();


		$('.schedule .show-schedule-summary').on('click',function() {
			$('.panel').hide();
			$('.panel.schedule-summary').show();
		});


		/// Weekly Schedule
		$('.schedule .show-weekly-schedule').on('click',function() {
			$('.panel').hide();
			$('.panel.schedule-list-weekly').show();
		});


		/// Special Event
		$('.schedule .show-special-event').on('click',function() {
			$('.panel').hide();
			$('.panel.schedule-list-special').show();
		});

		/// Go Straight Home


		/// Go To Schedule Summary

		$('.schedule-list-weekly .add-schedule').on('click',function() {
			$('.panel').hide();
			$('.panel.schedule-new-weekly').show();
		});

		$('.schedule-list-special .add-schedule').on('click',function() {
			$('.panel').hide();
			$('.panel.schedule-new-special').show();
		});


		
		$('.schedule-new-weekly  .start-time-selection .time-hour .up').on('mousedown',function() {
			var obj = $(this).parent().find('.value');
			ScheduleUI.decrementHour(obj);
		});	

		$('.schedule-new-weekly  .start-time-selection .time-hour .down').on('mousedown',function() {
			var obj = $(this).parent().find('.value');
			ScheduleUI.incrementHour(obj);
		});			

		$('.schedule-new-weekly  .end-time-selection .time-hour .up').on('mousedown',function() {
			console.log($(this));	
			var obj = $(this).parent().find('.value');
			console.log(obj.html());
			ScheduleUI.decrementHour(obj);
		});	

		$('.schedule-new-weekly  .end-time-selection .time-hour .down').on('mousedown',function() {
			var obj = $(this).parent().find('.value');
			ScheduleUI.incrementHour(obj);
		});	


		$('#schedule-overview').find('.schedule-weekly-link').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('schedule-list-weekly') }, delayTime );				
			}

		});	

		$('#schedule-overview').find('.schedule-special-link').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				setTimeout(function() { BaseUI.switchPanel('schedule-list-special') }, delayTime );				
			}

		});			
		$('#schedule-overview').find('.schedule-default-config').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('disabled')) {
				// do nothing
			} else {
			//	BaseUI.addInverse(thisObj);
				$('#schedule-overview').find('.overlay').show();			
			}

		});		


		$('#schedule-overview').find('.overlay .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});				

		$('#schedule-list-weekly').find('ul').on('mousedown','.remove-schedule',function() {
			scheduleToDelete = $(this).parent().attr('data-schedule-loc'); // location of schedule in array of schedules
			$('#schedule-list-weekly').find('.overlay.confirm-schedule-delete').show();
			return false;
		});	

		$('#schedule-list-weekly').find('.overlay.confirm-schedule-delete .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});	

		$('#schedule-list-weekly').find('.overlay.confirm-schedule-delete .set').on('mousedown',function() {
			ScheduleUI.removeWeeklySchedule(scheduleToDelete);
		});			

		$('#schedule-list-weekly').find('.page-up').on('mousedown',function() {
			ScheduleUI.pageUpWeekly();
		});

		$('#schedule-list-weekly').find('.page-down').on('mousedown',function() {
			ScheduleUI.pageDownWeekly();
		});						

		$('#schedule-list-special').find('ul').on('mousedown','.remove-schedule',function() {
			scheduleToDelete = $(this).parent().attr('data-schedule-loc'); // location of schedule in array of schedules
			$('#schedule-list-special').find('.overlay.confirm-schedule-delete').show();
			return false;
		});	

		$('#schedule-list-special').find('.overlay.confirm-schedule-delete .set').on('mousedown',function() {
			ScheduleUI.removeSpecialSchedule(scheduleToDelete);
		});		

		$('#schedule-list-special').find('.overlay.confirm-schedule-delete .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});			

		$('#schedule-list-special').find('.page-up').on('mousedown',function() {
			ScheduleUI.pageUpSpecial();
		});

		$('#schedule-list-special').find('.page-down').on('mousedown',function() {
			ScheduleUI.pageDownSpecial();
		});						


	},

	isConfigOnSchedule: function(confLoc) {
		var isScheduled = false;
		var dowScheduleLen = allWorkingData.InSpire.dowScheduleEntries.length;
		for (var i = 0; i <  dowScheduleLen; i++) {
			if (confLoc == allWorkingData.InSpire.dowScheduleEntries[i].m_confId) {
				isScheduled = true;
				break;
			}
		}
		var toyScheduleLen = allWorkingData.InSpire.toyScheduleEntries.length;
		for (var i = 0; i <  toyScheduleLen; i++) {
			if (confLoc == allWorkingData.InSpire.toyScheduleEntries[i].m_confId) {
				isScheduled = true;
				break;
			}
		}				
		return isScheduled;
	},

	pageUpWeekly: function() {
		console.log('pageUpWeekly');

		var startPoint = 0;
		var curSet = $('#schedule-list-weekly').find('#set-count').val();
		if (curSet > 0) {
			startPoint = (curSet - 1) + 1;
			$('#schedule-list-weekly').find('.content ul li.update-schedule').addClass('hide');
			for (var i = startPoint; i < startPoint + 7;  i++) {
				$('#schedule-list-weekly').find('.content ul li:eq('+i+')').removeClass('hide');
			}
			$('#schedule-list-weekly').find('#set-count').val(parseInt(curSet - 1));			
		}	
	},


	pageDownWeekly: function() {
		console.log('pageDownWeekly');
		var startPoint = 0;
		var dowScheduleLen = parseInt($('#schedule-list-weekly').find('.content ul li.update-schedule').length);
		var setCount = Math.floor(dowScheduleLen/7);
		var remainCount = dowScheduleLen % 7;
		console.log('remainCount is ' + remainCount);
		var curSet = $('#schedule-list-weekly').find('#set-count').val();
		if (setCount > curSet) {
			if (remainCount > 0) {
				startPoint = ((curSet + 1) * 7) + 1; 
				$('#schedule-list-weekly').find('.content ul li.update-schedule').addClass('hide');
				for (var i = startPoint; i < startPoint + 7;  i++) {
					$('#schedule-list-weekly').find('.content ul li:eq('+i+')').removeClass('hide');
				}
				$('#schedule-list-weekly').find('#set-count').val(parseInt(curSet + 1));						
			} else {
				startPoint = ((curSet) * 7) + 1; 
				$('#schedule-list-weekly').find('.content ul li.update-schedule').addClass('hide');
				for (var i = startPoint; i < startPoint + 7;  i++) {
					$('#schedule-list-weekly').find('.content ul li:eq('+i+')').removeClass('hide');
				}
				$('#schedule-list-weekly').find('#set-count').val(parseInt(curSet + 1));				
			}
		} else {
			console.log('sheeet');
		}
	},	

	pageUpSpecial: function() {
		console.log('pageUpSpecial');

		var startPoint = 0;
		var curSet = $('#schedule-list-special').find('#set-count').val();
		if (curSet > 0) {
			startPoint = (curSet - 1) + 1;
			$('#schedule-list-special').find('.content ul li.update-schedule').addClass('hide');
			for (var i = startPoint; i < startPoint + 6;  i++) {
				$('#schedule-list-special').find('.content ul li:eq('+i+')').removeClass('hide');
			}
			$('#schedule-list-special').find('#set-count').val(parseInt(curSet - 1));			
		}	
	},

	pageDownSpecial: function() {
		console.log('pageDownSpecial');
		var startPoint = 0;
		var dowScheduleLen = parseInt($('#schedule-list-special').find('.content ul li.update-schedule').length);
		var setCount = Math.floor(dowScheduleLen/6);
		var remainCount = dowScheduleLen % 6;
		console.log('remainCount is ' + remainCount);
		var curSet = $('#schedule-list-special').find('#set-count').val();
		if (setCount > curSet) {
			if (remainCount > 0) {
				startPoint = ((curSet + 1) * 6) + 1; 
				$('#schedule-list-special').find('.content ul li.update-schedule').addClass('hide');
				for (var i = startPoint; i < startPoint + 6;  i++) {
					$('#schedule-list-special').find('.content ul li:eq('+i+')').removeClass('hide');
				}
				$('#schedule-list-special').find('#set-count').val(parseInt(curSet + 1));						
			} else {
				startPoint = ((curSet) * 6) + 1; 
				$('#schedule-list-special').find('.content ul li.update-schedule').addClass('hide');
				for (var i = startPoint; i < startPoint + 6;  i++) {
					$('#schedule-list-special').find('.content ul li:eq('+i+')').removeClass('hide');
				}
				$('#schedule-list-special').find('#set-count').val(parseInt(curSet + 1));				
			}
		} else {
			console.log('sheeet');
		}
	},	

/**************************************/
// LIST OF WEEKLY SCHEDULES (TOD)

	getWeeklyList: function() {
		var markup = '<li class=\'add-new-schedule\'><div>Add a New Weekly Schedule</div></li>';
		var dowScheduleLen = allWorkingData.InSpire.dowScheduleEntries.length;
		var confId, dayOfWeek, startTime, endTime, configName, configArrayLoc, scheduleArrayLoc, dowText, filterClass;
		 for (var i = 0; i <  dowScheduleLen; i++) {

		 		confId = parseInt(allWorkingData.InSpire.dowScheduleEntries[i].m_confId);
		 		dowVal = parseInt(allWorkingData.InSpire.dowScheduleEntries[i].m_dow);


					dayOfWeek = BaseUI.translateDayOfWeek(dowVal);

					configName = ConfigUI.getConfigNameById(confId);
					configArrayLoc = ConfigUI.getConfigArrayLoc(confId);
					startTimeHour = allWorkingData.InSpire.dowScheduleEntries[i].m_startTime.m_hour24;
					startTimeMin = allWorkingData.InSpire.dowScheduleEntries[i].m_startTime.m_min;
					startTimeSec = allWorkingData.InSpire.dowScheduleEntries[i].m_startTime.m_sec;
					startTimeFormatted = BaseUI.translateTime(startTimeHour,startTimeMin,startTimeSec);
					endTimeHour = allWorkingData.InSpire.dowScheduleEntries[i].m_endTime.m_hour24;
					endTimeMin = allWorkingData.InSpire.dowScheduleEntries[i].m_endTime.m_min;
					endTimeFormatted = BaseUI.translateTime(endTimeHour,endTimeMin);		
					scheduleArrayLoc = i;	

			 		if ($('#schedule-list-weekly').find('.dow-filter li.active').length > 0) {
				 		if (ScheduleUI.filteredDow(dowVal)) {
				 		//	filterClass = 'included';
				 		markup = markup + '<li class=\'update-schedule\' data-dow-loc=\'' + dowVal + '\' data-schedule-loc=\''+ scheduleArrayLoc + '\' data-config-loc=\''+ configArrayLoc + '\'><div class=\'weekly-day\'>'+dayOfWeek+'</div><div class=\'weekly-time\'>'+ startTimeFormatted +' - ' + endTimeFormatted +'</div><div class=\'config-name\'>'+ configName +'</div><div class=\'remove-schedule\'>Delete</div></li>';
				 		} 		 			
			 		} else {
			 			//filterClass = 'included';
						markup = markup + '<li class=\'update-schedule\' data-dow-loc=\'' + dowVal + '\' data-schedule-loc=\''+ scheduleArrayLoc + '\' data-config-loc=\''+ configArrayLoc + '\'><div class=\'weekly-day\'>'+dayOfWeek+'</div><div class=\'weekly-time\'>'+ startTimeFormatted +' - ' + endTimeFormatted +'</div><div class=\'config-name\'>'+ configName +'</div><div class=\'remove-schedule\'>Delete</div></li>';			 			
			 		}

					

		 }	
		$('#schedule-list-weekly').find('.content ul').empty().append(markup);
		var setCount = Math.floor(parseInt($('#schedule-list-weekly').find('li.update-schedule').length)/7);
		var remainCount = parseInt($('#schedule-list-weekly').find('li.update-schedule').length) % 7;
		var starPoint = 0;
		console.log('original setCount is ' + setCount);
		if (remainCount == 0) {
			setCount = setCount - 1;
		}
		console.log('setCount is ' + setCount);
		console.log('remainCount is ' + remainCount);

		if (setCount > 0) {
			startPoint = (setCount * 7) + 1;
		} else {
			setCount = 0;
			startPoint = 1;
		}

		// adjust start point if schedule is filtered out
		for (var j = startPoint; j < startPoint + 7;  j++) {
			if($('#schedule-list-weekly').find('.content ul li:eq('+j+')').hasClass('excluded')) {
				startPoint = startPoint + 1;
			} else {
				break;
			}
		}		


		console.log('startPoint is ' + startPoint);
		$('#schedule-list-weekly').find('.content ul li.update-schedule').addClass('hide');
		var endPoint = startPoint + 7;
		for (var j = startPoint; j < endPoint;  j++) {
			$('#schedule-list-weekly').find('.content ul li:eq('+j+')').removeClass('hide');		
		}
		$('#schedule-list-weekly').find('#set-count').val(setCount);
	},

/**************************************/
// FILTER SCHEDULE
	filteredDow: function(val) {
		var weeklyFilterArr = [];
		var isFiltered = false;
		for (var j = 0; j < 7;  j++) {
			if ($('#schedule-list-weekly').find('.dow-filter li:nth-child('+(j + 1)+')').hasClass('active')){
				weeklyFilterArr.push(parseInt($('#schedule-list-weekly').find('.dow-filter li:nth-child('+(j + 1)+')').attr('data-dow')));
			}
		};
		if($.inArray(val,weeklyFilterArr) === -1) {
			isFiltered = false;
		} else {
			isFiltered = true;
		}
		return isFiltered;		
	},

	filterDow: function() {
		$('#schedule-list-weekly').find('.dow-filter li').on('mousedown',function() {
			var thisObj = $(this);
			if (thisObj.hasClass('active')) {
				thisObj.removeClass('active');
			} else {
				thisObj.addClass('active');
			}
			var filterDowArr = [];
			for (var j = 0; j < 7;  j++) {
				if ($('#schedule-list-weekly').find('.dow-filter li:nth-child('+(j + 1)+')').hasClass('active')){
					filterDowArr.push(parseInt($('#schedule-list-weekly').find('.dow-filter li:nth-child('+(j + 1)+')').attr('data-dow')));
				}
				
			};
			ScheduleUI.getWeeklyList();
		});
	},


/**************************************/
// ADD WEEKLY SCHEDULE (TOD)

	addWeeklySchedule: function() {
		$('#schedule-list-weekly').find('.content ul').on('mousedown','li.add-new-schedule',function() {
			$('#schedule-list-weekly').find('.overlay.schedule-def #operation-mode').val('add');
			$('#schedule-list-weekly').find('.overlay.schedule-def .multi-weekday-selection li').removeClass('active');
			$('#schedule-list-weekly').find('.overlay.schedule-def .multi-weekday-selection').show();
			$('#schedule-list-weekly').find('.overlay.schedule-def .configuration-selection span').text(ConfigUI.getConfigNameById(1));
			$('#schedule-list-weekly').find('.overlay.schedule-def .weekday-selection').hide();			
			$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-hour span').text('0:');
			$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-min span').text('00');
			$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-hour span').text('0:');
			$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-min span').text('00');			
			$('#schedule-list-weekly').find('.overlay.schedule-def').show();
		});

		$('#schedule-list-weekly').find('.content ul').on('mousedown','li.update-schedule',function() {
			var schedToUpdate = parseInt($(this).attr('data-schedule-loc'));
			
			// Load Weekday
			$('#schedule-list-weekly').find('.schedule-def #weekday-sel').val(allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_dow);
			$('#schedule-list-weekly').find('.schedule-def .weekday-selection span').text(BaseUI.translateDayOfWeek($('#schedule-list-weekly').find('.schedule-def #weekday-sel').val()));	
			
			// Load Config Name
			var configToRead = $(this).attr('data-config-loc');
			$('#schedule-list-weekly').find('.schedule-def #config-sel').val(configToRead);
			$('#schedule-list-weekly').find('.schedule-def .configuration-selection span').text(allWorkingData.InSpire.m_controllerConfigurations[configToRead].m_configurationName);

			// Load Start Time Hour
			$('#schedule-list-weekly').find('.schedule-def #start-hour-sel').val(allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_startTime.m_hour24);
			$('#schedule-list-weekly').find('.schedule-def .start-time-hour span').text($('#schedule-list-weekly').find('.schedule-def #start-hour-sel').val() + ':');	

			// Load Start Time Minutes
			$('#schedule-list-weekly').find('.schedule-def #start-min-sel').val(allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_startTime.m_min);
			var minutes = allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_startTime.m_min;
			if (minutes < 10) {minutes = "0"+minutes;}
			$('#schedule-list-weekly').find('.schedule-def .start-time-min span').text(minutes);	

			// Load End Time Hour
			$('#schedule-list-weekly').find('.schedule-def #end-hour-sel').val(allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_endTime.m_hour24);
			$('#schedule-list-weekly').find('.schedule-def .end-time-hour span').text($('#schedule-list-weekly').find('.schedule-def #end-hour-sel').val() + ':');				

			// Load End Time Minutes
			$('#schedule-list-weekly').find('.schedule-def #end-min-sel').val(allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_endTime.m_min);
			var minutes = allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_endTime.m_min;
			if (minutes < 10) {minutes = "0"+minutes;}
			$('#schedule-list-weekly').find('.schedule-def .end-time-min span').text(minutes);	

			$('#schedule-list-weekly').find('.overlay.schedule-def #sched-to-update').val($(this).attr('data-schedule-loc'));

			$('#schedule-list-weekly').find('.overlay.schedule-def .multi-weekday-selection').hide();
			$('#schedule-list-weekly').find('.overlay.schedule-def .weekday-selection').show();
			$('#schedule-list-weekly').find('.overlay.schedule-def #operation-mode').val('update');
			$('#schedule-list-weekly').find('.overlay.schedule-def').show();
		});		

		// WEEKDAY SELECTION
		$('#schedule-list-weekly').find('.overlay.schedule-def .weekday-selection .increment').on('mousedown',function() {
			var curWeekdayVal = parseInt($('#schedule-list-weekly').find('.schedule-def #weekday-sel').val());
			var weekdayArr = [1,2,4,8,16,32,64];
			var curPos = $.inArray(curWeekdayVal,weekdayArr);
			if (curPos == 6) {
				var nextWeekday = weekdayArr[0];
			} else {
				var nextWeekday = weekdayArr[curPos + 1];
			}
			$('#schedule-list-weekly').find('.schedule-def #weekday-sel').val(nextWeekday);
			$('#schedule-list-weekly').find('.overlay.schedule-def .weekday-selection span').text(BaseUI.translateDayOfWeek($('#schedule-list-weekly').find('.schedule-def #weekday-sel').val()));
		});	

		$('#schedule-list-weekly').find('.overlay.schedule-def .weekday-selection .decrement').on('mousedown',function() {
			var curWeekdayVal = parseInt($('#schedule-list-weekly').find('.schedule-def #weekday-sel').val());
			var weekdayArr = [1,2,4,8,16,32,64];
			var curPos = $.inArray(curWeekdayVal,weekdayArr);
			if (curPos == 0) {
				var nextWeekday = weekdayArr[6];
			} else {
				var nextWeekday = weekdayArr[curPos - 1];
			}
			$('#schedule-list-weekly').find('.schedule-def #weekday-sel').val(nextWeekday);
			$('#schedule-list-weekly').find('.overlay.schedule-def .weekday-selection span').text(BaseUI.translateDayOfWeek($('#schedule-list-weekly').find('.schedule-def #weekday-sel').val()));
		});				

		// CONFIG SELECTION
		$('#schedule-list-weekly').find('.overlay.schedule-def .configuration-selection .increment').on('mousedown',function() {
			var curConfigLoc = parseInt($('#schedule-list-weekly').find('.schedule-def #config-sel').val());
			var configCount = allWorkingData.InSpire.m_controllerConfigurations.length;		
			if (curConfigLoc < parseInt(configCount - 1)) {
				curConfigLoc = parseInt(curConfigLoc + 1);
			} else {
				curConfigLoc = 0;
			}
			$('#schedule-list-weekly').find('.schedule-def #config-sel').val(curConfigLoc);		
			$('#schedule-list-weekly').find('.overlay.schedule-def .configuration-selection span').text(allWorkingData.InSpire.m_controllerConfigurations[curConfigLoc].m_configurationName);
		});	

		$('#schedule-list-weekly').find('.overlay.schedule-def .configuration-selection .decrement').on('mousedown',function() {
			var curConfigLoc = parseInt($('#schedule-list-weekly').find('.schedule-def #config-sel').val());
			var configCount = allWorkingData.InSpire.m_controllerConfigurations.length;		
			if (curConfigLoc == 0) {
				curConfigLoc = parseInt(configCount - 1);
			} else {
				curConfigLoc = parseInt(curConfigLoc - 1);
			}
			$('#schedule-list-weekly').find('.schedule-def #config-sel').val(curConfigLoc);		
			$('#schedule-list-weekly').find('.overlay.schedule-def .configuration-selection span').text(allWorkingData.InSpire.m_controllerConfigurations[curConfigLoc].m_configurationName);
		});	

	

		// START TIME SELECTION
		$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-hour .increment').on('mousedown',function() {
			var curStartHourSel = parseInt($('#schedule-list-weekly').find('.schedule-def #start-hour-sel').val());
			if (curStartHourSel == 23) {
				curStartHourSel = 0;
			} else {
				curStartHourSel = curStartHourSel + 1;
			}
			$('#schedule-list-weekly').find('.schedule-def #start-hour-sel').val(curStartHourSel);
			$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-hour span').text(curStartHourSel + ':');
		});	

		$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-hour .decrement').on('mousedown',function() {
			var curStartHourSel = parseInt($('#schedule-list-weekly').find('.schedule-def #start-hour-sel').val());
			if (curStartHourSel == 0) {
				curStartHourSel = 23;
			} else {
				curStartHourSel = curStartHourSel - 1;
			}
			$('#schedule-list-weekly').find('.schedule-def #start-hour-sel').val(curStartHourSel);
			$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-hour span').text(curStartHourSel + ':');
		});	


		$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-min .increment').on('mousedown',function() {
			var curStartMinSel = parseInt($('#schedule-list-weekly').find('.schedule-def #start-min-sel').val());
			if (curStartMinSel == 55) {
				curStartMinSel = 0;
			} else {
				curStartMinSel = curStartMinSel + 5;
			}
			$('#schedule-list-weekly').find('.schedule-def #start-min-sel').val(curStartMinSel);
			if (curStartMinSel < 10) {curStartMinSel = "0"+curStartMinSel};
			$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-min span').text(curStartMinSel);
		});	

		$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-min .decrement').on('mousedown',function() {
			var curStartMinSel = parseInt($('#schedule-list-weekly').find('.schedule-def #start-min-sel').val());
			if (curStartMinSel == 0) {
				curStartMinSel = 55;
			} else {
				curStartMinSel = curStartMinSel - 5;
			}
			$('#schedule-list-weekly').find('.schedule-def #start-min-sel').val(curStartMinSel);
			if (curStartMinSel < 10) {curStartMinSel = "0"+curStartMinSel};
			$('#schedule-list-weekly').find('.overlay.schedule-def .start-time-min span').text(curStartMinSel);
		});			

		// END TIME SELECTION
		$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-hour .increment').on('mousedown',function() {

			var curEndHourSel = parseInt($('#schedule-list-weekly').find('.schedule-def #end-hour-sel').val());
			if (curEndHourSel == 24) {
				curEndHourSel = 0;
			} else {
				curEndHourSel = curEndHourSel + 1;
			}
			$('#schedule-list-weekly').find('.schedule-def #end-hour-sel').val(curEndHourSel);
			$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-hour span').text(curEndHourSel + ':');
		});	

		$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-hour .decrement').on('mousedown',function() {
			var curEndHourSel = parseInt($('#schedule-list-weekly').find('.schedule-def #end-hour-sel').val());
			if (curEndHourSel == 0) {
				curEndHourSel = 24;
			} else {
				curEndHourSel = curEndHourSel - 1;
			}
			$('#schedule-list-weekly').find('.schedule-def #end-hour-sel').val(curEndHourSel);
			$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-hour span').text(curEndHourSel + ':');
		});			

		$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-min .increment').on('mousedown',function() {
			var curEndMinSel = parseInt($('#schedule-list-weekly').find('.schedule-def #end-min-sel').val());
			if (curEndMinSel == 55) {
				curEndMinSel = 0;
			} else {
				curEndMinSel = curEndMinSel + 5;
			}
			$('#schedule-list-weekly').find('.schedule-def #end-min-sel').val(curEndMinSel);
			if (curEndMinSel < 10) {curEndMinSel = "0"+curEndMinSel};
			$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-min span').text(curEndMinSel);
		});	

		$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-min .decrement').on('mousedown',function() {
			var curEndMinSel = parseInt($('#schedule-list-weekly').find('.schedule-def #end-min-sel').val());
			if (curEndMinSel == 0) {
				curEndMinSel = 55;
			} else {
				curEndMinSel = curEndMinSel - 5;
			}
			$('#schedule-list-weekly').find('.schedule-def #end-min-sel').val(curEndMinSel);
			if (curEndMinSel < 10) {curEndMinSel = "0"+curEndMinSel};
			$('#schedule-list-weekly').find('.overlay.schedule-def .end-time-min span').text(curEndMinSel);
		});			

		$('#schedule-list-weekly').find('.overlay.schedule-def .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});

		$('#schedule-list-weekly').find('.overlay .multi-weekday-selection li').on('mousedown',function() {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});	

		$('#schedule-list-weekly').find('.overlay.schedule-def .set').on('mousedown',function() {

			if ($('#schedule-list-weekly').find('.schedule-def #operation-mode').val() == 'update') {
				var schedToUpdate = $('#schedule-list-weekly').find('.overlay.schedule-def #sched-to-update').val();
				allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_dow = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #weekday-sel').val());
				var adjConfId = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #config-sel').val());
				
				allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_confId = parseInt(adjConfId + 1);
				allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_startTime.m_hour24 = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #start-hour-sel').val());
				allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_startTime.m_min = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #start-min-sel').val());
				allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_endTime.m_hour24 = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #end-hour-sel').val());
				allWorkingData.InSpire.dowScheduleEntries[schedToUpdate].m_endTime.m_min = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #end-min-sel').val());			
				
			} else {
				var dowsSelected = [];
				$('#schedule-list-weekly').find('.schedule-def .multi-weekday-selection li').each(function() {  
					if ($(this).hasClass('active')) {
						dowsSelected.push(parseInt($(this).find('a').attr('data-dow')));
					}
				});
				dowsCount = dowsSelected.length;
				for (var i = 0; i <  dowsCount; i++) {
					var newDowObj = {
		               "m_dow" : 0,
		               "m_confId" : 0,
		               "m_enabled" : true,
		               "m_endTime" : {
		                  "m_hour24" : 0,
		                  "m_min" : 0,
		                  "m_sec" : 0
		               },
		               "m_startTime" : {
		                  "m_hour24" : 0,
		                  "m_min" : 0,
		                  "m_sec" : 0
		               }				
					};

					newDowObj.m_dow = parseInt(dowsSelected[i]);
					var adjConfId = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #config-sel').val());
					newDowObj.m_confId = parseInt(adjConfId + 1);
					newDowObj.m_startTime.m_hour24 = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #start-hour-sel').val());
					newDowObj.m_startTime.m_min = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #start-min-sel').val());
					newDowObj.m_endTime.m_hour24 = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #end-hour-sel').val());
					newDowObj.m_endTime.m_min = parseInt($('#schedule-list-weekly').find('.overlay.schedule-def #end-min-sel').val());											

					allWorkingData.InSpire.dowScheduleEntries.push(newDowObj);

				}	

			}

			// Sort by start min
			allWorkingData.InSpire.dowScheduleEntries.sort(function(obj1, obj2) {
				return obj1.m_startTime.m_hour24 - obj2.m_startTime.m_min;
			});

			// Sort by start hour
			allWorkingData.InSpire.dowScheduleEntries.sort(function(obj1, obj2) {
				return obj1.m_startTime.m_hour24 - obj2.m_startTime.m_hour24;
			});
			// Then sort by day of week
			allWorkingData.InSpire.dowScheduleEntries.sort(function(obj1, obj2) {
				return obj1.m_dow - obj2.m_dow;
			});

			ScheduleUI.resetWeeklyFilter();
			ScheduleUI.getWeeklyList();
			ConfigUI.loadConfigList();
			BaseUI.resetOverlay();
		});		

	},

	removeWeeklySchedule: function(loc) {
		allWorkingData.InSpire.dowScheduleEntries.splice(loc,1);
		allPristineData.InSpire.dowScheduleEntries.splice(loc,1);
		ScheduleUI.getWeeklyList();
		ConfigUI.loadConfigList();
		BaseUI.resetOverlay();
	},

	removeSpecialSchedule: function(loc) {
		allWorkingData.InSpire.toyScheduleEntries.splice(loc,1);
		allPristineData.InSpire.toyScheduleEntries.splice(loc,1);
		ScheduleUI.getSpecialList();
		ConfigUI.loadConfigList();
		BaseUI.resetOverlay();
	},	

	resetWeeklyFilter: function() {
		$('#schedule-list-weekly').find('.dow-filter li').removeClass('active');
	},

	decrementHour: function(obj) {
			
			var getCurValue = parseInt(obj.text());
			if (getCurValue == 0) {
				getCurValue = 23;
			} else {
				getCurValue = getCurValue - 1;
			}			
			obj.text(getCurValue);
	
	},

	incrementHour: function(obj) {

			var getCurValue = parseInt(obj.text());
			if (getCurValue == 23) {
				getCurValue = 0;
			} else {
				getCurValue = getCurValue + 1;
			}			
			obj.text(getCurValue);	
	},

/**************************************/
// LIST OF SPECIAL EVENTS (TOY)

	getSpecialList: function() {
		var markup = '<li class=\'add-new-schedule\'><div>Add a New Special Event</div></li>';
		var dowScheduleLen = allWorkingData.InSpire.toyScheduleEntries.length;
		var confId, dayOfWeek, startDate, startTime, endDate, endTime, configName, configArrayLoc, scheduleArrayLoc, dowText, filterClass;
		 for (var i = 0; i <  dowScheduleLen; i++) {

		 		confId = parseInt(allWorkingData.InSpire.toyScheduleEntries[i].m_confId);
		 		dowVal = parseInt(allWorkingData.InSpire.toyScheduleEntries[i].m_dow);


					configName = ConfigUI.getConfigNameById(confId);
					configArrayLoc = ConfigUI.getConfigArrayLoc(confId);
					startDateYear = allWorkingData.InSpire.toyScheduleEntries[i].m_startDateTime.m_date.m_year;
					startDateMonth = allWorkingData.InSpire.toyScheduleEntries[i].m_startDateTime.m_date.m_month;
					if (startDateMonth < 10) {startDateMonth = "0"+startDateMonth;}					
					startDateDay = allWorkingData.InSpire.toyScheduleEntries[i].m_startDateTime.m_date.m_day;
					if (startDateDay < 10) {startDateDay = "0"+startDateDay;}	
					startTimeHour = allWorkingData.InSpire.toyScheduleEntries[i].m_startDateTime.m_time.m_hour24;
					startTimeMin = allWorkingData.InSpire.toyScheduleEntries[i].m_startDateTime.m_time.m_min;
					startTimeSec = allWorkingData.InSpire.toyScheduleEntries[i].m_startDateTime.m_time.m_sec;
					startTimeFormatted = BaseUI.translateTime(startTimeHour,startTimeMin,startTimeSec);
					endDateYear = allWorkingData.InSpire.toyScheduleEntries[i].m_endDateTime.m_date.m_year;
					endDateMonth = allWorkingData.InSpire.toyScheduleEntries[i].m_endDateTime.m_date.m_month;
					if (endDateMonth < 10) {endDateMonth = "0"+endDateMonth;}	
					endDateDay = allWorkingData.InSpire.toyScheduleEntries[i].m_endDateTime.m_date.m_day;
					if (endDateDay < 10) {endDateDay = "0"+endDateDay;}						
					endTimeHour = allWorkingData.InSpire.toyScheduleEntries[i].m_endDateTime.m_time.m_hour24;
					endTimeMin = allWorkingData.InSpire.toyScheduleEntries[i].m_endDateTime.m_time.m_min;
					endTimeFormatted = BaseUI.translateTime(endTimeHour,endTimeMin);		
					scheduleArrayLoc = i;	

					markup = markup + '<li class=\'update-schedule\' data-schedule-loc=\''+ scheduleArrayLoc + '\' data-config-loc=\''+ configArrayLoc + '\'>';
					markup = markup + '<div class=\'start-date-time\'>'+ startDateYear + '-' + startDateMonth + '-' + startDateDay + ' ' + startTimeFormatted +' to </div>';
					markup = markup + '<div class=\'end-date-time\'>'+ endDateYear + '-' + endDateMonth + '-' + endDateDay + ' '+ endTimeFormatted + '</div>';
					markup = markup + '<div class=\'config-name\'>'+ configName +'</div><div class=\'remove-schedule\'>Delete</div></li>';

		 }	
		$('#schedule-list-special').find('.content ul').empty().append(markup);
		var setCount = Math.floor(parseInt($('#schedule-list-special').find('li.update-schedule').length)/6);
		var remainCount = dowScheduleLen % 6;
		var starPoint = 0;

		if (remainCount == 0) {
			setCount = setCount - 1;
		}

		if (setCount > 0) {
			startPoint = (setCount * 6) + 1;
		} else {
			setCount = 0;
			startPoint = 1;
		}
		$('#schedule-list-special').find('.content ul li.update-schedule').addClass('hide');
		for (var j = startPoint; j < startPoint + 6;  j++) {
			$('#schedule-list-special').find('.content ul li:eq('+j+')').removeClass('hide');				
		}
		$('#schedule-list-special').find('#set-count').val(setCount);
	},

/**************************************/
// ADD SPECIAL EVEN (TOY)

	addSpecialEvent: function() {
		$('#schedule-list-special').find('.content ul').on('mousedown','li.add-new-schedule',function() {
			$('#schedule-list-special').find('.overlay.schedule-def #operation-mode').val('add');
			$('#schedule-list-special').find('.overlay.schedule-def .configuration-selection span').text(ConfigUI.getConfigNameById(1));			
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-year span').text('2016');
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-month span').text('1');
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-day span').text('1');
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-year span').text('2016');
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-month span').text('1');
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-day span').text('1');			
			$('#schedule-list-special').find('.overlay.schedule-def .start-time-hour span').text('0:');
			$('#schedule-list-special').find('.overlay.schedule-def .start-time-min span').text('00');
			$('#schedule-list-special').find('.overlay.schedule-def .end-time-hour span').text('0:');
			$('#schedule-list-special').find('.overlay.schedule-def .end-time-min span').text('00');
			$('#schedule-list-special').find('.overlay.schedule-def').show();
		});

		$('#schedule-list-special').find('.content ul').on('mousedown','li.update-schedule',function() {
			var schedToUpdate = parseInt($(this).attr('data-schedule-loc'));
			
			// Load Config Name
			var configToRead = $(this).attr('data-config-loc');
			$('#schedule-list-special').find('.schedule-def #config-sel').val(configToRead);
			$('#schedule-list-special').find('.schedule-def .configuration-selection span').text(allWorkingData.InSpire.m_controllerConfigurations[configToRead].m_configurationName);

			// Load Start Date Year
			$('#schedule-list-special').find('.schedule-def #start-year-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_date.m_year);
			$('#schedule-list-special').find('.schedule-def .start-date-year span').text($('#schedule-list-special').find('.schedule-def #start-year-sel').val() + '');

			// Load Start Date Month
			$('#schedule-list-special').find('.schedule-def #start-month-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_date.m_month);
			$('#schedule-list-special').find('.schedule-def .start-date-month span').text($('#schedule-list-special').find('.schedule-def #start-month-sel').val() + '');

			// Load Start Date Day
			$('#schedule-list-special').find('.schedule-def #start-day-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_date.m_day);
			$('#schedule-list-special').find('.schedule-def .start-date-day span').text($('#schedule-list-special').find('.schedule-def #start-day-sel').val() + '');

			// Load Start Time Hour
			$('#schedule-list-special').find('.schedule-def #start-hour-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_time.m_hour24);
			$('#schedule-list-special').find('.schedule-def .start-time-hour span').text($('#schedule-list-special').find('.schedule-def #start-hour-sel').val() + ':');	

			// Load Start Time Minutes
			$('#schedule-list-special').find('.schedule-def #start-min-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_time.m_min);
			var minutes = allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_time.m_min;
			if (minutes < 10) {minutes = "0"+minutes;}
			$('#schedule-list-special').find('.schedule-def .start-time-min span').text(minutes);	



			// Load End Date Year
			$('#schedule-list-special').find('.schedule-def #end-year-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_date.m_year);
			$('#schedule-list-special').find('.schedule-def .end-date-year span').text($('#schedule-list-special').find('.schedule-def #end-year-sel').val() + '');

			// Load End Date Month
			$('#schedule-list-special').find('.schedule-def #end-month-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_date.m_month);
			$('#schedule-list-special').find('.schedule-def .end-date-month span').text(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_date.m_month);

			// Load End Date Day
			$('#schedule-list-special').find('.schedule-def #end-day-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_date.m_day);
			$('#schedule-list-special').find('.schedule-def .end-date-day span').text($('#schedule-list-special').find('.schedule-def #end-day-sel').val() + '');


			// Load End Time Hour
			$('#schedule-list-special').find('.schedule-def #end-hour-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_time.m_hour24);
			$('#schedule-list-special').find('.schedule-def .end-time-hour span').text($('#schedule-list-special').find('.schedule-def #end-hour-sel').val() + ':');				

			// Load End Time Minutes
			$('#schedule-list-special').find('.schedule-def #end-min-sel').val(allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_time.m_min);
			var minutes = allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_time.m_min;
			if (minutes < 10) {minutes = "0"+minutes;}
			$('#schedule-list-special').find('.schedule-def .end-time-min span').text(minutes);	

			$('#schedule-list-special').find('.overlay.schedule-def #sched-to-update').val($(this).attr('data-schedule-loc'));

			$('#schedule-list-special').find('.overlay.schedule-def .multi-weekday-selection').hide();
			$('#schedule-list-special').find('.overlay.schedule-def .weekday-selection').show();
			$('#schedule-list-special').find('.overlay.schedule-def #operation-mode').val('update');
			$('#schedule-list-special').find('.overlay.schedule-def').show();
		});		
			

		// CONFIG SELECTION
		$('#schedule-list-special').find('.overlay.schedule-def .configuration-selection .increment').on('mousedown',function() {
			var curConfigLoc = parseInt($('#schedule-list-special').find('.schedule-def #config-sel').val());
			var configCount = allWorkingData.InSpire.m_controllerConfigurations.length;		
			if (curConfigLoc < parseInt(configCount - 1)) {
				curConfigLoc = parseInt(curConfigLoc + 1);
			} else {
				curConfigLoc = 0;
			}
			$('#schedule-list-special').find('.schedule-def #config-sel').val(curConfigLoc);		
			$('#schedule-list-special').find('.overlay.schedule-def .configuration-selection span').text(allWorkingData.InSpire.m_controllerConfigurations[curConfigLoc].m_configurationName);
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .configuration-selection .decrement').on('mousedown',function() {
			var curConfigLoc = parseInt($('#schedule-list-special').find('.schedule-def #config-sel').val());
			var configCount = allWorkingData.InSpire.m_controllerConfigurations.length;		
			if (curConfigLoc == 0) {
				curConfigLoc = parseInt(configCount - 1);
			} else {
				curConfigLoc = parseInt(curConfigLoc - 1);
			}
			$('#schedule-list-special').find('.schedule-def #config-sel').val(curConfigLoc);		
			$('#schedule-list-special').find('.overlay.schedule-def .configuration-selection span').text(allWorkingData.InSpire.m_controllerConfigurations[curConfigLoc].m_configurationName);
		});	

		// START DATE SELECTION
		$('#schedule-list-special').find('.overlay.schedule-def .start-date-year .increment').on('mousedown',function() {
			var curStartYearSel = parseInt($('#schedule-list-special').find('.schedule-def #start-year-sel').val());
			curStartYearSel = curStartYearSel + 1;
			$('#schedule-list-special').find('.schedule-def #start-year-sel').val(curStartYearSel);
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-year span').text(curStartYearSel + '');
		});		

		$('#schedule-list-special').find('.overlay.schedule-def .start-date-year .decrement').on('mousedown',function() {
			var curStartYearSel = parseInt($('#schedule-list-special').find('.schedule-def #start-year-sel').val());
			curStartYearSel = curStartYearSel - 1;
			$('#schedule-list-special').find('.schedule-def #start-year-sel').val(curStartYearSel);
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-year span').text(curStartYearSel + '');
		});				

		$('#schedule-list-special').find('.overlay.schedule-def .start-date-month .increment').on('mousedown',function() {
			var curStartMonthSel = parseInt($('#schedule-list-special').find('.schedule-def #start-month-sel').val());
			if (curStartMonthSel == 12) {
				curStartMonthSel = 1;
			} else {
				curStartMonthSel = curStartMonthSel + 1;
			}
			$('#schedule-list-special').find('.schedule-def #start-month-sel').val(curStartMonthSel);
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-month span').text(curStartMonthSel + '');
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .start-date-month .decrement').on('mousedown',function() {
			var curStartMonthSel = parseInt($('#schedule-list-special').find('.schedule-def #start-month-sel').val());
			if (curStartMonthSel == 1) {
				curStartMonthSel = 12;
			} else {
				curStartMonthSel = curStartMonthSel - 1;
			}
			$('#schedule-list-special').find('.schedule-def #start-month-sel').val(curStartMonthSel);
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-month span').text(curStartMonthSel + '');
		});			

		$('#schedule-list-special').find('.overlay.schedule-def .start-date-day .increment').on('mousedown',function() {
			var curStartDaySel = parseInt($('#schedule-list-special').find('.schedule-def #start-day-sel').val());
			if (curStartDaySel == 31) {
				curStartDaySel = 1;
			} else {
				curStartDaySel = curStartDaySel + 1;
			}
			$('#schedule-list-special').find('.schedule-def #start-day-sel').val(curStartDaySel);
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-day span').text(curStartDaySel + '');
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .start-date-day .decrement').on('mousedown',function() {
			var curStartDaySel = parseInt($('#schedule-list-special').find('.schedule-def #start-day-sel').val());
			if (curStartDaySel == 1) {
				curStartDaySel = 31;
			} else {
				curStartDaySel = curStartDaySel - 1;
			}
			$('#schedule-list-special').find('.schedule-def #start-day-sel').val(curStartDaySel);
			$('#schedule-list-special').find('.overlay.schedule-def .start-date-day span').text(curStartDaySel + '');
		});	

		// START TIME SELECTION
		$('#schedule-list-special').find('.overlay.schedule-def .start-time-hour .increment').on('mousedown',function() {
			var curStartHourSel = parseInt($('#schedule-list-special').find('.schedule-def #start-hour-sel').val());
			if (curStartHourSel == 23) {
				curStartHourSel = 0;
			} else {
				curStartHourSel = curStartHourSel + 1;
			}
			$('#schedule-list-special').find('.schedule-def #start-hour-sel').val(curStartHourSel);
			$('#schedule-list-special').find('.overlay.schedule-def .start-time-hour span').text(curStartHourSel + ':');
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .start-time-hour .decrement').on('mousedown',function() {
			var curStartHourSel = parseInt($('#schedule-list-special').find('.schedule-def #start-hour-sel').val());
			if (curStartHourSel == 0) {
				curStartHourSel = 23;
			} else {
				curStartHourSel = curStartHourSel - 1;
			}
			$('#schedule-list-special').find('.schedule-def #start-hour-sel').val(curStartHourSel);
			$('#schedule-list-special').find('.overlay.schedule-def .start-time-hour span').text(curStartHourSel + ':');
		});	


		$('#schedule-list-special').find('.overlay.schedule-def .start-time-min .increment').on('mousedown',function() {
			var curStartMinSel = parseInt($('#schedule-list-special').find('.schedule-def #start-min-sel').val());
			if (curStartMinSel == 55) {
				curStartMinSel = 0;
			} else {
				curStartMinSel = curStartMinSel + 5;
			}
			$('#schedule-list-special').find('.schedule-def #start-min-sel').val(curStartMinSel);
			if (curStartMinSel < 10) {curStartMinSel = "0"+curStartMinSel};
			$('#schedule-list-special').find('.overlay.schedule-def .start-time-min span').text(curStartMinSel);
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .start-time-min .decrement').on('mousedown',function() {
			var curStartMinSel = parseInt($('#schedule-list-special').find('.schedule-def #start-min-sel').val());
			if (curStartMinSel == 0) {
				curStartMinSel = 55;
			} else {
				curStartMinSel = curStartMinSel - 5;
			}
			$('#schedule-list-special').find('.schedule-def #start-min-sel').val(curStartMinSel);
			if (curStartMinSel < 10) {curStartMinSel = "0"+curStartMinSel};
			$('#schedule-list-special').find('.overlay.schedule-def .start-time-min span').text(curStartMinSel);
		});			

		// END DATE SELECTION
		$('#schedule-list-special').find('.overlay.schedule-def .end-date-year .increment').on('mousedown',function() {
			var curEndYearSel = parseInt($('#schedule-list-special').find('.schedule-def #end-year-sel').val());
			curEndYearSel = curEndYearSel + 1;
			$('#schedule-list-special').find('.schedule-def #end-year-sel').val(curEndYearSel);
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-year span').text(curEndYearSel + '');
		});		

		$('#schedule-list-special').find('.overlay.schedule-def .end-date-year .decrement').on('mousedown',function() {
			var curEndYearSel = parseInt($('#schedule-list-special').find('.schedule-def #end-year-sel').val());
			curEndYearSel = curEndYearSel - 1;
			$('#schedule-list-special').find('.schedule-def #end-year-sel').val(curEndYearSel);
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-year span').text(curEndYearSel + '');
		});				

		$('#schedule-list-special').find('.overlay.schedule-def .end-date-month .increment').on('mousedown',function() {
			var curEndMonthSel = parseInt($('#schedule-list-special').find('.schedule-def #end-month-sel').val());
			if (curEndMonthSel == 12) {
				curEndMonthSel = 1;
			} else {
				curEndMonthSel = curEndMonthSel + 1;
			}
			$('#schedule-list-special').find('.schedule-def #end-month-sel').val(curEndMonthSel);
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-month span').text(curEndMonthSel + '');
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .end-date-month .decrement').on('mousedown',function() {
			var curEndMonthSel = parseInt($('#schedule-list-special').find('.schedule-def #end-month-sel').val());
			if (curEndMonthSel == 1) {
				curEndMonthSel = 12;
			} else {
				curEndMonthSel = curEndMonthSel - 1;
			}
			$('#schedule-list-special').find('.schedule-def #end-month-sel').val(curEndMonthSel);
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-month span').text(curEndMonthSel + '');
		});			

		$('#schedule-list-special').find('.overlay.schedule-def .end-date-day .increment').on('mousedown',function() {
			var curEndDaySel = parseInt($('#schedule-list-special').find('.schedule-def #end-day-sel').val());
			if (curEndDaySel == 31) {
				curEndDaySel = 1;
			} else {
				curEndDaySel = curEndDaySel + 1;
			}
			$('#schedule-list-special').find('.schedule-def #end-day-sel').val(curEndDaySel);
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-day span').text(curEndDaySel + '');
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .end-date-day .decrement').on('mousedown',function() {
			var curEndDaySel = parseInt($('#schedule-list-special').find('.schedule-def #end-day-sel').val());
			if (curEndDaySel == 1) {
				curEndDaySel = 31;
			} else {
				curEndDaySel = curEndDaySel - 1;
			}
			$('#schedule-list-special').find('.schedule-def #end-day-sel').val(curEndDaySel);
			$('#schedule-list-special').find('.overlay.schedule-def .end-date-day span').text(curEndDaySel + '');
		});	

		// END TIME SELECTION
		$('#schedule-list-special').find('.overlay.schedule-def .end-time-hour .increment').on('mousedown',function() {

			var curEndHourSel = parseInt($('#schedule-list-special').find('.schedule-def #end-hour-sel').val());
			if (curEndHourSel == 24) {
				curEndHourSel = 0;
			} else {
				curEndHourSel = curEndHourSel + 1;
			}
			$('#schedule-list-special').find('.schedule-def #end-hour-sel').val(curEndHourSel);
			$('#schedule-list-special').find('.overlay.schedule-def .end-time-hour span').text(curEndHourSel + ':');
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .end-time-hour .decrement').on('mousedown',function() {
			var curEndHourSel = parseInt($('#schedule-list-special').find('.schedule-def #end-hour-sel').val());
			if (curEndHourSel == 0) {
				curEndHourSel = 24;
			} else {
				curEndHourSel = curEndHourSel - 1;
			}
			$('#schedule-list-special').find('.schedule-def #end-hour-sel').val(curEndHourSel);
			$('#schedule-list-special').find('.overlay.schedule-def .end-time-hour span').text(curEndHourSel + ':');
		});			

		$('#schedule-list-special').find('.overlay.schedule-def .end-time-min .increment').on('mousedown',function() {
			var curEndMinSel = parseInt($('#schedule-list-special').find('.schedule-def #end-min-sel').val());
			if (curEndMinSel == 55) {
				curEndMinSel = 0;
			} else {
				curEndMinSel = curEndMinSel + 5;
			}
			$('#schedule-list-special').find('.schedule-def #end-min-sel').val(curEndMinSel);
			if (curEndMinSel < 10) {curEndMinSel = "0"+curEndMinSel};
			$('#schedule-list-special').find('.overlay.schedule-def .end-time-min span').text(curEndMinSel);
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .end-time-min .decrement').on('mousedown',function() {
			var curEndMinSel = parseInt($('#schedule-list-special').find('.schedule-def #end-min-sel').val());
			if (curEndMinSel == 0) {
				curEndMinSel = 55;
			} else {
				curEndMinSel = curEndMinSel - 5;
			}
			$('#schedule-list-special').find('.schedule-def #end-min-sel').val(curEndMinSel);
			if (curEndMinSel < 10) {curEndMinSel = "0"+curEndMinSel};
			$('#schedule-list-special').find('.overlay.schedule-def .end-time-min span').text(curEndMinSel);
		});			

		$('#schedule-list-special').find('.overlay.schedule-def .cancel').on('mousedown',function() {
			BaseUI.resetOverlay();
		});

		$('#schedule-list-special').find('.overlay .multi-weekday-selection li').on('mousedown',function() {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});	

		$('#schedule-list-special').find('.overlay.schedule-def .set').on('mousedown',function() {

			if ($('#schedule-list-special').find('.schedule-def #operation-mode').val() == 'update') {
				var schedToUpdate = $('#schedule-list-special').find('.overlay.schedule-def #sched-to-update').val();
				var adjConfId = parseInt($('#schedule-list-special').find('.overlay.schedule-def #config-sel').val());
				
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_confId = parseInt(adjConfId + 1);
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_date.m_year = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-year-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_date.m_month = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-month-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_date.m_day = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-day-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_time.m_hour24 = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-hour-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_startDateTime.m_time.m_min = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-min-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_date.m_year = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-year-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_date.m_month = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-month-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_date.m_day = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-day-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_time.m_hour24 = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-hour-sel').val());
				allWorkingData.InSpire.toyScheduleEntries[schedToUpdate].m_endDateTime.m_time.m_min = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-min-sel').val());			
				
			} else {
				var newToyObj = {
                  "m_confId" : 0,
                  "m_enabled" : true,
                  "m_endDateTime" : {
                     "m_date" : {
                        "m_day" : 0,
                        "m_month" : 0,
                        "m_year" : 0
                     },
                     "m_time" : {
                        "m_hour24" : 0,
                        "m_min" : 0,
                        "m_sec" : 0
                     }
                  },
                  "m_startDateTime" : {
                     "m_date" : {
                        "m_day" : 0,
                        "m_month" : 0,
                        "m_year" : 0
                     },
                     "m_time" : {
                        "m_hour24" : 0,
                        "m_min" : 0,
                        "m_sec" : 0
                     }
                  }		
				};
				var adjConfId = parseInt($('#schedule-list-special').find('.overlay.schedule-def #config-sel').val());
				newToyObj.m_confId = parseInt(adjConfId + 1);
				newToyObj.m_startDateTime.m_date.m_year = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-year-sel').val());
				newToyObj.m_startDateTime.m_date.m_month = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-month-sel').val());
				newToyObj.m_startDateTime.m_date.m_day = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-day-sel').val());
				newToyObj.m_startDateTime.m_time.m_hour24 = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-hour-sel').val());
				newToyObj.m_startDateTime.m_time.m_min = parseInt($('#schedule-list-special').find('.overlay.schedule-def #start-min-sel').val());
				newToyObj.m_endDateTime.m_date.m_year = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-year-sel').val());
				newToyObj.m_endDateTime.m_date.m_month = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-month-sel').val());
				newToyObj.m_endDateTime.m_date.m_day = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-day-sel').val());
				newToyObj.m_endDateTime.m_time.m_hour24 = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-hour-sel').val());
				newToyObj.m_endDateTime.m_time.m_min = parseInt($('#schedule-list-special').find('.overlay.schedule-def #end-min-sel').val());			
				
				allWorkingData.InSpire.toyScheduleEntries.push(newToyObj);

			}

			// Sort by start min
			allWorkingData.InSpire.toyScheduleEntries.sort(function(obj1, obj2) {
				return obj1.m_startDateTime.m_time.m_min - obj2.m_startDateTime.m_time.m_min;
			});

			// Sort by start hour
			allWorkingData.InSpire.toyScheduleEntries.sort(function(obj1, obj2) {
				return obj1.m_startDateTime.m_time.m_hour24 - obj2.m_startDateTime.m_time.m_hour24;
			});

			// Sort by start day
			allWorkingData.InSpire.toyScheduleEntries.sort(function(obj1, obj2) {
				return obj1.m_startDateTime.m_date.m_day - obj2.m_startDateTime.m_date.m_day;
			});		

			// Sort by start month
			allWorkingData.InSpire.toyScheduleEntries.sort(function(obj1, obj2) {
				return obj1.m_startDateTime.m_date.m_month - obj2.m_startDateTime.m_date.m_month;
			});	

			// Sort by start year
			allWorkingData.InSpire.toyScheduleEntries.sort(function(obj1, obj2) {
				return obj1.m_startDateTime.m_date.m_year - obj2.m_startDateTime.m_date.m_year;
			});									

			$('#schedule-list-special').find('.schedule-def #config-sel').val('0');

			$('#schedule-list-special').find('.schedule-def #start-year-sel').val('2016');
			$('#schedule-list-special').find('.schedule-def #start-month-sel').val('1');
			$('#schedule-list-special').find('.schedule-def #start-day-sel').val('1');

			$('#schedule-list-special').find('.schedule-def #end-year-sel').val('2016');
			$('#schedule-list-special').find('.schedule-def #end-month-sel').val('1');
			$('#schedule-list-special').find('.schedule-def #end-day-sel').val('1');


			ScheduleUI.getSpecialList();
			ConfigUI.loadConfigList();
			BaseUI.resetOverlay();
		});		

	},	



} // end of ScheduleUI

// $(document).ready(ScheduleUI.initialize);