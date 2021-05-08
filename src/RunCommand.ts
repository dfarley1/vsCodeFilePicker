import * as vscode from 'vscode';
import * as subprocess from 'child_process';
import { Args, CommandConfig } from './Args';


export class RunCommand {
    private command: string;
    private cwd: string | undefined;

    constructor(args: CommandConfig, file: string) {
        this.cwd = args.cwd;

        this.command = this.resolveFile(args.command, file);
    }

    private resolveFile(command: string, file: string): string {
        const regex: RegExp = /\$\{(file)\}/gm;
        return command.replace(regex, file);
    }

    run(): string {
        const options: subprocess.ExecSyncOptionsWithStringEncoding = {
            encoding: 'utf8',
            cwd: this.cwd,
        };
        try {
            return subprocess.execSync(this.command!, options);
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}
