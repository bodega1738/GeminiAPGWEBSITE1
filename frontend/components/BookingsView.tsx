import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@antml:invoke>
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus } from 'lucide-react';

export default function BookingsView() {
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [selectedShip, setSelectedShip] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const result = await backend.bookings.listBookings();
      return result.bookings;
    },
  });

  const { data: ships } = useQuery({
    queryKey: ['ships'],
    queryFn: async () => {
      const result = await backend.fleet.listShips();
      return result.ships;
    },
  });

  const quickBookMutation = useMutation({
    mutationFn: async () => {
      return await backend.bookings.quickBook({
        shipId: selectedShip,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setShowQuickBook(false);
    },
  });

  const groupedBookings = ships?.map((ship: any) => ({
    ship,
    bookings: bookings?.filter((b: any) => b.shipId === ship.id) || [],
  })) || [];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-500',
      booked: 'bg-red-500',
      maintenance: 'bg-orange-500',
      offline: 'bg-gray-500',
      reserved: 'bg-blue-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Bookings Calendar</h1>
        <Button onClick={() => setShowQuickBook(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Quick Book
        </Button>
      </div>

      {showQuickBook && (
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Book</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Ship</Label>
              <Select value={selectedShip} onValueChange={setSelectedShip}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Select a ship" />
                </SelectTrigger>
                <SelectContent>
                  {ships?.map((ship: any) => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name} - {ship.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Start Time</Label>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">End Time</Label>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <Button onClick={() => quickBookMutation.mutate()} className="w-full bg-green-600 hover:bg-green-700">
              <Calendar className="h-4 w-4 mr-2" />
              Create Booking
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {groupedBookings.map(({ ship, bookings: shipBookings }: any) => (
          <Card key={ship.id} className="bg-slate-800/50 border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-semibold">{ship.name}</h3>
                <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(ship.status)}`}>
                  {ship.status}
                </span>
              </div>
              <span className="text-slate-400">${ship.hourlyRate}/hr</span>
            </div>

            <div className="space-y-2">
              {shipBookings.length > 0 ? (
                shipBookings.map((booking: any) => (
                  <div key={booking.id} className="bg-slate-900 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Booking #{booking.id.slice(-8)}</p>
                        <p className="text-slate-400 text-sm">
                          {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No bookings</p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
