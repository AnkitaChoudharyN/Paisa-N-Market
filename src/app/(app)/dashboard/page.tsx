'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Bot, Flame, ShieldCheck, TrendingUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { initialHoldings, availableFunds as initialAvailableFunds } from '@/lib/portfolio-data';
import type { StockPrice } from '@/app/(app)/portfolio/types';

const quickActions = [
  {
    title: 'Virtual Portfolio',
    description: 'Practice trading with ₹1L virtual money',
    icon: TrendingUp,
    value: '₹1,25,000',
    href: '/portfolio',
  },
  {
    title: 'Learning Path',
    description: 'Continue your financial education',
    icon: BookOpen,
    value: '24/40',
    href: '/learn',
  },
  {
    title: 'Fraud Challenge',
    description: 'Test your scam detection skills',
    icon: ShieldCheck,
    value: 'New Challenge!',
    href: '/fraud-prevention',
  },
  {
    title: 'AI Advisor',
    description: 'Get personalized financial advice',
    icon: Bot,
    value: 'Ask AI',
    href: '/advice',
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Simplified price simulation
const getLiveStockPrices = (): StockPrice[] => {
  return initialHoldings.map(({ ticker, name, avgPrice }) => {
    const randomFactor = 1 + (Math.random() - 0.5) / 10;
    const newPrice = avgPrice * randomFactor * 1.05; // Simulate some growth
    const change = ((newPrice - avgPrice) / avgPrice) * 100;
    return { ticker, name, price: newPrice, change };
  });
};


export default function DashboardPage() {
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);

  useEffect(() => {
    const marketPrices = getLiveStockPrices();
    
    const totalInvested = initialHoldings.reduce((acc, h) => acc + h.avgPrice * h.quantity, 0);
    
    const totalHoldingsValue = initialHoldings.reduce((acc, holding) => {
        const stock = marketPrices.find(s => s.ticker === holding.ticker);
        return acc + (stock ? stock.price : holding.avgPrice) * holding.quantity;
    }, 0);

    const totalValue = totalHoldingsValue + initialAvailableFunds;
    const totalPnl = totalHoldingsValue - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    
    setPortfolioValue(totalValue);
    setPortfolioChange(totalPnlPercent);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 bg-background p-4 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">नमस्ते! 👋</h1>
          <p className="text-muted-foreground">
            Ready to grow your wealth today?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <span className="relative mr-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Live Market
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="font-bold">Level 8</span>
          </Button>
        </div>
      </header>

      {/* Progress Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Progress</CardTitle>
            <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-xs font-medium">
              <Flame className="h-4 w-4 text-orange-400" />
              <span>12 day streak</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between text-sm">
            <span>1250 / 1500 XP to next level</span>
          </div>
          <Progress value={83} className="h-2 bg-white/30" />
        </CardContent>
      </Card>

      {/* Virtual Portfolio Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-muted-foreground">
            Virtual Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{formatCurrency(portfolioValue)}</span>
            <span className={`text-sm font-semibold ${portfolioChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}% this month
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="-mx-4 -my-2 flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{action.title === 'Virtual Portfolio' ? 'View' : action.value}</p>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-muted-foreground">
            <p>Coming Soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
