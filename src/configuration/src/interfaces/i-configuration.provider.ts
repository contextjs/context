export interface IConfigurationProvider {
    getValueAsync(key: string): Promise<any>;
}