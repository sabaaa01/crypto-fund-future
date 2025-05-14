
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { web3Service, CampaignStatus } from "@/lib/web3";
import { Link } from "react-router-dom";
import { Campaign } from "@/types/crowdfunding";
import { Clock, Users, CircleDollarSign } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const status = web3Service.getCampaignStatus(campaign);
  const progress = web3Service.getProgress(campaign.amountRaised, campaign.goal);
  const daysLeft = web3Service.getDaysLeft(campaign.deadline);
  const formattedAmountRaised = web3Service.formatEth(campaign.amountRaised);
  const formattedGoal = web3Service.formatEth(campaign.goal);

  return (
    <Link to={`/campaign/${campaign.id}`}>
      <Card className="overflow-hidden transition-all hover:border-brand hover:shadow-lg hover:shadow-brand/5 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={campaign.imageUrl} 
            alt={campaign.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
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
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold line-clamp-1">{campaign.title}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          <Progress value={progress} className="h-2 mb-3" />
          
          <div className="flex justify-between text-sm mt-2">
            <div className="font-medium">{formattedAmountRaised} ETH</div>
            <div className="text-muted-foreground">of {formattedGoal} ETH</div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 text-sm text-muted-foreground border-t border-border/40 mt-auto">
          <div className="w-full flex justify-between">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{daysLeft} days left</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{campaign.contributionsCount} backers</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CampaignCard;
