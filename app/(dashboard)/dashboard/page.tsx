import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

export default function DashboardPage() {
    return (
        <div className="font-bold text-purple-800">
            dashboard page
            <Button onClick={async () => {
                "use server";
                await signOut();
            }}>
                Logout
            </Button>
        </div>
    );
}
