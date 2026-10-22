const vscode = require('vscode');
const { runServerAction } = require('./src/mcpControl');

const viewId = 'waylandMcp.controls';
const serverSetting = 'waylandMcpControls.serverId';
const commands = {
  start: 'waylandMcpControls.start',
  stop: 'waylandMcpControls.stop',
  restart: 'waylandMcpControls.restart',
  listServers: 'waylandMcpControls.listServers',
  openConfiguration: 'waylandMcpControls.openConfiguration',
};

class ControlsProvider {
  getTreeItem(item) {
    return item;
  }

  getChildren() {
    return [
      new vscode.TreeItem(
        'VS Code manages the server process',
        vscode.TreeItemCollapsibleState.None,
      ),
      actionItem('Start Wayland MCP', commands.start, 'play'),
      actionItem('Stop Wayland MCP', commands.stop, 'debug-stop'),
      actionItem('Restart Wayland MCP', commands.restart, 'refresh'),
      actionItem('Show MCP server list', commands.listServers, 'list-unordered'),
      actionItem('Open MCP configuration', commands.openConfiguration, 'settings-gear'),
    ];
  }
}

function actionItem(label, command, icon) {
  const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
  item.command = { command, title: label };
  item.iconPath = new vscode.ThemeIcon(icon);
  return item;
}

function configuredServerId() {
  return vscode.workspace.getConfiguration().get(serverSetting, 'mcp.config.usrlocal.wayland');
}

async function invokeServerAction(action) {
  try {
    await runServerAction(vscode, action, configuredServerId());
    vscode.window.showInformationMessage(
      `Sent ${action} request for Wayland MCP to VS Code. Check “MCP: List Servers” for its current state.`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(message);
  }
}

function activate(context) {
  const provider = new ControlsProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(viewId, provider),
    vscode.commands.registerCommand(commands.start, () => invokeServerAction('start')),
    vscode.commands.registerCommand(commands.stop, async () => {
      const choice = await vscode.window.showWarningMessage(
        'Stop the Wayland MCP server? Active desktop-control requests may fail.',
        { modal: true },
        'Stop Server',
      );
      if (choice === 'Stop Server') {
        await invokeServerAction('stop');
      }
    }),
    vscode.commands.registerCommand(commands.restart, async () => {
      const choice = await vscode.window.showWarningMessage(
        'Restart the Wayland MCP server? Active desktop-control requests may fail.',
        { modal: true },
        'Restart Server',
      );
      if (choice === 'Restart Server') {
        await invokeServerAction('restart');
      }
    }),
    vscode.commands.registerCommand(commands.listServers, () =>
      vscode.commands.executeCommand('workbench.mcp.listServer'),
    ),
    vscode.commands.registerCommand(commands.openConfiguration, () =>
      vscode.commands.executeCommand('workbench.mcp.openUserMcpJson'),
    ),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
