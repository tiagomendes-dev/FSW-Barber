import BookingItem from "@/app/_components/booking-item";
import Header from "@/app/_components/header";
import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isFuture, isPast } from "date-fns";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Key } from "react";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/");
  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      service: true,
      barbershop: true,
    },
  });

  const confirmedBookings = bookings.filter((booking: { date: any }) =>
    isFuture(booking.date),
  );
  const finishedBookings = bookings.filter((booking: { date: any }) =>
    isPast(booking.date),
  );

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <h2 className="my-6 mb-3 text-sm font-bold uppercase text-gray-400">
          Confirmados
        </h2>

        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking: { id: Key | null | undefined }) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        <h2 className="my-6 mb-3 text-sm font-bold uppercase text-gray-400">
          Finalizados
        </h2>

        <div className="flex flex-col gap-3">
          {finishedBookings.map((booking: { id: Key | null | undefined }) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;