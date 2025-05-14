
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { web3Service } from "@/lib/web3";
import { Link } from "react-router-dom";
import { Wallet, Plus } from "lucide-react";

const Header = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    setIsConnected(web3Service.isConnected);
    setWalletAddress(web3Service.currentAccount);
  }, []);

  const connectWallet = async () => {
    const connected = await web3Service.connectWallet();
    if (connected) {
      setIsConnected(true);
      setWalletAddress(web3Service.currentAccount);
    }
  };

  return (
    <header className="border-b border-white/10 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold gradient-text">CryptoFund</Link>
        
        <div className="flex items-center gap-4">
          <Link to="/create">
            <Button variant="outline" className="hidden md:flex gap-2">
              <Plus size={16} />
              Create Campaign
            </Button>
          </Link>
          
          {isConnected ? (
            <Button variant="secondary" className="flex items-center gap-2">
              <Wallet size={16} />
              <span className="hidden md:block">{web3Service.shortenAddress(walletAddress!)}</span>
              <span className="block md:hidden">Connected</span>
            </Button>
          ) : (
            <Button onClick={connectWallet} className="flex items-center gap-2">
              <Wallet size={16} />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
