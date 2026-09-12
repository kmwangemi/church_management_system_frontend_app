"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRecordOffering } from '../../hooks/api/use-finances';

interface OfferingFormData {
  amount: number;
  type: string;
  payment_method: string;
  organization_id: string;
}

export function RecordOfferingForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OfferingFormData>({
    defaultValues: {
      type: "TITHE",
      payment_method: "M_PESA"
    }
  });
  const { mutate: recordOffering, isPending, isSuccess } = useRecordOffering();
  const onSubmit = (data: OfferingFormData) => {
    // Ensure amount is float
    data.amount = parseFloat(data.amount as unknown as string);
    recordOffering(data, {
      onSuccess: () => {
        reset();
      }
    });
  };
  return (
    <div className="p-6 max-w-xl mx-auto bg-background rounded-xl shadow-md space-y-4 border border-border">
      <h2 className="text-2xl font-bold text-foreground">Record Offering</h2>
      {isSuccess && <div className="p-3 bg-green-50 text-green-700 rounded-md">Offering recorded successfully!</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Amount</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted-foreground sm:text-sm">$</span>
            </div>
            <input 
              type="number"
              step="0.01"
              {...register("amount", { required: "Amount is required", min: 0.01 })}
              className="pl-7 block w-full rounded-md border-border shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <span className="text-red-500 text-sm mt-1">{errors.amount.message}</span>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Offering Type</label>
            <select 
              {...register("type")}
              className="w-full rounded-md border-border shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 bg-background"
            >
              <option value="TITHE">Tithe</option>
              <option value="OFFERING">General Offering</option>
              <option value="BUILDING_FUND">Building Fund</option>
              <option value="MISSIONS">Missions</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Payment Method</label>
            <select 
              {...register("payment_method")}
              className="w-full rounded-md border-border shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 bg-background"
            >
              <option value="CASH">Cash</option>
              <option value="M_PESA">M-Pesa</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CARD">Card</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Organization ID</label>
          <input 
            {...register("organization_id", { required: "Organization ID is required" })}
            className="w-full rounded-md border-border shadow-sm border p-2"
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Processing...' : 'Record Payment'}
        </button>
      </form>
    </div>
  );
}
