here’s a structured prd for your “completion screen” feature:

purpose & overview

once the user finishes an exercise (completes the final step), they should be greeted with a celebratory component featuring a “well done!” message, their final score, and a button to start another course.
the objective: congratulate users, provide immediate feedback, encourage continuing their learning journey.
user flow

user arrives at the last step of an exercise.
user selects “continue.”
system triggers the completion logic (e.g., updates user_progress, calculates final score).
upon successful completion, the new “completion screen” component is rendered.
user sees a “well done!” message, plus final score (like “your score: 85%”).
user has a button labeled “start another course.” tapping that leads them to either:
a course selection screen, or
recommended courses from the same topic.
