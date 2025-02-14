interface CloudinaryConfig {
    cloud_name?: string;
    api_key?: string;
    api_secret?: string;
}

interface CloudinaryAsyncConfig {
    useFactory: (
        ...args: any[]
    ) => Promise<CloudinaryConfig> | CloudinaryConfig;
    inject?: any[];
}

export type { CloudinaryConfig, CloudinaryAsyncConfig };

