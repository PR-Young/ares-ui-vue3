export function createModules() {
    return import.meta.glob(["/.vtj/projects/*.json", "/.vtj/files/*.json"]);
}