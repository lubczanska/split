export interface Group {
    _id: string;
    name: string;
    emoji: string;
    currency: string;
    members: string[];
    memberBalance: Map<string, number>;
    owner: string;
    isPublic: boolean;
  }
  