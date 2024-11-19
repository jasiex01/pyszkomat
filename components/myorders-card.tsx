import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSearchParams } from "next/navigation";

export default function OrderCard({
  machineId,
  restaurant,
  status,
  orderId,
}: {
  machineId: string;
  restaurant: string;
  status: string;
  orderId: number;
}) {
  const [machineAddress, setMachineAddress] = useState("");

  useEffect(() => {
    const fetchMachineAddress = async () => {
      try {
        const response = await fetch(`/api/parcel_machines/${machineId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch machine address");
        }
        const data = await response.json();
        setMachineAddress(data.address);
      } catch (error) {
        console.error("Error fetching machine address:", error);
      }
    };

    if (machineId) {
      fetchMachineAddress();
    }
  }, [machineId]);

  switch (status) {
    case "DELIVERED":
      status = "W drodze";
      break;
    case "LOST_AND_FOUND":
      status = "Zgubione";
      break;
    case "PREPARED":
      status = "W trakcie przygotowania";
      break;
    case "READY_FOR_PICKUP":
      status = "W pyszkomacie";
      break;
    case "RECEIVED":
      status = "Odebrano";
      break;
    default:
      status = "Nieznany";
  }

  return (
    <Card border="light" bg="dark" text="light">
      <Card.Header as="h2">{restaurant}</Card.Header>
      <Card.Body>
        <Container fluid>
          <Row>
            <Col>
              <Card.Title>{machineId}</Card.Title>
              <Card.Text>Adres: {machineAddress}</Card.Text>
              <Card.Text>Status: {status}</Card.Text>
            </Col>
            <Col md={2}>
              <Button
                variant="dark"
                size="lg"
                href={`/order-details?orderId=${orderId}`}
                className="text-light border-light mt-4"
              >
                Szczegóły
              </Button>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}
