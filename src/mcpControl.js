const serverCommands = {
  start: 'workbench.mcp.startServer',
  stop: 'workbench.mcp.stopServer',
  restart: 'workbench.mcp.restartServer',
};

async function runServerAction(vscode, action, serverId) {
  const command = serverCommands[action];
  if (!command) {
    throw new Error(`Unsupported Wayland MCP action: ${action}`);
  }
  if (typeof serverId !== 'string' || serverId.trim() === '') {
    throw new Error('Set a valid VS Code MCP server ID in the Wayland MCP Controls settings.');
  }

  try {
    await vscode.commands.executeCommand(command, serverId);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `VS Code could not ${action} the MCP server "${serverId}": ${message}`,
      { cause: error },
    );
  }
}

module.exports = { runServerAction };
