
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { web3Service } from "@/lib/web3";
import { CircleDollarSign } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Campaign } from "@/types/crowdfunding";

interface ContributeFormProps {
  campaign: Campaign;
  onSuccess?: () => void;
}

const ContributeForm: React.FC<ContributeFormProps> = ({ campaign, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid contribution amount"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (!web3Service.isConnected) {
        await web3Service.connectWallet();
      }
      
      const success = await web3Service.contribute(campaign.id, amount);
      if (success) {
        setAmount("");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Contribution error:", error);
      toast.error("Contribution failed", {
        description: "There was an error processing your contribution"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick amount buttons
  const quickAmounts = ["0.1", "0.5", "1", "5"];

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-lg font-medium mb-4">Support this project</h3>
      
      <form onSubmit={handleContribute}>
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ETH"
            className="pl-10"
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {quickAmounts.map((amt) => (
            <Button
              key={amt}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount(amt)}
            >
              {amt} ETH
            </Button>
          ))}
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Contribute Now"}
        </Button>
      </form>
    </div>
  );
};

export default ContributeForm;
