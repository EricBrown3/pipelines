# Motivation
Need to execute stages of a pipeline sequentially.

Primitive data structure, a "pipeline".

## Dependencies
In traditional entity component system, there is no concept of stages, only groups of systems which have similar dependencies. However, these groups can only communicate their dependencies through entities using "system state" components. This is obtuse, inefficient (causes queries/ selectors to re-run), and dirties world state with execution state. The end result is a difficult to maintain program loop.

by creating an explicit pipeline of stages with params and results, we keep execution state out of world state, and allows users to determine dependencies between stage in an orthogonal way.

## Seperation of Concerns
With traditional ECS, there is only one monolithic data structure, the "world".

In reality, your application will be split across multiple contexts (web workers, threads, etc) or agents (server/ client).

Each of these contexts/ agents have different concerns, and therefore should have different pipelines and passes.

eg, a typical setup:
"simulate" pipeline which:
- executes in its own worker thread
- reads and writes to world state
- executes once per "step" (ie, at a fixed interval)
- takes world state and user input as params

"render" pipeline which:
- executes in its own worker thread
- reads from world state
- executes once per animation frame
- takes world state, canvas context, and delta time as params

In this example, there is a clear dependency: the render pipeline *only* reads from a slice of the world!

# Concepts

## Pipeline
Pipeline have stages.

Pipeline produces their results from the result of all their stages.

## Stage
Each stage produces params from the pipeline's params and current stage results. 

This allows passing the results for one pipline stage as the params for another.

# Usage
Pipelines can execute other pipelines. This allows for "synchronization" points.