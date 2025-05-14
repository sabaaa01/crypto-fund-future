
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { web3Service, CampaignStatus } from "@/lib/web3";
import Header from "@/components/Header";
import ContributeForm from "@/components/ContributeForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Campaign } from "@/types/crowdfunding";
import { toast } from "@/components/ui/sonner";
import { ArrowUp, Calendar, Clock, Users, Wallet, CircleDollarSign } from "lucide-react";

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!id) return;

      try {
        const data = await web3Service.getCampaignById(id);
        setCampaign(data);
        setIsOwner(
          web3Service.isConnected &&
          web3Service.currentAccount?.toLowerCase() === data.owner.toLowerCase()
        );
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        toast.error("Failed to load campaign", {
          description: "Could not load campaign details"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  const handleWithdraw = async () => {
    if (!campaign) return;
    
    try {
      if (!web3Service.isConnected) {
        await web3Service.connectWallet();
      }
      
      await web3Service.withdrawFunds(campaign.id);
    } catch (error) {
      console.error("Withdraw error:", error);
    }
  };

  const refreshCampaign = async () => {
    if (!id) return;
    const data = await web3Service.getCampaignById(id);
    setCampaign(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
          <p className="mb-8 text-muted-foreground">The campaign you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </main>
      </div>
    );
  }

  const status = web3Service.getCampaignStatus(campaign);
  const progress = web3Service.getProgress(campaign.amountRaised, campaign.goal);
  const daysLeft = web3Service.getDaysLeft(campaign.deadline);
  const formattedAmountRaised = web3Service.formatEth(campaign.amountRaised);
  const formattedGoal = web3Service.formatEth(campaign.goal);
  const deadline = new Date(campaign.deadline * 1000).toLocaleDateString();

  // Check if the campaign is active
  const isActive = status === CampaignStatus.ACTIVE;
  
  // Check if withdrawal is available
  const canWithdraw = isOwner && 
    (status === CampaignStatus.SUCCESSFUL || 
     (progress >= 100 && isActive));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/" className="text-sm text-brand flex items-center gap-1 hover:underline">
            <ArrowUp size={14} className="rotate-90" />
            Back to all campaigns
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{campaign.title}</h1>
                <Badge 
                  variant={status === CampaignStatus.ACTIVE ? "default" : 
                          status === CampaignStatus.SUCCESSFUL ? "outline" : "secondary"}
                  className={
                    status === CampaignStatus.ACTIVE ? "bg-green-600" : 
                    status === CampaignStatus.SUCCESSFUL ? "border-green-500 text-green-500" : ""
                  }
                >
                  {status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Created by {web3Service.shortenAddress(campaign.owner)}
              </p>
            </div>
            
            <div className="rounded-lg overflow-hidden">
              <img 
                src={campaign.imageUrl} 
                alt={campaign.title} 
                className="w-full object-cover h-[300px]"
              />
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="mb-4">
                  <Progress value={progress} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm">
                    <div className="font-medium text-xl">{formattedAmountRaised} ETH</div>
                    <div className="text-muted-foreground">of {formattedGoal} ETH goal</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-center mb-1 text-brand">
                      <Users size={18} />
                    </div>
                    <div className="font-medium">{campaign.contributionsCount}</div>
                    <div className="text-xs text-muted-foreground">Contributors</div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-center mb-1 text-brand">
                      <Clock size={18} />
                    </div>
                    <div className="font-medium">{daysLeft}</div>
                    <div className="text-xs text-muted-foreground">Days Left</div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-center mb-1 text-brand">
                      <Calendar size={18} />
                    </div>
                    <div className="font-medium">{deadline}</div>
                    <div className="text-xs text-muted-foreground">End Date</div>
                  </div>
                </div>
                
                {canWithdraw && (
                  <div className="mt-6">
                    <Button 
                      onClick={handleWithdraw} 
                      variant="default" 
                      className="w-full flex items-center gap-2"
                    >
                      <Wallet size={16} />
                      Withdraw Funds
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">About this campaign</h2>
              <div className="text-muted-foreground whitespace-pre-line">
                {campaign.description}
              </div>
            </div>
          </div>
          
          {/* Contribution Form */}
          <div>
            {isActive ? (
              <ContributeForm campaign={campaign} onSuccess={refreshCampaign} />
            ) : (
              <div className="glass-card rounded-lg p-6 text-center">
                <div className="mb-4">
                  <CircleDollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Campaign {status === CampaignStatus.SUCCESSFUL ? "Funded!" : "Ended"}</h3>
                <p className="text-muted-foreground mb-4">
                  {status === CampaignStatus.SUCCESSFUL 
                    ? "This campaign has successfully reached its funding goal." 
                    : "This campaign is no longer accepting contributions."}
                </p>
                <Link to="/">
                  <Button variant="outline" className="w-full">Browse Other Campaigns</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>CryptoFund - A decentralized crowdfunding platform powered by blockchain</p>
        </div>
      </footer>
    </div>
  );
};

export default CampaignDetail;
