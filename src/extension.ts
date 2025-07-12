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
	updateCursorStyle(false);

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

	const showAllEditors = vscode.commands.registerCommand(
		"godmode.showAllEditors",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("workbench.action.showAllEditors");
			}
		},
	);

	const focusFilesExplorer = vscode.commands.registerCommand(
		"godmode.focusFilesExplorer",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand(
					"workbench.action.toggleSidebarVisibility",
				);
			}
		},
	);

	const openFile = vscode.commands.registerCommand("godmode.openFile", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("workbench.action.quickOpen");
		}
	});

	const forwardSearch = vscode.commands.registerCommand(
		"godmode.forwardSearch",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("actions.find");
			}
		},
	);

	const beginningOfLine = vscode.commands.registerCommand(
		"godmode.beginningOfLine",
		() => {
			if (isGodmodeActive) {
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

	const killRegion = vscode.commands.registerCommand(
		"godmode.killRegion",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("emacs-mcx.killRegion");
			}
		},
	);

	const killLine = vscode.commands.registerCommand("godmode.killLine", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("emacs-mcx.killLine");
		}
	});

	// Code folding commands
	const foldAll = vscode.commands.registerCommand("godmode.foldAll", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("editor.foldAll");
		}
	});

	const unfoldRecursively = vscode.commands.registerCommand(
		"godmode.unfoldRecursively",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("editor.unfoldRecursively");
			}
		},
	);

	const unfoldAll = vscode.commands.registerCommand("godmode.unfoldAll", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("editor.unfoldAll");
		}
	});

	const foldLevel1 = vscode.commands.registerCommand(
		"godmode.foldLevel1",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("editor.foldLevel1");
			}
		},
	);

	const foldLevel2 = vscode.commands.registerCommand(
		"godmode.foldLevel2",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("editor.foldLevel2");
			}
		},
	);

	const foldLevel3 = vscode.commands.registerCommand(
		"godmode.foldLevel3",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("editor.foldLevel3");
			}
		},
	);

	const lineBreakInsert = vscode.commands.registerCommand(
		"godmode.lineBreakInsert",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("lineBreakInsert");
			}
		},
	);

	const yank = vscode.commands.registerCommand("godmode.yank", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("emacs-mcx.yank");
		}
	});

	const deleteRight = vscode.commands.registerCommand(
		"godmode.deleteRight",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("deleteRight");
			}
		},
	);

	const closeActiveEditor = vscode.commands.registerCommand(
		"godmode.closeActiveEditor",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("workbench.action.closeActiveEditor");
			}
		},
	);

	const newLine = vscode.commands.registerCommand("godmode.newLine", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("emacs-mcx.newLine");
		}
	});

	const commentLine = vscode.commands.registerCommand(
		"godmode.commentLine",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("editor.action.commentLine");
			}
		},
	);

	// Editor management commands
	const closeEditorsInOtherGroups = vscode.commands.registerCommand(
		"godmode.closeEditorsInOtherGroups",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand(
					"workbench.action.closeEditorsInOtherGroups",
				);
			}
		},
	);

	const splitEditorDown = vscode.commands.registerCommand(
		"godmode.splitEditorDown",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("workbench.action.splitEditorDown");
			}
		},
	);

	const splitEditorRight = vscode.commands.registerCommand(
		"godmode.splitEditorRight",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("workbench.action.splitEditorRight");
			}
		},
	);

	const highlightWords = vscode.commands.registerCommand(
		"godmode.highlightWords",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("highlightwords.addHighlight");
			}
		},
	);

	const navigateEditorGroups = vscode.commands.registerCommand(
		"godmode.navigateEditorGroups",
		() => {
			if (isGodmodeActive) {
				vscode.commands.executeCommand("workbench.action.navigateEditorGroups");
			}
		},
	);

	const gotoLine = vscode.commands.registerCommand("godmode.gotoLine", () => {
		if (isGodmodeActive) {
			vscode.commands.executeCommand("emacs-mcx.gotoLine");
		}
	});

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
		showAllEditors,
		focusFilesExplorer,
		openFile,
		forwardSearch,
		beginningOfLine,
		endOfLine,
		recenterTopBottom,
		killRegion,
		killLine,
		foldAll,
		unfoldRecursively,
		unfoldAll,
		foldLevel1,
		foldLevel2,
		foldLevel3,
		lineBreakInsert,
		yank,
		deleteRight,
		closeActiveEditor,
		newLine,
		commentLine,
		closeEditorsInOtherGroups,
		splitEditorDown,
		splitEditorRight,
		highlightWords,
		navigateEditorGroups,
		gotoLine,
	);

	// Set up typing prevention when godmode is active
	setupTypingPrevention(context);
}

function updateCursorStyle(isGodmode: boolean) {
	// Use try-catch to prevent configuration update errors
	try {
		const cursorStyle = isGodmode ? "line" : "block";
		vscode.workspace
			.getConfiguration("editor")
			.update("cursorStyle", cursorStyle, vscode.ConfigurationTarget.Global);
	} catch (error) {
		// Silently ignore configuration errors
		console.log("Could not update cursor style:", error);
	}
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
		updateCursorStyle(true);
	} else {
		statusBarItem.text = "$(circle-outline) Normal";
		statusBarItem.color = undefined;
		// Set cursor to block when not in godmode (editing mode)
		updateCursorStyle(false);
	}
}

function setupTypingPrevention(context: vscode.ExtensionContext) {
	// Register type command override to prevent typing in godmode
	const typeCommand = vscode.commands.registerCommand("type", (args) => {
		if (isGodmodeActive && !isSelectModeActive) {
			// Prevent typing in godmode (but allow it in select mode)
			return;
		}

		// If we're in select mode and user types, exit select mode and allow typing
		if (isSelectModeActive) {
			isSelectModeActive = false;
			updateStatusBar();
		}

		// Execute the default type command
		return vscode.commands.executeCommand("default:type", args);
	});

	context.subscriptions.push(typeCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}
