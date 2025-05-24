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
    is_fixed_donation: z.boolean().default(false),
    location: z.string().min(2, {
      message: 'Location must be at least 2 characters.',
    }),
    status: z.string().default('1'),
    is_featured: z.boolean().default(false),
    feature_image: z.any().optional(),
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
  is_fixed_donation: false,
  location: '',
  status: '1',
  is_featured: false,
  feature_image: null,
};

// Helper to format form data for API submission
export const formatEventDataForSubmission = (data) => {
  // Format dates to YYYY-MM-DD strings
  const formattedData = {
    ...data,
    start_date:
      data.start_date instanceof Date
        ? data.start_date.toISOString().split('T')[0]
        : data.start_date,
    end_date:
      data.end_date instanceof Date ? data.end_date.toISOString().split('T')[0] : data.end_date,
    is_fixed_donation: data.is_fixed_donation ? '1' : '0',
    is_featured: data.is_featured ? '1' : '0',
  };

  return formattedData;
};
