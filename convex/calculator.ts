// Pure calculation functions (can be called from mutations)
export const calculateQuote = (args: {
  shipId: string;
  hours: number;
  people: number;
  services: Array<{ serviceId: string; quantity: number }>;
  pricingRules: Array<any>;
  shipRate: number;
  serviceRates: Array<any>;
}) => {
  const { shipId, hours, people, services, pricingRules, shipRate, serviceRates } = args;
  
  // Base ship cost
  let shipCost = shipRate * hours;
  
  // Apply pricing rules to ship cost
  for (const rule of pricingRules) {
    if (shouldApplyRule(rule, { shipId, hours, people })) {
      shipCost = applyRule(shipCost, rule);
    }
  }
  
  // Calculate service costs
  let serviceCosts = services.map(service => {
    const serviceRate = serviceRates.find(s => s.serviceId === service.serviceId);
    if (!serviceRate) return { serviceId: service.serviceId, cost: 0 };
    
    let cost = serviceRate.rate * service.quantity;
    
    // Apply pricing rules to service cost
    for (const rule of pricingRules) {
      if (shouldApplyRule(rule, { serviceId: service.serviceId, quantity: service.quantity })) {
        cost = applyRule(cost, rule);
      }
    }
    
    return { serviceId: service.serviceId, cost };
  });
  
  const subtotal = shipCost + serviceCosts.reduce((sum, s) => sum + s.cost, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  return {
    shipCost,
    serviceCosts,
    subtotal,
    tax,
    total,
    appliedRules: pricingRules.filter(rule => 
      shouldApplyRule(rule, { shipId, hours, people, services })
    ),
  };
};

// Helper function to check if a pricing rule should be applied
const shouldApplyRule = (rule: any, context: any) => {
  const { field, operator, value } = rule.condition;
  const contextValue = context[field];
  
  switch (operator) {
    case "eq": return contextValue === value;
    case "gt": return contextValue > value;
    case "lt": return contextValue < value;
    case "gte": return contextValue >= value;
    case "lte": return contextValue <= value;
    default: return false;
  }
};

// Helper function to apply a pricing rule
const applyRule = (cost: number, rule: any) => {
  const { type, value } = rule.action;
  
  switch (type) {
    case "multiply": return cost * value;
    case "add": return cost + value;
    case "subtract": return cost - value;
    case "set": return value;
    default: return cost;
  }
};
