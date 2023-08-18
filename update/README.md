# Motivation
Need to execute stages of a pipeline sequentially.

Primitive data structure, a "pipeline".

## Dependencies
In traditional entity component system, there is no concept of stages, only groups of systems which have similar dependencies. However, these groups can only communicate their dependencies through entities using "system state" components. This is obtuse, inefficient (causes queries/ selectors to re-run), and dirties world state with execution state. The end result is a difficult to maintain program loop.

by creating an explicit pipeline of stages with params and results, we keep execution state out of world state, and allows users to determine dependencies between stage in an orthogonal way.

## Seperation of Concerns
With traditional ECS, there is only one monolithic data structure, the "world".

Your world may be split across multiple contexts (web workers, threads, etc) or agents (server/ client).

Each of these contexts/ agents have different concerns, and therefore should have different pipelines and passes.

eg, you may have a "simulate" dedicated worker, which executes in its own worker thread, which executes once per "step" (ie, at a a fixed interval), which takes user input, which does not use delta time. 
eg, you may have a "render" dedicated worker, which executes in its own worker thread, which executes once per frame, which does not take user input, which uses delta time.
In this example, there is a clear dependency: the render update pipeline *only* reads from a slice of the world!

One pipelines per concern.

# Concepts

## Pipeline
Pipeline have stages.

Pipeline produces their results from the result of all their stages.

## Stage
Each stage produces params from the pipeline stage.

A stage can have a single pass, or multiple passes.

Passes always execute.

## Pass
Params of a pass are produced by the stage.

Passes are useful for independent execution within a stage, which have no dependencies of each other.