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
  updateCursorStyle("normal");
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
  const showAllEditors = vscode.commands.registerCommand(
    "godmode.showAllEditors",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("workbench.action.showAllEditors");
      }
    }
  );
  const focusFilesExplorer = vscode.commands.registerCommand(
    "godmode.focusFilesExplorer",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand(
          "workbench.action.toggleSidebarVisibility"
        );
      }
    }
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
    }
  );
  const beginningOfLine = vscode.commands.registerCommand(
    "godmode.beginningOfLine",
    () => {
      if (isGodmodeActive) {
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
  const killRegion = vscode.commands.registerCommand(
    "godmode.killRegion",
    async () => {
      if (isGodmodeActive) {
        await vscode.commands.executeCommand("emacs-mcx.killRegion");
      }
    }
  );
  const killLine = vscode.commands.registerCommand(
    "godmode.killLine",
    async () => {
      if (isGodmodeActive) {
        await vscode.commands.executeCommand("emacs-mcx.killLine");
      }
    }
  );
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
    }
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
    }
  );
  const foldLevel2 = vscode.commands.registerCommand(
    "godmode.foldLevel2",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("editor.foldLevel2");
      }
    }
  );
  const foldLevel3 = vscode.commands.registerCommand(
    "godmode.foldLevel3",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("editor.foldLevel3");
      }
    }
  );
  const lineBreakInsert = vscode.commands.registerCommand(
    "godmode.lineBreakInsert",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("lineBreakInsert");
      }
    }
  );
  const yank = vscode.commands.registerCommand("godmode.yank", async () => {
    if (isGodmodeActive) {
      await vscode.commands.executeCommand("emacs-mcx.yank");
    }
  });
  const deleteRight = vscode.commands.registerCommand(
    "godmode.deleteRight",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("deleteRight");
      }
    }
  );
  const closeActiveEditor = vscode.commands.registerCommand(
    "godmode.closeActiveEditor",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("workbench.action.closeActiveEditor");
      }
    }
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
    }
  );
  const closeEditorsInOtherGroups = vscode.commands.registerCommand(
    "godmode.closeEditorsInOtherGroups",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand(
          "workbench.action.closeEditorsInOtherGroups"
        );
      }
    }
  );
  const splitEditorDown = vscode.commands.registerCommand(
    "godmode.splitEditorDown",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("workbench.action.splitEditorDown");
      }
    }
  );
  const splitEditorRight = vscode.commands.registerCommand(
    "godmode.splitEditorRight",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("workbench.action.splitEditorRight");
      }
    }
  );
  const highlightWords = vscode.commands.registerCommand(
    "godmode.highlightWords",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("highlightwords.addHighlight");
      }
    }
  );
  const navigateEditorGroups = vscode.commands.registerCommand(
    "godmode.navigateEditorGroups",
    () => {
      if (isGodmodeActive) {
        vscode.commands.executeCommand("workbench.action.navigateEditorGroups");
      }
    }
  );
  const gotoLine = vscode.commands.registerCommand("godmode.gotoLine", () => {
    if (isGodmodeActive) {
      vscode.commands.executeCommand("emacs-mcx.gotoLine");
    }
  });
  const copyWithAltW = vscode.commands.registerCommand(
    "godmode.copyWithAltW",
    async () => {
      if (isGodmodeActive) {
        if (isSelectModeActive) {
          isSelectModeActive = false;
          updateStatusBar();
        }
        await vscode.commands.executeCommand("emacs-mcx.copyRegion");
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
    copyWithAltW
  );
  setupTypingPrevention(context);
  setupTextChangeListener(context);
}
function setupTextChangeListener(context) {
  const textDocumentChangeListener = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (!isGodmodeActive) {
        return;
      }
      if (isGodmodeActive && isSelectModeActive && event.contentChanges.length > 0) {
        isSelectModeActive = false;
        updateStatusBar();
      }
    }
  );
  context.subscriptions.push(textDocumentChangeListener);
}
function updateCursorStyle(mode) {
  try {
    const cursorStyle = mode === "normal" ? "block" : "line";
    vscode.workspace.getConfiguration("editor").update("cursorStyle", cursorStyle, vscode.ConfigurationTarget.Global);
  } catch (error) {
    console.log("Could not update cursor style:", error);
  }
}
function updateStatusBar() {
  if (isGodmodeActive) {
    if (isSelectModeActive) {
      statusBarItem.text = "$(selection) Select Mode";
      statusBarItem.color = "#61dafb";
      updateCursorStyle("select");
    } else {
      statusBarItem.text = "$(circle-filled) Godmode";
      statusBarItem.color = "#ff6b6b";
      updateCursorStyle("godmode");
    }
  } else {
    statusBarItem.text = "$(circle-outline) Normal";
    statusBarItem.color = void 0;
    updateCursorStyle("normal");
  }
}
function setupTypingPrevention(context) {
  const typeCommand = vscode.commands.registerCommand("type", (args) => {
    if (isGodmodeActive && !isSelectModeActive) {
      return;
    }
    if (isSelectModeActive) {
      isSelectModeActive = false;
      updateStatusBar();
    }
    return vscode.commands.executeCommand("default:type", args);
  });
  context.subscriptions.push(typeCommand);
}
function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
  try {
    vscode.workspace.getConfiguration("editor").update("cursorStyle", "block", vscode.ConfigurationTarget.Global);
  } catch (error) {
    console.log("Could not restore cursor settings:", error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
