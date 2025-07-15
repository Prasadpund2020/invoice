import { ReactNode } from 'react';
import { Resend } from 'resend';

const resend = new Resend(process.env.AUTH_RESEND_KEY);
//console.log("key",resend)

export async function sendEmail(to:string, subject:string,reactHTML: ReactNode){
    const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: to,
    subject: subject,
    react:reactHTML,
  });


  if(error){
    return error
  }
  return data

}
  
