import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

import { Args, DisplayType, PresentationConfig } from './Args';

export class PickCommand {
    private readonly _args: Args;
    constructor(args: Args) {
        this._args = args;
    }
    private getMasks(): string[] {
        if (this._args.masks == undefined) {
            return ['./**/*.*'];
        }
        if (typeof (this._args.masks) == 'string') {
            return [this._args.masks];
        }
        return this._args.masks;
    }
    private getValue(obj: any, path: string) {
        const paths = path.replace('[', '.').replace(']', '').split('.');
        let current = obj;
        for (let i = 0; i < paths.length; ++i) {
            const value = current[paths[i]];
            if (value === undefined) {
                return undefined;
            }
            current = value;
        }
        return current;
    }

    private getFilesAsync(pattern: string): Promise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            glob(pattern, (err, files) => {
                return err ? reject(err) : resolve(files);
            });
        });
    }
    getProperty(file: string, root: string, cfg: PresentationConfig): string | undefined {
        const type = typeof (cfg) == 'string' ? cfg : cfg.type;
        switch (type) {
            case DisplayType.None: {
                return undefined;
            }
            case DisplayType.FileName: {
                return path.basename(file);
            }
            case DisplayType.FilePath: {
                return file;
            }
            case DisplayType.FileRelativePath: {
                return path.relative(root, file);
            }
            case DisplayType.DirectoryName: {
                const dir = path.dirname(file);
                return path.basename(dir);
            }
            case DisplayType.DirectoryPath: {
                const dir = path.dirname(file);
                return dir;
            }
            case DisplayType.DirectoryRelativePath: {
                const dir = path.dirname(file);
                return path.relative(root, dir);
            }
            case DisplayType.Json: {
                if (typeof (cfg) == 'string' || cfg.json == undefined) {
                    throw new Error("Json property not specified");
                }
                const json = fs.readFileSync(file, 'utf8');
                const obj = JSON.parse(json);
                return this.getValue(obj, cfg.json);
            }
            default:
                throw new Error(`Unsupported type ${type}`);
        }
    }
    private getDisplay(file: string, root: string): vscode.QuickPickItem | undefined {
        const label = this.getProperty(file, root, this._args.display);
        if (label == undefined) {
            return undefined;
        }
        if (typeof (this._args.display) == 'string') {
            return {
                label: label
            };
        }
        const description = this.getProperty(file, root, this._args.display.description || DisplayType.DefaultDescription);
        const detail = this.getProperty(file, root, this._args.display.detail || DisplayType.DefaultDetail);
        return {
            label: label,
            description: description,
            detail: detail
        };
    }
    private getOutput(file: string, root: string): string | undefined {
        return this.getProperty(file, root, this._args.output);
    }

    private async getAbsoluteMap(mask: string): Promise<Map<vscode.QuickPickItem, string>> {
        const map = new Map<vscode.QuickPickItem, string>();
        var files = await this.getFilesAsync(mask);
        for (const file of files) {
            const key = this.getDisplay(file, "/");
            const value = this.getOutput(file, "/");
            if (key != undefined && value != undefined) {
                map.set(key, value);
            }
        }
        return map;
    }

    private async getWorkspaceMap(mask: string): Promise<Map<vscode.QuickPickItem, string>> {
        const map = new Map<vscode.QuickPickItem, string>();

        for (const folder of vscode.workspace.workspaceFolders) {
            const root = folder.uri.fsPath;
            var files = await this.getFilesAsync(path.join(root, mask));
            for (const file of files) {
                const key = this.getDisplay(file, root);
                const value = this.getOutput(file, root);
                if (key != undefined && value != undefined) {
                    map.set(key, value);
                }
            }
        }

        return map;
    }

    public async Invoke(): Promise<string | undefined> {
        var map: Map<vscode.QuickPickItem, string>;
        const masks = this.getMasks();

        for (const mask of masks) {
            if (mask.startsWith("/")) {
                map = await this.getAbsoluteMap(mask);
            } else {
                map = await this.getWorkspaceMap(mask);
            }
        }
        const names = Array.from(map.keys());
        if (names.length == 0) {
            await vscode.window.showInformationMessage("No files found");
            return undefined;
        }
        const selected = await vscode.window.showQuickPick(names);
        if (selected == undefined) {
            return undefined;
        }
        return map.get(selected);
    }
}
