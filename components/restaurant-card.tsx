import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaStar } from "react-icons/fa";

export default function RestaurantCard({
  name,
  foodType,
  address,
  rating,
  id,
  restaurantId,
  photoUrl,
  isAddedToFavorite,
}: {
  name: string;
  foodType: string;
  address: string;
  rating: number;
  id: string;
  restaurantId: number;
  photoUrl: string;
  isAddedToFavorite: boolean;
}) {
  const [filledStars, setFilledStars] = useState(rating);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(isAddedToFavorite);

  const customerId = 1;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/images/${photoUrl}`);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        console.log("Image fetched:", imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (photoUrl) {
      fetchImage();
    }
  }, [photoUrl]);

  const toggleFavorite = async () => {
    setIsFavorite((prev) => !prev);

    try {
      const response = await fetch(
        `http://localhost:8080/api/frontend/favourite/restaurants/${customerId}/${restaurantId}`,
        {
          method: isFavorite ? "DELETE" : "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const fillStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i < filledStars ? "gold" : "gray"}
          style={{ marginRight: "2px" }}
        />
      );
    }
    return stars;
  };

  switch (foodType) {
    case "ASIAN":
      foodType = "Azjatycka";
      break;
    case "BBQ":
      foodType = "Grill";
      break;
    case "BAKERY":
      foodType = "Piekarnia";
      break;
    case "FAST_FOOD":
      foodType = "Fast food";
      break;
    case "ITALIAN":
      foodType = "Włoska";
      break;
    case "KEBAB":
      foodType = "Kebab";
      break;
    case "MEXICAN":
      foodType = "Meksykańska";
      break;
    case "SEAFOOD":
      foodType = "Owoce morza";
      break;
    default:
      foodType = "Nieznany";
  }

  return (
    <Card border="light" bg="dark" text="light">
      <Card.Header
        as="h2"
        className="d-flex justify-content-between align-items-center"
      >
        {name}
        <FaStar
          onClick={toggleFavorite}
          color={isFavorite ? "gold" : "gray"}
          size={24}
          style={{ cursor: "pointer" }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        />
      </Card.Header>
      <Card.Body className="d-flex">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={`${name} image`}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              marginRight: "20px",
            }}
          />
        )}
        <div>
          <Card.Title>{foodType}</Card.Title>
          <Card.Text>{address}</Card.Text>
          <div style={{ marginBottom: "10px" }}>{fillStars()}</div>
          <Button
            variant="dark"
            size="lg"
            href={`/restaurant-details?id=${id}&restaurantId=${restaurantId}`}
            className="text-light border-light"
          >
            Zamów
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
