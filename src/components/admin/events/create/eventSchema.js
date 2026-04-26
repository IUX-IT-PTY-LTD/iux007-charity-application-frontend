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
    }).nullable(),
    is_fixed_donation: z.boolean().default(false),
    location: z
      .string()
      .min(2, {
        message: 'Location must be at least 2 characters.',
      })
      .nullable(),
    status: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    featured_image: z.any().optional(),
    // Qurbani donation fields
    is_qurbani_donation: z.boolean().default(false),
    // Australia Qurbani pricing
    cow_price: z.coerce.number().min(0, {
      message: 'Cow price must be a positive number.',
    }).nullable(),
    goat_price: z.coerce.number().min(0, {
      message: 'Goat price must be a positive number.',
    }).nullable(),
    lamb_price: z.coerce.number().min(0, {
      message: 'Lamb price must be a positive number.',
    }).nullable(),
    // Overseas Qurbani pricing
    overseas_cow_price: z.coerce.number().min(0, {
      message: 'Overseas cow price must be a positive number.',
    }).nullable(),
    overseas_goat_price: z.coerce.number().min(0, {
      message: 'Overseas goat price must be a positive number.',
    }).nullable(),
    overseas_lamb_price: z.coerce.number().min(0, {
      message: 'Overseas lamb price must be a positive number.',
    }).nullable(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: 'End date must be after start date',
    path: ['end_date'],
  })
  .refine((data) => {
    if (data.is_qurbani_donation) {
      const hasAustraliaPrice = data.cow_price > 0 || data.goat_price > 0 || data.lamb_price > 0;
      const hasOverseasPrice = data.overseas_cow_price > 0 || data.overseas_goat_price > 0 || data.overseas_lamb_price > 0;
      return hasAustraliaPrice || hasOverseasPrice;
    }
    return true;
  }, {
    message: 'At least one Qurbani price must be set for Australia or Overseas when Qurbani donation is enabled',
    path: ['is_qurbani_donation'],
  });

// Default form values
export const defaultEventValues = {
  title: '',
  description: '',
  start_date: new Date(),
  end_date: new Date(),
  price: 0,
  target_amount: null,
  is_fixed_donation: false,
  location: '',
  status: true,
  is_featured: false,
  featured_image: null,
  // Qurbani donation defaults
  is_qurbani_donation: false,
  // Australia pricing
  cow_price: null,
  goat_price: null,
  lamb_price: null,
  // Overseas pricing
  overseas_cow_price: null,
  overseas_goat_price: null,
  overseas_lamb_price: null,
};
