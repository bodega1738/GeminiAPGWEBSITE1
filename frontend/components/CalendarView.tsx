import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Users,
  MapPin,
  Anchor
} from 'lucide-react';

export default function CalendarView() {
  const viewRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dummy bookings data with Filipino context
  const dummyBookings = [
    {
      id: 1,
      title: 'Santos Anniversary Cruise',
      client: 'Maria Santos',
      vessel: 'Luxury Yacht "Perla"',
      date: new Date(2024, 2, 15),
      time: '4:00 PM - 8:00 PM',
      guests: 20,
      status: 'confirmed',
      location: 'Subic Bay',
      type: 'anniversary',
      notes: 'Sunset cruise with dinner service'
    },
    {
      id: 2,
      title: 'Team Building Adventure',
      client: 'ABC Corporation',
      vessel: 'Catamaran "Bandera"',
      date: new Date(2024, 2, 8),
      time: '9:00 AM - 5:00 PM',
      guests: 35,
      status: 'confirmed',
      location: 'Anawangin Cove',
      type: 'corporate',
      notes: 'Full day package with activities'
    },
    {
      id: 3,
      title: 'Birthday Celebration',
      client: 'Sarah Chen',
      vessel: 'Speedboat "Sigaw"',
      date: new Date(2024, 2, 28),
      time: '2:00 PM - 6:00 PM',
      guests: 8,
      status: 'pending',
      location: 'Nagsasa Cove',
      type: 'birthday',
      notes: 'With jet ski rental and snorkeling'
    },
    {
      id: 4,
      title: 'Corporate Event',
      client: 'XYZ Holdings',
      vessel: 'Private Yacht "Kalayaan"',
      date: new Date(2024, 2, 22),
      time: '6:00 PM - 11:00 PM',
      guests: 50,
      status: 'confirmed',
      location: 'Subic Bay',
      type: 'corporate',
      notes: 'Formal dinner cruise with AV setup'
    },
    {
      id: 5,
      title: 'Pre-Wedding Shoot',
      client: 'Anna & Miguel',
      vessel: 'Catamaran "Pag-ibig"',
      date: new Date(2024, 2, 5),
      time: '3:00 PM - 7:00 PM',
      guests: 12,
      status: 'confirmed',
      location: 'Camara Island',
      type: 'wedding',
      notes: 'Photography package included'
    }
  ];

  useEffect(() => {
    gsap.fromTo(viewRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    gsap.fromTo('.calendar-cell',
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.4, 
        stagger: 0.02, 
        ease: "power2.out",
        delay: 0.2
      }
    );
  }, [currentDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date | null) => {
    if (!date) return [];
    return dummyBookings.filter(booking => 
      booking.date.toDateString() === date.toDateString()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 border-green-400/30 text-green-300';
      case 'pending': return 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300';
      case 'cancelled': return 'bg-red-500/20 border-red-400/30 text-red-300';
      default: return 'bg-gray-500/20 border-gray-400/30 text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wedding': return '💒';
      case 'birthday': return '🎂';
      case 'corporate': return '🏢';
      case 'anniversary': return '💕';
      default: return '⚓';
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateBookings = getBookingsForDate(selectedDate);

  return (
    <div ref={viewRef} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-light text-emerald-100 tracking-wide">
            Booking Calendar
          </h2>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/30 transition-all">
          <Plus className="w-4 h-4" />
          <span>New Booking</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-emerald-100">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex space-x-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-lg bg-slate-900/50 border border-emerald-500/20 text-emerald-300 hover:text-emerald-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-lg bg-slate-900/50 border border-emerald-500/20 text-emerald-300 hover:text-emerald-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-emerald-300/60">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const bookings = getBookingsForDate(day);
              const isSelected = day && selectedDate.toDateString() === day.toDateString();
              const isToday = day && new Date().toDateString() === day.toDateString();
              
              return (
                <div
                  key={index}
                  className={`
                    calendar-cell relative h-24 p-1 border border-emerald-500/10 rounded-lg cursor-pointer
                    transition-all duration-200 hover:bg-emerald-500/10
                    ${isSelected ? 'bg-emerald-500/20 border-emerald-400/40' : ''}
                    ${isToday ? 'ring-1 ring-emerald-400/50' : ''}
                    ${!day ? 'cursor-default' : ''}
                  `}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium ${isToday ? 'text-emerald-200' : 'text-emerald-300/80'}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1 mt-1">
                        {bookings.slice(0, 2).map(booking => (
                          <div 
                            key={booking.id}
                            className={`text-xs px-1 py-0.5 rounded text-center border ${getStatusColor(booking.status)}`}
                          >
                            {getTypeIcon(booking.type)} {booking.client.split(' ')[0]}
                          </div>
                        ))}
                        {bookings.length > 2 && (
                          <div className="text-xs text-emerald-300/60 text-center">
                            +{bookings.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <div className="bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-lg font-medium text-emerald-100 mb-4">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>

            {selectedDateBookings.length === 0 ? (
              <p className="text-emerald-300/60 text-center py-8">
                No bookings for this date
              </p>
            ) : (
              <div className="space-y-4">
                {selectedDateBookings.map(booking => (
                  <div key={booking.id} className="bg-slate-900/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-emerald-100">{booking.title}</h4>
                        <p className="text-sm text-emerald-300/70">{booking.client}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-emerald-300/70">
                        <Anchor className="w-4 h-4" />
                        <span>{booking.vessel}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-emerald-300/70">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-emerald-300/70">
                        <Users className="w-4 h-4" />
                        <span>{booking.guests} guests</span>
                      </div>
                      <div className="flex items-center space-x-2 text-emerald-300/70">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.location}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-emerald-500/20">
                      <p className="text-xs text-emerald-300/60">{booking.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fleet Status */}
          <div className="bg-slate-800/30 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-lg font-medium text-emerald-100 mb-4">Fleet Status</h3>
            <div className="space-y-3">
              {[
                { name: 'Luxury Yacht "Perla"', status: 'available', bookings: 3 },
                { name: 'Catamaran "Bandera"', status: 'booked', bookings: 5 },
                { name: 'Speedboat "Sigaw"', status: 'maintenance', bookings: 0 },
                { name: 'Private Yacht "Kalayaan"', status: 'available', bookings: 2 },
                { name: 'Catamaran "Pag-ibig"', status: 'available', bookings: 4 },
              ].map((vessel, index) => (
                <div key={vessel.name} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      vessel.status === 'available' ? 'bg-green-400' :
                      vessel.status === 'booked' ? 'bg-orange-400' :
                      'bg-red-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-emerald-100">{vessel.name}</p>
                      <p className="text-xs text-emerald-300/60 capitalize">{vessel.status}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-emerald-300/60">This Month</p>
                    <p className="text-sm font-medium text-emerald-100">{vessel.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
