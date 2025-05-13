// components/donations/DonationFilters.jsx
"use client";

import React, { useState } from "react";
import { Search, Filter, Calendar, Download, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DonationFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  paymentMethodFilter,
  setPaymentMethodFilter,
  amountFilter,
  setAmountFilter,
  statusCounts,
  paymentMethods,
  exportDonations,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search donations..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Date
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto p-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-normal p-4"
                  >
                    {dateFilter ? "Clear Date Filter" : "Select Date..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
              <SelectItem value="name-a-z">Donor Name A-Z</SelectItem>
              <SelectItem value="name-z-a">Donor Name Z-A</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={exportDonations}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap gap-2 py-2 items-center">
            <div className="text-sm text-muted-foreground">Status:</div>
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
              <Badge variant="outline" className="ml-2">
                {statusCounts.all}
              </Badge>
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
            >
              Completed
              <Badge variant="outline" className="ml-2">
                {statusCounts.completed}
              </Badge>
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
              <Badge variant="outline" className="ml-2">
                {statusCounts.pending}
              </Badge>
            </Button>
            <Button
              variant={statusFilter === "failed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("failed")}
            >
              Failed
              <Badge variant="outline" className="ml-2">
                {statusCounts.failed}
              </Badge>
            </Button>
            <Button
              variant={statusFilter === "refunded" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("refunded")}
            >
              Refunded
              <Badge variant="outline" className="ml-2">
                {statusCounts.refunded}
              </Badge>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 py-2 items-center">
            <div className="text-sm text-muted-foreground">Payment Method:</div>
            <Button
              variant={paymentMethodFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setPaymentMethodFilter("all")}
            >
              All Methods
            </Button>
            {paymentMethods.map((method) => (
              <Button
                key={method}
                variant={paymentMethodFilter === method ? "default" : "outline"}
                size="sm"
                onClick={() => setPaymentMethodFilter(method)}
              >
                {method}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 py-2 items-center">
            <div className="text-sm text-muted-foreground">Amount:</div>
            <Select value={amountFilter} onValueChange={setAmountFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="under-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1000</SelectItem>
                <SelectItem value="over-1000">Over $1000</SelectItem>
              </SelectContent>
            </Select>

            {dateFilter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateFilter(null)}
                className="ml-auto"
              >
                Clear Date Filter
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationFilters;
