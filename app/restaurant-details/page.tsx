"use client";
import Banner from "@/components/banner";
import React, { useEffect, useState } from "react";
import { MenuItem } from "@/types/menu-item";
import RestaurantMenu from "@/components/restaurant-menu";
import ShoppingCart from "@/components/shopping-cart";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const parcelMachineId = searchParams.get("id");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `/api/frontend/restaurant/menu_items/${restaurantId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);

  const addToCart = (item: MenuItem, quantity: number) => {
    if (quantity <= 0) {
      return;
    }
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.name === item.name
    );

    if (existingItemIndex !== -1) {
      // Item already exists in the cart, update its quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    } else {
      // Item doesn't exist in the cart, add it as a new entry
      const newItem = { ...item, quantity };
      setCartItems([...cartItems, newItem]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Banner />
      <Container fluid>
        <Row>
          <Col>
            <RestaurantMenu menuItems={menuItems} addToCart={addToCart} />
          </Col>
          <Col md={2}>
            <ShoppingCart
              cartItems={cartItems}
              setCartItems={setCartItems}
              parcelMachineId={parcelMachineId || ""}
            />
          </Col>
        </Row>
      </Container>
    </main>
  );
}
