# Motivation
Need to execute stages of a pipeline sequentially.

Primitive data structure, a "pipeline".

## Dependencies
Dependencies are implicitly defined in a straightfoward and orthogonal way through composing pipelines.

Example:
In a physics simulation for a typical 3D game, you calculate contacts, restitute bodies using those contacts, then write the bodies back to transforms. In an ECS paradigm, you would solve this by creating a system for each of these, and put these into a group.

## Seperation of Concerns
With traditional ECS, there is only one monolithic data structure, the "world".

In reality, your application will be split across multiple contexts (web workers, threads, etc) or agents (server/ client).

Each of these contexts/ agents have different concerns, and therefore should have different execution.

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

Pipeline creates their results from the result of all their stages.

## Stage
Each stage creates params from the pipeline's params and current stage results. 

This allows passing the results for one pipline stage as the params for another.

# Usage
Stages can execute pipelines; we refer to this as "nesting" pipelines.