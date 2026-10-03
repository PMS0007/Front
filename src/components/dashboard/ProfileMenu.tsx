"use client"

import { useState } from "react"
import { X, Mail, Phone, Briefcase, Calendar, LogOut, Bell } from "lucide-react"
import useProfileForm from "@/hooks/staff/useProfileForm"
import useLogOutForm from "@/hooks/auth/useLogOutForm"



export default function ProfileMenu() {

  const {handleSubmit} = useLogOutForm()
  


  const [isOpen, setIsOpen] = useState(false)
  const { data } = useProfileForm()

  const fullName = data?.staff_profile?.full_name || "Guest"
  const email = data?.email || "—"
  const phone = data?.staff_profile?.phone || "—"
  const role = data?.staff_profile?.role || "None"

  const rawHiredAt = data?.staff_profile?.hired_at

  const joined = rawHiredAt
    ? new Date(rawHiredAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "None"


  const initial = fullName.charAt(0).toUpperCase()

  return (
    <>
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-slate-50 cursor-pointer"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {initial}
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-slate-900">
              {fullName}
            </span>
            <span className="block text-xs text-slate-400">{email}</span>
          </span>
        </button>
      </div>

      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-1/4 min-w-[320px] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 border-b border-slate-200 px-6 py-8">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-teal-500 text-2xl font-semibold text-white">
            {initial}
          </span>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900">{fullName}</p>
            <p className="text-sm text-slate-400">{role}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
            Active shift
          </span>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-6 py-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Contact
          </p>

          <div className="flex items-center gap-3 rounded-xl px-2 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-medium text-slate-900">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl px-2 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="text-sm font-medium text-slate-900">{phone}</p>
            </div>
          </div>



          <div className="flex items-center gap-3 rounded-xl px-2 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Calendar className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs text-slate-400">Joined</p>
              <p className="text-sm font-medium text-slate-900">{joined}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <button 
          onClick={handleSubmit} 
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}