"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Banner from "@/components/banner";
import SearchBar from "./searchbar";
import Footer from "./footer";

const DynamicMap = dynamic(() => import("./map"), {
  ssr: false,
});

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [markers, setMarkers] = useState([]);

  // Fetch markers from the API
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch("/api/frontend/parcel_machines");
        const data = await response.json();
        setMarkers(data);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };

    fetchMarkers();
  }, []);

  // Filter markers based on searchTerm
  const filteredMarkers = markers.filter((marker: any) =>
    marker.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Banner />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <DynamicMap markers={filteredMarkers} />
      <Footer />
    </>
  );
}
