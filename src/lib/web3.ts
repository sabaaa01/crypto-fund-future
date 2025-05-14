
import { toast } from '@/components/ui/sonner';
import { ethers } from 'ethers';

// For demo purposes, we'll include a simplified ABI here
// In a real app, you would import the actual ABI from a JSON file
const CROWDFUNDING_ABI = [
  "function createCampaign(string memory title, string memory description, string memory imageUrl, uint256 goal, uint256 deadline) public returns (uint256)",
  "function getCampaigns() public view returns (tuple(uint256 id, address owner, string title, string description, string imageUrl, uint256 goal, uint256 deadline, uint256 amountRaised, uint256 contributorsCount, bool isActive)[] memory)",
  "function getCampaignById(uint256 campaignId) public view returns (tuple(uint256 id, address owner, string title, string description, string imageUrl, uint256 goal, uint256 deadline, uint256 amountRaised, uint256 contributorsCount, bool isActive))",
  "function contribute(uint256 campaignId) public payable",
  "function withdrawFunds(uint256 campaignId) public",
  "function getCampaignContributors(uint256 campaignId) public view returns (address[] memory)"
];

// For the MVP, we're using a mock contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare const window: EthereumWindow;

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  public isConnected = false;
  public currentAccount: string | null = null;

  // For demo, we'll simulate blockchain data
  private mockCampaigns = [
    {
      id: "1",
      owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      title: "Decentralized Education Platform",
      description: "Building a platform to provide free education through blockchain technology.",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      goal: ethers.parseEther("10").toString(),
      deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
      amountRaised: ethers.parseEther("4.5").toString(),
      contributors: ["0x123...", "0x456...", "0x789..."],
      contributionsCount: 24,
      isActive: true
    },
    {
      id: "2",
      owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      title: "Community-Owned Solar Farm",
      description: "Funding a solar farm owned by the community with profits distributed to token holders.",
      imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d",
      goal: ethers.parseEther("50").toString(),
      deadline: Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60, // 45 days from now
      amountRaised: ethers.parseEther("12").toString(),
      contributors: ["0x123...", "0x456..."],
      contributionsCount: 18,
      isActive: true
    },
    {
      id: "3",
      owner: "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF",
      title: "Decentralized Art Gallery",
      description: "Creating a platform for artists to showcase and sell their work without intermediaries.",
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      goal: ethers.parseEther("15").toString(),
      deadline: Math.floor(Date.now() / 1000) + 20 * 24 * 60 * 60, // 20 days from now
      amountRaised: ethers.parseEther("7.2").toString(),
      contributors: ["0x123...", "0x456...", "0x789...", "0xabc..."],
      contributionsCount: 32,
      isActive: true
    }
  ];

  // Add a list of recent transactions
  private transactions: Array<{
    type: 'contribution' | 'withdrawal' | 'creation';
    campaignId: string;
    amount?: string;
    timestamp: number;
    from: string;
  }> = [];

  // Check if MetaMask is available
  async connectWallet() {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error("MetaMask not found", {
        description: "Please install MetaMask to use this application"
      });
      return false;
    }
    
    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await this.provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        toast.error("No accounts found", {
          description: "Please create an account in MetaMask"
        });
        return false;
      }

      this.signer = await this.provider.getSigner();
      this.currentAccount = await this.signer.getAddress();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, this.signer);
      this.isConnected = true;
      
      toast.success("Wallet connected", {
        description: `Connected to ${this.shortenAddress(this.currentAccount)}`
      });
      
      return true;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Failed to connect wallet", {
        description: "Please check your MetaMask and try again"
      });
      return false;
    }
  }

  shortenAddress(address: string) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  async getCampaigns() {
    try {
      // In a real implementation, we would use the contract
      // return await this.contract!.getCampaigns();
      
      // For the MVP, we return mock data
      return this.mockCampaigns;
    } catch (error) {
      console.error("Error getting campaigns:", error);
      toast.error("Failed to fetch campaigns");
      return [];
    }
  }

  async getCampaignById(id: string) {
    try {
      // In a real implementation, we would use the contract
      // return await this.contract!.getCampaignById(id);
      
      // For the MVP, we return mock data
      return this.mockCampaigns.find(campaign => campaign.id === id) || null;
    } catch (error) {
      console.error("Error getting campaign:", error);
      toast.error("Failed to fetch campaign details");
      return null;
    }
  }

  async createCampaign(campaign: {
    title: string;
    description: string;
    imageUrl: string;
    goal: string;
    deadline: number;
  }) {
    try {
      if (!this.signer || !this.contract) {
        await this.connectWallet();
        if (!this.signer || !this.contract) {
          throw new Error("Wallet connection required");
        }
      }

      // In a real implementation, we would use the contract
      /*
      const tx = await this.contract.createCampaign(
        campaign.title,
        campaign.description,
        campaign.imageUrl,
        ethers.parseEther(campaign.goal),
        campaign.deadline
      );
      await tx.wait();
      return true;
      */

      // For the MVP, we simulate success and add to mock campaigns
      const newId = (this.mockCampaigns.length + 1).toString();
      const newCampaign = {
        id: newId,
        owner: this.currentAccount || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        title: campaign.title,
        description: campaign.description,
        imageUrl: campaign.imageUrl || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d",
        goal: ethers.parseEther(campaign.goal).toString(),
        deadline: campaign.deadline,
        amountRaised: "0",
        contributors: [],
        contributionsCount: 0,
        isActive: true
      };
      
      this.mockCampaigns.push(newCampaign);
      
      // Add transaction record
      this.addTransaction({
        type: 'creation',
        campaignId: newId,
        from: this.currentAccount || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      });
      
      toast.success("Campaign created successfully", {
        description: "Your campaign is now live on the blockchain"
      });
      return true;
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign", {
        description: "Please try again later"
      });
      return false;
    }
  }

  async contribute(campaignId: string, amount: string) {
    try {
      if (!this.signer || !this.contract) {
        await this.connectWallet();
        if (!this.signer || !this.contract) {
          throw new Error("Wallet connection required");
        }
      }

      // In a real implementation, we would use the contract
      /*
      const tx = await this.contract.contribute(campaignId, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      return true;
      */

      // For the MVP, we simulate success by updating mock data
      const campaign = this.mockCampaigns.find(c => c.id === campaignId);
      if (campaign) {
        const amountWei = ethers.parseEther(amount);
        campaign.amountRaised = (BigInt(campaign.amountRaised) + amountWei).toString();
        campaign.contributionsCount += 1;
        
        // Add the contributor if not already in the list
        const contributor = this.currentAccount || "0x123...";
        if (!campaign.contributors.includes(contributor)) {
          campaign.contributors.push(contributor);
        }
        
        // Add transaction record
        this.addTransaction({
          type: 'contribution',
          campaignId,
          amount,
          from: this.currentAccount || "0x123...",
        });
      }

      toast.success("Contribution successful", {
        description: `You contributed ${amount} ETH to this campaign`
      });
      return true;
    } catch (error) {
      console.error("Error contributing:", error);
      toast.error("Failed to make contribution", {
        description: "Please try again later"
      });
      return false;
    }
  }

  async withdrawFunds(campaignId: string) {
    try {
      if (!this.signer || !this.contract) {
        await this.connectWallet();
        if (!this.signer || !this.contract) {
          throw new Error("Wallet connection required");
        }
      }

      // In a real implementation, we would use the contract
      /*
      const tx = await this.contract.withdrawFunds(campaignId);
      await tx.wait();
      return true;
      */

      // Add transaction record
      this.addTransaction({
        type: 'withdrawal',
        campaignId,
        amount: this.mockCampaigns.find(c => c.id === campaignId)?.amountRaised || "0",
        from: this.currentAccount || "0x123...",
      });

      toast.success("Funds withdrawn successfully", {
        description: "The funds have been transferred to your wallet"
      });
      return true;
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds", {
        description: "Please ensure you're the campaign owner and the goal has been met"
      });
      return false;
    }
  }

  // Add a method to add transactions
  private addTransaction(tx: {
    type: 'contribution' | 'withdrawal' | 'creation';
    campaignId: string;
    amount?: string;
    from: string;
  }) {
    this.transactions.push({
      ...tx,
      timestamp: Math.floor(Date.now() / 1000)
    });
  }

  // Add a method to get recent transactions
  getTransactions() {
    return [...this.transactions].reverse();
  }

  getCampaignStatus(campaign: any) {
    const now = Math.floor(Date.now() / 1000);
    const goalMet = ethers.parseEther(campaign.amountRaised.toString()) >= ethers.parseEther(campaign.goal.toString());
    
    if (!campaign.isActive) {
      return goalMet ? CampaignStatus.SUCCESSFUL : CampaignStatus.EXPIRED;
    }

    if (campaign.deadline < now) {
      return CampaignStatus.EXPIRED;
    }

    return CampaignStatus.ACTIVE;
  }

  getProgress(amountRaised: string, goal: string) {
    const raised = parseFloat(ethers.formatEther(amountRaised));
    const targetGoal = parseFloat(ethers.formatEther(goal));
    return Math.min((raised / targetGoal) * 100, 100);
  }

  formatEth(value: string) {
    return parseFloat(ethers.formatEther(value)).toFixed(4);
  }

  getDaysLeft(deadline: number) {
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = deadline - now;
    return Math.max(0, Math.floor(secondsLeft / (60 * 60 * 24)));
  }
}

export const web3Service = new Web3Service();
export enum CampaignStatus {
  ACTIVE = "Active",
  SUCCESSFUL = "Successful",
  EXPIRED = "Expired",
}
