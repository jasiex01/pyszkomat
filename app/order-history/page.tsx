"use client";
import Banner from "@/components/banner";
import OrderCard from "@/components/myorders-card";
import React, { useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';

export default function Page() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = 1;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `/api/frontend/customers/orders/history/${customerId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log(data);
        setOrders(data);
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
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <main>
      <Banner />
      <div className="row row-cols-1 g-4 mt-1">
        {orders.map((order: any, index) => (
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
