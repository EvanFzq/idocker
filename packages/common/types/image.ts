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

export interface ImageItem {
  Containers: number;
  Created: number;
  Id: string;
  Labels?: Record<string, string>;
  ParentId: string;
  RepoDigests?: string[];
  RepoTags: string[];
  SharedSize: number;
  Size: number;
  VirtualSize: number;
  Name: string;
  Tags: string[];
}
