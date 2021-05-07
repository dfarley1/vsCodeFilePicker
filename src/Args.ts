export enum DisplayType {
    None = 'none',
    FileName = 'fileName',
    FilePath = 'filePath',
    FileRelativePath = 'fileRelativePath',
    DirectoryName = 'dirName',
    DirectoryPath = 'dirPath',
    DirectoryRelativePath = 'dirRelativePath',
    Json = 'json',
    DefaultDisplay = FileName,
    DefaultDescription = None,
    DefaultDetail = None,
    DefaultOut = FilePath
}

export type PresentationConfig = DisplayType | {
    type: DisplayType;
    json?: string;
};

export type DisplayConfig = DisplayType | PresentationConfig & {
    description: PresentationConfig;
    detail: PresentationConfig;
};

export interface Args {
    masks: string | string[];
    display: DisplayConfig;
    output: PresentationConfig;
}
