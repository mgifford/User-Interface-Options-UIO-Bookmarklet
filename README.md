# UIO+ Accessibility Bookmarklet

This project provides a lightweight accessibility bookmarklet inspired by the [UIO+ (User Interface Options Plus)](https://github.com/fluid-project/uio-plus) browser extension and [Fluid UI Preferences Framework](https://github.com/fluid-project/infusion). The bookmarklet offers essential accessibility enhancements that work across different browsers.

## Currently Implemented Features

The bookmarklet currently provides the following accessibility enhancements:

1. Text Customization:
   - Text Size: Adjust text size from 100% to 200%
   - Line Spacing: Toggle increased line spacing for better readability

2. Visual Adjustments:
   - High Contrast Mode: Toggle high contrast mode with white text on black background
   - SVG and Image Handling: Proper contrast adjustments for both vector and raster images

3. Page Simplification:
   - Reading Mode: Hide distracting content and focus on main content
   - Table of Contents: Generate an automatic table of contents from page headings

4. User Interface:
   - Customizable Icon Position: Choose from top-left, top-right, bottom-left, or bottom-right
   - Persistent Settings: Save preferences using localStorage
   - Keyboard Access: Toggle controls with Alt+A
   - Reset Button: Restore default settings

## Technical Details

The bookmarklet is implemented as a self-contained JavaScript file that:

1. Injects a floating accessibility control panel
2. Uses localStorage for persistent settings across page loads
3. Implements accessibility features through dynamic CSS injection
4. Provides keyboard shortcuts for better accessibility

## Installation

The bookmarklet can be installed by dragging the link from the index.html page to your browser's bookmarks bar. It works in modern browsers including Chrome, Firefox, Safari, and Edge.

## External Resources

- [UIO+ Extension](https://github.com/fluid-project/uio-plus): The browser extension that inspired this bookmarklet
- [Fluid UI Preferences Framework](https://docs.fluidproject.org/infusion/development/tutorial-userInterfaceOptions/UserInterfaceOptions.html): Documentation on UI Options implementation
- [WCAG 2.1](https://www.w3.org/WAI/standards-guidelines/wcag/): Web Content Accessibility Guidelines that informed our implementation

## TODO Features

The following features are planned for future implementation:

1. Text Enhancements:
   - Character Spacing adjustment
   - Word Spacing control
   - Text-to-Speech functionality
   - Syllabification for complex words

2. Visual Improvements:
   - Additional color schemes beyond high contrast
   - Custom highlight colors for selected text
   - Enhanced form input visibility
   - Custom link styles

3. Navigation Enhancements:
   - Skip links for better keyboard navigation
   - Right-click text selection option
   - Enhanced keyboard shortcuts
   - Better heading navigation

4. Technical Improvements:
   - Better error handling for localStorage
   - Support for synchronized settings across tabs
   - Performance optimization for large pages
   - Enhanced Table of Contents with collapsible sections

5. Accessibility Improvements:
   - ARIA live regions for important updates
   - Better screen reader support
   - Focus management improvements
   - Enhanced keyboard navigation patterns
