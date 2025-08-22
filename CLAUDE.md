# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
```bash
npm start        # Run dev server on http://localhost:4200 with hot reload
ng serve         # Alternative command for dev server
```

### Build Commands
```bash
npm run build    # Production build to dist/projet-dropdown
ng build --watch --configuration development  # Development build with file watching
```

### Testing
```bash
npm test         # Run unit tests with Karma
ng test          # Alternative command for unit tests
ng test --watch=false --code-coverage  # Single run with coverage report
```

### Generate Components and Services
```bash
ng generate component components/[name] --style=scss
ng generate service services/[name]
ng generate directive directives/[name]
ng generate module modules/[name]
```

## Architecture Overview

### Project Structure
This is an Angular 20 demo application showcasing custom UI components and advanced Angular patterns. Key architectural decisions:

- **Standalone Components**: Uses Angular's standalone component architecture (no NgModule-based approach)
- **Custom Component Prefix**: Uses `c3` prefix for components (configured in angular.json)
- **Styling**: SCSS with Tailwind CSS integration and custom theme variables
- **SSR Support**: Server-side rendering configured with Angular Universal

### Module Organization

The application is organized into self-contained feature modules for reusability:

#### Core Modules (`src/app/modules/`)
- **dropdown**: Custom dropdown implementation with directives and services
- **overlay**: Overlay system for modals and popups using CDK-like patterns
- **dragDrop**: Drag and drop functionality with custom directives
- **sortableList**: Sortable list implementation with drag-and-drop reordering
- **autocomplete**: Custom autocomplete component with options
- **snackbar**: Toast notification system
- **scrollDispatcher**: Scroll event management service

Each module typically contains:
- Service for state management and coordination
- Directives for behavior attachment
- Components for UI rendering
- Module file for dependency organization

### Custom Directives Pattern

The app implements several advanced directive patterns in `src/app/directives/`:
- **c3Tooltip**: Custom tooltip directive
- **onDrag**: Drag behavior directive
- **onScrollEnd**: Scroll end detection

### Layout System

Two main layouts in `src/app/layouts/`:
- **DefaultLayout**: Main application layout with sidebar navigation
- **HomeLayout**: Specific layout for the home page

### Routing Architecture

- Routes defined in `app.routes.ts` using Angular's new routing API
- All routes are children of `DefaultLayoutComponent`
- Each route has associated title metadata for navigation

### State Management Patterns

- **Service-based State**: Each module uses services for state management (e.g., `dropdown.service.ts`, `overlay.service.ts`)
- **Dependency Injection**: Heavy use of Angular DI for service coordination
- **Observable Patterns**: RxJS for reactive state and event handling

### Component Communication

- **Content Projection**: Extensive use in components like menu-coulant
- **Template References**: Used for dynamic content insertion
- **ViewChild/ContentChild**: For parent-child component interaction
- **Custom Events**: Output decorators for component communication

### Animation System

Custom animations defined in `src/app/pages/animation-example/animations/`:
- Expansion animations
- Translation animations
- Integrated with Angular Animations API

### TypeScript Configuration

- **Strict Mode**: Disabled (`strict: false` in tsconfig.json)
- **Angular Compiler Options**: Strict template checking enabled
- **Target**: ES2022 with module bundler resolution

## Important Patterns and Conventions

### Component Structure
Components follow a consistent structure:
- HTML template for markup
- SCSS file for component-specific styles
- TypeScript file with component logic
- Optional spec file for tests

### Service Patterns
Services typically manage:
- Component registration and coordination
- State management for feature modules
- Observable streams for reactive updates

### Directive Usage
Custom directives are used extensively for:
- DOM manipulation
- Event handling
- Behavior attachment to elements

### Style Organization
- Global styles in `src/styles.scss` and `src/styles/` directory
- Component-specific styles use ViewEncapsulation
- Tailwind utilities available globally
- Custom SCSS partials for themes and utilities

## Key Dependencies

- **Angular 20**: Latest Angular version with standalone components
- **Tailwind CSS**: Utility-first CSS framework
- **ngx-highlight-js**: Code syntax highlighting
- **Express**: SSR server implementation
- **RxJS**: Reactive programming library