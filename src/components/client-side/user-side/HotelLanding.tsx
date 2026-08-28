"use client";

import { useCallback, useEffect, useState } from "react";

import BookingModal from "./BookingModal";
import About from "./About";
import CallMeBackModal from "./CallMeBackModal";
import FaqAccordion from "./FaqAccordion";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import RoomsSection from "./RoomsSection";
import Toast from "./Toast";


import {
  defaultBooking,
  nightsBetween,
  nextDay,
  type BookingDraft,
} from "@/lib/booking";


export default function HotelLanding() {
  const [draft, setDraft] = useState<BookingDraft>(defaultBooking);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openBooking = useCallback((roomId?: string) => {
    setDraft((current) => ({
      ...current,
      roomId: roomId ?? current.roomId,
    }));
    setBookingOpen(true);
  }, []);

  const scrollToBooking = useCallback(() => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function handleDraftChange(next: BookingDraft) {
    setDraft(
      nightsBetween(next.checkIn, next.checkOut) < 1
        ? { ...next, checkOut: nextDay(next.checkIn) }
        : next,
    );
  }

  return (
    <div className="bg-cream">
      <Header
        onCallMeBack={() => setCallbackOpen(true)}
        onBookNow={scrollToBooking}
      />
      <main>
        <Hero
          draft={draft}
          onChange={handleDraftChange}
          onSearch={() => openBooking()}
        />
        <About />
        <RoomsSection onBookRoom={(roomId) => openBooking(roomId)} />
        <FaqAccordion />
      </main>
      <Footer onCallMeBack={() => setCallbackOpen(true)} />

      <BookingModal
        open={bookingOpen}
        draft={draft}
        onChange={handleDraftChange}
        onClose={() => setBookingOpen(false)}
        onSuccess={setToast}
      />
      <CallMeBackModal
        open={callbackOpen}
        onClose={() => setCallbackOpen(false)}
        onSuccess={setToast}
      />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
