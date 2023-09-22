--- 

STORY as a user, I want stage functions to recieve stage keys in execution order and the current index

---

STORY as a developer, I want async
  different concurrency models: any or all

  executePipelineSync
  executePipelineAsync

---

STORY everyone want tests
  TASK add jest

---

STORY as a developer, I want to compose execution data "WithWorldState"
  this this pipeline, params of every pipeline and every stage has currentWorldState, and returns finalWorldState

  createParams will create currentWorldState from pipeline

  stage will return finalWorldState

STORY as a developer, I want to compose execution "WithEvents"
    stateApi will be a property on params
    
  state will contain
    currentWorldState

  createParams will return 
    finalWorldState

---

STORY as a user, I want to compose exeuction "withRunCount"

STORY as a user, I want a function which adds time
  
  the goal will be to add simulationStartAgentTime, lastPipelineStartAgentTime, lastStageStartAgentTime

  TASK example of squares which use "simulationTime" and "agentTime"
    color is startTime % animationTime 

---

STORY as a user, I want to compose, "withLockstep"

STORY as a user, I want to compose, "withRollback"