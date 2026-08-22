---
name: motion-ui-engineer
description: Design and implement high-quality React UI motion and visual effects using Motion for React and, when appropriate, React Bits components.
---

# motion-ui-engineer

## Purpose
Design and implement high-quality React UI motion and visual effects using Motion for React and, when appropriate, React Bits components, ensuring motion serves as a UX tool rather than mere decoration.

## Activation Triggers
- When the application stack is React/Next.js and a polished UI is required.
- During the UI polishing phase to improve user comprehension and feedback.

## Inputs
- The built UI components and pages.
- The project's overarching design system and theme.

## Required Context
- Do NOT require React Bits or Motion if the chosen application stack does not need them or is not React-based.
- Keep animation consistent throughout the application.

## Responsibilities
- Implement subtle functional and interaction animations.
- Use Motion for enter/exit transitions, hover/tap/focus feedback, layout transitions, list changes, modal transitions, loading/success/error states, scroll-triggered reveals, and gesture interactions.
- Selectively integrate React Bits components for premium visual moments (hero sections, animated typography, backgrounds).
- Adapt any copied components (like React Bits) strictly to the project's actual design system.
- Verify loading, empty, success, and error states behave smoothly.

## Operating Procedure
1. Verify the technology stack. If using React/Next.js, install `motion` (`npm install motion`) and import from `motion/react`.
2. Review the user journey to identify critical feedback moments (clicks, page loads, data updates).
3. Apply subtle Motion transitions to these elements first.
4. If a "Wow" moment is needed for the demo, integrate a React Bits component (e.g., animated typography or hero background) but immediately adapt its colors and styling to the project.
5. Verify performance on normal laptop hardware to ensure no lag.
6. Verify keyboard navigation and focus states remain visible and usable.
7. Test the application with mobile screen dimensions to ensure animation does not break responsiveness.
8. Implement checks for `prefers-reduced-motion` and disable heavy animations accordingly.

## Decision Rules
- Motion is a UX tool, not decoration everywhere. Prefer subtle and functional animations.
- Do not introduce unnecessary dependencies.
- Never hide important information behind an animation.
- Never make essential controls dependent on animation.
- Respect `prefers-reduced-motion` settings.

## Tool Usage Guidance
- **Motion for React:** `npm install motion` -> `import { motion } from 'motion/react'`
- **React Bits:** Copy components selectively and adapt them rather than blindly importing.

## Expected Outputs
- A polished, interactive, and responsive UI that feels premium but not gimmicky.

## Quality Gates
- Are all animations functional and non-blocking?
- Does the site remain fully functional when reduced-motion is requested?
- Is keyboard navigation still perfect?

## Failure Handling
- If an animation causes layout thrashing or performance drops, remove it immediately and fall back to instant CSS state changes.

## Completion Criteria
- UI feels polished rather than gimmicky.
- Motion supports user comprehension.
- No animation blocks functionality.
- Reduced-motion behavior is handled.
- Mobile behavior is verified.
- No unnecessary dependencies are introduced.
- No copied component is left unadapted.

## Prohibited Behavior
- Do not use heavy visual effects that reduce performance.
- Do not use animation that interferes with accessibility.
- Avoid excessive particle effects, 3D effects, infinite animations, or animated cursors unless they materially improve the experience and serve a clear purpose.
