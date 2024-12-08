"use client";
import { useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';
import Banner from "@/components/banner";
import RestaurantCard from "@/components/restaurant-card";
import { useSearchParams } from "next/navigation";
import { InputGroup, FormControl, Dropdown, DropdownButton } from "react-bootstrap";
import Stepper from "@/components/stepper";

interface Restaurant {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  description: string;
  category: string;
  rating: number;
  photoUrl: string;
  isFavorite: boolean;
}

export default function Page() {
  const searchParams = useSearchParams();
  const parcelMachineId = searchParams.get("id");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("Ocena");
  const categoryTranslations: { [key: string]: string } = {
    ALL: "Wszystkie",
    ASIAN: "Azjatycka",
    BBQ: "Grill",
    BAKERY: "Piekarnia",
    FAST_FOOD: "Fast Food",
    ITALIAN: "Włoska",
    KEBAB: "Kebab",
    MEXICAN: "Meksykańska",
    SEAFOOD: "Owoce morza",
    VEGAN: "Wegańska",
  };  

  const customerId = 1;

  // Steps definition
  const currentStep = 1; // Set this to the current step index (1-based)
  const steps = ["Wybór pyszkomatu", "Wybór restauracji", "Wybór dań", "Podsumowanie"];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Fetch restaurants from parcel machine
        const response = await fetch(
          `/api/frontend/parcel_machine/restaurants/${parcelMachineId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }
        const data: Restaurant[] = await response.json();
  
        const favouriteResponse = await fetch(
          `/api/frontend/favourite/restaurants/${customerId}`
        );
        if (!favouriteResponse.ok) {
          throw new Error("Failed to fetch favourite restaurants");
        }
        const favouriteData: Restaurant[] = await favouriteResponse.json();
  
        // Mark restaurants as favorites
        for (const restaurant of data) {
          restaurant.isFavorite = favouriteData.some(
            (favourite) => favourite.id === restaurant.id
          );
        }
  
        // Sort restaurants by name (initial sort)
        data.sort((a, b) => a.name.localeCompare(b.name));
  
        setRestaurants(data);
        setFilteredRestaurants(data); // Set filteredRestaurants to all restaurants initially
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    if (parcelMachineId) {
      fetchRestaurants();
    }
  }, [parcelMachineId]);
  
  useEffect(() => {
    // Filter and sort the restaurants whenever the searchQuery, selectedCategory, or sortOrder changes
    let filtered = [...restaurants];

    if (searchQuery) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "ALL") {
      console.log(restaurants)
      filtered = filtered.filter((restaurant) => restaurant.category === selectedCategory);
    }    

    // Sort restaurants
    if (sortOrder === "Ocena") {
      filtered = filtered.sort((a, b) => b.rating - a.rating); // Sort by rating descending
    } else if (sortOrder === "Nazwa") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name ascending
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCategory, sortOrder, restaurants]);

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

  return (
    <main>
      <Banner />

      {/* Stepper */}
      <Stepper steps={steps} currentStep={currentStep} />

      <section className="pt-5">
        <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
          {/* Search Input */}
          <InputGroup className="w-50">
            <FormControl
              placeholder="Szukaj restauracji"
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
            <Dropdown.Item eventKey="Ocena">Ocena</Dropdown.Item>
            <Dropdown.Item eventKey="Nazwa">Nazwa</Dropdown.Item>
          </DropdownButton>
        </div>

        {/* Restaurants List */}
        <div className="row row-cols-1 g-4">
          {filteredRestaurants.length === 0 ? (
            <p>Nie znaleziono restauracji</p>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div className="col" key={restaurant.id}>
                <RestaurantCard
                  name={restaurant.name}
                  address={restaurant.address}
                  foodType={categoryTranslations[restaurant.category] || restaurant.category || "Nieznany"}
                  rating={restaurant.rating}
                  id={parcelMachineId ?? ""}
                  restaurantId={restaurant.id}
                  photoUrl={restaurant.photoUrl}
                  isAddedToFavorite={restaurant.isFavorite}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
