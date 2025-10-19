import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Calculator, FileText } from 'lucide-react';

export default function QuotesView() {
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [selectedShip, setSelectedShip] = useState('');
  const [hours, setHours] = useState('4');
  const [people, setPeople] = useState('8');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [calculation, setCalculation] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data: quotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const result = await backend.quotes.listQuotes();
      return result.quotes;
    },
  });

  const { data: ships } = useQuery({
    queryKey: ['ships'],
    queryFn: async () => {
      const result = await backend.fleet.listShips();
      return result.ships.filter((s: any) => s.published);
    },
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const result = await backend.fleet.listServices();
      return result.services.filter((s: any) => s.published);
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async () => {
      return await backend.quotes.calculateQuote({
        shipId: selectedShip,
        hours: parseFloat(hours),
        people: parseInt(people),
        services: selectedServices.map(s => ({
          serviceId: s.id,
          quantity: s.quantity,
        })),
      });
    },
    onSuccess: (data) => {
      setCalculation(data);
    },
  });

  const createQuoteMutation = useMutation({
    mutationFn: async () => {
      if (!calculation) return;
      return await backend.quotes.createQuote({
        shipId: selectedShip,
        hours: parseFloat(hours),
        people: parseInt(people),
        services: selectedServices.map(s => ({
          serviceId: s.id,
          quantity: s.quantity,
        })),
        breakdown: calculation.breakdown,
        appliedRules: calculation.appliedRules,
        subtotal: calculation.subtotal,
        tax: calculation.tax,
        total: calculation.total,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      setShowNewQuote(false);
      setCalculation(null);
    },
  });

  const handleCalculate = () => {
    if (selectedShip) {
      calculateMutation.mutate();
    }
  };

  const handleAddService = (serviceId: string) => {
    const service = services?.find((s: any) => s.id === serviceId);
    if (service) {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Quotes</h1>
        <Button onClick={() => setShowNewQuote(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Quote
        </Button>
      </div>

      {showNewQuote && (
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">New Quote</h2>
          
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
                      {ship.name} - ${ship.hourlyRate}/hr
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Hours</Label>
                <Input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">People</Label>
                <Input
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-300">Services</Label>
              <Select onValueChange={handleAddService}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Add a service" />
                </SelectTrigger>
                <SelectContent>
                  {services?.map((service: any) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.unitPrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedServices.length > 0 && (
                <div className="mt-2 space-y-2">
                  {selectedServices.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900 p-2 rounded">
                      <span className="text-white">{service.name}</span>
                      <Input
                        type="number"
                        value={service.quantity}
                        onChange={(e) => {
                          const updated = [...selectedServices];
                          updated[idx].quantity = parseInt(e.target.value);
                          setSelectedServices(updated);
                        }}
                        className="w-20 bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleCalculate} className="w-full bg-green-600 hover:bg-green-700">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>

            {calculation && (
              <div className="bg-slate-900 p-4 rounded space-y-3">
                <h3 className="text-white font-semibold">Breakdown</h3>
                {calculation.breakdown.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
                
                {calculation.appliedRules.length > 0 && (
                  <>
                    <hr className="border-slate-700" />
                    <h4 className="text-white font-semibold">Applied Rules</h4>
                    {calculation.appliedRules.map((rule: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>{rule.ruleName}</span>
                        <span>{rule.adjustment > 0 ? '+' : ''}${rule.adjustment.toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}

                <hr className="border-slate-700" />
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>${calculation.total.toFixed(2)}</span>
                </div>

                <Button onClick={() => createQuoteMutation.mutate()} className="w-full bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Save Quote
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {quotes?.map((quote: any) => (
          <Card key={quote.id} className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-semibold">Quote #{quote.id.slice(-8)}</h3>
                <p className="text-slate-400 text-sm">Created: {new Date(quote.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">${quote.total.toFixed(2)}</p>
                <p className="text-slate-400 text-sm">{quote.hours} hours, {quote.people} people</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
