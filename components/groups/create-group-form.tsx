"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateGroup } from '../../hooks/api/use-groups';

interface GroupFormData {
  name: string;
  organization_id: string;
  department_id?: string;
  leader_id?: string;
  description?: string;
  is_active: boolean;
}

export function CreateGroupForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GroupFormData>({
    defaultValues: {
      is_active: true
    }
  });
  const { mutate: createGroup, isPending, isSuccess } = useCreateGroup();
  const onSubmit = (data: GroupFormData) => {
    createGroup(data, {
      onSuccess: () => {
        reset();
      }
    });
  };
  return (
    <div className="p-6 max-w-xl mx-auto bg-background rounded-xl shadow-md space-y-4 border border-border">
      <h2 className="text-2xl font-bold text-foreground">Create New Group</h2>
      {isSuccess && <div className="p-3 bg-green-50 text-green-700 rounded-md">Group created successfully!</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Group Name</label>
          <input 
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-md border-border shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Youth Choir"
          />
          {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Organization ID</label>
          <input 
            {...register("organization_id", { required: "Organization ID is required" })}
            className="w-full rounded-md border-border shadow-sm border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
          <textarea 
            {...register("description")}
            className="w-full rounded-md border-border shadow-sm border p-2 h-24"
          />
        </div>
        <div className="flex items-center">
          <input 
            type="checkbox"
            {...register("is_active")}
            className="rounded border-border text-blue-600 shadow-sm h-4 w-4"
          />
          <label className="ml-2 block text-sm text-foreground">Active Group</label>
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
}
