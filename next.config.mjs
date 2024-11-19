/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/frontend/parcel_machines',
          destination: 'http://localhost:8080/api/frontend/parcel_machines'
        },
        {
          source: '/api/frontend/parcel_machine/restaurants/:parcelMachineId',
          destination: 'http://localhost:8080/api/frontend/parcel_machine/restaurants/:parcelMachineId'
        },
        {
          source: '/api/frontend/restaurant/menu_items/:restaurantId',
          destination: 'http://localhost:8080/api/frontend/restaurant/menu_items/:restaurantId'
        },
        {
          source: '/api/frontend/customers/orders/:customerId',
          destination: 'http://localhost:8080/api/frontend/customers/orders/:customerId'
        },
        {
          source: '/api/parcel_machines/:machineId',
          destination: 'http://localhost:8080/api/parcel_machines/:machineId'
        },
        {
          source: '/api/frontend/orders/:orderId',
          destination: 'http://localhost:8080/api/frontend/orders/:orderId'
        },
        {
          source: '/api/frontend/orders/heating/:orderId',
          destination: 'http://localhost:8080/api/frontend/orders/heating/:orderId'
        },
        {
          source: '/api/frontend/orders/pick_up/:orderId',
          destination: 'http://localhost:8080/api/frontend/orders/pick_up/:orderId'
        },
        {
          source: '/api/frontend/orders',
          destination: 'http://localhost:8080/api/frontend/orders'
        },
        {
          source: '/api/images/:filename',
          destination: 'http://localhost:8080/api/images/:filename'
        },
        {
          source: '/api/frontend/customers/orders/history/:customerId',
          destination: 'http://localhost:8080/api/frontend/customers/orders/history/:customerId'
        },
        {
          source: '/api/frontend/customers/orders/active/:customerId',
          destination: 'http://localhost:8080/api/frontend/customers/orders/active/:customerId'
        },
        {
          source: '/api/frontend/favourite/restaurants/:customerId/:id',
          destination: 'http://localhost:8080/api/frontend/favourite/restaurants/:customerId/:id'
        },
        {
          source: '/api/frontend/favourite/restaurants/:customerId',
          destination: 'http://localhost:8080/api/frontend/favourite/restaurants/:customerId'
        },
      ];
    }
  };
  
  export default nextConfig;
  