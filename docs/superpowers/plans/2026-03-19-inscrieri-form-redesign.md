# Înscrieri Form Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add lift+stagger step transitions, animated pill stepper with done/active/upcoming states, and input focus polish to the `/inscrieri` registration form.

**Architecture:** Pure CSS keyframes in `globals.css` drive the stepper pill animations (no Motion needed there); the `motion` library drives step card transitions and field stagger in each step component; `_RegistrationForm.tsx` wraps each step in a `motion.div` keyed to the step number so React remounts it on every step change.

**Tech Stack:** Next.js 15, `motion` v12 (`motion/react`), Tailwind CSS 4, pure CSS keyframes

---

## File Map

| File | Change |
|------|--------|
| `src/app/globals.css` | Add 3 keyframes + 3 utility classes |
| `src/app/inscrieri/_shared.tsx` | Upgrade `StepIndicator` — dual icon slots, connector fill div |
| `src/app/inscrieri/_RegistrationForm.tsx` | Wrap each step in `motion.div key={step}` |
| `src/app/inscrieri/_StepPersonal.tsx` | Add `motion` stagger container around fields |
| `src/app/inscrieri/_StepExperience.tsx` | Add `motion` stagger container around fields |
| `src/app/inscrieri/_StepConfirm.tsx` | Add `motion` stagger container around agreement cards |

---

## Task 1: Add keyframes to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add keyframes and utility classes**

Append after the existing `@layer utilities { ... }` block (after line 207):

```css
/* Înscrieri form animations */
@keyframes inscrieri-check-pop {
  0%   { transform: scale(0.3) rotate(-20deg); opacity: 0; }
  65%  { transform: scale(1.25) rotate(4deg);  opacity: 1; }
  100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
}
@keyframes inscrieri-pill-glow {
  0%   { box-shadow: 0 0 0 0px oklch(0.421 0.2593 264.52 / 0.4); }
  100% { box-shadow: 0 0 0 6px oklch(0.421 0.2593 264.52 / 0); }
}
@keyframes inscrieri-line-fill {
  from { width: 0%; }
  to   { width: 100%; }
}

@layer utilities {
  .animate-check-pop {
    animation: inscrieri-check-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .animate-pill-glow {
    animation: inscrieri-pill-glow 1.2s 0.1s ease-out;
  }
  .animate-line-fill {
    animation: inscrieri-line-fill 0.5s 0.15s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
}
```

- [ ] **Step 2: Verify dev server has no CSS errors**

Run: `npm run dev`
Expected: no build errors, page loads at `http://localhost:3000`

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(inscrieri): add stepper animation keyframes to globals.css"
```

---

## Task 2: Upgrade StepIndicator in _shared.tsx

**Files:**
- Modify: `src/app/inscrieri/_shared.tsx`

The current pill is `<div className="flex items-center gap-2 px-3 py-2 ...rounded-full">`. The upgrade keeps this exact shape but adds:
- A border (transparent for upcoming, blue for active/done)
- A background fill for done state
- Two icon slots: step icon (hidden when done) + check icon (shown when done, plays `animate-check-pop`)
- Connector becomes a relative container with an inner fill div that animates width 0→100% when done

- [ ] **Step 1: Replace StepIndicator in _shared.tsx**

Replace the entire `StepIndicator` component (lines 23–54) with:

```tsx
export const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-2">
    {STEPS.map((step, i) => {
      const Icon = step.icon;
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={step.label}>
          {i > 0 && (
            <div className="h-px flex-1 min-w-6 max-w-16 bg-gray-200 relative overflow-hidden">
              <div
                key={`fill-${i}-${done}`}
                className={cn(
                  "absolute inset-y-0 left-0 bg-edusport-blue",
                  done ? "animate-line-fill" : "w-0",
                )}
              />
            </div>
          )}
          <div
            key={`pill-${i}-${active}`}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300",
              done && "bg-edusport-blue border-edusport-blue text-white",
              active && "border-edusport-blue text-edusport-blue bg-edusport-blue/5 animate-pill-glow",
              !active && !done && "border-transparent text-gray-300",
            )}
          >
            {/* Step icon — hidden when done */}
            {!done && <Icon className="w-3.5 h-3.5 shrink-0" />}

            {/* Check icon — shown when done, animates in */}
            {done && (
              <svg
                key={`check-${i}`}
                className="w-3.5 h-3.5 shrink-0 animate-check-pop"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            {step.label}
          </div>
        </React.Fragment>
      );
    })}
  </div>
);
```

- [ ] **Step 2: Verify stepper visually at /inscrieri**

Open `http://localhost:3000/inscrieri`. The first pill should be blue-bordered with the User icon. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/inscrieri/_shared.tsx
git commit -m "feat(inscrieri): upgrade StepIndicator with done/active/upcoming states and animations"
```

---

## Task 3: Add step transition animation in _RegistrationForm.tsx

**Files:**
- Modify: `src/app/inscrieri/_RegistrationForm.tsx`

Wrap each step render in a `motion.div` with `key={step}` so React unmounts/remounts on step change, triggering the lift-in animation. The `key` is the critical detail — without it, React reuses the element and the animation won't replay.

- [ ] **Step 1: Add motion import**

At the top of `_RegistrationForm.tsx`, add:

```tsx
import { motion } from "motion/react";
```

- [ ] **Step 2: Add shared transition constants above the component**

```tsx
const stepTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};
```

- [ ] **Step 3: Wrap each step render in motion.div**

Replace the step render section (lines 65–80) with:

```tsx
  return (
    <motion.div key={step} {...stepTransition}>
      {step === 0 && (
        <StepPersonal form={form} onChange={handleChange} onNext={nextStep} />
      )}
      {step === 1 && (
        <StepExperience
          form={form}
          onChange={handleChange}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 2 && (
        <StepConfirm onBack={prevStep} onSubmit={handleSubmit} status={status} />
      )}
    </motion.div>
  );
```

Note: the `status === "sent"` early return above this stays unchanged.

- [ ] **Step 4: Verify step transitions at /inscrieri**

Fill in a field, click Continuă. The new step card should lift in smoothly. Back should also trigger the animation. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/inscrieri/_RegistrationForm.tsx
git commit -m "feat(inscrieri): add lift-in step transition animation with motion"
```

---

## Task 4: Field stagger in _StepPersonal.tsx

**Files:**
- Modify: `src/app/inscrieri/_StepPersonal.tsx`

Each top-level field group (`<div>`) becomes a `motion.div` child inside a stagger container. The stagger container starts animating 0.15s after the card lift-in completes its first visible frame.

- [ ] **Step 1: Add motion import**

```tsx
import { motion } from "motion/react";
```

- [ ] **Step 2: Add variant constants above the component**

```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const field = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
```

- [ ] **Step 3: Wrap field groups in stagger container**

Replace the two field sections (the child/parent `flex flex-col gap-5` divs) — wrap each in a `motion.div variants={container} initial="hidden" animate="show"` and wrap each individual field `<div>` in `<motion.div variants={field}>`:

```tsx
  return (
    <div>
      <StepIndicator current={0} />

      <div className="flex flex-col gap-3 mb-6">
        <p className="text-xs font-semibold text-edusport-blue uppercase tracking-widest">
          Date copil
        </p>
      </div>

      <motion.div className="flex flex-col gap-5" variants={container} initial="hidden" animate="show">
        <motion.div variants={field}>
          <FieldLabel htmlFor="childName">Nume complet copil *</FieldLabel>
          <input
            id="childName"
            name="childName"
            type="text"
            required
            placeholder="Numele complet al copilului"
            value={form.childName}
            onChange={onChange}
            className={inputBase}
          />
        </motion.div>

        <motion.div variants={field} className="grid sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="childBirthDate">Data nașterii *</FieldLabel>
            <input
              id="childBirthDate"
              name="childBirthDate"
              type="text"
              required
              placeholder="ex: 15 martie 2018"
              value={form.childBirthDate}
              onChange={onChange}
              className={inputBase}
            />
          </div>
          <div>
            <FieldLabel htmlFor="shirtSize">Mărime tricou & înălțime *</FieldLabel>
            <input
              id="shirtSize"
              name="shirtSize"
              type="text"
              required
              placeholder="ex: 128 cm / mărime 8 ani"
              value={form.shirtSize}
              onChange={onChange}
              className={inputBase}
            />
          </div>
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-3 mt-10 mb-6">
        <p className="text-xs font-semibold text-edusport-blue uppercase tracking-widest">
          Date părinte / tutore
        </p>
      </div>

      <motion.div className="flex flex-col gap-5" variants={container} initial="hidden" animate="show">
        <motion.div variants={field} className="grid sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel htmlFor="parentName">Nume complet părinte *</FieldLabel>
            <input
              id="parentName"
              name="parentName"
              type="text"
              required
              placeholder="Numele complet al părintelui"
              value={form.parentName}
              onChange={onChange}
              className={inputBase}
            />
          </div>
          <div>
            <FieldLabel htmlFor="phone">Telefon *</FieldLabel>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+40 7xx xxx xxx"
              value={form.phone}
              onChange={onChange}
              className={inputBase}
            />
          </div>
        </motion.div>
      </motion.div>

      <StepNavigation
        onBack={() => {}}
        onNext={onNext}
        canProceed={canProceed}
        backLabel=""
      />
    </div>
  );
```

- [ ] **Step 4: Verify field stagger at /inscrieri step 1**

Reload `/inscrieri`. Fields should float up one by one after the card arrives. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/inscrieri/_StepPersonal.tsx
git commit -m "feat(inscrieri): add field stagger animation to StepPersonal"
```

---

## Task 5: Field stagger in _StepExperience.tsx

**Files:**
- Modify: `src/app/inscrieri/_StepExperience.tsx`

Same pattern as Task 4. The file has two field sections — "Experiență & așteptări" (3 fields: `level`, `priorExperience`, `expectations`) and "Informații suplimentare" (2 fields: `howHeard`, `clubInterest`). Both sections get a stagger container.

- [ ] **Step 1: Add motion import and variants**

```tsx
import { motion } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const field = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
```

- [ ] **Step 2: Wrap first field section (lines 33–73)**

Replace `<div className="flex flex-col gap-5">` (first occurrence, wrapping `level`, `priorExperience`, `expectations`) with `<motion.div className="flex flex-col gap-5" variants={container} initial="hidden" animate="show">` and wrap each of the three `<div>` children in `<motion.div variants={field}>`.

- [ ] **Step 3: Wrap second field section (lines 82–112)**

Replace `<div className="flex flex-col gap-5">` (second occurrence, wrapping `howHeard`, `clubInterest`) with `<motion.div className="flex flex-col gap-5" variants={container} initial="hidden" animate="show">` and wrap each of the two `<div>` children in `<motion.div variants={field}>`. The `<p>` note inside the `clubInterest` wrapper stays inside `<motion.div variants={field}>` alongside the `SelectField`.

- [ ] **Step 4: Verify field stagger at step 2**

Advance to step 2. Fields should stagger in. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/inscrieri/_StepExperience.tsx
git commit -m "feat(inscrieri): add field stagger animation to StepExperience"
```

---

## Task 6: Card stagger in _StepConfirm.tsx

**Files:**
- Modify: `src/app/inscrieri/_StepConfirm.tsx`

Step 3 has three cards (regulament, gdpr, program link). Stagger them in the same way.

- [ ] **Step 1: Add motion import and variants**

```tsx
import { motion } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
```

- [ ] **Step 2: Wrap the three cards in a stagger container**

Wrap the regulament card `<div>`, the gdpr card `<div>`, and the program link `<a>` (lines 32–154) in a single `<motion.div variants={container} initial="hidden" animate="show">` and wrap each of the three elements in `<motion.div variants={card}>`.

The error message and navigation row stay outside the stagger container — no changes there.

- [ ] **Step 3: Verify card stagger at step 3**

Advance to step 3. The three cards should stagger in. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/inscrieri/_StepConfirm.tsx
git commit -m "feat(inscrieri): add card stagger animation to StepConfirm"
```

---

## Task 7: Input focus lift in form-field.tsx

**Files:**
- Modify: `src/components/ui/form-field.tsx`

`inputBaseOnCard` already has `focus:ring-1 focus:ring-edusport-blue/20 transition-all`. Add `focus:-translate-y-px` for the subtle lift. This applies automatically to all inputs/textareas/selects in the inscrieri form (they all use `inputBase` which aliases `inputBaseOnCard`).

- [ ] **Step 1: Add focus lift to inputBaseOnCard**

In `src/components/ui/form-field.tsx` line 10–11, change `inputBaseOnCard` from:

```ts
export const inputBaseOnCard =
  "w-full px-4 py-3 text-sm bg-white border border-gray-200 outline-none focus:border-edusport-blue focus:ring-1 focus:ring-edusport-blue/20 transition-all placeholder:text-gray-400";
```

to:

```ts
export const inputBaseOnCard =
  "w-full px-4 py-3 text-sm bg-white border border-gray-200 outline-none focus:border-edusport-blue focus:ring-1 focus:ring-edusport-blue/20 focus:-translate-y-px transition-all placeholder:text-gray-400";
```

- [ ] **Step 2: Verify focus lift at /inscrieri**

Click any input field. It should subtly lift 1px upward. No other inputs on the site should be affected (this class is only used inside card backgrounds).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/form-field.tsx
git commit -m "feat(inscrieri): add subtle focus lift to inputBaseOnCard"
```

---

## Final Verification

- [ ] Run through the full form flow at `http://localhost:3000/inscrieri`:
  - Step 1: card lifts in, fields stagger up one by one
  - Click Continuă: step 1 pill fills solid blue with ✓, connector animates blue, step 2 card lifts in
  - Step 2: fields stagger in
  - Click Continuă: step 2 pill fills blue, connector fills, step 3 card lifts in
  - Step 3: agreement cards stagger in
  - Click Înapoi from step 2: step 2 pill returns to active state (border ring), step 1 pill returns to active, connector instantly reverts to gray (no reverse animation — intentional).
  - Submit: success state displays correctly
- [ ] Run `npm run build` — no TypeScript errors
- [ ] Run `npm run lint` — no new lint errors
