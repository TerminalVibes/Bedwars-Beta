// FileSystem API:

/** Reads the contents of the file located at path and returns it. If the file does not exist, it errors. */
declare function readfile(path: string): string;

/** Writes contents to the supplied path. */
declare function writefile(path: string, contents: string): void;

/** Appends content to the file contents at path. If the file does not exist, it errors. */
declare function appendfile(path: string, content: string): void;

/** Loads in the contents of a file as a chunk and returns it if compilation is successful. Otherwise, if an error has occurred during compilation, nil followed by the error message will be returned. */
declare function loadfile(path: string): ((...args: any[]) => any) | undefined;

/** Returns a table of files in folder. */
declare function listfiles(folder: string): String[];

/** Returns if path is a file or not. */
declare function isfile(path: string): boolean;

/** Returns if path is a folder or not. */
declare function isfolder(path: string): boolean;

/** Creates a new folder at path. */
declare function makefolder(path: string): void;

/** Deletes the folder in the supplied path, if no folder exists, it errors. */
declare function delfolder(path: string): void;

/** Deletes the file in the supplied path, if no file exists, it errors. */
declare function delfile(path: string): void;
