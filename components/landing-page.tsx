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
  const [streetNames, setStreetNames] = useState<string[]>([]);

  // Fetch markers from the API
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch("/api/frontend/parcel_machines");
        const data = await response.json();
        setMarkers(data);

        // Extract unique street names from markers
        const streets = [...new Set(data.map((marker: any) => marker.address))];
        setStreetNames(streets);
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
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        suggestions={streetNames}
      />
      <DynamicMap markers={filteredMarkers} />
      <Footer />
    </>
  );
}
