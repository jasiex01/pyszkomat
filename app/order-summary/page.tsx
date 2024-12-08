"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Banner from "@/components/banner";
import Stepper from "@/components/stepper";
import { Button, Card, ListGroup, Container } from "react-bootstrap";
import { FaCreditCard } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Spinner } from 'react-bootstrap';

const OrderSummary = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const router = useRouter();

  // Steps definition
  const currentStep = 4; // Set this to the current step index (1-based)
  const steps = ["Wybór pyszkomatu", "Wybór restauracji", "Wybór dań", "Podsumowanie"];

  useEffect(() => {
    if (searchParams) {
      try {
        // Parse the order details from the query string
        const details = JSON.parse(searchParams.get("orderDetails") as string);
        setOrderDetails(details);

        // request on the backend
        const apirequest = JSON.parse(searchParams.get("order") as string);
        console.log(apirequest);
        setOrder(apirequest);
      } catch (error) {
        console.error("Error parsing order details:", error);
      }
    }
  }, []);

  if (!orderDetails) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const handlePayment = async () => {
    alert("Payment successful! Your order is being processed.");
    console.log(order);
    const response = await fetch(`/api/frontend/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error("Failed to place order");
    }

    const data = await response.json();
    console.log("Order placed successfully:", data);
    // Navigate to the order details page or show a success message
    router.push(`/order-details?orderId=${data.id}`);
  };

  return (
    <main>
      <Banner />

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      <Container className="pt-5">
        <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h1>Podsumowanie zamówienia</h1>
            <div className="mt-4">
              <h2>Pozycje w koszyku</h2>
              <ListGroup>
                {orderDetails.cartItems.map((item: any, index: number) => (
                  <ListGroup.Item key={index}>
                    <div className="d-flex justify-content-between">
                      <span>{item.quantity} x {item.name}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} zł</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <div className="mt-4">
              <strong>Razem: {orderDetails.totalPrice.toFixed(2)} zł</strong>
            </div>
          </div>

          <Card className="shadow-sm" style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Podsumowanie płatności</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Zamówienie:</Card.Subtitle>
              <Card.Text>
                <strong>{orderDetails.totalPrice.toFixed(2)} zł</strong>
              </Card.Text>
              <Button
                variant="dark"
                onClick={handlePayment}
                block
                className="d-flex align-items-center justify-content-center"
              >
                <FaCreditCard className="mr-2" />
                Złóż zamówienie
              </Button>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </main>
  );
};

export default OrderSummary;
