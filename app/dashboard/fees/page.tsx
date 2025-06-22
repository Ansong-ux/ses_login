import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getOutstandingFees,
  getFeeStructure,
  getPaymentHistory,
} from "@/lib/db";
import Link from "next/link";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Calendar,
  Download,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  BarChart3,
  Receipt,
  Wallet,
  Target,
} from "lucide-react";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function FeesPage() {
  const user = await getUser();
  const outstandingFees = await getOutstandingFees();
  const feeStructure = await getFeeStructure();
  const paymentHistory = await getPaymentHistory();

  const getStats = () => {
    const totalOutstanding = outstandingFees.reduce(
      (sum: number, fee: any) => sum + (fee.amount || 0),
      0
    );
    const totalPaid = paymentHistory.reduce(
      (sum: number, payment: any) => sum + (payment.amount || 0),
      0
    );
    const overdueCount = outstandingFees.filter(
      (fee: any) => fee.is_overdue
    ).length;

    return [
      {
        title: "Total Outstanding",
        value: `$${totalOutstanding.toLocaleString()}`,
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "Amount due",
      },
      {
        title: "Total Paid",
        value: `$${totalPaid.toLocaleString()}`,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "This semester",
      },
      {
        title: "Overdue Fees",
        value: overdueCount,
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "Requires attention",
      },
      {
        title: "Payment Rate",
        value: `${Math.round(
          (totalPaid / (totalPaid + totalOutstanding)) * 100
        )}%`,
        icon: TrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Completion rate",
      },
    ];
  };

  const getPaymentMethods = () => {
    return [
      { name: "Credit Card", percentage: 45, color: "bg-blue-500" },
      { name: "Bank Transfer", percentage: 30, color: "bg-green-500" },
      { name: "Cash", percentage: 15, color: "bg-purple-500" },
      { name: "Mobile Money", percentage: 10, color: "bg-orange-500" },
    ];
  };

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {getStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-slate-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-slate-500">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Fee Structure */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Receipt className="h-5 w-5 text-blue-600" />
            Fee Structure
          </CardTitle>
          <CardDescription>
            Current fee structure by academic level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {feeStructure.map((fee: any, index: number) => (
              <div
                key={index}
                className="p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-colors group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-blue-200 text-blue-700 bg-blue-50"
                  >
                    Level {fee.level}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-slate-900">
                    ${fee.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600">Per semester</p>
                  <p className="text-xs text-slate-500">
                    Academic year 2024/2025
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Methods */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <CreditCard className="h-5 w-5 text-green-600" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Distribution of payment methods used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getPaymentMethods().map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">
                      {method.name}
                    </span>
                    <span className="text-sm text-slate-600">
                      {method.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${method.color} transition-all duration-500`}
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Wallet className="h-5 w-5 text-purple-600" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  Most recent fee payments from students
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {paymentHistory.slice(0, 5).map((payment: any) => (
                <div
                  key={payment.payment_id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        payment.status === "Completed"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {payment.status === "Completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {payment.student_name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {payment.payment_method} - ID: {payment.transaction_id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        payment.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      ${payment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 