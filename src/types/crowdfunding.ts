
export interface Campaign {
  id: string;
  owner: string;
  title: string;
  description: string;
  imageUrl: string;
  goal: string; // in ETH
  deadline: number; // timestamp
  amountRaised: string; // in ETH
  contributors: string[];
  contributionsCount: number;
  isActive: boolean;
}

export interface Contribution {
  contributor: string;
  amount: string;
  timestamp: number;
}

export enum CampaignStatus {
  ACTIVE = "Active",
  SUCCESSFUL = "Successful",
  EXPIRED = "Expired",
}
