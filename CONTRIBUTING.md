# Contributing to ThanasOS

Thank you for your interest in contributing to ThanasOS.

ThanasOS is a browser-based macOS-style operating system built using React, TypeScript, and Vite. The primary goal of this project is to recreate the macOS experience as closely as possible inside the browser, including its interactions, animations, windowing system, and overall user experience. The project is experimental and actively evolving.

Contributions are welcome in all areas including bug fixes, performance improvements, UI/UX enhancements, new features, and documentation.

## Getting Started

### 1. Fork the repository
Create a fork of the repository on GitHub using the Fork button.

### 2. Clone your fork

```bash
git clone https://github.com/<your-username>/thanas-os.git
cd thanas-os
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will run at:
http://localhost:5173

## Contribution Workflow

### 1. Create a new branch

Always create a dedicated branch for your changes.

```bash
git checkout -b feature/your-feature-name
```

Examples:
feature/window-system-improvements  
feature/dock-refactor  
fix/spotlight-search-bug  

### 2. Make your changes

Ensure your changes align with the project's goal of closely replicating macOS behavior and design.

Guidelines:
- Maintain consistency with existing UI/UX patterns
- Avoid unrelated changes in a single pull request
- Keep code clean and readable
- Ensure changes do not break existing functionality

### 3. Commit your changes

```bash
git add .
git commit -m "short description of change"
```

Examples:
fix: improve window drag performance  
feat: enhance dock magnification behavior  
refactor: optimize window rendering system  

### 4. Push your branch

```bash
git push origin feature/your-feature-name
```

### 5. Open a Pull Request

Submit a pull request to the main repository.

Include:
- Clear description of the changes
- Reason for the changes
- Screenshots or recordings if UI behavior is affected

## Pull Request Guidelines

- Keep changes small and focused
- Do not mix multiple unrelated features in one PR
- Discuss major changes before implementation
- Ensure consistency with macOS-like behavior and aesthetics
- Avoid performance regressions

## Areas for Contribution

- Window management system improvements
- Dock behavior and animations
- Spotlight search enhancements
- UI/UX refinements to better match macOS
- Performance optimizations
- New system apps or widgets
- Accessibility improvements
- Mobile experience improvements
- Documentation improvements

## Project Goal

The long-term goal of ThanasOS is to be the most accurate and detailed macOS-like experience available in the browser. Contributions that improve realism, interaction fidelity, and system behavior are especially valuable.

## Notes

This project is in active development and is not production stable. Feedback, ideas, and discussions are welcome alongside code contributions.
