"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
import { Upload } from "lucide-react";

export default function ReviewModal() {
    const [open, setOpen] = useState(false)

    return (<></>
        // <Dialog open={open} onOpenChange={setOpen}>
        //     <DialogTrigger asChild>
        //         <Button variant="link" className="text-blue-500 hover:text-blue-600 px-0">
        //             Write a review
        //         </Button>
        //     </DialogTrigger>
        //     <DialogContent className="sm:max-w-[425px]">
        //         <DialogHeader>
        //             <DialogTitle className="text-2xl font-semibold text-[#1a237e]">Write a review</DialogTitle>
        //             <DialogDescription className="text-gray-500">
        //                 Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
        //             </DialogDescription>
        //         </DialogHeader>
        //         <form className="mt-6 space-y-6" action={}>
        //             <div className="space-y-2">
        //                 <label htmlFor="message" className="text-xl font-medium">
        //                     Leave a message
        //                 </label>
        //                 <Textarea
        //                     id="message"
        //                     placeholder="What is your update"
        //                     className="min-h-[200px] resize-none p-4 text-gray-500 bg-white rounded-lg"
        //                 />
        //             </div>

        //             <div className="space-y-3">
        //                 <Button
        //                     variant="secondary"
        //                     className="w-full text-base bg-gray-400 hover:bg-gray-500 text-white"
        //                     onClick={() => setOpen(false)}
        //                 >
        //                     <Upload/> Upload changes
        //                 </Button>
        //                 <Button
        //                     className="w-full text-base bg-[#4355f9] hover:bg-[#3a47d5]"
        //                     onClick={() => setOpen(false)}
        //                 >
        //                     Send a review
        //                 </Button>
        //             </div>
        //         </form>
        //     </DialogContent>
        // </Dialog>
    )
}

