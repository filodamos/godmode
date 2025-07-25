# Change Log

All notable changes to the "godmode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.16] - 2024-12-19

### Added
- **Cursor Style Changes**: Dynamic cursor styles for different modes
  - Block cursor in normal editing modex
  - Line cursor in godmode navigation mode
  - Line cursor in select mode
- **Enhanced Visual Feedback**: Bette mode indication through cursor styling and status bar indicators

## [0.1.19] - 2024-12-19

### Changed
- **Removed cursor color changes**: Cursor colors no longer change when switching modes
- **Kept cursor style changes**: Cursor still switches between block (normal) and line (godmode/select) styles
- **Simplified configuration**: Removed `godmode.cursorColors` setting

## [0.1.20] - 2024-12-19

### Added
- **Auto-exit select mode**: Select mode now automatically exits when copying (Ctrl+C) or cutting (Ctrl+X) text
- **Enhanced user experience**: More intuitive behavior when working with selections

### Improved
- Select mode behavior is now more consistent with standard text editor expectations

## [0.1.21] - 2024-12-19

### Added
- **Alt+W Copy Functionality**: Added Alt+W keybinding to copy and automatically exit select mode
- **Emacs-MCX Integration**: Alt+W now uses `emacs-mcx.copyRegion` for consistent Emacs-style copying

### Improved
- **Enhanced Kill/Yank Commands**: Made killRegion, killLine, and yank commands async and added proper status bar updates
- **Better State Management**: Improved select mode state handling across all text manipulation commands

### Technical
- Simplified copy/cut implementation using custom commands instead of clipboard event listeners
- Better async/await handling for command execution

## [0.1.22] - 2024-12-19

### Added
- **Automatic Select Mode Exit**: Added text document change listener that automatically exits select mode when any text changes occur
- **Enhanced User Experience**: Select mode now exits on typing, pasting, deletions, and any other text modifications

### Changed
- **Simplified Kill/Yank Commands**: Removed manual select mode exits from killRegion, killLine, and yank commands since text changes now handle this automatically
- **Streamlined State Management**: Text document change listener now handles select mode state transitions consistently

### Improved
- **More Intuitive Behavior**: Users can enter select mode, make selections, and start editing without manually exiting select mode
- **Consistent State Handling**: All text editing operations now automatically exit select mode through the document change listener

## [Unreleased]

- Initial release