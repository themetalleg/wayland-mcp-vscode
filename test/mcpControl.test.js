const assert = require('node:assert/strict');
const test = require('node:test');
const { runServerAction } = require('../src/mcpControl');

test('routes lifecycle actions to VS Code for the configured server', async () => {
  const calls = [];
  const vscode = {
    commands: {
      async executeCommand(...args) {
        calls.push(args);
      },
    },
  };

  await runServerAction(vscode, 'start', 'mcp.config.usrlocal.wayland');
  await runServerAction(vscode, 'stop', 'mcp.config.usrlocal.wayland');
  await runServerAction(vscode, 'restart', 'mcp.config.usrlocal.wayland');

  assert.deepEqual(calls, [
    ['workbench.mcp.startServer', 'mcp.config.usrlocal.wayland'],
    ['workbench.mcp.stopServer', 'mcp.config.usrlocal.wayland'],
    ['workbench.mcp.restartServer', 'mcp.config.usrlocal.wayland'],
  ]);
});

test('rejects unsupported actions and empty server IDs', async () => {
  const vscode = { commands: { executeCommand: async () => assert.fail('must not execute') } };

  await assert.rejects(
    runServerAction(vscode, 'delete', 'mcp.config.usrlocal.wayland'),
    /Unsupported Wayland MCP action/,
  );
  await assert.rejects(
    runServerAction(vscode, 'start', '  '),
    /valid VS Code MCP server ID/,
  );
});

test('surfaces VS Code command failures with context', async () => {
  const vscode = {
    commands: {
      async executeCommand() {
        throw new Error('command unavailable');
      },
    },
  };

  await assert.rejects(
    runServerAction(vscode, 'start', 'mcp.config.usrlocal.wayland'),
    /could not start.*command unavailable/,
  );
});
