"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateEvent } from '../../hooks/api/use-events';

interface EventFormData {
  name: string;
  organization_id: string;
  start_time: string;
  location: string;
  description: string;
}

export function CreateEventForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>();
  const { mutate: createEvent, isPending, isSuccess } = useCreateEvent();
  const onSubmit = (data: EventFormData) => {
    // Ensure start_time is a valid ISO format
    data.start_time = new Date(data.start_time).toISOString();
    createEvent(data, {
      onSuccess: () => {
        reset(); // Clear form on success
      }
    });
  };
  return (
    <div className="p-6 max-w-xl mx-auto bg-background rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Create New Event</h2>
      {isSuccess && <p className="text-green-600">Event created successfully!</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Event Name</label>
          <input 
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full rounded-md border-border shadow-sm border p-2"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium">Organization ID</label>
          <input 
            {...register("organization_id", { required: "Organization ID is required" })}
            className="mt-1 block w-full rounded-md border-border shadow-sm border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Start Time</label>
          <input 
            type="datetime-local"
            {...register("start_time", { required: "Start time is required" })}
            className="mt-1 block w-full rounded-md border-border shadow-sm border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input 
            {...register("location")}
            className="mt-1 block w-full rounded-md border-border shadow-sm border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea 
            {...register("description")}
            className="mt-1 block w-full rounded-md border-border shadow-sm border p-2"
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
