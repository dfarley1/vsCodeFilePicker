# File Picker

File picker is simple tool, helping you to select file while running vs code task.

# filePicker.pick
Example 'tasks.json' file to build project in monorepo with lerna
```json
{
    "version": "2.0.0",
    "inputs": [
        {
            "id": "pickerInput",
            "type": "command",
            "command": "filePicker.pick",
            "args": {
                "masks": "apps/*/package.json",
                "display": {
                    "type": "json",
                    "json": "name",
                    "detail": "fileRelativePath",
                    "description": {
                        "type": "json",
                        "json": "description"
                    }
                },
                "output": "filePath"
            }
        }
    ],
    "tasks": [
        {
            "label": "echo",
            "type": "shell",
            "command": "echo ${pickerInput:p}",
            "problemMatcher": []
        }
    ]
}
```

## Arguments

* `masks` `<string | string[]>` Masks to file search. Masks starting with `"/"` are searched as absolute paths, not relative to `workspaceFolder`.
* `display` `<DisplayType | DisplayConfig>` File names presentation type
* `output` `<DisplayType | DisplayConfig>` Output presentation type

`DisplayType`:
* `none`returns `undefined`
* `fileName` returns file name (ex. _readme.md_)
* `filePath` returns absolute file path (ex _c:/Projects/proj/info/readme.md_)
* `fileRelativePath` returns file path, relative to workspace (ex _info/readme.md_)
* `dirName` returs name of directory containings file (ex. _info_)
* `dirPath` returs absolute path to directory containings file (ex. _c:/Projects/proj/info_)
* `dirRelativePath` returs relative path to directory containings file (ex. _info_)
* `json` reads file as json object and returns value of property, specified in `PresentationConfig.json` property


`PresentationConfig`:
* `type` `<DisplayType>` Presentation type
* `json` `<string>` Path to property of json file

`DisplayConfig`:
* `type` `<DisplayType>` Presentation type
* `json` `<string>` Path to property of json file
* `description` `<PresentationConfig>` Rule to get file description (to show in vs code picker)
* `detail` `<PresentationConfig>` Rule to get file details (to show in vs code picker)


# filePicker.pickCommand
This command operates similarly to [`filePicker.pick`](#filePicker.pick) except the resulting file name or property can be used in a shell command for further processing. For example, the user can select a file to test and use a shell command to generate appropriate debugging args for the test.

## Usage
Example `launch.json` which uses a shell script to generate args for a user-specified test.
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug File",
            "request": "launch",
            "program": "process_to_debug",
            "args": ["${input:getDebugArgs}"],
        },
    ],
    "inputs": [
        {
            "id": "getDebugArgs",
            "type": "command",
            "command": "filePicker.pickCommand",
            "args": {
                "masks": "**/*.test",
                "display": "filePath",
                "output": "filePath",
                "command": {
                    "command": "generate_args.sh ${file}",
                    "cwd": ".",
                }
            }
        }
    ]
}

```

## Arguments
Same as `filePicker.pick` except with the addition of a `command` section:
* `command` `<CommandConfig>`

`CommandConfig`:
* `command` `string` shell command to be run. No variable substitution is currently supported except for `"${file}"` being replaced with the results of the file pick.
* `cwd` `string` Directory to execute the command in.
