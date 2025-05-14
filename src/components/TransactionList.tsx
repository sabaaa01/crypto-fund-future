
import { useState } from "react";
import { web3Service } from "@/lib/web3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { CircleDollarSign, ArrowUp, Clock } from "lucide-react";

interface Transaction {
  type: 'contribution' | 'withdrawal' | 'creation';
  campaignId: string;
  amount?: string;
  timestamp: number;
  from: string;
}

const TransactionBadge = ({ type }: { type: string }) => {
  if (type === 'contribution') {
    return <Badge className="bg-green-600">Contribution</Badge>;
  } else if (type === 'withdrawal') {
    return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Withdrawal</Badge>;
  } else {
    return <Badge variant="secondary">Campaign Created</Badge>;
  }
};

const TransactionIcon = ({ type }: { type: string }) => {
  if (type === 'contribution') {
    return <CircleDollarSign size={16} className="text-green-500" />;
  } else if (type === 'withdrawal') {
    return <ArrowUp size={16} className="text-yellow-500" />;
  } else {
    return <Clock size={16} className="text-muted-foreground" />;
  }
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(
    web3Service.getTransactions()
  );

  // Function to refresh transactions
  const refreshTransactions = () => {
    setTransactions(web3Service.getTransactions());
  };

  // Set up polling for new transactions
  useState(() => {
    const interval = setInterval(refreshTransactions, 3000);
    return () => clearInterval(interval);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <div key={index} className="flex items-start p-3 rounded-lg bg-muted/30">
                  <div className="mr-3 mt-1">
                    <TransactionIcon type={tx.type} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <TransactionBadge type={tx.type} />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(tx.timestamp * 1000), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">
                      Campaign ID: {tx.campaignId}
                      {tx.amount && (
                        <span className="font-medium"> • {tx.amount} ETH</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      From: {web3Service.shortenAddress(tx.from)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
