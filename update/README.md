# Motivation
Need to execute stages of a pipeline sequentially.

Primitive data structure, a "pipeline".

## Dependency
By allowing stages to produce params (which are used by nested pipelines), we allows users to determine dependencies between stages in a straightfoward and orthogonal way.

Dependencies are implicitly defined through their order.

Instead of sorting and groups, we define pipelines and stages.
Instead of queries, we define params.

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
Produce results allows for "synchronization" points.

Stages can execute pipelines; we refer to this as "nesting" pipelines.