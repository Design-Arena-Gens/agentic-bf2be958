"use client";

import { useState, useMemo } from "react";

type PaymentApp = "PayPal" | "Venmo" | "CashApp" | "Stripe" | "Zelle" | "ApplePay";

interface Transaction {
  id: string;
  app: PaymentApp;
  amount: number;
  type: "sent" | "received";
  recipient: string;
  description: string;
  date: Date;
  status: "completed" | "pending" | "failed";
}

const appColors: Record<PaymentApp, string> = {
  PayPal: "bg-blue-500",
  Venmo: "bg-sky-400",
  CashApp: "bg-green-500",
  Stripe: "bg-purple-500",
  Zelle: "bg-indigo-500",
  ApplePay: "bg-black",
};

const sampleTransactions: Transaction[] = [
  {
    id: "1",
    app: "PayPal",
    amount: 125.50,
    type: "received",
    recipient: "John Doe",
    description: "Invoice payment",
    date: new Date("2025-10-15T10:30:00"),
    status: "completed",
  },
  {
    id: "2",
    app: "Venmo",
    amount: 45.00,
    type: "sent",
    recipient: "Sarah Smith",
    description: "Dinner split",
    date: new Date("2025-10-15T18:45:00"),
    status: "completed",
  },
  {
    id: "3",
    app: "CashApp",
    amount: 200.00,
    type: "received",
    recipient: "Mike Johnson",
    description: "Rent payment",
    date: new Date("2025-10-14T09:00:00"),
    status: "completed",
  },
  {
    id: "4",
    app: "Stripe",
    amount: 1500.00,
    type: "received",
    recipient: "Client XYZ",
    description: "Project milestone",
    date: new Date("2025-10-13T14:20:00"),
    status: "completed",
  },
  {
    id: "5",
    app: "Zelle",
    amount: 80.00,
    type: "sent",
    recipient: "Emma Wilson",
    description: "Concert tickets",
    date: new Date("2025-10-12T20:15:00"),
    status: "completed",
  },
  {
    id: "6",
    app: "ApplePay",
    amount: 35.99,
    type: "sent",
    recipient: "Coffee Shop",
    description: "Coffee & pastries",
    date: new Date("2025-10-16T08:00:00"),
    status: "completed",
  },
  {
    id: "7",
    app: "PayPal",
    amount: 99.99,
    type: "sent",
    recipient: "Amazon",
    description: "Online purchase",
    date: new Date("2025-10-11T16:30:00"),
    status: "pending",
  },
  {
    id: "8",
    app: "Venmo",
    amount: 25.00,
    type: "received",
    recipient: "Alex Brown",
    description: "Gas money",
    date: new Date("2025-10-10T12:00:00"),
    status: "completed",
  },
];

export default function Home() {
  const [transactions] = useState<Transaction[]>(sampleTransactions);
  const [selectedApp, setSelectedApp] = useState<PaymentApp | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => selectedApp === "All" || t.app === selectedApp)
      .filter(
        (t) =>
          t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, selectedApp, searchQuery]);

  const stats = useMemo(() => {
    const received = filteredTransactions
      .filter((t) => t.type === "received")
      .reduce((sum, t) => sum + t.amount, 0);
    const sent = filteredTransactions
      .filter((t) => t.type === "sent")
      .reduce((sum, t) => sum + t.amount, 0);
    return { received, sent, total: received - sent };
  }, [filteredTransactions]);

  const paymentApps: (PaymentApp | "All")[] = [
    "All",
    "PayPal",
    "Venmo",
    "CashApp",
    "Stripe",
    "Zelle",
    "ApplePay",
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Payment Tracker</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="text-xs opacity-90">Received</div>
            <div className="text-lg font-bold">${stats.received.toFixed(2)}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="text-xs opacity-90">Sent</div>
            <div className="text-lg font-bold">${stats.sent.toFixed(2)}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="text-xs opacity-90">Net</div>
            <div className={`text-lg font-bold ${stats.total >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              ${stats.total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* App Filter Tabs */}
      <div className="sticky top-[208px] bg-white shadow-sm z-10 overflow-x-auto">
        <div className="flex gap-2 p-3 min-w-max">
          {paymentApps.map((app) => (
            <button
              key={app}
              onClick={() => setSelectedApp(app)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedApp === app
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {app}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-4 space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-medium">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`${
                      appColors[transaction.app]
                    } text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold`}
                  >
                    {transaction.app.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {transaction.recipient}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.app}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      transaction.type === "received"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "received" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.date.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {transaction.description}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : transaction.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.status}
                </span>
                <span className="text-xs text-gray-400">
                  {transaction.date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
