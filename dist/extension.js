"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var isGodmodeActive = false;
var isSelectModeActive = false;
var statusBarItem;
var recenterState = 0;
function activate(context) {
  console.log("Godmode extension is now active!");
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.text = "$(circle-outline) Normal";
  statusBarItem.tooltip = "Godmode Status";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
  vscode.workspace.getConfiguration("editor").update("cursorStyle", "block", true);
  const toggleGodmode = vscode.commands.registerCommand(
    "godmode.toggle",
    () => {
      if (isSelectModeActive) {
        isSelectModeActive = false;
        updateStatusBar();
        return;
      }
      isGodmodeActive = !isGodmodeActive;
      if (!isGodmodeActive) {
        isSelectModeActive = false;
      }
      updateStatusBar();
      vscode.commands.executeCommand(
        "setContext",
        "godmode.active",
        isGodmodeActive
      );
    }
  );
  const toggleSelectMode = vscode.commands.registerCommand(
    "godmode.toggleSelectMode",
    () => {
      if (!isGodmodeActive) {
        isGodmodeActive = true;
        vscode.commands.executeCommand(
          "setContext",
          "godmode.active",
          isGodmodeActive
        );
      }
      isSelectModeActive = !isSelectModeActive;
      updateStatusBar();
    }
  );
  const moveDown = vscode.commands.registerCommand("godmode.moveDown", () => {
    if (isGodmodeActive) {
      vscode.commands.executeCommand("godmode.internal.trackMovement");
      recenterState = 0;
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
      recenterState = 0;
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
        recenterState = 0;
        if (isSelectModeActive) {
          vscode.commands.executeCommand("cursorRightSelect");
        } else {
          vscode.commands.executeCommand("cursorRight");
        }
      }
    }
  );
  const moveBackward = vscode.commands.registerCommand(
    "godmode.moveBackward",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("godmode.internal.trackMovement");
        recenterState = 0;
        if (isSelectModeActive) {
          vscode.commands.executeCommand("cursorLeftSelect");
        } else {
          vscode.commands.executeCommand("cursorLeft");
        }
      }
    }
  );
  const pageDown = vscode.commands.registerCommand("godmode.pageDown", () => {
    if (isGodmodeActive) {
      vscode.commands.executeCommand("godmode.internal.trackMovement");
      recenterState = 0;
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
      recenterState = 0;
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
    }
  );
  const beginningOfLine = vscode.commands.registerCommand(
    "godmode.beginningOfLine",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("godmode.internal.trackMovement");
        recenterState = 0;
        if (isSelectModeActive) {
          vscode.commands.executeCommand("cursorHomeSelect");
        } else {
          vscode.commands.executeCommand("cursorHome");
        }
      }
    }
  );
  const endOfLine = vscode.commands.registerCommand("godmode.endOfLine", () => {
    if (isGodmodeActive) {
      vscode.commands.executeCommand("godmode.internal.trackMovement");
      recenterState = 0;
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
          if (recenterState === 0) {
            editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
            recenterState = 1;
          } else if (recenterState === 1) {
            editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
            recenterState = 2;
          } else {
            const visibleRanges = editor.visibleRanges;
            if (visibleRanges.length > 0) {
              const visibleRange = visibleRanges[0];
              const linesInView = visibleRange.end.line - visibleRange.start.line;
              const targetLine = Math.max(
                0,
                currentPosition.line - linesInView + 1
              );
              const targetPosition = new vscode.Position(targetLine, 0);
              const targetRange = new vscode.Range(
                targetPosition,
                targetPosition
              );
              editor.revealRange(
                targetRange,
                vscode.TextEditorRevealType.AtTop
              );
            }
            recenterState = 0;
          }
        }
      }
    }
  );
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
    recenterTopBottom
  );
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
    vscode.workspace.getConfiguration("editor").update("cursorStyle", "line", true);
  } else {
    statusBarItem.text = "$(circle-outline) Normal";
    statusBarItem.color = void 0;
    vscode.workspace.getConfiguration("editor").update("cursorStyle", "block", true);
  }
}
function setupTypingPrevention(context) {
  let isExecutingMovementCommand = false;
  const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    if (isGodmodeActive && event.contentChanges.length > 0) {
      if (isSelectModeActive && !isExecutingMovementCommand) {
        isSelectModeActive = false;
        updateStatusBar();
        return;
      }
      if (!isSelectModeActive) {
        const change = event.contentChanges[0];
        if (change.text.length > 0 && change.rangeLength === 0) {
          const editor = vscode.window.activeTextEditor;
          if (editor && editor.document === event.document) {
            editor.edit((editBuilder) => {
              editBuilder.delete(
                new vscode.Range(
                  change.range.start,
                  change.range.start.translate(0, change.text.length)
                )
              );
            });
          }
        }
      }
    }
  });
  const commandListener = vscode.commands.registerCommand(
    "godmode.internal.trackMovement",
    () => {
      isExecutingMovementCommand = true;
      setTimeout(() => {
        isExecutingMovementCommand = false;
      }, 100);
    }
  );
  context.subscriptions.push(changeListener, commandListener);
}
function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
