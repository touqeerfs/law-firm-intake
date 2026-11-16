# Own design tokens and hand-built primitives

The brief says generic AI-generated UI counts against the submission, and the role is about design systems. We define our own tokens in Tailwind v4's `@theme` (and remove Tailwind's default palette so only our tokens exist) and hand-build small primitives (Button, Pill, Avatar, Field…). Radix is used only where focus management is hard to get right: Dialog, DropdownMenu and Popover.

## Considered Options

- **shadcn/ui**: fast, but its default look is exactly the "generic" result the brief warns about, and it copies in a lot of code we'd then have to own and maintain.
