import * as vscode from 'vscode';
import { Args } from './Args';
import { PickCommand } from './PickCommand';
import { RunCommand } from './RunCommand';

async function pick(args: Args): Promise<string | undefined> {
    return new PickCommand(args).Invoke();
}

async function pickCommand(args: Args): Promise<string | undefined> {
    const picker = new PickCommand(args);
    const result = picker.Invoke().then(file => {
        const run_result = new RunCommand(args.command, file).run();
        return run_result;
    });
    return result;
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('filePicker.pick', pick),
        vscode.commands.registerCommand('filePicker.pickCommand', pickCommand),
    );
}

export function deactivate() { }
