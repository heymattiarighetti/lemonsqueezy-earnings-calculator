"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { providerName } from "@/config";
import { useEffect, useState } from "react";

export default function PaymentsCalculator() {
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [vatRate, setVatRate] = useState(0);
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const [isInternational, setIsInternational] = useState(false);
  const [isPayPal, setIsPayPal] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateFees();
  }, [
    price,
    quantity,
    vatRate,
    isTaxInclusive,
    isSubscription,
    isInternational,
    isPayPal,
  ]);

  const calculateFees = () => {
    const priceNum = price || 0;
    const quantityNum = quantity || 1;
    const vatRateNum = vatRate / 100 || 0;

    let basePrice = priceNum * quantityNum;
    if (isTaxInclusive) {
      basePrice = basePrice / (1 + vatRateNum);
    }

    const baseFee = Math.ceil(basePrice * 0.05 * 100) / 100;
    const flatFee = 0.5;
    const internationalFee = isInternational
      ? Math.ceil(basePrice * 0.015 * 100) / 100
      : 0;

    const payPalFee = isPayPal ? Math.ceil(basePrice * 0.015 * 100) / 100 : 0;

    const subscriptionFee = isSubscription
      ? Math.ceil(basePrice * 0.005 * 100) / 100
      : 0;

    const totalFee =
      baseFee + flatFee + internationalFee + payPalFee + subscriptionFee;

    const vat = isTaxInclusive
      ? Math.ceil((priceNum * quantityNum - basePrice) * 100) / 100
      : Math.ceil(basePrice * vatRateNum * 100) / 100;

    const payout = Math.ceil((basePrice - totalFee) * 100) / 100;

    const customerPays = isTaxInclusive
      ? priceNum
      : vatRateNum > 0
        ? priceNum * (1 + vatRateNum)
        : priceNum;

    setResult({
      customerPays,
      basePrice: Math.ceil(basePrice * 100) / 100,
      vat,
      baseFee,
      flatFee,
      subscriptionFee,
      internationalFee,
      payPalFee,
      totalFee: Math.ceil(totalFee * 100) / 100,
      payout,
    });
  };

  return (
    <div className="container mx-auto items-start justify-center p-4 md:flex">
      {
        // card style
        // rounded-base border-2 border-border bg-main text-black shadow-light dark:border-darkBorder dark:shadow-dark
      }
      <Card className="md:w-2/3">
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between space-x-4">
              <div className="w-3/4 space-y-2">
                <Label htmlFor="price">Price Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="pl-6"
                    required
                  />
                </div>
              </div>
              <div className="w-1/4 space-y-2">
                <Label htmlFor="subscriptionToggle">
                  {isSubscription ? "Subscription (0.5%)" : "One-time payment"}
                </Label>
                <div>
                  <Switch
                    id="subscription"
                    checked={isSubscription}
                    onCheckedChange={setIsSubscription}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between space-x-4">
              <div className="w-3/4 space-y-2">
                <Label htmlFor="vatRate">VAT Rate</Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2">
                    %
                  </span>
                  <Input
                    id="vatRate"
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="pl-6"
                    required
                  />
                </div>
              </div>
              <div className="w-1/4 space-y-2">
                <Label htmlFor="taxToggle">
                  {isTaxInclusive ? "Tax included" : "Tax excluded"}
                </Label>
                <div>
                  <Switch
                    id="taxToggle"
                    checked={isTaxInclusive}
                    onCheckedChange={setIsTaxInclusive}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 pl-1">
                <Checkbox
                  id="international"
                  checked={isInternational}
                  onCheckedChange={(checked) =>
                    setIsInternational(checked as boolean)
                  }
                />
                <Label
                  htmlFor="international"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  International Payment (1.5%)
                </Label>
              </div>
              <div className="flex items-center space-x-2 pl-1">
                <Checkbox
                  id="paypal"
                  checked={isPayPal}
                  onCheckedChange={(checked) => setIsPayPal(checked as boolean)}
                />
                <Label
                  htmlFor="paypal"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  PayPal Payment (1.5%)
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10);
                    if (!isNaN(newValue) && newValue >= 1) {
                      setQuantity(newValue);
                    }
                  }}
                  className="max-w-32"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3 rounded-base border-2 border-border bg-white p-5 shadow-light dark:border-darkBorder dark:bg-secondaryBlack dark:shadow-dark md:w-1/3">
        <h4 className="text-xl font-heading">$$$</h4>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span>Customer</span>
            <span>${result?.customerPays.toFixed(2)}</span>
          </p>
          {quantity > 1 && (
            <p className="flex justify-between">
              <span>Transactions</span>
              <span>${(result?.customerPays * quantity).toFixed(2)}</span>
            </p>
          )}
          <p className="flex justify-between">
            <span>Taxes</span>
            <span>${result?.vat.toFixed(2)}</span>
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="flex cursor-help justify-between underline decoration-dotted underline-offset-4">
                  <span>LS Fees</span>
                  <span>${result?.totalFee.toFixed(2)}</span>
                </p>
              </TooltipTrigger>
              <TooltipContent className="space-y-2">
                <h3 className="text-md mb-4 font-bold">{providerName} Fees</h3>
                <p className="flex justify-between">
                  <span>5% base</span>
                  <span>${result?.baseFee.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>.50c flat</span>
                  <span>${result?.flatFee.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Subscription</span>
                  <span>${result?.subscriptionFee.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="pr-6">International</span>
                  <span>${result?.internationalFee.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>PayPal</span>
                  <span>${result?.payPalFee.toFixed(2)}</span>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="flex justify-between font-bold">
            <span>You get</span>
            <span>${result?.payout.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
