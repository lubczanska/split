export interface Group {
    _id: string;
    name: string;
    emoji: string;
    currency: string;
    members: {name: string}[];
    memberBalance: Record<string, number>;
    owner: string;
    isPublic: boolean;
  }
  