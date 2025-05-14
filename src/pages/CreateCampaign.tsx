
import Header from "@/components/Header";
import CampaignForm from "@/components/CampaignForm";

const CreateCampaign = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create a Campaign</h1>
          <p className="text-muted-foreground mb-8">
            Launch your fundraising campaign on the blockchain and start raising funds from supporters around the world.
          </p>
          
          <div className="bg-card border rounded-lg p-6">
            <CampaignForm />
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

export default CreateCampaign;
