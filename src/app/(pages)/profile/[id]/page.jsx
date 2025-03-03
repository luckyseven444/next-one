"use client";
import { useSearchParams } from "next/navigation";

const ProfileID = () =>{
    const searchParams = useSearchParams();
    const name = searchParams.get("name") || "Guest";
    return (
        <div>
            ProfileID
            
            <div>Profile Name: {name}</div>
        </div>
        
    )
}

export default ProfileID;