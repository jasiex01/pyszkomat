import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { MenuItem } from "@/types/menu-item";
import { FaPlus, FaMinus } from "react-icons/fa";

interface RestaurantMenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
}

export default function RestaurantMenu({
  menuItems,
  addToCart,
}: RestaurantMenuProps) {
  const [quantities, setQuantities] = useState<number[]>(
    Array(menuItems.length).fill(0)
  );

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const imagePromises = menuItems.map(async (item) => {
        try {
          const response = await fetch(`/api/images/${item.photoUrl}`);
          if (!response.ok) {
            throw new Error("Failed to fetch image");
          }
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        } catch (error) {
          console.error("Error fetching image:", error);
          return null;
        }
      });

      const imageUrls = await Promise.all(imagePromises);
      setImages(imageUrls.filter((url) => url !== null) as string[]);
    };

    fetchImages();
  }, [menuItems]);

  const handleIncrement = (index: number) => {
    const newQuantities = [...quantities];
    newQuantities[index]++;
    setQuantities(newQuantities);
  };

  const handleDecrement = (index: number) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 0) {
      newQuantities[index]--;
      setQuantities(newQuantities);
    }
  };

  return (
    <div className="mt-3">
      {menuItems.map((item, index) => (
        <Card
          key={index}
          border="light"
          bg="dark"
          text="light"
          style={{
            marginBottom: "10px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {images[index] && (
            <Card.Img
              src={images[index]}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginRight: "20px",
              }}
            />
          )}
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.description}</Card.Text>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>Cena:</strong> {item.price.toFixed(2)} zł
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <InputGroup style={{ width: "180px", marginRight: "10px" }}>
                  <InputGroup.Text>
                    <Button
                      variant="dark"
                      onClick={() => handleDecrement(index)}
                    >
                      <FaMinus />
                    </Button>
                  </InputGroup.Text>
                  <FormControl
                    value={quantities[index]}
                    readOnly
                    style={{ textAlign: "center" }}
                  />
                  <InputGroup.Text>
                    <Button
                      variant="dark"
                      onClick={() => handleIncrement(index)}
                    >
                      <FaPlus />
                    </Button>
                  </InputGroup.Text>
                </InputGroup>
                <Button
                  variant="dark"
                  className="text-light border-light"
                  onClick={() => addToCart(item, quantities[index])}
                >
                  Do koszyka
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}