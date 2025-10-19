import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:invoke>
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Ship, Edit } from 'lucide-react';

export default function FleetView() {
  const [showNewShip, setShowNewShip] = useState(false);
  const [editingShip, setEditingShip] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('available');
  const queryClient = useQueryClient();

  const { data: ships } = useQuery({
    queryKey: ['ships'],
    queryFn: async () => {
      const result = await backend.fleet.listShips();
      return result.ships;
    },
  });

  const createShipMutation = useMutation({
    mutationFn: async () => {
      return await backend.fleet.createShip({
        name,
        description,
        hourlyRate: parseFloat(hourlyRate),
        capacity: parseInt(capacity),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
      setShowNewShip(false);
      resetForm();
    },
  });

  const updateShipMutation = useMutation({
    mutationFn: async (ship: any) => {
      return await backend.fleet.updateShip({
        id: ship.id,
        name: ship.name,
        description: ship.description,
        hourlyRate: ship.hourlyRate,
        capacity: ship.capacity,
        published: ship.published,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
      setEditingShip(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ shipId, status }: any) => {
      return await backend.fleet.updateShipStatus({
        id: shipId,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setHourlyRate('');
    setCapacity('');
    setStatus('available');
  };

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
        <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
        <Button onClick={() => setShowNewShip(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Ship
        </Button>
      </div>

      {showNewShip && (
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">New Ship</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Hourly Rate</Label>
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Capacity</Label>
                <Input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
            <Button onClick={() => createShipMutation.mutate()} className="w-full bg-green-600 hover:bg-green-700">
              Create Ship
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ships?.map((ship: any) => (
          <Card key={ship.id} className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Ship className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="text-white font-semibold">{ship.name}</h3>
                  <p className="text-slate-400 text-sm">{ship.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingShip(ship)}
                className="text-slate-400 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Rate:</span>
                <span className="text-white font-medium">${ship.hourlyRate}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Capacity:</span>
                <span className="text-white font-medium">{ship.capacity} guests</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <Select
                  value={ship.status}
                  onValueChange={(newStatus) =>
                    updateStatusMutation.mutate({ shipId: ship.id, status: newStatus })
                  }
                >
                  <SelectTrigger className="w-32 h-8 bg-slate-900 border-slate-700">
                    <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(ship.status)}`}>
                      {ship.status}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Published:</span>
                <span className={ship.published ? 'text-green-400' : 'text-orange-400'}>
                  {ship.published ? 'Yes' : 'Draft'}
                </span>
              </div>
            </div>

            {!ship.published && (
              <Button
                onClick={() => updateShipMutation.mutate({ ...ship, published: true })}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Publish
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
