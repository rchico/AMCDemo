


//this checks and moves our objects and functions into the "namespace" of: com.RhythmTraffic.ConfigurationLibrary
var com;
if (!com) com = {};
else if (typeof com != 'object')
    throw new Error('com already exists and is not an object!');

if (!com.RhythmTraffic) com.RhythmTraffic = {};
else if (typeof com.RhythmTraffic != 'object')
    throw new Error('com.rhythmtraffic already exists and is not an object!');


com.RhythmTraffic.ConfigurationLibrary = {
    ConfigCompatibility : function ()
    {
        this.errorMsg = [];
        this.hasError = false;
        this.hasWarning = false;
        this.warningMsg = [];
        this.m_channelToPhase = [];
        this.PrintErrorList = [];
    },

    ConfigurationErrorObject: function (ErrorType, Message)
    {
        if ( !((ErrorType ==  com.RhythmTraffic.ConfigurationLibrary.enumErrorType.SUCCESS) ||
               (ErrorType == com.RhythmTraffic.ConfigurationLibrary.enumErrorType.ERROR) ||
               (ErrorType == com.RhythmTraffic.ConfigurationLibrary.enumErrorType.WARNING)))
        {
            throw 'ConfigurationErrorObject initialized with invalid error Type';
        }
        
        this.m_type = ErrorType;
        this.m_msg = Message;
        
    },

    ConfigurationErrorContainer: function ()
    {
        this.m_ErrorQueue = [];
    },

    PedestrianPhaseValidation: function (PedPhase)
    {
        com.RhythmTraffic.ConfigurationLibrary.ConfigurationErrorContainer.call(this);
        this.Phase = PedPhase;
        
    },

    VehiclePhaseValidation: function (VehiclePhase)
    {
        com.RhythmTraffic.ConfigurationLibrary.ConfigurationErrorContainer.call(this);
        this.Phase = VehiclePhase;
    },

    PreemptSettingsValidation: function (PreemptSettings)
    {
        com.RhythmTraffic.ConfigurationLibrary.ConfigurationErrorContainer.call(this);
        this.Settings = PreemptSettings;
    },

    VehicleDetectorValidation: function (VehicleDetector)
    {
        com.RhythmTraffic.ConfigurationLibrary.ConfigurationErrorContainer.call(this);
        this.Detector = VehicleDetector;
    },

    StartupValidation: function (StartupConfig)
    {
        com.RhythmTraffic.ConfigurationLibrary.ConfigurationErrorContainer.call(this);
        this.StartupConfig = StartupConfig;
    },

    enumLeftTurnMode :
    {
        NOT_A_LEFT_TURN: 0,
        PROTECTED: 1,
        PERMITTED: 2,
        PROTECTED_PERMITTED: 3
    },

    enumMovementDirections :
    {
        NORTHBOUND_LEFT: 1,
        NORTHBOUND_THROUGH: 2,
        SOUTHBOUND_LEFT: 4,
        SOUTHBOUND_THROUGH: 5,
        EASTBOUND_LEFT: 7,
        EASTBOUND_THROUGH: 8,
        WESTBOUND_LEFT: 10,
        WESTBOUND_THROUGH: 11,
    },

    enumErrorType :
    {
        SUCCESS: 0,
        WARNING: 1,
        ERROR: 2,
    },

    enumRecallType : 
    {
        NONE: 0,
        MIN: 1,
        MAX: 2,
        SOFT: 3
    }
};


with (com.RhythmTraffic.ConfigurationLibrary)
{

    //ConfigCompatibility Object
    //
    //
    //
    //
    ConfigCompatibility.prototype.ValidateConfigInfo = function (configObject)
    {
        //here are members for this level: 
        //m_startupConfiguration  //checked.
        //"m_phaseInitialization" : 
            //"m_startupOneCallVeh" : true,
            //"m_startupOneCallPed" : true,
            //"m_vehDriverInit" : [1, 3, 1, 1, 1, 3, 1, 1],
            //"m_pedDriverInit" : [0, 3, 0, 1, 0, 3, 0, 1],
            //"m_movementDirection" : [1, 5, 7, 11, 4, 2, 10, 8]
       

        //m_phaseCompatibility  //??
        //m_channelCompatibility  //have function

        //m_vehiclePhaseOutput //Checked
        //m_pedPhaseOutput     //checked

        //m_controllerConfiguration  //Checked
        //m_intersectionName    //nothing to check
        //m_manualOverride
        //m_networkSettings
        //m_preemptConfiguration  //Checked
        //m_schedule
        

       //if (this.VerifyChannelCompatibility(configObject.m_channelCompatibility.m_bArrChannelCompatibility))
        {
            //channel compatibility is OK, save it.
            this.m_channelCompatibility = new ChannelCompatibilityMatrix(configObject.m_channelCompatibility.m_bArrChannelCompatibility);
        }


        //look for duplicate channels, This creates warnings not errors.
        var ErrorArray = this.CheckForDuplicateChannelAssignment(configObject.m_vehiclePhaseOutput, configObject.m_pedPhaseOutput);
        for (var i = 0, max = ErrorArray.length; i < max; ++i)
        {
            this.InternalStoreErrorObj(ErrorArray[i]);
        }



        //validate preempt settings
        var ErrorContainerArray = this.ValidatePreemptArray(configObject.m_preemptConfiguration.m_preempt);
        for (var ContainerNum = 0, max = ErrorContainerArray.length; ContainerNum < max; ++ContainerNum)
        {
            for (var ErrorNum = 0, ErrorMax = ErrorContainerArray[ContainerNum].m_ErrorQueue.length; ErrorNum < ErrorMax; ++ErrorNum)
            {
                this.InternalStoreErrorObj(ErrorContainerArray[ContainerNum].m_ErrorQueue[ErrorNum])
            }
        }

        //validate singular  Startup settings
        var ErrorContainer = this.VaildateStartupConfig(configObject.m_startupConfiguration);
        for (ErrorNum = 0, ErrorMax = ErrorContainer.m_ErrorQueue.length; ErrorNum < ErrorMax; ++ErrorNum)
        {
            this.InternalStoreErrorObj(ErrorContainer.m_ErrorQueue[ErrorNum])
        }
        

        //validate all the Controller Configs individually.
        ErrorContainerArray = this.ValidateControllerConfigArray(configObject.m_controllerConfigurations);
        for (var ContainerNum = 0, max = ErrorContainerArray.length; ContainerNum < max; ++ContainerNum)
        {
            for (var ErrorNum = 0, ErrorMax = ErrorContainerArray[ContainerNum].m_ErrorQueue.length; ErrorNum < ErrorMax; ++ErrorNum)
            {
                this.InternalStoreErrorObj(ErrorContainerArray[ContainerNum].m_ErrorQueue[ErrorNum])
            }
        }
        
        //validate active phases don't have a channel conflict this is a hard fault.
        ErrorContainerArray = this.ValidateEnabledPhasesChannelOutputForAllConfigurations(configObject, configObject.m_controllerConfigurations);
        for (var ContainerNum = 0, max = ErrorContainerArray.length; ContainerNum < max; ++ContainerNum)
        {
            for (var ErrorNum = 0, ErrorMax = ErrorContainerArray[ContainerNum].m_ErrorQueue.length; ErrorNum < ErrorMax; ++ErrorNum)
            {
                this.InternalStoreErrorObj(ErrorContainerArray[ContainerNum].m_ErrorQueue[ErrorNum])
            }
        }

        //for (var i = 0, max = this.PrintErrorList.length; i < max; ++i)
        //{
        //    console.log(this.PrintErrorList[i]);
        //}
        
        return !this.hasError;
    }

    ConfigCompatibility.prototype.ValidateEnabledPhasesChannelOutputForAllConfigurations = function (InspireConfig, ControllerConfigArray)
    {
        var ErrorContainerArray = [];
        for (var i = 0, max = ControllerConfigArray.length; i < max; ++i)
        {
            //foreach controller
            var ErrorContainer = this.ValidateEnabledPhasesChannelOutput(InspireConfig, ControllerConfigArray[i]);
            ErrorContainerArray.push(ErrorContainer);
        }
        return ErrorContainerArray;
    }

    ConfigCompatibility.prototype.CheckForDuplicateChannelAssignment = function (VehicleChannelConfigArray, PedestrianChannelConfigArray)
    {
        var retErrorArry = [];
        //flip the two arrays around to be one channel centric array to look for duplicates.
        var ChannelType = 'vehicle';
        for (var i = 0, max = VehicleChannelConfigArray.length; i < max; ++i)
        {
            var errorObj = this.AddOutputChannelCheckForConflict(VehicleChannelConfigArray[i].m_greenChannelNum, i+1, ChannelType);
            if (!errorObj.IsSuccess())
            {
                retErrorArry.push(errorObj);
            }
        }
        
        var ChannelType = 'pedestrian';
        for (var i = 0, max = PedestrianChannelConfigArray.length; i < max; ++i)
        {
            var errorObj = this.AddOutputChannelCheckForConflict(PedestrianChannelConfigArray[i].m_greenChannelNum, i+1, ChannelType);
            if (!errorObj.IsSuccess())
            {
                retErrorArry.push(errorObj);
            }
        }
        return retErrorArry;
    }

    //startup config
    ConfigCompatibility.prototype.VaildateStartupConfig = function (StartupConfig)
    {
        var testStartup = new StartupValidation(StartupConfig);
        
        testStartup.AddError(testStartup.ValidateRedRevert());
        testStartup.AddError(testStartup.ValidateStartupTime());
        //"m_startupState" : 0 TODO validate startup state?

        return testStartup;
    }


    //Controller Array
    ConfigCompatibility.prototype.ValidateControllerConfigArray = function (ControlerConfigArray)
    {
        var RetArray = [];

        for (var controlleridx = 0, controllermax = ControlerConfigArray.length; controlleridx < controllermax; ++controlleridx)
        {
            console.log('ValidateControllerConfigArray controlleridx =' + controlleridx);
            var ArrayOfContainers = this.ValidateControllerConfig(ControlerConfigArray[controlleridx]);
            for (var containeridx = 0, containermax = ArrayOfContainers.length ; containeridx < containermax; ++containeridx)
            {
                errContainer = ArrayOfContainers[containeridx];
                //add in a message so we know which config it came from.
                if (errContainer.HasError())
                {
                    for (var j = 0, errormax = errContainer.m_ErrorQueue.length; j < errormax; ++j)
                    {
                        var errObj = errContainer.m_ErrorQueue[j];
                        if (!errObj.IsSuccess())
                        {
                            errObj.setMessage("In " + ControlerConfigArray[controlleridx].m_configurationName + " " + errObj.getMessage());
                            console.log('ValidateControllerConfigArray updating msg to' + errObj.getMessage());
                        }
                    }
                    console.log('error container has error.');
                }
                RetArray.push(errContainer);
                console.log('ValidateControllerConfigArray adding contiainer to array: contaner.count/array.length ' + errContainer.m_ErrorQueue.length + '/' + RetArray.length);
            }
        }
        return RetArray;
    }

    //Single Controller config
    ConfigCompatibility.prototype.ValidateControllerConfig = function (curConfig)
    {
        var ArrayOfContainers = [];

        //check ped timings
        var tmpArrayOfErrorContainers = this.ValidatePedestrianTimingArray(curConfig.m_pedPhase);
        Array.prototype.push.apply(ArrayOfContainers, tmpArrayOfErrorContainers);

        //check vehicle timings
        tmpArrayOfErrorContainers = this.ValidateVehicleTimingArray(curConfig.m_vehiclePhase);
        Array.prototype.push.apply(ArrayOfContainers, tmpArrayOfErrorContainers);

        //validate Detector settings.
        tmpArrayOfErrorContainers = this.ValidateVehicleDetectorSettingsArray(curConfig.m_vehDetector);
        Array.prototype.push.apply(ArrayOfContainers, tmpArrayOfErrorContainers);

        return ArrayOfContainers;
    }

    ConfigCompatibility.prototype.ValidateEnabledPhasesChannelOutput = function (InspireConfig, curConfig)
    {
        var ErrorContainer = new ConfigurationErrorContainer();
        var ActivePhaseChannels = [];

        //iterate over vehicle phases
        for (var i = 0, max = curConfig.m_vehiclePhase.length; i < max; ++i)
        {
            //if enabled
            if (curConfig.m_vehiclePhase[i].m_enabled)
            {
                var curPhaseNum = curConfig.m_vehiclePhase[i].PhaseNum;
                if (typeof(InspireConfig.m_vehiclePhaseOutput[curPhaseNum]) != 'undefined')
                {
                    //get assigned channel
                    var ChannelNum = InspireConfig.m_vehiclePhaseOutput[curPhaseNum].m_greenChannelNum;
                    //validated assigned channel??? no, it's validated elsewhere.
                    //check if assigned channel has value
                    if (typeof (ActivePhaseChannels[ChannelNum]) == 'undefined')
                    {
                        //claim
                        ActivePhaseChannels[ChannelNum] = { type: 'vehicle', phase: curPhaseNum };
                    } 
                    else
                    {
                        //save error
                        ErrorContainer.m_ErrorQueue.push(new ConfigurationErrorObject(enumErrorType.ERROR,
                            'In ' + curConfig.m_configurationName + ' Vehicle phase ' + curPhaseNum + ' output channel ' + ChannelNum + 
                            'conflicts with ' + ActivePhaseChannels[ChannelNum].type + ' phase ' + ActivePhaseChannels[ChannelNum].phase));
                    }
                }
            }
            
        }

        //iterate over ped phases
        for (var i = 0, max = curConfig.m_pedPhase.length; i < max; ++i)
        {
            //if enabled
            if (curConfig.m_pedPhase[i].m_enabled)
            {
                var curPhaseNum = curConfig.m_pedPhase[i].PhaseNum;
                if (typeof (InspireConfig.m_pedPhaseOutput[curPhaseNum]) != 'undefined')
                {
                    //get assigned channel
                    var ChannelNum = InspireConfig.m_pedPhaseOutput[curPhaseNum].m_greenChannelNum;
                    //validated assigned channel??? no, it's validated elsewhere.
                    //check if assigned channel has value
                    if (typeof (ActivePhaseChannels[ChannelNum]) == 'undefined')
                    {
                        //claim
                        ActivePhaseChannels[ChannelNum] = { type: 'pedestrian', phase: curPhaseNum };
                    }
                    else
                    {
                        //save error
                        ErrorContainer.m_ErrorQueue.push(new ConfigurationErrorObject(enumErrorType.ERROR,
                            'In ' + curConfig.m_configurationName + ' pedestrian phase ' + curPhaseNum + ' output channel ' + ChannelNum +
                            'conflicts with ' + ActivePhaseChannels[ChannelNum].type + ' phase ' + ActivePhaseChannels[ChannelNum].phase));
                    }
                }
            }

        }

        return ErrorContainer;
    }

    //Pedestrian phase Array
    ConfigCompatibility.prototype.ValidatePedestrianTimingArray = function (PedestrianPhaseArray)
    {
        var RetArray = [];
        for (var i = 0, max = PedestrianPhaseArray.length; i < max; ++i)
        {
            if (PedestrianPhaseArray[i].m_enabled)
            {
                var ErrorContainer = this.ValidatePedestrianTiming(PedestrianPhaseArray[i]);
                RetArray.push(ErrorContainer);
            } else
            {
                RetArray.push(new ConfigurationErrorContainer());
            }
        }
        return RetArray;
    }
    //Pedestrian phase

    ConfigCompatibility.prototype.ValidatePedestrianTiming = function (PedistrianPhase)
    {
        var testPhase = new PedestrianPhaseValidation(PedistrianPhase);
        //PedistrianPhase.m_walkTiming
        testPhase.AddError(testPhase.CheckWalkTiming());

        // PedistrianPhase.m_clearanceTiming
        testPhase.AddError(testPhase.CheckClearanceTiming());

        //does walktime + CLear time < min green time?  only if non-actuated. TODO?
        return testPhase;
    }


    //vehicle Phase Array
    ConfigCompatibility.prototype.ValidateVehicleTimingArray = function (VehiclePhaseArray)
    {
        var RetArray = [];
        for (var i = 0, max = VehiclePhaseArray.length; i < max; ++i)
        {
            if (VehiclePhaseArray[i].m_enabled)
            {
                var ErrorContainer = this.ValidateVehicleTiming(VehiclePhaseArray[i]);
                RetArray.push(ErrorContainer);
            } else
            {

            }
        }
        
        return RetArray;
    }
    //single vehicle phase
    ConfigCompatibility.prototype.ValidateVehicleTiming = function (VehiclePhase)
    {

        var testPhase = new VehiclePhaseValidation(VehiclePhase);
        
        testPhase.AddError(testPhase.CheckRedTiming());
        

        testPhase.AddError(testPhase.CheckYellowTiming());
        
        if (VehiclePhase.m_dynamicMaxGreenEnabled)
        {
            //m_dynamicMaxAdjustStepSec
            //m_maxDynamicMaxGreenTimingSec
            testPhase.AddError(testPhase.CheckDynamicGreenMax());
            testPhase.AddError(testPhase.CheckDynamicGreenAdjustStep());
        }
        //checks max and min.
        testPhase.AddError(testPhase.CheckGreenTimingMax());
        
        testPhase.AddError(testPhase.CheckGreenTimingMin());

        //checks for both thru and left turn movements
        testPhase.AddError(testPhase.CheckLeftTurnMode());

        testPhase.AddError(testPhase.CheckPassageTime());

        testPhase.AddError(testPhase.CheckRecallSetting());
        
        return testPhase;
    }

    //Preempt Settings array
    ConfigCompatibility.prototype.ValidatePreemptArray = function (PreemptArray)
    {
        var RetArray = [];
        for (var i = 0, max = PreemptArray.length; i < max; ++i)
        {
            if (PreemptArray[i].m_enabled)
            {
                var errContainer = this.ValidatePreemptSettings(PreemptArray[i]);
                RetArray.push(errContainer);

            } else
            {
                //create empty container and push it
                RetArray.push(new ConfigurationErrorContainer());
            }
        }
        return RetArray;
    }

    //Preempt Settings
    ConfigCompatibility.prototype.ValidatePreemptSettings = function (PreemptSettings)
    {
        var testPreemptConfigValidator = new PreemptSettingsValidation(PreemptSettings);

        //For post A2 TODO
        //testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckPedClearanceTiming());
        //testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckPedWalkTiming());
        //testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckGreenTiming());
        //testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckYellowTiming());
        //testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckRedTiming());
        //testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckCallTiming());

        testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckInput());
        testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckMaxCall());
        testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckMinGreen());
        testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckDelay());
        testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckDwellState());
        testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckCycleState());
        testPreemptConfigValidator.AddError(testPreemptConfigValidator.CheckExitState());


        return testPreemptConfigValidator;

    }


    //Vehicle Detector array
    ConfigCompatibility.prototype.ValidateVehicleDetectorSettingsArray = function (VehicleDetectorArray)
    {
        var RetArray = [];
        for (var i = 0, max = VehicleDetectorArray.length; i < max; ++i)
        {
            if (VehicleDetectorArray[i].m_enabled)
            {
                this.ValidateVehicleDetectorSettings(VehicleDetectorArray[i]);
            }
        }
        return RetArray;
    }

    //vehicle detector
    ConfigCompatibility.prototype.ValidateVehicleDetectorSettings = function (VehDetectorSettings)
    {
        var testVehDetectorValidator = new VehicleDetectorValidation(VehDetectorSettings);
        
        testVehDetectorValidator.AddError(testVehDetectorValidator.CheckDelay());
        testVehDetectorValidator.AddError(testVehDetectorValidator.CheckExtend());
        testVehDetectorValidator.AddError(testVehDetectorValidator.CheckStuckOff());
        testVehDetectorValidator.AddError(testVehDetectorValidator.CheckStuckOn());

        return testVehDetectorValidator;
    }
    

    //Vehicle phase output Array
    ConfigCompatibility.prototype.ValidateVehiclePhaseOutputArray = function (VehiclePhaseOutputArray)
    {
        var RetArray = [];

        for (var i = 0, max = VehiclePhaseOutputArray.length; i < max; ++i)
        {
            var errContainer = this.ValidateVehiclePhaseOutput(VehiclePhaseOutputArray[i]);
            RetArray.push(errContainer);
        }
        return RetArray;
    }
    //single Vehicle phase output
    ConfigCompatibility.prototype.ValidateVehiclePhaseOutput = function (VehiclePhaseOutput)
    {
        //has these values: 
        //"m_redChannelNum" : 1,  1-as many channels as there are?
        //"m_redSignalDriver" : 1,  //driver is section so 1-3
        //"m_yellowChannelNum" : 1,
        //"m_yellowSignalDriver" : 2,
        //"m_greenChannelNum" : 1,
        //"m_greenSignalDriver" : 3,
        //"m_fyaChannelNum" : 0,
        //"m_fyaSignalDriver" : 0,

        //can't be validated?
        //"m_flashRedWhenActive" : false,
        //"m_flashYellowWhenActive" : false,
        //"m_flashGreenWhenActive" : false

    }




    //Object must be mirrored across the row=col axis.
    ConfigCompatibility.prototype.VerifyChannelCompatibility = function (ChannelCompatibilityMatrix)
    {
        
        ChannelCompatibilityMatrix.forEach(function (RowObj, RowIndex, array)
        {
            RowObj.forEach(function (val, ColIndex, RowArray)
            {
                if (ChannelCompatibilityMatrix[ColIndex][RowIndex] != val)
                {
                    //TODO this should be converted to error container or more standard error messages. not console log.
                    console.log('failure at row,col: ' + (RowIndex + 1) + ',' + (ColIndex + 1));
                }
            });
        });
    }

    ConfigCompatibility.prototype.InternalStoreErrorObj = function (errorObj)
    {
        if (errorObj.IsWarning())
        {
            this.hasWarning = true;
            this.warningMsg.push(errorObj.getMessage());
            return
        }

        if (errorObj.IsError())
        {
            this.hasError = true;
            this.errorMsg.push(errorObj.getMessage());
        }

        this.PrintErrorList.push(errorObj.toString());
    }

    ConfigCompatibility.prototype.AddOutputChannelCheckForConflict = function (ChannelNum, PhaseNum, ChannelType)
    {
        //channel 0 is N/A must do nothing, but return success.
        if (ChannelNum == 0)
        {
            return new ConfigurationErrorObject(enumErrorType.SUCCESS, '');
        }
        //if Channel Compatibility has been created. Ensure it's in allowed range of channels, assigned.
        if (typeof (this.m_channelCompatibility) != 'undefined')
        {
            //use existing object to check valid channel
            if (!this.m_channelCompatibility.IsValidChannel(ChannelNum))
            {
                return new ConfigurationErrorObject(enumErrorType.ERROR, 'Invalid channel assigned to ' + ChannelType + ' phase ' + PhaseNum);
            }
            
         }

        //check for Channel use elsewhere. (Vec phases and Ped phases);
        if (typeof (this.m_channelToPhase[ChannelNum]) == 'undefined')
        {
            //assign this channel to this phase info.
            this.m_channelToPhase[ChannelNum] = { phase: PhaseNum, type: ChannelType };
        }
        else
        {
            return new ConfigurationErrorObject(enumErrorType.WARNING, 
                'Duplicate Channel assigned on: ' + ChannelType + ' phase ' + PhaseNum + ' and ' +
                this.m_channelToPhase[ChannelNum].type + ' phase ' + this.m_channelToPhase[ChannelNum].phase);
        }
        
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, '');
    }



    //ChannelCompatibilityMatrix Object.
    //
    //
    //
    //
    function ChannelCompatibilityMatrix(ChannelCompatibilityArray)
    {
        this.m_compatibilityArray = ChannelCompatibilityArray;
    }

    ChannelCompatibilityMatrix.prototype.IsValidChannel = function (ChannelNum)
    {
        if (ChannelNum > this.m_compatibilityArray.length || ChannelNum < 1)
        {
            return false;
        }
        return true;
    }

    ChannelCompatibilityMatrix.prototype.CompatiblePhases = function (Phase1, Phase2)
    {
        if (Phase1 < 1 || Phase2 < 1)
        {
            console.log('ERROR: PHASE OUT OF BOUNDS FOR CHECKING COMPATIBLITY! Must greater than zero');
            return;
        }
        var Index1 = Phase1 - 1;
        var Index2 = Phase2 - 1;
        return this.m_compatibilityArray[Index1][Index2];
    }

    //
    //
    //
    //end ChannelCompatibilityMatrix object

    // ConfigurationError
    //
    //
    //
    ConfigurationErrorObject.prototype.IsError = function ()
    { return this.m_type == enumErrorType.ERROR; }
    
    ConfigurationErrorObject.prototype.IsWarning = function ()
    { return this.m_type == enumErrorType.WARNING; }

    ConfigurationErrorObject.prototype.IsSuccess = function ()
    { return this.m_type == enumErrorType.SUCCESS; }

    ConfigurationErrorObject.prototype.getMessage = function ()
    { return this.m_msg;}

    ConfigurationErrorObject.prototype.setMessage = function (NewMessage)
    { this.m_msg = NewMessage; }

    ConfigurationErrorObject.prototype.toString = function()
    {
        var StringType = 'Success:';
        if (this.IsError()) StringType = 'ERROR:';
        if (this.IsWarning()) StringType = 'WARNING:';

        return StringType + this.m_msg;
    }

    // ConfigurationErrorContainer  (base class for Objects which contian multiple errors)
    //
    //
    //
    ConfigurationErrorContainer.prototype.CheckIntRange = function (Value, CheckIntObject)
    {
        if ((Value < CheckIntObject.Min) || (Value > CheckIntObject.Max))
        {
            
            if (CheckIntObject.hasOwnProperty('DivideErrorMsgBy'))
            {
                Value /= CheckIntObject.DivideErrorMsgBy;
                CheckIntObject.Min /= CheckIntObject.DivideErrorMsgBy;
                CheckIntObject.Max /= CheckIntObject.DivideErrorMsgBy;
            }
            
            return new ConfigurationErrorObject(CheckIntObject.FailureType, Value + ' falls outside the allowed range of: ' + CheckIntObject.Min + '-' + CheckIntObject.Max);
        }
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }

    ConfigurationErrorContainer.prototype.HasError = function ()
    {
        for (var i = 0, max = this.m_ErrorQueue.length; i < max; ++i)
        {
            if (this.m_ErrorQueue[i].IsError())
            {
                return true;
            }
        }
        return false;
    }

    ConfigurationErrorContainer.prototype.HasWarning = function ()
    {
        for (var i = 0, max = this.m_ErrorQueue.length; i < max; ++i)
        {
            if (this.m_ErrorQueue[i].IsWarning())
            {
                return true;
            }
        }
        return false;
    }

    ConfigurationErrorContainer.prototype.AddError = function (ErrorObj)
    {
        this.m_ErrorQueue.push(ErrorObj);
    }

    //start StartupValidation
    //
    //
    //
    //INIT function above
    StartupValidation.prototype = Object.create(ConfigurationErrorContainer.prototype);

    StartupValidation.prototype.addError = function (errorObj)
    {
        if ( !errorObj.IsSuccess() )
        {
            this.m_ErrorQueue.push(errorObj);
        }
    }


    StartupValidation.prototype.ValidateStartupTime = function ()
    {
        //"m_startupTimeSec" : 6
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }


    StartupValidation.prototype.ValidateRedRevert = function ()
    {
        //"m_redRevertTenthSec" : 40
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }
    
    //start PedestrianPhase
    //
    //
    //
    //INIT function above
    PedestrianPhaseValidation.prototype = Object.create(ConfigurationErrorContainer.prototype);

    PedestrianPhaseValidation.prototype.addError = function (errorObj)
    {
        if ( !errorObj.IsSuccess() )
        {
            errorObj.setMessage('Ped phase ' + this.Phase.m_phaseNum + ' ' + errorObj.getMessage());
            this.m_ErrorQueue.push(errorObj);
        }
    }

    PedestrianPhaseValidation.prototype.CheckWalkTiming = function ()
    {
        var errorObj = this.CheckIntRange(this.Phase.m_walkTiming, { FailureType: enumErrorType.ERROR, Min: 0, Max: 80 });
        if ( !errorObj.IsSuccess() )
        {
            errorObj.setMessage('walk timing of ' + errorObj.getMessage());
        }
        return errorObj;
        //m_enabled: false
        //m_nonActuated: true
        //m_pedClearanceTimesWithVehicleYellow: true
        //m_phaseNum: 1
        //m_restInWalk: true
    }

    PedestrianPhaseValidation.prototype.CheckClearanceTiming = function ()
    {
        var errorObj = this.CheckIntRange(this.Phase.m_clearanceTiming, { FailureType: enumErrorType.ERROR, Min: 0, Max: 80 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('clearance timing of ' + errorObj.getMessage());
        }
        return errorObj;
    }

    //start VehiclePhaseValidation
    //
    //
    //inheiret from Error Container
    VehiclePhaseValidation.prototype = Object.create(ConfigurationErrorContainer.prototype);

    VehiclePhaseValidation.prototype.AddError = function (errorObj)
    {
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Vehicle Phase ' + this.Phase.m_phaseNum + ' ' + errorObj.getMessage());
            this.m_ErrorQueue.push(errorObj);
        }
    }

    VehiclePhaseValidation.prototype.CheckRedTiming = function ()
    {
        //the red clearance interval should not exceed 6 seconds. A recent survey conducted by The Urban Transportation Monitor indicated that practitioners who used a standard red clearance interval used a range from 0.5 to 2.0 seconds.
        var errorObj = this.CheckIntRange(this.Phase.m_redTimingTenthSec, { Min: 0, Max: 255, FailureType: enumErrorType.ERROR, DivideErrorMsgBy: 10 });
        if (!errorObj.IsSuccess())
        {
            //add to error object?
            errorObj.setMessage('Red timing of ' + errorObj.getMessage());
        }
        return errorObj;
    }

    VehiclePhaseValidation.prototype.CheckYellowTiming = function ()
    {
        //yellow change interval should last approximately 3 to 6 seconds, MUTC
        var errorObj = this.CheckIntRange(this.Phase.m_yellowTimingTenthSec, { Min: 30, Max: 255, FailureType: enumErrorType.ERROR, DivideErrorMsgBy: 10 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Yellow timing of ' + errorObj.getMessage());
        }
        return errorObj;
    }


    VehiclePhaseValidation.prototype.CheckGreenTimingMax = function ()
    {
        //TODO check by movement type? Thru vs left turn?

        //VehiclePhase.m_maxGreenTimingSec: 15

        var errorObj = this.CheckIntRange(this.Phase.m_maxGreenTimingSec, { Min: 4, Max: 100, FailureType: enumErrorType.ERROR });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Max Green timing of ' + errorObj.getMessage());
            return errorObj;
        }

        if (this.Phase.m_maxGreenTimingSec < this.Phase.m_minGreenTimingSec)
        {
            return new ConfigurationErrorObject(enumErrorType.ERROR, 'Max green must be greater than or equal to min green');
        }

        return errorObj;
    }

    VehiclePhaseValidation.prototype.CheckGreenTimingMin = function ()
    {
        //VehiclePhase.m_minGreenTimingSec: 3
        errorObj = this.CheckIntRange(this.Phase.m_minGreenTimingSec, { Min: 3, Max: 50, FailureType: enumErrorType.ERROR });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Min Green timing of ' + errorObj.getMessage());
            return errorObj;
        }

        if (this.Phase.m_maxGreenTimingSec < this.Phase.m_minGreenTimingSec)
        {
            return new ConfigurationErrorObject(enumErrorType.ERROR, 'Min green must be less than or equal to max green');
        }

        return errorObj;

    }

    VehiclePhaseValidation.prototype.CheckDynamicGreenAdjustStep = function ()
    {
        //m_dynamicMaxAdjustStepSec: 5
        var errorObj = this.CheckIntRange(this.Phase.m_dynamicMaxAdjustStepSec, { Min: 0, Max: 30, FailureType: enumErrorType.ERROR });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Dynamic Green Adjust Step of ' + errorObj.getMessage());
        }
        return errorObj;
    }

    VehiclePhaseValidation.prototype.CheckDynamicGreenMax = function ()
    {
        //VehiclePhase.m_maxDynamicMaxGreenTimingSec: 15
        var errorObj = this.CheckIntRange(this.Phase.m_maxDynamicMaxGreenTimingSec, { Min: 5, Max: 75, FailureType: enumErrorType.ERROR });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Dynamic Green Max of ' + errorObj.getMessage());
            return errorObj;
        }

        //m_maxDynamicMaxGreenTimingSec should be > the configured Max Green
        if (this.Phase.m_maxDynamicMaxGreenTimingSec <= this.Phase.m_maxGreenTimingSec)
        {
            return (new ConfigurationErrorObject(enumErrorType.ERROR, 'Max Dynamic Green must be greater than Max Green'));
        }

        return errorObj;

    }


    VehiclePhaseValidation.prototype.CheckLeftTurnMode = function ()
    {
        //IF phase is a LEFT TURN/ LEFT TURN Mode can not be 0
        //IF phase is a THRU/ LEFT TURN Mode should be 0
        if (this.IsLeftTurn())
        {

            //if not one of the known valid left turn states.
            if (!((this.Phase.m_leftTurnMode == enumLeftTurnMode.PERMITTED) ||
                (this.Phase.m_leftTurnMode == enumLeftTurnMode.PROTECTED_PERMITTED) ||
                (this.Phase.m_leftTurnMode == enumLeftTurnMode.PROTECTED)) )
            {
                return (new  ConfigurationErrorObject(enumErrorType.ERROR, "has a left turn movement direction, but doesn't have a valid left turn mode."));
            }
        } else
        {
            //console.log('Is not left turn')
            //TODO warning, or error?
            if (this.Phase.m_leftTurnMode != enumLeftTurnMode.NOT_A_LEFT_TURN)
            {
                //TODO warning, or error?
                return (new  ConfigurationErrorObject(enumErrorType.WARNING, 'is through according to movement but also has a left turn mode assigned.'));
            }
        }
        return (new ConfigurationErrorObject(enumErrorType.SUCCESS, ''));
    }

    VehiclePhaseValidation.prototype.IsLeftTurn = function ()
    {
        if (this.Phase.m_movementDirection == enumMovementDirections.NORTHBOUND_LEFT ||
            this.Phase.m_movementDirection == enumMovementDirections.SOUTHBOUND_LEFT ||
            this.Phase.m_movementDirection == enumMovementDirections.EASTBOUND_LEFT ||
            this.Phase.m_movementDirection == enumMovementDirections.WESTBOUND_LEFT)
        {
            return true;
        }
        return false;
    }

    VehiclePhaseValidation.prototype.IsLeftTurnModePermissive = function ()
    {
        return (this.Phase.m_leftTurnMode == enumLeftTurnMode.PERMITTED || this.Phase.m_leftTurnMode == enumLeftTurnMode.PROTECTED_PERMITTED);
    }

    VehiclePhaseValidation.prototype.CheckPassageTime = function ()
    {
        //m_passageTimeTenthSec: 30
        var errorObj = this.CheckIntRange(this.Phase.m_passageTimeTenthSec, { Min: 0, Max: 255, FailureType: enumErrorType.ERROR, DivideErrorMsgBy: 10 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Passage Time of ' + errorObj.getMessage());
        }
        return errorObj;
    }

    VehiclePhaseValidation.prototype.CheckRecallSetting = function ()
    {
        //m_recall: 0  --- ENUM min/max/ped/soft
        var errorObj = this.CheckIntRange(this.Phase.m_recall, { Min: 0, Max: 3, FailureType: enumErrorType.ERROR });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Recall must be one of: min/max/pedestrian/soft ' + errorObj.getMessage());
        }
        return errorObj;
    }

    VehiclePhaseValidation.prototype.CheckPermissiveStartPhase = function ()
    {
        //m_permissiveStartPhase : 0
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }
    //
    //
    //
    // END VehiclePhase object


    //BEGIN PreemptSettingsValidation
    //
    //
    //
    PreemptSettingsValidation.prototype = Object.create(ConfigurationErrorContainer.prototype);

    PreemptSettingsValidation.prototype.AddError = function (errorObj)
    {
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Preempt #' + this.Settings.m_preemptId + ' ' + errorObj.getMessage());
            this.m_ErrorQueue.push(errorObj);
        }

    }

    PreemptSettingsValidation.prototype.CheckGreenTiming = function ()
    {
        //m_initialGreenTiming: 7
        var errorObj = this.CheckIntRange(this.Settings.m_initialGreenTiming , { FailureType: enumErrorType.ERROR, Min: 3, Max: 80 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Initial Green timing of ' + errorObj.getMessage());
        }
        return errorObj;
    };

    PreemptSettingsValidation.prototype.CheckCallTiming = function ()
    {
        //m_maxCallSec: 120
        var errorObj = this.CheckIntRange(this.Settings.m_maxCallSec, { FailureType: enumErrorType.ERROR, Min: 3, Max: 255 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Max Call timing of ' + errorObj.getMessage());
        }
        return errorObj;
    };

    PreemptSettingsValidation.prototype.CheckRedTiming = function ()
    {
        //m_redTimingTenthSec: 20
        var errorObj = this.CheckIntRange(this.Settings.m_redTimingTenthSec, { FailureType: enumErrorType.ERROR, Min: 0, Max: 255, DivideErrorMsgBy: 10 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Red timing of ' + errorObj.getMessage());
        }
        return errorObj;
    };

    PreemptSettingsValidation.prototype.CheckYellowTiming = function ()
    {
        //m_YellowTimingTenthSec: 40
        var errorObj = this.CheckIntRange(this.Settings.m_yellowTimingTenthSec, { FailureType: enumErrorType.ERROR, Min: 30, Max: 255, DivideErrorMsgBy: 10 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Yellow timing of ' + errorObj.getMessage());
        }
        return errorObj;
    };

    PreemptSettingsValidation.prototype.CheckPedClearanceTiming = function ()
    {
        //m_pedClearanceTiming: 25
        //console.log('CheckPedTiming Clearance,Walking:' + this.Settings.m_pedClearanceTiming + ',' + this.Settings.m_walkTiming);
        var errorObj = this.CheckIntRange(this.Settings.m_pedClearanceTiming, { FailureType: enumErrorType.ERROR, Min: 0, Max: 80 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Pedestrian clearance timing of ' + errorObj.getMessage());
        }
        return errorObj;
    };

    PreemptSettingsValidation.prototype.CheckPedWalkTiming = function ()
    {
        //m_walkTiming: 7
        var errorObj = this.CheckIntRange(this.Settings.m_walkTiming, { FailureType: enumErrorType.ERROR, Min: 0, Max: 80 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Pedestrian walk timing of ' + errorObj.getMessage());
        }
        return errorObj;

    };

    PreemptSettingsValidation.prototype.CheckInput = function()
    {
        //TODO

        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }

    PreemptSettingsValidation.prototype.CheckMaxCall = function()
    {
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }

    PreemptSettingsValidation.prototype.CheckMinGreen = function()
    {
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }

    PreemptSettingsValidation.prototype.CheckDelay = function()
    {
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }

    PreemptSettingsValidation.prototype.CheckDwellState = function()
    {
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }
    PreemptSettingsValidation.prototype.CheckCycleState = function()
    {
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }
    PreemptSettingsValidation.prototype.CheckExitState = function()
    {
        //TODO
        return new ConfigurationErrorObject(enumErrorType.SUCCESS, "");
    }

    //
    //
    //
    // END PreemptSettingsValidation object

    // BEGIN VehicleDetectorValidation
    //
    //
    //
    VehicleDetectorValidation.prototype = Object.create(ConfigurationErrorContainer.prototype);

    VehicleDetectorValidation.prototype.AddError = function(errorObj)
    {
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Detector #' + this.Detector.m_detectorNum + ' ' + errorObj.getMessage());
            this.m_ErrorQueue.push(errorObj);
        }
    }

    VehicleDetectorValidation.prototype.CheckDelay = function ()
    {
        //FHWA ch5.6.1: 
        //Delay is sometimes used with stop-line, presence mode detection for turn movements from exclusive lanes. For right-turn-lane detection, delay should be considered when the capacity for right-turn-on-red (RTOR) exceeds the right-turn volume or a conflicting movement is on recall. If RTOR capacity is limited, then delay may only serve to degrade intersection efficiency by further delaying right-turn vehicles. The delay setting should range from 8 to 12 seconds, with the larger values used for higher crossroad volumes (31).
        //If the left-turn movement is protected-permissive and the opposing through phase is on minimum (or soft) recall, then delay should be considered for the detection in the left turn lane. The delay setting should range from 3 to 7 seconds, with the larger values used for higher opposing volumes (32). In this case, a minimum recall should also be placed on the adjacent through phase to ensure that a lack of demand on the adjacent through phase does not result in the left-turn movement receiving neither a permissive nor a protected left-turn indication.
        //Delay may also be used to prevent an erroneous call from being registered in the controller if vehicles tend to traverse over another phase’s detector zone. For example, left-turning vehicles often cut across the perpendicular left-turn lane at the end of their turning movement. A detector delay coupled with non-locking memory would prevent a call from being placed for the unoccupied detector.
        var errorObj = this.CheckIntRange(this.Detector.m_delaySec, { FailureType: enumErrorType.ERROR, Min: 0, Max: 12 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Delay timing of ' + errorObj.getMessage());
        }
        return errorObj;

    }


    //this will be 10ths of second. TODO
    VehicleDetectorValidation.prototype.CheckExtend = function ()
    {
        var errorObj = this.CheckIntRange(this.Detector.m_extendSec, { FailureType: enumErrorType.ERROR, Min: 0, Max: 255, DivideErrorMsgBy: 10 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Extend timing of ' + errorObj.getMessage());
        }
        return errorObj;
    }

    VehicleDetectorValidation.prototype.CheckStuckOff = function ()
    {
        var errorObj = this.CheckIntRange(this.Detector.m_stuckOffFailureThresholdMinutes, { FailureType: enumErrorType.ERROR, Min: 0, Max: 25 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Stuck Off timing of ' + errorObj.getMessage());
        }
        return errorObj;
    }

    VehicleDetectorValidation.prototype.CheckStuckOn = function ()
    {
        var errorObj = this.CheckIntRange(this.Detector.m_stuckOnFailureThresholdMinutes, { FailureType: enumErrorType.ERROR, Min: 0, Max: 25 });
        if (!errorObj.IsSuccess())
        {
            errorObj.setMessage('Detector #' + this.Detector.m_detectorNum + ' Stuck On timing of ' + errorObj.getMessage());
        }
        return errorObj;
    }

    //
    //
    //
    // END VehicleDetectorValidation

}; // end of with com.RhythmTraffic.ConfigurationLibrary


