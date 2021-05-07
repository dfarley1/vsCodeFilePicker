import * as vscode from 'vscode';
import { Args } from './Args';
import { PickCommand } from './PickCommand';

function pick(args: Args) {
    return new PickCommand(args).Invoke();
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('filePicker.pick', pick),
    );
}

export function deactivate() { }
