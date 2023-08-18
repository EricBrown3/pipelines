----

STORY as a developer, I want example
  paku-8

  TASK create player-stage collision pipeline
  TASK create player-stage collision resolution pipeline
    kill the player
  
STORY as a user, I want indexed *and* named pipeline stages
  in addition to an array, I want to support record

---

STORY as a user, I want "PassthroughPipelineStage"
  which does not have "passParams" and forwards pipeline params straight to stage params

---

STORY as a developer, I want to compose execution "WithWorldState"
  stateApi will be a property on params
    
  state will contain
    currentWorldState

  produceParams will return 
    finalWorldState

  Stage.afterExecute
    will reduce stage result into state, currentWorldState

STORY as a developer, I want to compose execution "WithEvents"
    stateApi will be a property on params
    
  state will contain
    currentWorldState

  produceParams will return 
    finalWorldState

  Stage.afterExecute
    will reduce stage result into state, currentWorldState

---

STORY as a user, I want to compose exeuction "withRunCount"

STORY as a user, I want a function which adds time
  
  the goal will be to add simulationStartAgentTime, lastPipelineStartAgentTime, lastStageStartAgentTime

  TASK example of squares which use "simulationTime" and "agentTime"
    color is startTime % animationTime 

---

STORY everyone want tests
  TASK add jest
  TASK create tests for standard pipeline

---

STORY as a user, I want to compose, "withLockstep"

STORY as a user, I want to compose, "withRollback"

---

STORY as a developer, I want async
  TASK bring back "order": for stages

    stageOrder: [
      [characterToStageCollision, stageToCharacterCollision],
      combat
    ]

---

