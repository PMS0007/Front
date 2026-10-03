'use client'

import { X, Minus, Plus, User, Mail, Phone } from "lucide-react";
import { BookingFormPayload } from "@/interface/BookingInterface";
import { useAddBookingModal } from "@/hooks/booking/useBookingAddModal";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: BookingFormPayload) => Promise<void> | void;
}

function Counter({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-4 text-center text-sm font-medium text-gray-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {label} {required && <span className="text-gray-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none";

export default function AddBookingModal({ isOpen, onClose, onSubmit }: AddBookingModalProps) {
  const form = useAddBookingModal({ onSubmit, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">New Booking</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto px-6 py-5 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Field label="Full Name" required>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={(e) => form.setFullName(e.target.value)}
                          placeholder="Enter full name"
                          className={`${inputClass} pr-8`}
                          required
                        />
                        <User className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                      </div>
                    </Field>
                  </div>

                  <div className="col-span-2">
                    <Field label="Email" required>
                      <div className="relative">
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => form.setEmail(e.target.value)}
                          placeholder="your_email@gmail.com"
                          className={`${inputClass} pr-8`}
                          required
                        />
                        <Mail className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                      </div>
                    </Field>
                  </div>

                  <div className="col-span-2">
                    <Field label="Phone Number" required>
                      <div className="flex gap-2">
                        <select
                          value={form.countryCode}
                          onChange={(e) => form.setCountryCode(e.target.value)}
                          className="w-24 rounded-lg border border-gray-200 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option value="+39">+39</option>
                          <option value="+380">+380</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <div className="relative flex-1">
                          <input
                            type="tel"
                            value={form.phoneNumber}
                            onChange={(e) => form.setPhoneNumber(e.target.value)}
                            placeholder="enter your number"
                            className={`${inputClass} pr-8`}
                            required
                          />
                          <Phone className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Check In" required>
                    <input
                      type="date"
                      value={form.checkInDate}
                      onChange={(e) => form.setCheckInDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </Field>

                  <Field label="Check Out" required>
                    <input
                      type="date"
                      value={form.checkOutDate}
                      onChange={(e) => form.setCheckOutDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </Field>

                  <Field label="Adults">
                    <Counter value={form.adults} onChange={form.setAdults} min={1} />
                  </Field>

                  <Field label="Children">
                    <Counter value={form.children} onChange={form.setChildren} min={0} />
                  </Field>

                  <div className="col-span-2">
                    
                    <Field label="Room Type" required>
                      <select
                        value={form.roomType}
                        onChange={(e) =>
                          form.setRoomType(e.target.value ? Number(e.target.value) : "")
                        }
                        className={inputClass}
                        required
                      >
                        <option value="">Select room type</option>
                        {form.isTypesLoading ? (
                          <option disabled>Loading...</option>
                        ) : (
                          form.fullTypes?.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))
                        )}
                      </select>
                    </Field>
                  </div>

                  <Field label="Rooms">
                    <Counter value={form.rooms} onChange={form.setRooms} min={1} />
                  </Field>

                  <Field label="Room No">
                    <select
                      value={form.roomNo}
                      onChange={(e) => form.setRoomNo(e.target.value)}
                      className={inputClass}
                      disabled={!form.roomType}
                    >
                      <option value="">
                        {!form.roomType ? "Select room type first" : "Select room"}
                      </option>

                      {form.availableRooms.map((room) => (
                        <option key={room.id} value={room.room_number || room.id}>
                          Room {room.room_number || room.number || room.id}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
                Preview
              </h3>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-500">Guest Information</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>Name: {form.fullName || "—"}</li>
                    <li>Email: {form.email || "—"}</li>
                    <li>
                      Phone: {form.phoneNumber ? `${form.countryCode}${form.phoneNumber}` : "—"}
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-500">Booking Details</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>Check-in: {form.checkInDate || "—"}</li>
                    <li>Check-out: {form.checkOutDate || "—"}</li>
                    <li>Duration: {form.nights} night{form.nights === 1 ? "" : "s"}</li>
                    <li>Total Guests: {form.adults + form.children}</li>
                    <li>Room Type ID: {form.roomType || "—"}</li>
                    <li>Number of Rooms: {form.rooms}</li>
                    <li>Room No: {form.roomNo || "—"}</li>
                  </ul>
                </div>

                <div className="space-y-1 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Sub Total</span>
                    <span className="font-medium">${form.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Service Fee</span>
                    <span className="font-medium">${form.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Discount</span>
                    <span className="font-medium">${form.discount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-green-600">${form.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={form.isSubmitting}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {form.isSubmitting ? "Creating..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}