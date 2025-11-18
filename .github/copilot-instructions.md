# AI Coding Agent Instructions for Netflix Portfolio

## Project Overview
Single-page portfolio website with Netflix-inspired dark theme and cinematic design. Pure HTML/CSS/JavaScript (no build tools or frameworks). All code lives in `Index.html` with embedded styles and vanilla JS.

## Architecture & Key Components

### 1. **Visual Design System**
- **Brand Color**: Netflix red (`#e50914`) used for accents, buttons, and highlights
- **Base Theme**: Dark mode (`#141414` background, `#fff` text)
- **Typography**: 'Netflix Sans' fallback to Helvetica/Arial; 'Bebas Neue' for headers (loaded from Google Fonts)
- **Consistency**: All interactive elements, borders, and hover states should maintain Netflix red accent color

### 2. **Three.js Animation Canvases**
Two separate animated particle backgrounds using Three.js (CDN loaded):

- **Hero Canvas** (`#hero-canvas`): Large 3000-particle system with mouse tracking
  - Color: Netflix red particles with additive blending
  - Interaction: Rotates and translates based on mouse position (smooth smoothing factor 0.05)
  - Resize handler updates camera/renderer on window resize
  
- **Chatbot Canvas** (`#chatbot-canvas`): Smaller 500-particle system for chat header
  - Color: White particles (0xffffff)
  - Scoped to chatbot container positioning
  - Lazy-initialized on first chatbot open (`chatbot.dataset.initialized`)

**Pattern**: Both follow same Three.js setup (Scene → Camera → WebGLRenderer → Particles → Animation Loop)

### 3. **Page Structure & Navigation**
Single-page app with four main views (managed via `showSection()` function):
1. **Home/Hero** - Initial view with CTAs
2. **Projects** - Card-based layout with horizontal scrolling rows
3. **Resume** - Text-based experience/education/skills
4. **Contact** - Form with email validation

Navigation via `onclick="showSection()"` handlers. Hero hidden when any section active.

### 4. **Chatbot System**
Interactive chat interface using Claude API (Anthropic endpoint: `https://api.anthropic.com/v1/messages`):
- **Trigger**: Floating red button (bottom-right, fixed position)
- **Features**:
  - System prompt provides portfolio context (skills, experience, projects)
  - Local pattern matching for common greetings (hi/hello/thanks/bye)
  - Typing indicator animation (3 dots bouncing)
  - Message flow with avatar icons (🤖 for bot, 👤 for user)
  - Auto-scroll to latest message
  - Navigation trigger: detects contact-related requests and can navigate to contact section

**Important**: Claude API requires access key. Currently uses placeholder `YOUR_API_KEY` structure.

### 5. **Contact Form Integration**
Two-tier submission strategy:
1. **Primary**: Web3Forms API (`https://api.web3forms.com/submit`) - requires free access key from web3forms.com
2. **Fallback**: `mailto:` link when API unavailable (graceful degradation)

Form submission shows loading state and provides user feedback (success/error/fallback messages).

## Critical Developer Workflows

### Adding/Editing Content
- All content in single HTML file → simple to deploy but requires careful section management
- **Projects**: Edit card divs in `#projects-section` (keep min-width: 280px for scrolling layout)
- **Resume**: Update `#resume-section` text directly (maintains styling via `.resume-section`, `.resume-item` classes)
- **Contact**: Update email/links at bottom of contact section; form integrates with Web3Forms API

### Modifying Styles
- All CSS embedded in `<style>` tag (easy to modify, no external sheet)
- **Media query**: Single breakpoint at `768px` for mobile responsiveness
- **Color scheme**: Search `#e50914` for Netflix red and `#141414` for background - maintain consistency

### Testing Interactions
- **Canvas animations**: Open DevTools, check WebGL renderer (three.js uses GPU)
- **Chatbot**: Toggle with floating button, test with local pattern responses first (no API key needed)
- **Contact form**: Test Web3Forms integration by providing valid access key, otherwise fallback to mailto works

### Deployment Notes
- No build step required - serve `Index.html` directly as static site
- External dependencies: Three.js via CDN, Google Fonts, Claude API (requires key), Web3Forms API (requires key)
- Sensitive keys should NOT be hardcoded - use environment or backend proxy

## Project-Specific Patterns

### Event Handling Pattern
Uses inline `onclick` handlers throughout (Netflix Portfolio style):
```html
<a onclick="showSection('projects')">Projects</a>
<button class="btn btn-primary" onclick="showSection('projects')">View Projects</button>
```
All navigation and form submissions use this direct handler approach.

### Section Toggle Pattern
The `showSection()` function:
1. Hides hero element
2. Removes `.active` class from all content sections
3. Adds `.active` class to target section
4. Forces scroll to top with multiple fallbacks (Safari/Chrome/Firefox compatibility)

### Message System Pattern
Chatbot uses three message handlers:
- `addMessage(content, isUser)` - adds styled message with avatar
- `showTypingIndicator()` / `removeTypingIndicator()` - shows/hides loading state
- `sendMessage()` - validates input, checks patterns, calls API with fallback

### Particle System Pattern
Both Three.js canvases follow:
1. Create BufferGeometry with random positions
2. Create PointsMaterial with color/opacity/blending
3. Create Points mesh and add to scene
4. Animation loop updates rotation based on mouse X/Y
5. Request mouse events to calculate target positions with smooth interpolation

## Cross-Component Communication
- **No state management library** - uses DOM and global variables
- **Navbar scroll effect**: Listens to `window.scroll` event, adds `.scrolled` class to nav
- **Chatbot visibility**: Tracked via `isChatbotOpen` boolean, toggled by button
- **Message scrolling**: Parent container scrolls to `scrollHeight` after each message added

## External Integrations

### Required Setup Steps
1. **Claude API**: Get key from https://console.anthropic.com/
   - Replace `'YOUR_API_KEY'` placeholder in chatbot fetch call
   - Model: `claude-sonnet-4-20250514`
   
2. **Web3Forms**: Get access key from https://web3forms.com/
   - Replace `'YOUR_WEB3FORMS_ACCESS_KEY'` in contact form handler
   - Fallback to mailto when unavailable

3. **Google Fonts**: Preconnect links already in `<head>` - no additional setup

## Testing Checklist for AI Agents
- [ ] Hero canvas renders without errors (check Console for WebGL warnings)
- [ ] Mouse tracking works smoothly (no lag in particle rotation)
- [ ] Section navigation works (all four sections accessible and scroll resets)
- [ ] Chatbot opens/closes smoothly with canvas initialization
- [ ] Responsive design at 768px breakpoint (test mobile view)
- [ ] Contact form fallback works (even without API keys configured)
- [ ] No console errors from Three.js or missing resources

## Files & References
- `Index.html` - Complete application (only source file)
- `.github/copilot-instructions.md` - This file
- `README.md` - Project introduction
- `LICENSE` - MIT License
