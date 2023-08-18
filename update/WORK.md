----

STORY as a developer, I want to bring back stage results
  TASK add stage.produceResults(stageParams, passResults)
  TASK pipeline.produceResults takes stageResults

STORY as a developer, I want example
  paku-8

  TASK finish other stages of simulation pipeline

STORY everyone want tests
  TASK add jest
  TASK create tests for standard pipeline

CHORE
  commit!

---

STORY as a developer, I want async
  TASK bring back "order": for stages, as "groups" of stages which have to execute
    eg, each stage has a key, and the order describes an array of keys/ array of keys.

    stageOrder: [
      [characterToStageCollision, stageToCharacterCollision],
      combat
    ]

---

STORY as a user, I want a function which composes any existing pipeline, `usingAgentTime`
  the purpose will be to use hooks

  hooks which compose produceParams with "Date.now()"

STORY as a developer, I want my "basic" pipeline execution using hooks
  this will be my pipeline
    
  state will contain
    currentWorldState
    currentEvents

  produceParams will return 
    finalWorldState and finalEvents

  Stage.afterExecute
    will reduce stage result into state, currentWorldState currentEvents

STORY I want tests for my basic pipeline

---

STORY as a user, I want hooks, usingLockstep
  beforeExecuteStages
  afterExecuteStages

STORY as a user, I want hooks, usingRollback
  beforeExecuteStages
  afterExecuteStages

---

