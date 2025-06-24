import z from 'zod';


export const onboardingSchema = z.object({ 
    firstName: z.string().min(3, {message:"First name is required"}).max(50, {message:"First name must be less than 50 characters"}),
    lastName: z.string().min(3, {message:"Last name is required"}).max(50, {message:"Last name must be less than 50 characters"}),
    currency:z.string({message:"Currency is required"}).optional(),
});