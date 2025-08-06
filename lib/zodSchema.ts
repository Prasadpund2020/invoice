import z from 'zod';

export const onboardingSchema = z.object({
  firstName: z.string().min(3, { message: "First name is required" }).max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string().min(3, { message: "Last name is required" }).max(50, { message: "Last name must be less than 50 characters" }),
  currency: z.string({ message: "Currency is required" }),
  address1: z.string().min(1, 'Address 1 is required'),
  address2: z.string().optional(),
  address3: z.string().optional(),

  // ✅ New field: Phone number (optional)
  phone: z.string().min(6, { message: "Phone number is too short" }).max(10, { message: "Phone number is too long" }).optional(),

  // ✅ New field: Logo image (optional base64 string)
  logo: z.string().optional(),

  // ✅ New field: Signature with name and image
  signature: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
  }).optional(),
});


export const InvoiceSchemaZod = z.object({
  invoice_no: z.string().optional(),
  invoice_date: z.date({ message: "invoice date is required" }),
  due_date: z.date({ message: "due date is required" }),
  currency: z.string().min(1, { message: "currency is required" }).optional(),
  showBankDetails: z.boolean().optional(), // ✅ ADD THIS

  from: z.object({
    name: z.string().min(3, { message: "name is required" }).max(100, { message: "name is having max hundred character" }),
    email: z.string().email({ message: "email is required" }),
    address1: z.string().min(5, { message: "Adress is required" }),
    address2: z.string().optional(),
    address3: z.string().optional(),
  }),

  to: z.object({
    name: z.string().min(3, { message: "name is required" }).max(100, { message: "name is having max hundred character" }),
    email: z.string().email({ message: "email is required" }),
    address1: z.string().min(5, { message: "Adress is required" }),
    address2: z.string().optional(),
    address3: z.string().optional(),
  }),

  items: z.array(z.object({
    item_name: z.string().min(3, { message: "item name is required" }).max(50, { message: "max character limit reached " }),
    quantity: z.number().min(0, { message: "Quantity can't be Negative" }),
    item_description: z.string().optional(), // ✨ New field

    price: z.number().min(0, { message: "Price can't be Negative" }),
    total: z.number().min(0, { message: "Total can't be Negative" }),
  })),

  sub_total: z.number(),
  discount: z.number(),
  tax_percentage: z.number(),
  total: z.number(),
  notes: z.string().optional(),
});
export const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().min(1, "Address Line 2 is required"),
  address3: z.string().min(1, "Address Line 3 is required"),
});
export const UpdateonboardingSchema = z.object({
  firstName: z.string().min(3, { message: "First name is required" }).max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string().min(3, { message: "Last name is required" }).max(50, { message: "Last name must be less than 50 characters" }),
  currency: z.string({ message: "Currency is required" }),
  email: z.string().email("Invalid email").optional(),
})

  