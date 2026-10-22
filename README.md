# Wayland MCP Controls

A small Visual Studio Code extension that adds a Wayland MCP control view to the Activity Bar.

## Features

- Start, stop, or restart the configured Wayland MCP server.
- Open VS Code's MCP server picker to inspect the current server state.
- Open the user MCP configuration.
- Stop and restart require confirmation.

The extension delegates process lifecycle to VS Code; it does not spawn a second copy of the server. VS Code does not expose a public extension API for querying an existing MCP server's running state, so use **Show MCP server list** to check whether it is running.

## Requirements

- VS Code 1.102 or newer with MCP server support.
- Wayland MCP already installed and configured in VS Code.

The default server ID is `mcp.config.usrlocal.wayland`, matching a user-profile MCP configuration entry named `wayland`. If your server has a different scope or name, set **Wayland MCP Controls: Server Id** to its VS Code MCP definition ID.

## Development

Run the unit tests with:

```sh
npm test
```

Press F5 in VS Code to launch an Extension Development Host.

## Implementation note

VS Code currently has no public extension API for controlling an MCP server registered in user settings. This extension calls VS Code's built-in MCP start/stop/restart commands with the configured server ID. Those command IDs are internal to VS Code and may change in a future release.
