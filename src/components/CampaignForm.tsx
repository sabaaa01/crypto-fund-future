
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { web3Service } from "@/lib/web3";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

const CampaignForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    goal: "",
    deadline: 30 // Default 30 days
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.imageUrl || !formData.goal) {
      toast.error("Missing information", {
        description: "Please fill out all the required fields"
      });
      return;
    }

    if (isNaN(Number(formData.goal)) || Number(formData.goal) <= 0) {
      toast.error("Invalid goal", {
        description: "Please enter a valid fundraising goal"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (!web3Service.isConnected) {
        await web3Service.connectWallet();
      }

      const deadline = Math.floor(Date.now() / 1000) + (Number(formData.deadline) * 24 * 60 * 60);
      
      const success = await web3Service.createCampaign({
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        goal: formData.goal,
        deadline
      });

      if (success) {
        toast.success("Campaign created", {
          description: "Your campaign has been created successfully"
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Campaign creation error:", error);
      toast.error("Failed to create campaign", {
        description: "There was an error creating your campaign"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Campaign Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Give your campaign a clear, attention-grabbing title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Explain your project, what the funds will be used for, and why people should contribute"
          rows={6}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Campaign Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Paste a link to an image that represents your campaign"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="goal">Fundraising Goal (ETH)</Label>
          <Input
            id="goal"
            name="goal"
            type="number"
            value={formData.goal}
            onChange={handleChange}
            placeholder="10"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deadline">Campaign Duration (days)</Label>
          <Input
            id="deadline"
            name="deadline"
            type="number"
            value={formData.deadline}
            onChange={handleChange}
            placeholder="30"
            min="1"
            max="365"
            required
          />
        </div>
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Campaign..." : "Launch Campaign"}
        </Button>
      </div>
    </form>
  );
};

export default CampaignForm;
