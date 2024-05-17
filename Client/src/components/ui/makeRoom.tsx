import { FaArrowAltCircleLeft } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useSupabaseMutation } from "supabase-query";
import { useQueryClient } from "react-query";
import { Spinner } from "./spinner";
import { UserCTX } from "@/routes/App";
import { LeftFadeIn } from "@/utils/variants";

export default function MakeRoom({ sidebarShown }: { sidebarShown: boolean }) {
  const User = useContext(UserCTX)
  const [RoomName, setRoomname] = useState("")
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useSupabaseMutation({
    onSuccess: () => queryClient.invalidateQueries("room"),
  });

  const handleSubmit = () => {
    setRoomname("")
    mutate((supabase) =>
      supabase.from("room").insert([{ name: RoomName, creator: User?.id, members: 1 }])
    )
  }
  const handlerEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.2 }}
          variants={LeftFadeIn}
          custom={-1}
          initial={false}
          animate={sidebarShown ? "open" : "closed"}
          className="bg-primary w-[6rem] font-sans rounded-lg p-2 flex justify-center" style={{ borderRadius: "8px" }}>
          <FaPlus className="self-center" size={15} />  ثبت
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          {isLoading ? <Spinner /> : (<div>
            <DialogTitle>یه اتاق نو </DialogTitle>
            <DialogDescription>
              اسم اتاق جدیدت چی میتونه باشه ؟!!  🧐
            </DialogDescription>
          </div>)}
        </DialogHeader>
        <div className="flex items-center justify-betweeen">
          <Input
            value={RoomName}
            onChange={(e) => setRoomname(e.target.value)}
            onKeyPress={handlerEnter}
            placeholder="اسم اتاق"
          />
          <Button type="submit" onClick={handleSubmit} size="sm" style={{ borderRadius: 7, marginRight: 5 }} className="px-3 ml-10">
            <span className="sr-only">Copy</span>
            <FaArrowAltCircleLeft size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
