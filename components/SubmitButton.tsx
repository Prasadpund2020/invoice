"use client";

import {Button}from '@/components/ui/button';
import {useFormStatus} from 'react-dom';


export default function SubmitButton({title}: {title: string}) {
    const{ pending }= useFormStatus()
  return (
    <Button >
      {pending ? "please wait..." : title}
    </Button>
  );
}