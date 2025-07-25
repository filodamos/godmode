# Godmode VSCode Extension

An emacs-inspired modal editing extension for VSCode that provides efficient cursor movement without typing.

## Features

- **Modal editing mode**: Toggle between normal typing and movement-only mode
- **Visual feedback**: Status bar indicator shows current mode with cursor style changes
- **Efficient navigation**: Use single keys for cursor movement
- **Typing prevention**: Automatically prevents typing in godmode
- **Cursor styling**: Different cursor styles for each mode (block vs line)

## Usage

### Activating/Deactivating Godmode

- Press `Escape` to toggle godmode on/off
- The status bar will show:
  - `○ Normal` when godmode is off (normal typing) - block cursor
  - `● Godmode` when godmode is on (movement only) - line cursor
  - `☑ Select Mode` when in select mode - line cursor

### Movement Commands (when godmode is active)

- `n` - Move cursor down
- `p` - Move cursor up  
- `f` - Move cursor forward (right)
- `b` - Move cursor backward (left)

### Select Mode Behavior

- Press `Space` to enter select mode while in godmode
- Select mode automatically exits when:
  - You start typing
  - You copy text with Alt+W
  - You press `Escape` to exit godmode

### Setting Up Caps Lock (Optional)

Since VSCode doesn't directly support caps lock binding, you can manually bind the toggle command:

1. Open VSCode settings (`Cmd+,`)
2. Search for "keyboard shortcuts"
3. Click "Open Keyboard Shortcuts (JSON)"
4. Add this binding:
```json
{
    "key": "capslock",
    "command": "godmode.toggle",
    "when": "editorTextFocus"
}
```

Note: This may require system-level configuration depending on your OS.

## Development

To test the extension:

1. Open this project in VSCode
2. Press `F5` to launch Extension Development Host
3. Test the functionality in the new window

## Commands

- `godmode.toggle` - Toggle godmode on/off
- `godmode.moveDown` - Move cursor down (n)
- `godmode.moveUp` - Move cursor up (p)
- `godmode.moveForward` - Move cursor right (f)
- `godmode.moveBackward` - Move cursor left (b)

## Keyboard Shortcuts

- `Escape` - Toggle godmode
- `Space` - Toggle select mode (when godmode active)
- `n` - Move down (when godmode active)
- `p` - Move up (when godmode active)  
- `f` - Move right (when godmode active)
- `b` - Move left (when godmode active)
- `Alt+W` - Copy and exit select mode (when godmode active)



## Installation

1. Package the extension: `npm run package`
2. Install the generated `.vsix` file in VSCode

---

*Inspired by emacs godmode for efficient modal editing in VSCode.*
