import * as z from 'zod';

// Define form schema with validation
export const eventFormSchema = z
  .object({
    title: z.string().min(2, {
      message: 'Event title must be at least 2 characters.',
    }),
    description: z.string().min(10, {
      message: 'Description must be at least 10 characters.',
    }),
    start_date: z.date({
      required_error: 'Start date is required.',
    }),
    end_date: z
      .date({
        required_error: 'End date is required.',
      })
      .refine((data) => data >= new Date(), {
        message: 'End date cannot be in the past.',
      }),
    price: z.coerce.number().min(0, {
      message: 'Price must be a positive number.',
    }),
    target_amount: z.coerce.number().min(0, {
      message: 'Target amount must be a positive number.',
    }),
    is_fixed_donation: z.number().default(0),
    location: z
      .string()
      .min(2, {
        message: 'Location must be at least 2 characters.',
      })
      .nullable(),
    status: z.number().default(1),
    is_featured: z.number().default(0),
    featured_image: z.any().optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: 'End date must be after start date',
    path: ['end_date'],
  });

// Default form values
export const defaultEventValues = {
  title: '',
  description: '',
  start_date: new Date(),
  end_date: new Date(),
  price: 0,
  target_amount: 0,
  is_fixed_donation: 0,
  location: '',
  status: 1,
  is_featured: 0,
  featured_image: null,
};
