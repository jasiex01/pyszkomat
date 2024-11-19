"use client";
import Banner from "@/components/banner";
import OrderCard from "@/components/myorders-card";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = 1;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `/api/frontend/customers/orders/active/${customerId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
        console.log(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchOrders();
    }
  }, [customerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Banner />
      <div className="row row-cols-1 g-4 mt-1">
        {orders
          .filter(
            (order: any) =>
              order.status === "PREPARED" || order.status === "READY_FOR_PICKUP"
          )
          .map((order: any, index) => (
            <div className="col" key={index}>
              <OrderCard
                machineId={order.parcelMachineId}
                restaurant={order.restaurantName}
                status={order.status}
                orderId={order.orderId}
              />
            </div>
          ))}
      </div>
    </main>
  );
}
