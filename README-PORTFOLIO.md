# Thanas R - macOS Portfolio Website 🚀

A stunning, interactive portfolio website that recreates the macOS desktop experience in the browser. Built with React, TypeScript, and modern web technologies.

## ✨ Features

### 🖥️ macOS Desktop Experience
- **Authentic macOS UI**: Frosted glass effects, rounded corners, and smooth animations
- **Menu Bar**: Live clock, system icons, and app title display
- **Draggable Windows**: Click and drag windows anywhere on the screen
- **Resizable Windows**: Resize from bottom-right corner
- **Traffic Light Controls**: Red (close), yellow (minimize), green (maximize)
- **Window Management**: Z-index stacking, focus management, minimize to dock

### 🎨 Customization
- **3 Beautiful Wallpapers**: Ocean waves, purple nebula, mountain sunset
- **Light/Dark Theme**: Switch between light and dark modes
- **Dock Settings**: Auto-hide toggle and magnification slider (0-100%)
- **Reduced Motion**: Accessibility option to minimize animations
- **Settings Persistence**: All preferences saved to localStorage
- **Import/Export**: Save and load your settings as JSON

### 📱 Apps Included
1. **About Me** - Personal bio, education, and stats
2. **Technologies** - Tech stack with proficiency levels
3. **Projects** - Portfolio of projects with links
4. **Journey** - Interactive timeline of milestones
5. **GitHub** - Live GitHub stats and repositories
6. **LinkedIn** - Professional profile summary
7. **Contact** - Contact form with social links
8. **Settings** - System preferences customization

### 🎯 Interactions
- **Dock Magnification**: Hover over dock icons for smooth scaling
- **Keyboard Shortcuts**: 
  - `Esc` - Close focused window
- **Active Indicators**: Dots under running apps in dock
- **Smooth Animations**: Spring physics and GPU-accelerated transforms
- **Responsive Design**: Mobile fallback (work in progress)

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Context API** - State management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

The app will be available at `http://localhost:8080`

## 📝 Customization Guide

### Update Personal Information

1. **About Me** (`src/components/apps/AboutApp.tsx`)
   - Edit name, age, education, bio
   - Update stats (years coding, projects, etc.)

2. **Technologies** (`src/components/apps/TechnologiesApp.tsx`)
   - Modify technology arrays with your skills
   - Adjust proficiency percentages
   - Update "Currently Learning" tags

3. **Projects** (`src/components/apps/ProjectsApp.tsx`)
   - Edit the `projects` array
   - Add your own projects with descriptions, tags, and links

4. **Journey** (`src/components/apps/JourneyApp.tsx`)
   - Update `milestones` array with your timeline
   - Change dates, titles, descriptions, and icons

5. **GitHub** (`src/components/apps/GitHubApp.tsx`)
   - Change the `username` variable to your GitHub username
   - GitHub API will automatically fetch your repos

6. **LinkedIn** (`src/components/apps/LinkedInApp.tsx`)
   - Update profile URL and personal information

7. **Contact** (`src/components/apps/ContactApp.tsx`)
   - Update email and social media links
   - Connect form to your backend (currently simulated)

### Add More Wallpapers

1. Add image to `src/assets/` (e.g., `wallpaper-4.jpg`)
2. Import in `src/components/macos/Desktop.tsx`
3. Add to `wallpapers` object
4. Add to settings in `src/components/apps/SettingsApp.tsx`

### Add New Apps

1. Create component in `src/components/apps/YourApp.tsx`
2. Add to apps array in `src/pages/Index.tsx`:

\`\`\`typescript
{
  id: 'your-app',
  name: 'Your App',
  icon: '🎯',
  component: YourApp,
  defaultSize: { width: 800, height: 600 },
  minSize: { width: 600, height: 400 },
}
\`\`\`

## 🎨 Design System

All colors use semantic HSL tokens defined in `src/index.css`:

- `--primary` - Brand blue
- `--accent` - Accent color
- `--background` - Page background
- `--foreground` - Text color
- `--macos-glass` - Frosted glass effect
- `--macos-traffic-*` - Traffic light colors

### Theme Customization

Edit HSL values in `src/index.css` under `:root` (light) and `.dark` (dark mode).

## 📱 Responsive Design

Currently optimized for desktop. Mobile improvements coming soon:
- Full-screen app modals
- Bottom sheet navigation
- Touch-friendly controls

## 🐛 Known Issues

- Resizing can be janky on slower devices
- No multi-touch gestures yet
- Settings import doesn't validate JSON structure

## 🔮 Future Enhancements

- [ ] Spotlight search (Cmd+Space)
- [ ] Launchpad grid view
- [ ] Desktop icons
- [ ] Right-click context menus
- [ ] Window snapping (split view)
- [ ] Multiple desktops/spaces
- [ ] Notification center
- [ ] Sound effects (with mute toggle)
- [ ] Full mobile responsive design
- [ ] PWA support

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Credits

- Design inspired by macOS Big Sur/Monterey
- Built with ❤️ by Thanas R
- Icons from Lucide React
- UI components from shadcn/ui

## 📞 Contact

- **GitHub**: [github.com/Thanas-R](https://github.com/Thanas-R)
- **LinkedIn**: [linkedin.com/in/thanasr](https://www.linkedin.com/in/thanasr/)
- **Email**: Click the Contact app!

---

Made with React ⚛️ and lots of ☕
