'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, DollarSign, Hash } from 'lucide-react';
import { donationService } from '@/api/services/admin/donationService';

const BankTransferForm = ({ isOpen, onClose, eventId, eventTitle, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    transactionCount: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a valid positive number';
    }

    if (!formData.transactionCount.trim()) {
      newErrors.transactionCount = 'Transaction count is required';
    } else if (isNaN(Number(formData.transactionCount)) || Number(formData.transactionCount) < 1) {
      newErrors.transactionCount = 'Transaction count must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await donationService.addBankTransferDonation(eventId, {
        total_amount: Number(formData.amount),
        transaction_count: Number(formData.transactionCount),
        notes: formData.notes.trim() || null,
      });

      if (response.status === 'success') {
        toast.success('Bank transfer donation added successfully');
      } else {
        throw new Error(response.message || 'Failed to add donation');
      }
      
      // Reset form
      setFormData({ amount: '', transactionCount: '', notes: '' });
      setErrors({});
      
      // Close modal and trigger refresh
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding bank transfer donation:', error);
      toast.error('Failed to add bank transfer donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isLoading) {
      setFormData({ amount: '', transactionCount: '', notes: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bank Transfer Donation</DialogTitle>
          <DialogDescription>
            Add donation amount & Number provided by donor made via bank transfer for "{eventTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field */}
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`pl-9 ${errors.amount ? 'border-red-500' : ''}`}
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Transaction Count Field */}
          <div className="space-y-2">
            <Label htmlFor="transactionCount">Number of Transactions</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="transactionCount"
                type="number"
                min="1"
                placeholder="1"
                className={`pl-9 ${errors.transactionCount ? 'border-red-500' : ''}`}
                value={formData.transactionCount}
                onChange={(e) => handleInputChange('transactionCount', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.transactionCount && (
              <p className="text-sm text-red-600">{errors.transactionCount}</p>
            )}
            <p className="text-sm text-gray-500">
              Enter the number of bank transactions made by the donor
            </p>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              rows="3"
              placeholder="Additional notes or comments..."
              className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.notes ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={isLoading}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Donation'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BankTransferForm;