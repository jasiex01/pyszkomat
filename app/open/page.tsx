"use client";
import Banner from "@/components/banner";
import Image from "next/image";
import qrcode from "@/public/qrcode.svg";
import { Button } from "react-bootstrap";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/frontend/orders/pick_up/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to open machine");
      }
      const data = await response.json();
      console.log(data);
    } catch (error: any) {
    } finally {
      alert("Otworzono skrytkę");
    }
  };

  return (
    <main>
      <Banner />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className="mt-3 mb-3">Zeskanuj kod przy Pyszkomacie</h1>
        <Image priority src={qrcode} alt="QR code" height={400} width={400} />
        <h2 className="mt-3 mb-3">Lub</h2>
        <Button
          variant="dark"
          size="lg"
          style={{ fontSize: "2.5rem", padding: "10px 20px" }}
          onClick={fetchOrders}
        >
          Otwórz zdalnie
        </Button>
      </div>
    </main>
  );
}
