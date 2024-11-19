"use client";
import dynamic from "next/dynamic";
import Banner from "@/components/banner";
import SearchBar from "./searchbar";
import Footer from "./footer";

const DynamicMap = dynamic(() => import("./map"), {
  ssr: false,
});

export default function LandingPage() {
  return (
    <>
      <Banner />
      <SearchBar />
      <DynamicMap />
      <Footer />
    </>
  );
}
