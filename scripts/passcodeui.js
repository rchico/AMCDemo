var PasscodeUI = {

	initialize: function () {

		window.passcodeTyped = '';
		window.validPasscodes = [['5026', 'West Des Moines'],['1111', 'Stevie Oneder'],['2222','Stanley Twocci'],['3333','Richard Roundthree'],['4444','Harrison Fourd'],['5555','Fivel MacDaniel'],['6666','Rose Sixer'],['7777','Mario Seventie'],['8888','Keight Mulgrew'],['9999', 'Manine Ocloughk'],['0000','Alfred Tennyson'],['1379','Rommel Chico']];
		window.curPasscode = '';

		PasscodeUI.passcodeKeypadEntry();
		PasscodeUI.validatePasscode();

	},

	passcodeKeypadEntry: function() {
		$('.passcode .keypad li[data-keypad-num]').on('mousedown',function() {
			$('.passcode .message.invalid').hide();
			var thisObj = $(this);
			BaseUI.addInverse(thisObj);	
			var activeCount = ($('.track-entry li.active').length);
			var keypadEntry = thisObj.attr('data-keypad-num');
			if (thisObj.find('a').hasClass('backspace')) {
				// backspace functions
				if (activeCount === 0) {
						// do nothing
					} else if (activeCount == 1) {
						$('.track-entry li:nth-child(1)').removeClass('active');
						PasscodeUI.updatePasscodeEntered('remove',keypadEntry);
					} else if (activeCount == 2) {
						$('.track-entry li:nth-child(2)').removeClass('active');
						PasscodeUI.updateEntered('remove',keypadEntry);
					} else  {
						$('.track-entry li:nth-child(3)').removeClass('active');
						PasscodeUI.updatePasscodeEntered('remove',keypadEntry);
					}

			} else {

				if (activeCount === 0) {
					$('.track-entry li:nth-child(1)').addClass('active');
					PasscodeUI.updatePasscodeEntered('add',keypadEntry);

				} else if (activeCount == 1) {
					$('.track-entry li:nth-child(1)').addClass('active');
					$('.track-entry li:nth-child(2)').addClass('active');
					PasscodeUI.updatePasscodeEntered('add',keypadEntry);
				} else if (activeCount == 2) {
					$('.track-entry li:nth-child(1)').addClass('active');
					$('.track-entry li:nth-child(2)').addClass('active');
					$('.track-entry li:nth-child(3)').addClass('active');
					PasscodeUI.updatePasscodeEntered('add',keypadEntry);
				} else  {
					$('.track-entry li:nth-child(1)').addClass('active');
					$('.track-entry li:nth-child(2)').addClass('active');
					$('.track-entry li:nth-child(3)').addClass('active');
					$('.track-entry li:nth-child(4)').addClass('active');
					$('.passcode .keypad li[data-keypad-num]').addClass('disabled');
					setTimeout(function() {
						PasscodeUI.updatePasscodeEntered('add',keypadEntry);
					}, delayTime );
				}
				
			}
		});
	},


    updatePasscodeEntered: function(action,value) {
		if (action == 'add') {
			passcodeTyped = passcodeTyped + value;
			if (passcodeTyped.length == '4') {
				if(PasscodeUI.validatePasscode(passcodeTyped)) {
					if (passcodeTyped != curPasscode) {
						BaseUI.loadActiveConfigOrPreempt();
						curPasscode = passcodeTyped;
					}
					$('.passcode .keypad li[data-keypad-num]').addClass('disabled');
					$('.bottom-strip .user-identification .value').text(userName);					
					setTimeout(function() { 
						BaseUI.switchPanel('intersection-status-view'); 
						$('.passcode .keypad li[data-keypad-num]').removeClass('disabled');
					}, delayTime );

				} else {
					PasscodeUI.updateMessagePasscode('Passcode provided is not valid.', 'invalid');
					$('.passcode .keypad li[data-keypad-num]').removeClass('disabled');
				}
				PasscodeUI.resetPasscode();
			}

		} else {
			passcodeTyped = passcodeTyped.slice(0, -1);

		}
	},

	validatePasscode: function(codeToValidate) {
		var i;
		var matchFound = false;
		for (i = 0; i < validPasscodes.length; i++) {
			if (codeToValidate == validPasscodes[i][0]) {
				userName = validPasscodes[i][1];
				matchFound = true;
				break;
			}
		}
		return matchFound;
		
	},

	updateMessagePasscode: function(message,state) {
		$('.passcode .message .copy').text(message).parent().removeClass('valid invalid').addClass(state).show();
	},

	resetPasscode: function() {
		$('.track-entry li').removeClass('active');
		passcodeTyped = '';
	}

} // end of BaseUI

$(document).ready(PasscodeUI.initialize);