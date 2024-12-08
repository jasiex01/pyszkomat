"use client";
import { useEffect, useState } from "react";
import Banner from "@/components/banner";
import Timer from "@/components/countdown-timer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useSearchParams } from "next/navigation";
import { Spinner } from 'react-bootstrap';

function convertToDate(dateString: string): number {
  const date = new Date(dateString);
  return date.getTime();
}

export default function Page() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const currentTime = Date.now() / 1000;

  const [machineId, setMachineId] = useState("");
  const [machineAddress, setMachineAddress] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [isHeating, setIsHeating] = useState(false);
  const [time, setTime] = useState(0.0);
  const [remainingTime, setRemainingTime] = useState(0.0);

  useEffect(() => {
    const fetchMachineAddress = async () => {
      try {
        const response = await fetch(`/api/frontend/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setMachineId(data.parcelMachine.parcelMachineId);
        setMachineAddress(data.parcelMachine.address);
        setOrderStatus(data.status);
        setIsHeating(data.isHeated);
        //Add 2 hours to the time to account for the timezone difference
        if (data.status === "READY_FOR_PICKUP") {
          const newTime = (convertToDate(data.pickUpTime) + 7200000) / 1000;
          setTime(newTime);
        } else {
          const newTime = (convertToDate(data.deliveryTime) + 7200000) / 1000;
          setTime(newTime);
        }
        setOrderItems(data.orderItems);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (orderId) {
      fetchMachineAddress();
    }
  }, [orderId]);

  useEffect(() => {
    setRemainingTime(time - currentTime);
  }, [time]);

  const toggleHeating = async () => {
    try {
      const response = await fetch(`/api/frontend/orders/heating/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(!isHeating),
      });

      if (!response.ok) {
        throw new Error("Failed to update heating status");
      }

      setIsHeating(!isHeating);
    } catch (error) {
      console.error("Error updating heating status:", error);
    }
  };

  if (remainingTime === 0) {
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
      {orderStatus !== "RECEIVED" && <Timer remainingTime={remainingTime} />}
      <div style={{ textAlign: "center", margin: "3vh", position: "relative" }}>
        <div
          style={{
            borderTop: "2px solid black",
            position: "absolute",
            top: "-10px",
            left: 0,
            right: 0,
          }}
        ></div>
        {orderStatus === "PREPARED" && (
          <h2>Twoje zamówienie jest przygotowywane!</h2>
        )}
        {orderStatus === "DELIVERED" && (
          <h2>Twoje zamówienie jest w drodze!</h2>
        )}
        {orderStatus === "READY_FOR_PICKUP" && (
          <h2>Twoje zamówienie czeka na Ciebie w Pyszkomacie!</h2>
        )}
        {orderStatus === "RECEIVED" && <h2>Zamówienie odebrane!</h2>}

        <div
          style={{
            borderBottom: "2px solid black",
            position: "absolute",
            bottom: "-10px",
            left: 0,
            right: 0,
          }}
        ></div>
      </div>

      <Container fluid>
        {orderStatus === "READY_FOR_PICKUP" && (
          <Row style={{ marginBottom: "3vh" }}>
            <Col className="d-flex justify-content-end">
              <Button
                variant="dark"
                size="lg"
                style={{ padding: "10px 20px" }}
                href={`/open?orderId=${orderId}`}
              >
                Otwórz skrytkę
              </Button>
            </Col>
            <Col>
              <Button
                variant="dark"
                size="lg"
                style={{ padding: "10px 20px" }}
                onClick={toggleHeating}
              >
                {isHeating ? "Wyłącz podgrzewanie" : "Włącz podgrzewanie"}
              </Button>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <h4>Wybrany Pyszkomat:</h4>
            <div className="mt-3">
              <h5>{machineId}</h5>
              <p className="mt-3">{machineAddress}</p>
              <p>Podgrzewanie {isHeating ? "włączone" : "wyłączone "}</p>
            </div>
          </Col>
          <Col>
            <h4>Szczegóły zamówienia:</h4>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: "20px",
                border: "1px solid #ddd",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Nazwa
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Liczba
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item: any, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
