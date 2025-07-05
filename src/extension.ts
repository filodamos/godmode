// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// Godmode state management
let isGodmodeActive = false;
let isSelectModeActive = false;
let statusBarItem: vscode.StatusBarItem;
let recenterState = 0; // 0 = top, 1 = center, 2 = bottom

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log("Godmode extension is now active!");

	// Create status bar item to show godmode status
	statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		100,
	);
	statusBarItem.text = "$(circle-outline) Normal";
	statusBarItem.tooltip = "Godmode Status";
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Initialize cursor style to block (normal editing mode)
	vscode.workspace
		.getConfiguration("editor")
		.update("cursorStyle", "block", true);

	// Register toggle godmode command (bound to Escape)
	const toggleGodmode = vscode.commands.registerCommand(
		"godmode.toggle",
		() => {
			// If we're in select mode, just exit select mode but keep godmode active
			if (isSelectModeActive) {
				isSelectModeActive = false;
				updateStatusBar();
				return;
			}

			// Otherwise, toggle godmode normally
			isGodmodeActive = !isGodmodeActive;

			// Reset select mode when exiting godmode
			if (!isGodmodeActive) {
				isSelectModeActive = false;
			}

			updateStatusBar();

			// Set context variable for key bindings
			vscode.commands.executeCommand(
				"setContext",
				"godmode.active",
				isGodmodeActive,
			);
		},
	);

	// Register toggle select mode command
	const toggleSelectMode = vscode.commands.registerCommand(
		"godmode.toggleSelectMode",
		() => {
			// Always enable godmode when toggling select mode
			if (!isGodmodeActive) {
				isGodmodeActive = true;
				// Set context variable for key bindings
				vscode.commands.executeCommand(
					"setContext",
					"godmode.active",
					isGodmodeActive,
				);
			}

			isSelectModeActive = !isSelectModeActive;
			updateStatusBar();
		},
	);

	// Register movement commands
	const moveDown = vscode.commands.registerCommand("godmode.moveDown", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("godmode.internal.trackMovement");
			recenterState = 0; // Reset recenter state on navigation
			if (isSelectModeActive) {
				vscode.commands.executeCommand("cursorDownSelect");
			} else {
				vscode.commands.executeCommand("cursorDown");
			}
		}
	});

	const moveUp = vscode.commands.registerCommand("godmode.moveUp", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("godmode.internal.trackMovement");
			recenterState = 0; // Reset recenter state on navigation
			if (isSelectModeActive) {
				vscode.commands.executeCommand("cursorUpSelect");
			} else {
				vscode.commands.executeCommand("cursorUp");
			}
		}
	});

	const moveForward = vscode.commands.registerCommand(
		"godmode.moveForward",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("godmode.internal.trackMovement");
				recenterState = 0; // Reset recenter state on navigation
				if (isSelectModeActive) {
					vscode.commands.executeCommand("cursorRightSelect");
				} else {
					vscode.commands.executeCommand("cursorRight");
				}
			}
		},
	);

	const moveBackward = vscode.commands.registerCommand(
		"godmode.moveBackward",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("godmode.internal.trackMovement");
				recenterState = 0; // Reset recenter state on navigation
				if (isSelectModeActive) {
					vscode.commands.executeCommand("cursorLeftSelect");
				} else {
					vscode.commands.executeCommand("cursorLeft");
				}
			}
		},
	);

	const pageDown = vscode.commands.registerCommand("godmode.pageDown", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("godmode.internal.trackMovement");
			recenterState = 0; // Reset recenter state on navigation
			if (isSelectModeActive) {
				vscode.commands.executeCommand("cursorPageDownSelect");
			} else {
				vscode.commands.executeCommand("cursorPageDown");
			}
		}
	});

	const pageUp = vscode.commands.registerCommand("godmode.pageUp", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("godmode.internal.trackMovement");
			recenterState = 0; // Reset recenter state on navigation
			if (isSelectModeActive) {
				vscode.commands.executeCommand("cursorPageUpSelect");
			} else {
				vscode.commands.executeCommand("cursorPageUp");
			}
		}
	});

	const saveFile = vscode.commands.registerCommand("godmode.saveFile", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("workbench.action.files.save");
		}
	});

	const forwardSearch = vscode.commands.registerCommand(
		"godmode.forwardSearch",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("godmode.internal.trackMovement");
				vscode.commands.executeCommand("actions.find");
			}
		},
	);

	const beginningOfLine = vscode.commands.registerCommand(
		"godmode.beginningOfLine",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("godmode.internal.trackMovement");
				recenterState = 0; // Reset recenter state on navigation
				if (isSelectModeActive) {
					vscode.commands.executeCommand("cursorHomeSelect");
				} else {
					vscode.commands.executeCommand("cursorHome");
				}
			}
		},
	);

	const endOfLine = vscode.commands.registerCommand("godmode.endOfLine", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("godmode.internal.trackMovement");
			recenterState = 0; // Reset recenter state on navigation
			if (isSelectModeActive) {
				vscode.commands.executeCommand("cursorEndSelect");
			} else {
				vscode.commands.executeCommand("cursorEnd");
			}
		}
	});

	const recenterTopBottom = vscode.commands.registerCommand(
		"godmode.recenterTopBottom",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("godmode.internal.trackMovement");
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const currentPosition = editor.selection.active;
					const range = new vscode.Range(currentPosition, currentPosition);

					// Cycle through three positions: top → center → bottom
					if (recenterState === 0) {
						// First press: scroll to top
						editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
						recenterState = 1;
					} else if (recenterState === 1) {
						// Second press: scroll to center
						editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
						recenterState = 2;
					} else {
						// Third press: scroll to bottom
						// VS Code doesn't have AtBottom, so we'll use a workaround
						const visibleRanges = editor.visibleRanges;
						if (visibleRanges.length > 0) {
							const visibleRange = visibleRanges[0];
							const linesInView =
								visibleRange.end.line - visibleRange.start.line;
							const targetLine = Math.max(
								0,
								currentPosition.line - linesInView + 1,
							);
							const targetPosition = new vscode.Position(targetLine, 0);
							const targetRange = new vscode.Range(
								targetPosition,
								targetPosition,
							);
							editor.revealRange(
								targetRange,
								vscode.TextEditorRevealType.AtTop,
							);
						}
						recenterState = 0; // Reset to top for next cycle
					}
				}
			}
		},
	);

	// Add all commands to subscriptions
	context.subscriptions.push(
		toggleGodmode,
		toggleSelectMode,
		moveDown,
		moveUp,
		moveForward,
		moveBackward,
		pageDown,
		pageUp,
		saveFile,
		forwardSearch,
		beginningOfLine,
		endOfLine,
		recenterTopBottom,
	);

	// Set up typing prevention when godmode is active
	setupTypingPrevention(context);
}

function updateStatusBar() {
	if (isGodmodeActive) {
		if (isSelectModeActive) {
			statusBarItem.text = "$(selection) Select Mode";
			statusBarItem.color = "#61dafb";
		} else {
			statusBarItem.text = "$(circle-filled) Godmode";
			statusBarItem.color = "#ff6b6b";
		}
		// Set cursor to line when in godmode (navigation mode)
		vscode.workspace
			.getConfiguration("editor")
			.update("cursorStyle", "line", true);
	} else {
		statusBarItem.text = "$(circle-outline) Normal";
		statusBarItem.color = undefined;
		// Set cursor to block when not in godmode (editing mode)
		vscode.workspace
			.getConfiguration("editor")
			.update("cursorStyle", "block", true);
	}
}

function setupTypingPrevention(context: vscode.ExtensionContext) {
	// Track if we're currently executing a movement command
	let isExecutingMovementCommand = false;

	// Register text document change listener to prevent typing in godmode and handle select mode
	const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
		if (isGodmodeActive && event.contentChanges.length > 0) {
			// If we're in select mode and this change wasn't from a movement command, exit select mode
			if (isSelectModeActive && !isExecutingMovementCommand) {
				isSelectModeActive = false;
				updateStatusBar();
				return; // Allow the change to proceed
			}

			// Check if changes are from regular typing (not commands) in regular godmode
			if (!isSelectModeActive) {
				const change = event.contentChanges[0];
				if (change.text.length > 0 && change.rangeLength === 0) {
					// This looks like regular typing, undo it
					const editor = vscode.window.activeTextEditor;
					if (editor && editor.document === event.document) {
						editor.edit((editBuilder) => {
							editBuilder.delete(
								new vscode.Range(
									change.range.start,
									change.range.start.translate(0, change.text.length),
								),
							);
						});
					}
				}
			}
		}
	});

	// Set up command execution tracking to know when we're running movement commands
	const commandListener = vscode.commands.registerCommand(
		"godmode.internal.trackMovement",
		() => {
			isExecutingMovementCommand = true;
			// Reset the flag after a short delay
			setTimeout(() => {
				isExecutingMovementCommand = false;
			}, 100);
		},
	);

	context.subscriptions.push(changeListener, commandListener);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}
