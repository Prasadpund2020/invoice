import Image from "next/image"

export default function Logo(){
    return (
        <div>
            <Image
                src="/invoice-ly (2).png"
                alt="generate invoice"
                width={240}
                height={30}
                priority
                style={{ height: "auto" }}  // <-- recommended
            />
        </div>
    )
}
