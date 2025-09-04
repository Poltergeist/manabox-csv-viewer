export interface Card {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ScryfallImage {
  img: string;
  updatedAt: number;
}

export interface ScryfallCache {
  [id: string]: ScryfallImage;
}

export interface TableColumn {
  id: string;
  header: string;
  accessorKey: string;
  visible: boolean;
  isScryfallId?: boolean;
}

export interface AppState {
  cards: Card[];
  columns: TableColumn[];
  searchTerm: string;
  isDense: boolean;
  pageSize: number;
  currentPage: number;
  scryfallCache: ScryfallCache;
  lastCsvData?: string;
}

export interface ScryfallCardData {
  id: string;
  image_uris?: {
    normal: string;
    small: string;
  };
  card_faces?: Array<{
    image_uris?: {
      normal: string;
      small: string;
    };
  }>;
}