# BeeFintech Website Design System

## Visual Theme & Atmosphere
- Mood: professional_minimal
- Feel: Clean, credible, service-oriented, and lightly technical.
- References: BeeFintech current light-blue brand direction, Plaid-style fintech clarity, and restrained B2B SaaS product pages.
- Product context: Public C-side-facing website with service modules, plus a password-protected data management admin console.

## Color Palette & Roles
- Background: #FFFFFF
- Surface: #F8FAFC
- Text primary: #0F172A
- Text secondary: #64748B
- Accent: #3B82F6
- Accent hover: #2563EB

## Typography Rules
- Display: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, 600, clamp(2rem, 5vw, 3.5rem)
- Body: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, 400, 1rem/1.6
- Mono: JetBrains Mono, "SFMono-Regular", Consolas, monospace, 400, 0.875rem

## Component Stylings
- Buttons: rounded-md, accent background, white text, clear focus-visible outline.
- Secondary buttons: white background, subtle border, text primary, accent hover border.
- Cards: surface background, subtle border, 8px radius, no heavy decorative shadow.
- Inputs: white background, 1px border, 8px radius, accent focus ring, clear error text below.
- Admin tables: compact rows, sticky header where useful, primary actions on the right, destructive actions visually secondary.
- Data widgets: use mono numerics for ROI values, booking counts, and admin metrics.

## Layout Principles
- Max width: 1200px
- Grid: single_column
- Section spacing: 72px
- Content padding: 24px on mobile, 40px on desktop
- Homepage rhythm: hero, value proof, capability matrix, ROI calculator, FAQ, insights, demo booking, footer.
- Admin rhythm: login, dashboard overview, data tables, edit panels.

## Depth & Elevation
- Shadows: none by default; use borders and background contrast for separation.
- Borders: 1px solid rgba(15, 23, 42, 0.08)
- Layering: top navigation may use a translucent white background with border-bottom only.

## Do's and Don'ts
- DO use light-blue accent sparingly for primary actions, active filters, and important data highlights.
- DO keep the website welcoming for public visitors while making the product capability concrete.
- DO make ROI, FAQ, insights, and demo booking feel like service entrances, not marketing decoration.
- DO reuse the same tokens for public pages and admin pages.
- DON'T use dark cloud-console styling as the main identity.
- DON'T imitate pure consumer insurance purchase pages too closely.
- DON'T use decorative gradient blobs, bokeh, or abstract orbs.
- DON'T invent colors outside the declared palette.
- DON'T put cards inside cards.

## Responsive Behavior
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Mobile: single column, stack all sections vertically, keep CTA buttons full width where helpful.
- Tablet: allow 2-column feature and FAQ grids.
- Desktop: use max-width constraint with 2-column hero and 3-column feature matrices.
- Images and product previews: fluid, max-width 100%, maintain aspect ratio.
- Admin: tables can switch to stacked record cards below 768px.

## Agent Prompt Guide
- Do NOT invent colors outside this palette.
- Do NOT add box-shadows unless replacing them with borders would make hierarchy unclear.
- Accent color appears maximum 3 times per viewport.
- All interactive elements need :focus-visible outline.
- Keep cards at 8px radius or less.
- Use product UI previews, data panels, calculators, and tables instead of generic abstract illustrations.
- Public site users do not log in. Only the admin console uses password login.
- MVP admin manages demo bookings, FAQ entries, and insurance technology insights.

## Dimensions Resolved From Defaults
- palette: set to "light_clean" because the requested direction is a light BeeFintech blue website.
- accent: set to "electric_blue" because the current BeeFintech logo uses a clear blue technology accent.
- typography: set to "inter" for high legibility across Chinese and English UI copy.
- display: set to "same_as_body" because the site should feel restrained and enterprise-ready.
- layout: set to "single_column" for safe responsive landing-page composition.
- mood: set to "professional_minimal" to balance public website clarity with B2B credibility.
- density: set to "balanced" for a 1-2 day MVP that still feels polished.
- exclude: set to "gradients, stock_photos, decorative blobs" based on the requested light B2B fintech direction.
