below is a proposed prd for implementing the exercise lock/unlock feature. minimal uppercase for emphasis only, while weaving in some straussian vibes. let's go:

purpose & overview

we want to prevent users from accessing higher-level exercises until they've completed all steps in lower-level exercises. we also want to track user progress in a robust way so we can easily adapt as we add more courses, topics, etc.
architecture is based on existing schemas for exercises, steps, and a user_progress table. we’ll also rely on some queries to figure out if the user has completed all steps in an exercise.
data model recap

tables of note:
topic and course: not super relevant to the lock/unlock logic directly, but we may need them for high-level grouping or if we choose to unlock entire courses after one is completed.
exercise: each one references a course_id. each exercise has a difficulty and an order that indicates which exercise is next.
step: each exercise is broken into multiple steps. a step can be a question, video, explanation, or whatever.
user_progress: tracks the user’s id, the exercise id, whether it’s unlocked, and the user’s score percentage. we’ll update or insert into this table whenever a user finishes an exercise.
unlocking flow

when a user finishes all steps in an exercise (i.e., the user has “completed” that exercise), we set is_unlocked = true for the next exercise.
the next exercise is the one whose order is exactly 1 greater than the completed exercise’s order.
upon unlocking, we generate or update a row in user_progress for that next exercise with is_unlocked = true.
if the user tries to access an exercise with is_unlocked = false, we throw an error or show a locked state in the ui.
completion detection

for an exercise to be considered “complete,” the user must have gone through all steps in that exercise.
each step can be “completed” only if the user’s response is correct or if the user explicitly taps “finish” on non-quiz steps (e.g., video or explanation).
consider partial completions: if the user abandons halfway, we store partial data but do not mark that exercise as complete.
a final pass is triggered once the user successfully completes the last step, at which point we update user_progress.score_percentage (or we do a final recalculation if needed) and set that exercise to complete.

edge cases

exercise not found: user tries to finish an invalid exercise. must handle gracefully.
next exercise doesn’t exist: we just do nothing, bc that means there’s no next exercise.
db concurrency issues: two updates to the same user_progress at once? handle conflicts by either using row locking or checking the final state before writing.
user tries to skip steps or jump ahead: ensure the ui disables the next step button until the previous is completed. if a request arrives to unlock an exercise out of order, we throw an error or ignore it.
retroactive changes: if we reorder exercises or steps later, make sure to recalc user_progress or at least store some versioning so we don’t break old completions.
error checks & logging

add logs whenever user attempts to complete an exercise they haven't fully finished, or tries to unlock an exercise that doesn't exist.
consider logging user actions for analytics, e.g., how many attempts they needed to pass a step, bc that might be valuable for data analysis.
if you rely on supabase rpc or triggers, keep an eye out for potential silent failures. always log or throw errors so we see them in logs or error trackers.
