{
   "Status" : {
      "m_activePreemptId": 1,
      "m_stopTime": false,
      "m_channelGreenStatus" : [
         false,
         false,
         false,
         true,
         false,
         false,
         false,
         false,
         true,
         false,
         false,
         false,
         false,
         false,
         false,
         false
      ],
      "m_channelRedStatus" : [
         true,
         true,
         true,
         false,
         true,
         true,
         true,
         false,
         true,
         true,
         true,
         true,
         true,
         true,
         false,
         true
      ],
      "m_channelYellowStatus" : [
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false
      ],
      "m_overlapNext" : [ false, true, false, false, false, false, false, false ],
      "m_overlapOn" : [ false, true, false, false, false, false, false, false ],
      "m_pedPhaseCalls" : [ true, true, true, true, false, true, false, true ],
      "m_pedPhaseNext" : [ false, true, true, false, false, false, false, false ],
      "m_pedPhaseOn" : [ false, false, false, true, true, false, false, false ],
      "m_pedPhaseRecalls" : [ true, false, false, false, false, false, false, false ],
      "m_pedPhaseRestingInWalk" : [ false, false, false, false, false, false, false, false ],
      "m_pedPhaseTimers" : [
         {
            "m_phaseNext" : 0,
            "m_active" : true,
            "m_clearanceTimer" : {
               "m_msRemaining" : 2000,
               "m_msTime" : 5000
            },
            "m_phaseNum" : 11,
            "m_restInWalkEnabled" : false,
            "m_restingInWalk" : true,
            "m_timingSection" : 1,
            "m_walkTimer" : {
               "m_msRemaining" : 5500,
               "m_msTime" : 6500
            }
         },
         {
            "m_phaseNext" : 0,
            "m_active" : true,
            "m_clearanceTimer" : {
               "m_msRemaining" : 6000,
               "m_msTime" : 17000
            },
            "m_phaseNum" : 12,
            "m_restInWalkEnabled" : false,
            "m_restingInWalk" : false,
            "m_timingSection" : 4,
            "m_walkTimer" : {
               "m_msRemaining" : 6000,
               "m_msTime" : 10000
            }
         }
      ],
      "m_preemptMaxTimer" : {
         "m_msRemaining" : 7000,
         "m_msTime" : 10000
      },

      "m_timedOverlapTimers" : [
         {
            "m_active" : true,
            "m_extendGreenTimer" : {
               "m_msRemaining" : 10,
               "m_msTime" : 0
            },
            "m_minGreenTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            },
            "m_overlapId" : 0,
            "m_redTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            },
            "m_yellowTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            }
         },
         {
            "m_active" : false,
            "m_extendGreenTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            },
            "m_minGreenTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            },
            "m_overlapId" : 0,
            "m_redTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            },
            "m_yellowTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            }
         }
      ],
      "m_trackClearanceTimer" : {
         "m_active" : false,
         "m_preemptId" : 0,
         "mckClearPhase" : 0
      },
      "m_vehPhaseCalls" : [ true, true, true, true, true, true, true, true ],
      "m_vehPhaseNext" : [ false, true, false, false, false, false, false, false ],
      "m_vehPhaseOn" : [ false, false, false, true, false, false, false, false ],
      "m_vehPhaseRecalls" : [ 3, 3, 2, 3, 3, 3, 3, 3 ],
      "m_vehiclePhaseTimers" : [
         {
            "m_active" : true,
            "m_gapOut" : true,
            "m_maxGreenTimer" : {
               "m_msRemaining" : 20000,
               "m_msTime" : 60000
            },
            "m_maxOut" : true,
            "m_minGreenTimer" : {
               "m_msRemaining" : 6000,
               "m_msTime" : 8000
            },
            "m_passageTimer" : {
               "m_msRemaining" : 2000,
               "m_msTime" : 5000
            },
            "m_phaseNum" : 8,
            "m_redTimer" : {
               "m_msRemaining" : 3000,
               "m_msTime" : 4000
            },
            "m_splitTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            },
            "m_timingSection" : 2,
            "m_yellowTimer" : {
               "m_msRemaining" : 1000,
               "m_msTime" : 5000
            }
         },
         {
            "m_active" : true,
            "m_gapOut" : false,
            "m_maxGreenTimer" : {
               "m_msRemaining" : 1000,
               "m_msTime" : 5000
            },
            "m_maxOut" : false,
            "m_minGreenTimer" : {
               "m_msRemaining" : 30000,
               "m_msTime" : 40000
            },
            "m_passageTimer" : {
               "m_msRemaining" : 7000,
               "m_msTime" : 9000
            },
            "m_phaseNum" : 1,
            "m_redTimer" : {
               "m_msRemaining" : 3000,
               "m_msTime" : 10000
            },
            "m_splitTimer" : {
               "m_msRemaining" : 0,
               "m_msTime" : 0
            },
            "m_timingSection" : 1,
            "m_yellowTimer" : {
               "m_msRemaining" : 1,
               "m_msTime" : 9
            }
         }
      ]
   }
}
