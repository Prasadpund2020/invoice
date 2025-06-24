import { connection} from mongoose;

declare global{
    var mongoose : {
        conn :connection ,
        promise:  promise<connection > | null,

}
}
export {}