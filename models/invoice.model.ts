import mongoose from 'mongoose';

interface IUserInvoice{
    name :string;
    email:string;
    address1:string;
    address2?:string;
    address3?:string;

}
interface IItem{
    item_name :string;
    quantity:string ;
    price:number;
    total:number;

}


export interface IInvoice{
    _id? :mongoose.Types.ObjectId;
    invoice_no: string;
    invoice_data: Date;
    due_date:Date;
    currency:string;


// from current user 
    from:IUserInvoice;



// to client 
    to:IUserInvoice;

    item :IItem[]
    sub_total:number;
    discount:number;

    //tax details 
    tax_percentage :number|null;

    total:number;
    notes?:string |null;


    created_at?:Date;
    updated_at?:Date;
}
const UserInvoiceSchema =new mongoose.Schema<IUserInvoice>({
    name: {type: String,required:true},
    email:{type:String,required:true},
    address1:{type:String,required:true},
    address2:{type:String,default:null},
    address3:{type:String,default:null},
},{
    _id : false
})
