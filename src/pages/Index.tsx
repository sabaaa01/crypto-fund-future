
import { useState, useEffect } from "react";
import { web3Service } from "@/lib/web3";
import CampaignCard from "@/components/CampaignCard";
import TransactionList from "@/components/TransactionList";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Campaign } from "@/types/crowdfunding";
import { Plus, RefreshCw } from "lucide-react";

const Index = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const data = await web3Service.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      fetchCampaigns();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCampaigns();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <section className="mb-12">
          <div className="rounded-2xl overflow-hidden relative bg-hero-pattern animate-gradient-flow">
            <div className="bg-black/10 p-8 md:p-12">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Fund Your Vision with Blockchain
                </h1>
                <p className="text-lg mb-8 text-gray-700">
                  Launch or contribute to decentralized fundraising campaigns. Transparent, 
                  secure, and powered by blockchain technology.
                </p>
                {/* Buttons removed from hero section as requested */}
              </div>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Active Campaigns</h2>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                    Refresh
                  </Button>
                  <Link to="/create">
                    <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                      <Plus size={16} />
                      New Campaign
                    </Button>
                  </Link>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse-slow"></div>
                  ))}
                </div>
              ) : campaigns.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground mb-4">No campaigns found</p>
                  <Link to="/create">
                    <Button>Create the first campaign</Button>
                  </Link>
                </div>
              )}
            </section>
          </div>
          
          <div>
            <TransactionList />
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>CryptoFund - A decentralized crowdfunding platform powered by blockchain</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
