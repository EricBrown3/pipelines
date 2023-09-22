
STORY as a developer, I want async
  different concurrency models: any, all, for

  executePipelineSync
  executePipelineAsync

---

STORY as a developer, I want to pass stageKey and stageOrder to each stage
  so that I want get the results of the previous stage

---

STORY as a developer, I want to compose execution data "WithWorldState"
  this this pipeline, params of every pipeline and every stage has currentWorldState, and returns finalWorldState

  createParams will create currentWorldState from pipeline

  stage will return finalWorldState

---

STORY as a developer, I want to compose execution "WithEvents"
    stateApi will be a property on params
    
  state will contain
    currentWorldState

  createParams will return 
    finalWorldState

---

STORY everyone want tests
  TASK add jest

STORY everyone wants tests for getOrderedStageDataEntries
  TASK test order respected

STORY everyone wants tests for executeSyncPipeline
  TASK test empty pipeline
  TASK test returns createResults
  TASK test default order of records
  TASK test default order of array
  TASK test beforeExecute is invoked with createParams
  TASK test afterExecute is invoked with createParams
  TASK test returns undefined when createResults is undefined
  TASK test doExecute is executed when shouldExecute is true
  TASK test beforeExecute is executed when shouldExecute is false
  TASK test afterExecute is executed when shouldExecute is false
  TASK test doExecute is NOT executed when shouldExecute is false
  TASK test execution order

STORY everyone wants tests for executeSyncPipeline
  TASK test empty pipeline
  TASK test returns createResults
  TASK test default order of records
  TASK test default order of array
  TASK test beforeExecute is invoked with createParams
  TASK test afterExecute is invoked with createParams
  TASK test returns undefined when createResults is undefined
  TASK test doExecute is executed when shouldExecute is true
  TASK test beforeExecute is executed when shouldExecute is false
  TASK test afterExecute is executed when shouldExecute is false
  TASK test doExecute is NOT executed when shouldExecute is false
  TASK test concurrencyMode all
  TASK test concurrencyMode any (fails when a second pipeline fails)
  TASK test concurrencyMode order

---

STORY as a user, I want to compose exeuction "withRunCount"

STORY as a user, I want a function which adds time
  
  the goal will be to add simulationStartAgentTime, lastPipelineStartAgentTime, lastStageStartAgentTime

  TASK example of squares which use "simulationTime" and "agentTime"
    color is startTime % animationTime 

---

STORY as a user, I want to compose, "withLockstep"

STORY as a user, I want to compose, "withRollback"