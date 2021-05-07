# File Picker

File picker is simple tool, helping you to select file while running vs code task.

## Usage
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
