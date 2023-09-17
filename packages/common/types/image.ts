export interface Image {
    star_count: number;
    is_official: boolean;
    name: string;
    is_automated: boolean;
    description: string;
}

export interface ImageOption {
    limit?: number;
    official?: boolean;
    stars?: number;
}
