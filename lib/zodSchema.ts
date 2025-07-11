import z from 'zod';


export const onboardingSchema = z.object({
    firstName: z.string().min(3, { message: "First name is required" }).max(50, { message: "First name must be less than 50 characters" }),
    lastName: z.string().min(3, { message: "Last name is required" }).max(50, { message: "Last name must be less than 50 characters" }),
    currency: z.string({ message: "Currency is required" }).optional(),
});


export const InvoiceSchemaZod = z.object({

    invoice_no: z.string().min(1,{message:"invoice no is required"}),
    invoice_date: z.date({ message: "invoice date is required" }),
    due_date: z.date({ message: "due date is required" }),
    currency: z.string().min(1,{ message: "currency is required" }).optional(),
    from: z.object({
        name: z.string().min(3, { message: "name is required" }).max(100, { message: "name is having max hundred character" }),
        email:z.string().email({message:"email is required"}),
        address1:z.string().min(5,{message:"Adress is required"}),
        address2:z.string().optional(),
        address3:z.string().optional(),

    }),
    to: z.object({
        name: z.string().min(3, { message: "name is required" }).max(100, { message: "name is having max hundred character" }),
        email:z.string().email({message:"email is required"}),
        address1:z.string().min(5,{message:"Adress is required"}),
        address2:z.string().optional(),
        address3:z.string().optional(),

    }),

    items: z.array(z.object({
        item_name:z.string().min(3,{message:"item name is required"}).max(10,{message:"max character limit reached "}),
        quantity:z.number().min(0,{message:"Quantity can't be Negative"}),
        price:z.number().min(0,{message:"Price can't be Negative"}),
        total:z.number().min(0,{message:"Total can't be Negative"}),

    })),
    sub_total: z.number(),
    discount: z.number(),


    tax_percentage:z.number(),
    total: z.number(),
    notes: z.string().optional(),
   // status: z.enum(["PAID","UNPAID","CANCEL"])

})

