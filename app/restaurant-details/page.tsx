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
import Stepper from "@/components/stepper";
import { InputGroup, FormControl, Dropdown, DropdownButton } from "react-bootstrap";
import { Spinner } from 'react-bootstrap';

// Category mappings from backend to Polish
const categoryTranslations: { [key: string]: string } = {
  ALL: "Wszystkie",
  BEVERAGE: "Napój",
  BREAKFAST: "Śniadanie",
  DESSERT: "Deser",
  DINNER: "Obiad",
  GLUTEN_FREE: "Bezglutenowe",
  LUNCH: "Lunch",
  SNACK: "Przekąska",
  SOUP: "Zupa",
  VEGAN: "Wegańska",
  VEGETARIAN: "Wegetariańska",
};

export default function Page() {
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("Nazwa");

  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const parcelMachineId = searchParams.get("id");

  // Steps definition
  const currentStep = 2; // Set this to the current step index (1-based)
  const steps = ["Wybór pyszkomatu", "Wybór restauracji", "Wybór dań", "Podsumowanie"];

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
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  // Filter menu items based on search and selected category
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearchQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  // Sort the filtered menu items based on selected sort order
  const sortedMenuItems = filteredMenuItems.sort((a, b) => {
    switch (sortOrder) {
      case "Nazwa":
        return a.name.localeCompare(b.name); // Sort by name (A to Z)
      case "Cena (rosnąco)":
        return a.price - b.price; // Sort by price (cheap to expensive)
      case "Cena (malejąco)":
        return b.price - a.price; // Sort by price (expensive to cheap)
      default:
        return 0;
    }
  });

  return (
    <main>
      <Banner />

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
          {/* Search Input */}
          <InputGroup className="w-50">
            <FormControl
              placeholder="Szukaj dania"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-light text-dark"
            />
          </InputGroup>

          {/* Category Filter */}
          <DropdownButton
            id="categoryFilter"
            title={`Filtruj: ${categoryTranslations[selectedCategory] || "Wszystkie"}`}
            onSelect={(category) => handleCategoryChange(category ?? "ALL")}
            variant="secondary"
          >
            {Object.entries(categoryTranslations).map(([key, label]) => (
              <Dropdown.Item key={key} eventKey={key}>
                {label}
              </Dropdown.Item>
            ))}
          </DropdownButton>

          {/* Sort Order */}
          <DropdownButton
            id="sortDropdown"
            title={`Sortuj według: ${sortOrder}`}
            onSelect={handleSortChange}
            variant="secondary"
          >
            <Dropdown.Item eventKey="Nazwa">Nazwa</Dropdown.Item>
            <Dropdown.Item eventKey="Cena (rosnąco)">Cena (rosnąco)</Dropdown.Item>
            <Dropdown.Item eventKey="Cena (malejąco)">Cena (malejąco)</Dropdown.Item>
          </DropdownButton>
        </div>

        <Row>
          <Col>
            <RestaurantMenu menuItems={sortedMenuItems} addToCart={addToCart} />
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
