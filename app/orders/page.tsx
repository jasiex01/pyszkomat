"use client";
import Banner from "@/components/banner";
import OrderCard from "@/components/myorders-card";
import React, { useEffect, useState } from "react";
import { Spinner, ToggleButton, ButtonGroup } from "react-bootstrap";

export default function OrdersPage() {
  const [activeOrders, setActiveOrders] = useState([]);
  const [historicalOrders, setHistoricalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("active"); // "active" or "history"

  const customerId = 1;

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        const [activeResponse, historyResponse] = await Promise.all([
          fetch(`/api/frontend/customers/orders/active/${customerId}`),
          fetch(`/api/frontend/customers/orders/history/${customerId}`),
        ]);

        if (!activeResponse.ok || !historyResponse.ok) {
          throw new Error("Failed to fetch orders");
        }

        const [activeData, historicalData] = await Promise.all([
          activeResponse.json(),
          historyResponse.json(),
        ]);

        setActiveOrders(activeData);
        setHistoricalOrders(historicalData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchAllOrders();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger">
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  const displayedOrders =
    view === "active" ? activeOrders : historicalOrders;

  return (
    <main>
      <Banner />
      <div className="container mt-4">
        {/* Toggle Buttons */}
        <ButtonGroup className="mb-4">
          <ToggleButton
            id="toggle-active"
            type="radio"
            variant={view === "active" ? "dark" : "outline-dark"}
            name="view"
            value="active"
            checked={view === "active"}
            onChange={() => setView("active")}
          >
            Aktualne zamówienia
          </ToggleButton>
          <ToggleButton
            id="toggle-history"
            type="radio"
            variant={view === "history" ? "secondary" : "outline-secondary"}
            name="view"
            value="history"
            checked={view === "history"}
            onChange={() => setView("history")}
          >
            Historyczne zamówienia
          </ToggleButton>
        </ButtonGroup>

        {/* Orders List */}
        <div className="row row-cols-1 g-4">
          {displayedOrders.length === 0 ? (
            <div className="text-center">
              <p>No orders found in this category.</p>
            </div>
          ) : (
            displayedOrders.map((order: any, index) => (
              <div className="col" key={index}>
                <OrderCard
                  machineId={order.parcelMachineId}
                  restaurant={order.restaurantName}
                  status={order.status}
                  orderId={order.orderId}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
