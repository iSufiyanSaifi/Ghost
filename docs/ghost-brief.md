# GHOST GARAGE ERP — COMPLETE PRODUCT DESIGN MASTER PROMPT
## Premium Automotive SaaS Ecosystem | Ghost Design System

**Product:** Ghost Garage ERP  
**Design System:** Ghost  
**Product Category:** Automotive Workshop Management / Garage ERP SaaS  
**Design Direction:** Premium Automotive Technology  
**Design Approach:** Completely New UI/UX, Enterprise-Grade, Modern, Functional and Scalable

---

# 1. YOUR ROLE

Act as a multidisciplinary product design team consisting of:

- Principal Product Designer
- Senior UI/UX Designer
- Enterprise SaaS Architect
- Design Systems Architect
- Automotive Industry Product Specialist
- UX Researcher
- Frontend Design Engineer
- Accessibility Specialist

Your responsibility is to design an entirely new, professional, modern and production-ready digital ecosystem for Ghost Garage.

This is not a simple dashboard redesign.

You are designing a full automotive ERP product ecosystem, including:

1. A public-facing SaaS marketing website.
2. A complete web-based Garage ERP.
3. A scalable, reusable design system named Ghost.
4. Responsive experiences for desktop, tablet and mobile.
5. Complete workflows connecting all ERP modules.
6. A consistent visual and interaction language across the entire product.

Think like a product team building a premium automotive SaaS platform that can compete with established international enterprise software.

The final experience must feel premium, precise, trustworthy, intuitive and engineered for real-world automotive workshop operations.

# 2. PRODUCT OVERVIEW

Ghost is an automotive technology platform designed to modernize garage and workshop operations.

It helps medium-sized and large automotive workshops manage their complete business operations from one connected platform.

The product should support:

- Garage owners and administrators.
- Service advisors.
- Front-desk executives.
- Workshop managers.
- Technicians and mechanics.
- Inventory managers.
- Purchase managers.
- Accountants and finance teams.
- Multi-branch business owners.
- Platform-level super administrators.

The ERP must connect every business operation instead of creating disconnected modules.

## Core business workflow

Design the product around this connected operational journey:

Customer Registration → Vehicle Registration → Service Booking → Vehicle Check-in → Inspection → Estimate Creation → Customer Approval → Service Execution → Quality Check → Invoice → Payment → Vehicle Delivery → Service Reminder.

Every stage should have a meaningful status, clear ownership, timestamps, available actions and appropriate data relationships.

The system must be designed around real garage operations, not generic business-dashboard assumptions.

# 3. DESIGN PHILOSOPHY

Create a completely fresh visual identity for the product UI.

Do not simply copy existing automotive SaaS dashboards or generic admin templates.

### Design principles

- Premium automotive aesthetics.
- Clean and minimal interface.
- Strong information hierarchy.
- Consistent spacing and alignment.
- Functional and purposeful visual elements.
- Comfortable information density.
- High-quality data presentation.
- Clear navigation and predictable interactions.
- Minimal unnecessary decoration.
- Excellent readability.
- Scalable component architecture.
- Practical workflows over decorative layouts.

The visual language should combine the precision of automotive engineering with the sophistication of modern enterprise SaaS.

Use visual references conceptually from premium automotive interfaces and mature SaaS products, but create an original design.

### Avoid

- Generic AI-generated dashboard layouts.
- Excessive gradients.
- Excessive glassmorphism.
- Unnecessary floating cards.
- Excessive rounded containers.
- Random colors.
- Inconsistent spacing.
- Oversized dashboard statistics.
- Decorative illustrations that do not improve usability.
- Excessive whitespace that hides important operational information.
- Huge empty dashboards.
- Inconsistent icon styles.
- Tables that look like spreadsheets from 2005.
- Unnecessary animations.

Every element must have a functional purpose.

# 4. BRAND AND VISUAL FOUNDATIONS

Use these values as fixed design requirements.

## Brand identity

Product name: Ghost Garage

Design system name: Ghost

Primary brand color:
`#1C70D4`

Secondary brand color:
`#FF1619`

Theme support:
- Light mode.
- Dark mode.

Typography:
Geist.

Design character:
Premium, technical, automotive, modern and enterprise-grade.

Do not replace the primary or secondary brand colors with other colors.

You can create appropriate tints, shades and accessible variants from these base colors.

## Color system architecture

Build a complete semantic color system.

### Brand colors

- Brand Primary
- Brand Primary Hover
- Brand Primary Active
- Brand Primary Subtle
- Brand Secondary
- Brand Secondary Hover
- Brand Secondary Active
- Brand Secondary Subtle

### Neutral colors

Create a sophisticated neutral palette for:

- Main application background.
- Secondary background.
- Surface.
- Elevated surface.
- Sidebar.
- Top navigation.
- Card backgrounds.
- Primary text.
- Secondary text.
- Muted text.
- Placeholder text.
- Borders.
- Dividers.
- Disabled elements.

### Semantic colors

Create independent semantic tokens for:

- Success.
- Warning.
- Error.
- Information.
- Pending.
- Neutral.

Important: The brand secondary red must not automatically be used for every destructive action or error state. Define semantic colors independently.

Check text and background combinations for WCAG 2.2 AA contrast wherever applicable.

## Light theme

Create a refined light experience with:

- Soft neutral page backgrounds.
- White or near-white surfaces.
- Subtle borders.
- Sophisticated text contrast.
- Carefully controlled shadows.
- Blue brand accents.

Avoid making every section a white card.

Use background hierarchy to visually organize the interface.

## Dark theme

Create a genuinely designed dark mode, not an inverted light theme.

Use:

- Deep charcoal backgrounds.
- Distinct surface elevations.
- Carefully selected neutral text colors.
- Subtle borders.
- Accessible blue accents.
- Adjusted red accents.
- Readable charts and tables.

Every component must have proper light and dark variants.

Do not use pure black everywhere.

## Typography system

Use Geist as the primary font family.

Create reusable typography tokens:

- Display.
- Heading 1.
- Heading 2.
- Heading 3.
- Heading 4.
- Body Large.
- Body Medium.
- Body Small.
- Label.
- Caption.
- Overline.
- Numeric / Data.

Use suitable font weights and line heights.

Apply tabular numerals to financial figures, counts, dates and operational metrics where useful.

Maintain readable typography throughout tables and complex data screens.

# 5. GRID AND SPACING SYSTEM

This foundation is mandatory.

## Responsive grid

Desktop:
- 12-column grid.

Tablet:
- 8-column grid.

Mobile:
- 4-column grid.

## Fluid layout

Use a fluid full-width application layout.

Do not force the entire product into a fixed-width centered container.

Use responsive page margins and meaningful content constraints.

## Desktop layout specifications

- Page margin: 24px.
- Column gutter: 20px.
- Default card padding: 24px.
- Base spacing: 8px.
- Default border radius: 12px.
- Comfortable information density.

## Spacing tokens

Create a consistent 8px-based spacing scale.

Suggested tokens:

- 4px: micro spacing exception.
- 8px: XS.
- 16px: SM.
- 24px: MD.
- 32px: LG.
- 40px: XL.
- 48px: 2XL.
- 64px: 3XL.
- 80px: 4XL.

Use 4px micro adjustments only when necessary for optical alignment or compact controls.

Never introduce arbitrary spacing values without a design-system reason.

## Responsive adjustments

Tablet:
- Page margins around 20px.
- Card padding around 20px.
- Adapt grid layouts based on available space.

Mobile:
- Page margins around 16px.
- Card padding around 16px.
- Stack multi-column content.
- Convert complex tables into responsive data presentations.
- Keep important actions accessible.

# 6. GHOST DESIGN SYSTEM

Build Ghost as the single source of truth for the entire product.

It must be modular, reusable, documented and scalable.

## Recommended design-system file structure

00 — Cover
01 — Design Principles
02 — Foundations
03 — Color Foundations
04 — Color Variables
05 — Semantic Tokens
06 — Typography
07 — Spacing
08 — Grid and Layout
09 — Border Radius
10 — Borders and Elevation
11 — Iconography
12 — Illustrations
13 — Component Library
14 — Form Components
15 — Navigation Components
16 — Data Display Components
17 — Feedback Components
18 — Overlay Components
19 — Charts and Analytics
20 — Tables and Lists
21 — Patterns
22 — Templates
23 — Page Layouts
24 — Component Playground
25 — Documentation
26 — Changelog

## Component architecture

Every component should have:

- A clear name.
- A reusable structure.
- Variants.
- States.
- Size options where applicable.
- Light and dark theme support.
- Responsive behaviour.
- Accessibility considerations.
- Consistent spacing.
- Documented usage rules.

Create components using atomic and compositional design principles.

Avoid unnecessary component duplication.

## Required components

### Buttons

- Primary.
- Secondary.
- Tertiary.
- Ghost.
- Destructive.
- Icon button.
- Button with dropdown.
- Split button.
- Loading button.

States:
Default, Hover, Focus, Active, Disabled, Loading.

Sizes:
Small, Medium, Large.

### Form elements

- Text input.
- Number input.
- Search input.
- Textarea.
- Select.
- Multi-select.
- Autocomplete.
- Date picker.
- Date range picker.
- Time picker.
- Currency input.
- Percentage input.
- Checkbox.
- Radio.
- Toggle.
- File upload.
- Searchable dropdown.

Include validation messages, helper text, required indicators and error states.

### Navigation

- Primary sidebar.
- Collapsed sidebar.
- Nested navigation.
- Breadcrumbs.
- Tabs.
- Sub-navigation.
- Top navigation.
- Pagination.
- Stepper.
- Context menu.
- Dropdown menu.

### Data components

- Data table.
- Status badge.
- Metric card.
- Summary card.
- Activity timeline.
- Progress indicator.
- Avatar.
- Customer information block.
- Vehicle information block.
- Financial summary.
- Empty state.
- Loading skeleton.
- Tooltip.
- Chart container.

### Feedback and overlays

- Modal.
- Confirmation dialog.
- Drawer.
- Popover.
- Toast notification.
- Alert banner.
- Inline validation.
- Loading indicator.
- Success state.
- Error state.

## Component quality

Do not create components only for visual appearance.

Define actual component behaviour.

For example, a data table must support sorting, filtering, row actions, loading, empty states and pagination where relevant.

# 7. ERP APPLICATION ARCHITECTURE

Create a clear information architecture for the complete Ghost Garage ERP.

The primary navigation should use a collapsible left sidebar.

### Navigation structure

1. Overview
2. CRM
   - Customers
   - Customer Groups
   - Customer Follow-ups
   - Service Reminders

3. Vehicles
   - All Vehicles
   - Vehicle Categories
   - Vehicle History

4. Workshop
   - Service Orders
   - Appointments
   - Inspections
   - Estimates
   - Quality Checks
   - Vehicle Delivery

5. Inventory
   - Inventory Overview
   - Spare Parts
   - Categories
   - Stock Movements
   - Stock Adjustments
   - Stock Transfers
   - Low Stock
   - Inventory Valuation

6. Procurement
   - Purchase Orders
   - Create Purchase Order
   - Suppliers
   - Goods Receiving
   - Purchase Returns

7. Finance
   - Invoices
   - Payments
   - Expenses
   - Receivables
   - Financial Summary

8. Workforce
   - Staff
   - Technicians
   - Roles and Permissions
   - Attendance
   - Workshop Bays
   - Task Assignments

9. Reports and Analytics
   - Business Overview
   - Revenue
   - Service Performance
   - Customer Analytics
   - Inventory Analytics
   - Technician Performance
   - Financial Reports

10. Branch Management
    - Branches
    - Branch Performance
    - Inter-branch Operations

11. Settings
    - General Settings
    - Garage Profile
    - Business Settings
    - Tax and Invoice Settings
    - Notifications
    - Integrations
    - User Management
    - Audit Logs

Adapt the exact navigation grouping if necessary for better usability, but retain all important business capabilities.

# 8. GLOBAL ERP APPLICATION SHELL

Design a consistent application shell shared across ERP screens.

## Left sidebar

Use a collapsible sidebar.

Suggested desktop dimensions:

- Expanded width: approximately 264px.
- Collapsed width: approximately 72px.

Include:

- Ghost logo.
- Current garage or branch selector.
- Navigation groups.
- Active navigation indicators.
- Collapsed icon mode.
- Tooltips for collapsed navigation.
- User profile and account access at the bottom.
- Responsive sidebar behaviour.

## Top navigation

Include:

- Breadcrumbs.
- Page title where appropriate.
- Global search.
- Quick-create action.
- Notifications.
- Help and support.
- Theme switcher.
- User profile.

Avoid cluttering the header.

## Global search

Design a useful global search experience.

Search across:

- Customers.
- Vehicles.
- Service orders.
- Invoices.
- Estimates.
- Purchase orders.
- Inventory items.

Show grouped search results and relevant metadata.

## Global action patterns

Create consistent patterns for:

- Add new customer.
- Register vehicle.
- Create service order.
- Create estimate.
- Generate invoice.
- Create purchase order.
- Add inventory.
- Receive stock.

# 9. COMPLETE ERP MODULE DESIGN REQUIREMENTS

Design all the following modules with consistent layouts and reusable components.

Each important module should include:

1. Main listing screen.
2. Detail/profile screen.
3. Create screen or form.
4. Edit experience.
5. Empty state.
6. Loading state.
7. Error state.
8. Search and filtering.
9. Relevant actions.
10. Confirmation and feedback states.

Do not make every module use an identical page layout. Use consistent foundations while adapting the information architecture to each workflow.

## A. Overview Dashboard

Create a powerful operational dashboard for garage owners and managers.

Include relevant metrics such as:

- Total revenue.
- Today's revenue.
- Active service orders.
- Vehicles currently in workshop.
- Pending estimates.
- Pending customer approvals.
- Pending payments.
- Monthly expenses.
- Available stock.
- Low stock alerts.
- Technician productivity.

Include useful visualizations:

- Revenue trends.
- Service order trends.
- Service category breakdown.
- Payment status.
- Workshop utilization.
- Technician performance.

Include operational sections:

- Recent service orders.
- Upcoming appointments.
- Pending approvals.
- Critical inventory alerts.
- Recent activity.
- Tasks requiring attention.

Allow date filters and branch-level filters.

Do not fill the dashboard with meaningless KPI cards.

Prioritize information that helps a garage owner decide what needs attention.

## B. CRM — Customers

Create a complete customer management experience.

Customer listing:
- Customer name.
- Customer ID.
- Contact information.
- Linked vehicles.
- Total visits.
- Lifetime spending.
- Last visit.
- Customer type.
- Customer status.

Customer profile:
- Basic information.
- Contact details.
- Linked vehicles.
- Service history.
- Invoices.
- Payment history.
- Estimates.
- Complaints and feedback.
- Customer notes.
- Communication history.
- Upcoming service reminders.

Support adding a new vehicle and linking an existing vehicle to a customer.

A vehicle should be linked to the correct customer without creating unnecessary duplicate records.

## C. Vehicles

Create a vehicle-centric experience.

Vehicle listing:
- Registration number.
- Make and model.
- Variant.
- Fuel type.
- Year.
- Customer.
- Last service.
- Current status.

Vehicle profile:
- Vehicle identity.
- Registration details.
- Customer information.
- Vehicle specifications.
- Service history.
- Inspection history.
- Open service orders.
- Estimates.
- Invoices.
- Parts replaced.
- Odometer history.
- Warranty information.
- Uploaded documents and photographs.

Design a practical vehicle profile that allows service advisors to quickly understand a vehicle's history.

## D. Workshop — Service Orders

Create an end-to-end service order management experience.

Listing:
- Service order number.
- Customer.
- Vehicle.
- Service type.
- Assigned advisor.
- Assigned technician.
- Branch.
- Creation date.
- Expected delivery date.
- Total amount.
- Status.

Support:
- List view.
- Kanban view where appropriate.
- Advanced filters.
- Search.
- Sorting.
- Date range filters.
- Bulk actions.
- Export.

Service order details:
- Service order overview.
- Customer and vehicle information.
- Complaint details.
- Inspection results.
- Estimate.
- Customer approval.
- Assigned staff.
- Parts required.
- Labour operations.
- Service progress.
- Internal notes.
- Attachments.
- Quality check.
- Invoice.
- Payment.
- Delivery information.

Make the details page vehicle-centric while maintaining visibility of customer information.

Design status progression clearly.

## E. Inspections

Create a modern digital vehicle inspection interface.

Include:
- Inspection checklist.
- Vehicle condition.
- Inspection categories.
- Pass/fail/attention states.
- Technician observations.
- Photograph attachments.
- Recommendations.
- Priority indicators.
- Customer-facing inspection summary.

Use intuitive interaction patterns.

The inspection interface should work efficiently on both desktop and tablets.

## F. Estimates

Create a complete estimate workflow.

Include:
- Customer and vehicle details.
- Labour items.
- Spare parts.
- Quantity.
- Unit price.
- Discounts.
- Taxes.
- Subtotal.
- Grand total.
- Terms and conditions.
- Validity.
- Customer approval status.

Support editing estimates and revising versions.

Show approved, pending, rejected and expired statuses.

## G. Invoices and Payments

Design a professional financial workflow.

Invoice screen:
- Invoice number.
- Customer.
- Vehicle.
- Service order.
- Invoice date.
- Due date.
- Line items.
- Taxes.
- Discounts.
- Total amount.
- Paid amount.
- Outstanding balance.
- Payment status.

Payments:
- Payment method.
- Amount received.
- Transaction reference.
- Payment date.
- Outstanding amount.
- Refunds where applicable.

Create a professional printable invoice layout.

Do not compromise financial readability for visual decoration.

## H. Inventory Management

Create an enterprise-ready inventory module.

Include:
- Inventory overview.
- Part listing.
- Part details.
- Categories.
- SKU.
- Barcode.
- Supplier.
- Stock quantity.
- Reserved quantity.
- Available quantity.
- Purchase price.
- Selling price.
- Reorder point.
- Stock value.

Additional workflows:
- Stock adjustment.
- Stock transfer.
- Goods receiving.
- Stock return.
- Low stock alerts.
- Inventory valuation.
- Stock movement history.

Inventory status must be immediately understandable.

## I. Procurement — Purchase Orders

Create complete purchase order management.

Listing:
- PO number.
- Supplier.
- Order date.
- Expected delivery.
- Total amount.
- Branch.
- Status.

Purchase order details:
- Supplier information.
- PO items.
- SKU.
- Quantity.
- Unit price.
- Tax.
- Total.
- Receiving status.
- Payment status.
- Activity history.
- Documents.

Create:
- Manual PO creation.
- Add supplier.
- Supplier selection.
- Item selection.
- Quantity and pricing.
- Review and submission.
- Approval workflow where required.

Include goods receiving and partial receiving scenarios.

## J. Suppliers

Create supplier management.

Supplier listing:
- Supplier name.
- Contact details.
- Supplied categories.
- Total purchases.
- Outstanding balance.
- Last purchase.

Supplier profile:
- Basic information.
- Contact details.
- Purchase history.
- Purchase orders.
- Payments.
- Returns.
- Documents.
- Notes.

## K. Workforce Management

Create interfaces for managing:

- Staff.
- Technicians.
- Service advisors.
- Roles.
- Permissions.
- Attendance.
- Task assignments.
- Workload.
- Performance.
- Workshop bays.

Create technician workload views that help workshop managers assign jobs effectively.

Do not expose unnecessary sensitive employee data to unauthorized roles.

## L. Reports and Analytics

Create a professional reports module.

Include:

- Revenue reports.
- Service order reports.
- Customer reports.
- Vehicle reports.
- Technician reports.
- Inventory reports.
- Supplier reports.
- Purchase reports.
- Tax reports.
- Payment reports.
- Branch comparison reports.

Design report configuration screens with:

- Report selection.
- Date range.
- Branch.
- Filters.
- Grouping.
- Data preview.
- Export to CSV.
- Export to Excel.
- Downloadable PDF where applicable.

Reports must provide useful information, not just attractive charts.

## M. Branch Management

Support multi-branch garage operations.

Include:

- Branch overview.
- Branch performance.
- Branch employees.
- Branch inventory.
- Service order distribution.
- Revenue comparisons.
- Stock transfers.
- Branch settings.

Always make the current branch context clear.

## N. Administration and Settings

Create organized settings experiences.

Include:
- Garage information.
- Business profile.
- Logo and branding.
- Tax configuration.
- Invoice customization.
- Service categories.
- Labour categories.
- Payment methods.
- User management.
- Roles and permissions.
- Notification preferences.
- Integration settings.
- Security settings.
- Audit logs.

# 10. WEBSITE DESIGN — PUBLIC-FACING SAAS PRODUCT

Design a completely separate but visually connected public website for Ghost Garage.

The website must communicate that Ghost is a premium garage management and automotive operations platform.

It should look like a serious SaaS technology product, not a traditional garage website.

## Website pages

Create the following:

1. Home.
2. Product Overview.
3. Features.
4. Solutions.
5. Pricing.
6. About Ghost.
7. Contact.
8. Book a Demo.
9. Login / Get Started.

## Homepage structure

### Section 1 — Navigation

Include:
- Ghost logo.
- Product.
- Solutions.
- Features.
- Pricing.
- About.
- Login.
- Primary CTA: Book a Demo.

### Section 2 — Hero

Create a high-impact headline communicating the value of complete garage management.

Suggested positioning:

"Run Your Garage. Not the Chaos."

Supporting message:

"One connected platform to manage customers, vehicles, service operations, inventory, payments and business performance."

Primary CTA:
Book a Demo.

Secondary CTA:
Explore the Platform.

Show a sophisticated, realistic product dashboard preview.

The hero should instantly communicate the product's capabilities.

### Section 3 — Problem and Solution

Explain the problems garages experience:

- Disconnected systems.
- Manual operational work.
- Poor inventory visibility.
- Delayed approvals.
- Inconsistent customer communication.
- Limited business performance visibility.

Show how Ghost simplifies these workflows.

### Section 4 — Product Showcase

Feature the primary modules using actual-looking UI previews:

- Customer Management.
- Vehicle Management.
- Service Orders.
- Digital Inspection.
- Estimates and Invoices.
- Inventory.
- Purchase Orders.
- Business Analytics.

### Section 5 — Connected Workflow

Visually communicate how Ghost connects the entire workshop journey.

### Section 6 — Business Benefits

Highlight operational benefits:

- Faster workshop operations.
- Better customer visibility.
- Improved inventory control.
- Streamlined financial operations.
- Better team coordination.
- Multi-branch visibility.

Do not fabricate customer testimonials, performance statistics or certifications.

Use placeholders when verified information is not available.

### Section 7 — Analytics Preview

Show how business owners can monitor their operations through dashboards and reports.

### Section 8 — Solutions

Present suitable solutions for:

- Independent garages.
- Multi-location workshops.
- Automotive service centres.
- Large workshop operations.

### Section 9 — Pricing

Create a flexible pricing layout.

Use clearly marked sample pricing or editable placeholders if actual pricing has not been supplied.

### Section 10 — FAQ

Answer practical questions about product functionality, implementation, support and subscriptions.

### Section 11 — Final CTA

Use a strong conversion-focused section.

### Section 12 — Footer

Include:
- Company.
- Product.
- Features.
- Resources.
- Support.
- Legal.
- Social links.
- Copyright.

## Website design requirements

- Responsive desktop, tablet and mobile layouts.
- High-quality typography.
- Strong hero composition.
- Carefully controlled animation.
- Clear visual storytelling.
- Premium product screenshots.
- Consistent color usage.
- Accessible navigation.
- Performance-focused interaction patterns.
- SEO-friendly semantic structure.

Keep the marketing website distinct from the ERP application shell.

# 11. RESPONSIVE DESIGN STRATEGY

Design mobile, tablet and desktop as intentional experiences.

Do not simply shrink the desktop UI.

### Desktop

- Full sidebar.
- Complete data tables.
- Multi-column layouts.
- Advanced filtering.
- Rich dashboard visualizations.
- Persistent navigation.

### Tablet

- Collapsible navigation.
- Adapted data tables.
- Responsive cards.
- Tablet-friendly forms.
- Touch-friendly controls.
- Optimized inspection workflows.

### Mobile

- Compact navigation or mobile drawer.
- Stacked content.
- Simplified tables.
- Card-based data views where appropriate.
- Bottom-sheet interactions where useful.
- Full-width primary actions.
- Touch-friendly targets.
- Simplified forms.
- Clear status visibility.

Use practical responsive breakpoints and test layouts around:

- Mobile: below 768px.
- Tablet: 768px–1023px.
- Desktop: 1024px and above.

Do not let horizontal overflow break important workflows.

# 12. UX INTERACTION AND WORKFLOW RULES

The ERP must be designed as a functional product, not a collection of static screens.

Include:

### Table behaviour

- Search.
- Sorting.
- Filtering.
- Pagination.
- Row selection.
- Bulk actions.
- Column visibility.
- Saved views where useful.
- Responsive behaviour.
- Loading state.
- Empty state.
- Error state.

### Form behaviour

- Clear labels.
- Inline validation.
- Required fields.
- Logical grouping.
- Conditional fields.
- Helpful defaults.
- Draft states where appropriate.
- Save and cancel actions.
- Unsaved change warnings.

### Feedback

Every meaningful action must provide feedback.

Examples:

- Customer created successfully.
- Vehicle linked successfully.
- Estimate submitted.
- Estimate approved.
- Stock received.
- Invoice generated.
- Payment recorded.

Use suitable confirmation dialogs for destructive or financially significant actions.

### Status management

Define consistent lifecycle statuses.

Avoid creating different status colors for similar states across modules.

### Empty states

Empty states must explain:

1. What is missing.
2. Why it matters.
3. What action the user can take.

### Accessibility

Apply WCAG 2.2 AA principles where applicable.

Include:
- Keyboard navigation.
- Visible focus indicators.
- Accessible labels.
- Contrast compliance.
- Semantic hierarchy.
- Clear error messages.
- Suitable touch targets.

# 13. DATA VISUALIZATION

Create a consistent analytics language.

Use charts only when they help users understand data.

Include:
- Line charts.
- Bar charts.
- Stacked bar charts.
- Donut charts.
- Area charts.
- Trend indicators.
- Comparison metrics.

Every chart must have:

- A clear title.
- Meaningful labels.
- Consistent color usage.
- Relevant date filters.
- Useful tooltips.
- Empty and loading states.
- Appropriate number formatting.

Never use 3D charts or decorative graphs without meaning.

Do not rely on color alone to communicate chart information.

# 14. ICONOGRAPHY AND VISUAL ASSETS

Use a consistent modern icon system.

Recommended direction:

- Lucide-style outline icons.
- Consistent stroke weight.
- Consistent sizing.
- Clear metaphor.
- Minimal visual complexity.

Create or source appropriate automotive illustrations and visual assets.

Automotive iconography may include:

- Engine.
- Brakes.
- Battery.
- Oil filter.
- Air filter.
- Tyres.
- Suspension.
- Transmission.
- Steering.
- Vehicle inspection.
- Workshop tools.

Maintain one consistent illustration style.

Do not mix unrelated icon families.

# 15. SECURITY AND PERMISSION-AWARE DESIGN

Design security-conscious user experiences.

Support:

- Role-based access control.
- Permission-aware navigation.
- Branch-level access.
- Restricted financial actions.
- Sensitive data visibility.
- Session states.
- Confirmation for destructive actions.
- Audit history.
- Protected administrative screens.

Users must only see actions and data they are authorized to access.

Do not treat hidden buttons as a security mechanism. Actual authorization must be enforced by the backend.

# 16. CONTENT AND DATA REALISM

Use realistic automotive business information.

Use realistic:

- Customer names.
- Vehicle registration numbers.
- Vehicle models.
- Service order numbers.
- Spare part names.
- Suppliers.
- Financial amounts.
- Dates.
- Technician names.
- Workshop statuses.

Avoid meaningless dummy content such as "Lorem Ipsum" throughout the product.

Use Indian automotive context where relevant, including:

- INR currency formatting.
- Indian GST presentation.
- Indian vehicle registration format.
- Kilometres for odometer readings.
- DD/MM/YYYY date presentation.

Keep all data clearly fictional when used in design prototypes.

Do not invent actual Ghost customers, testimonials, business metrics or certifications.

# 17. DESIGN AND IMPLEMENTATION QUALITY RULES

Follow these rules throughout the project.

1. Build and document the Ghost foundations before designing the full application.
2. Establish a consistent global layout.
3. Reuse components instead of recreating them.
4. Use semantic design tokens.
5. Maintain consistent hierarchy.
6. Design complete workflows, not isolated screens.
7. Make every interactive element meaningful.
8. Include responsive behaviour.
9. Support both light and dark themes.
10. Avoid unnecessary visual complexity.
11. Preserve data relationships across modules.
12. Prioritize operational usability.
13. Keep forms and tables efficient.
14. Make the system scalable to additional modules and branches.
15. Do not create fake functionality or misleading interactions.

If implementing in code, use the existing project's technology stack unless there is a compelling technical reason not to.

Use maintainable component architecture, reusable primitives, type-safe data models and appropriate form validation.

Do not introduce unnecessary dependencies.

Do not store secrets in client-side code.

Do not expose sensitive customer, employee or financial data through public interfaces.

If the actual backend is not connected, use clearly identified mock data and avoid pretending that operations are persistent.

# 18. EXECUTION PLAN

Do not attempt to design everything randomly in one step.

Execute the project in clearly defined phases.

## PHASE 0 — DISCOVERY AND AUDIT

Inspect all materials supplied with this task.

If existing Ghost project files, code, screenshots or designs are available:

- Understand the current product functionality.
- Identify all available modules.
- Understand data relationships.
- Identify important workflows.
- Review existing assets.
- Identify any existing technical constraints.

The purpose of this audit is to understand product requirements and preserve business logic.

IMPORTANT:

The requested design is entirely new.

Do not copy the old visual style, page layouts, component styling or outdated interface patterns.

Treat supplied materials as a source of product knowledge and functionality, not as visual restrictions.

If a file, repository or integration is inaccessible, state that clearly. Never pretend you have inspected materials that you could not access.

## PHASE 1 — INFORMATION ARCHITECTURE

Create:

- Complete sitemap.
- ERP module hierarchy.
- Role-based navigation.
- Page inventory.
- Core user journeys.
- Workflow diagrams.
- Important data relationships.

Ensure no major business operation is forgotten.

## PHASE 2 — GHOST DESIGN SYSTEM

Build:

- Brand foundations.
- Color palette.
- Semantic tokens.
- Light theme.
- Dark theme.
- Typography.
- Spacing.
- Grid.
- Elevation.
- Radius.
- Iconography.
- Component library.

Create a component playground and document component variants and states.

Do not start designing hundreds of individual screens before establishing consistent design foundations.

## PHASE 3 — GLOBAL APP SHELL

Design:

- Sidebar.
- Topbar.
- Breadcrumbs.
- Global search.
- Global actions.
- Notification system.
- User menu.
- Theme switching.
- Responsive navigation.

Validate the shell before proceeding.

## PHASE 4 — CORE ERP MODULES

Build modules in this order:

1. Overview.
2. Customers.
3. Vehicles.
4. Service Orders.
5. Inspections.
6. Estimates.
7. Invoices and Payments.
8. Inventory.
9. Purchase Orders.
10. Suppliers.
11. Workforce.
12. Reports.
13. Branch Management.
14. Settings.

Make sure related modules connect naturally.

## PHASE 5 — MARKETING WEBSITE

Build the complete public-facing website.

Establish a clear brand experience while reusing relevant Ghost foundations.

Do not make the marketing website look like the ERP dashboard.

## PHASE 6 — RESPONSIVE EXPERIENCE

Validate desktop, tablet and mobile layouts.

Test important forms, tables, navigation and operational workflows.

## PHASE 7 — DESIGN QA

Perform a comprehensive quality review.

Check:

- Visual consistency.
- Token usage.
- Typography.
- Spacing.
- Alignment.
- Color contrast.
- Responsiveness.
- Navigation.
- Accessibility.
- Table usability.
- Form behaviour.
- Empty states.
- Error states.
- Dark mode.
- Interaction feedback.
- Cross-module consistency.

Fix inconsistencies before declaring the work complete.

# 19. EXPECTED DELIVERABLES

The finished project must include:

### Design system

- Ghost documentation.
- Foundation tokens.
- Color variables.
- Light and dark themes.
- Typography system.
- Spacing system.
- Grid system.
- Reusable components.
- Component variants.
- Component states.

### Website

- Complete responsive marketing website.
- All primary marketing pages.
- Product showcases.
- Conversion sections.
- Responsive navigation.
- Footer.

### ERP

- Complete ERP information architecture.
- Global application shell.
- All specified modules.
- Listing screens.
- Detail screens.
- Create and edit screens.
- Operational workflows.
- Reports and analytics.
- Responsive layouts.

### Documentation

- Sitemap.
- Page inventory.
- Interaction specifications.
- Component documentation.
- Responsive rules.
- Design decisions.
- Outstanding assumptions.

# 20. FINAL QUALITY STANDARD

The product must feel like a premium automotive SaaS platform built by an experienced enterprise product team.

The marketing website must communicate trust, capability and sophistication.

The ERP must feel powerful without becoming complicated.

The design system must be coherent enough to support years of product expansion.

Every screen must look like part of the same product.

Every interaction must have a clear purpose.

Every important business workflow must be accounted for.

Prioritize real operational problems over visual trends.

Do not sacrifice usability for aesthetics.

Do not stop after creating a beautiful dashboard homepage.

A complete product means the website, ERP modules, detailed screens, reusable design system and connected workflows must all be considered.

---

# YOUR FIRST ACTION

Start with PHASE 0 and PHASE 1.

First, inspect all available materials and establish a complete understanding of Ghost Garage.

Then produce:

1. Product architecture.
2. Complete sitemap.
3. ERP module structure.
4. User roles and permissions matrix.
5. Main operational workflow map.
6. Page inventory.
7. Recommended design-system architecture.

Present the findings and design decisions clearly.

Then proceed through the phases in order, maintaining consistency with the approved foundations and the requirements in this document.

Do not silently remove modules or simplify important business workflows.

When important information is genuinely unavailable, make a clearly documented, reasonable assumption and continue wherever possible.

**Final objective: Build Ghost into a complete, premium, modern and scalable Garage ERP ecosystem powered by Ghost.**

**Brand:** Ghost  
**Design System:** Ghost  
**Tagline:** Run Your Garage. Not the Chaos.