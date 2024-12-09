import Link from "next/link";
import Button from "react-bootstrap/Button";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function PopupDetails({
  id,
  address,
  isFavorite,
}: {
  id: string;
  address: string;
  isFavorite: boolean;
}) {
  const customerId = 1;
  const [isAddedToFavorite, setIsFavorite] = useState(isFavorite);

  const toggleFavorite = async () => {
    setIsFavorite((prev) => !prev);

    try {
      const response = await fetch(
        `http://localhost:8080/api/frontend/favourite/parcel_machines/${customerId}/${id}`,
        {
          method: isAddedToFavorite ? "DELETE" : "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "20px", // Adjust height as needed
        }}
      >
        <h4 style={{ margin: 0 }}>{id}</h4>
        <FaHeart
          onClick={() => toggleFavorite()}
          color={isAddedToFavorite ? "red" : "gray"}
          size={24}
          style={{ cursor: "pointer" }}
          title={
            isAddedToFavorite ? "Remove from favorites" : "Add to favorites"
          }
        />
      </div>
      <p>{address}</p>
      <div className="d-grid gap-2">
        <Link href={`/restaurants?id=${id}`} passHref>
          <Button variant="dark" size="lg" className="text-light">
            Wybierz
          </Button>
        </Link>
      </div>
    </>
  );
}
