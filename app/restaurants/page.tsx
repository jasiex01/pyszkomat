"use client";
import { useEffect, useState } from "react";
import Banner from "@/components/banner";
import RestaurantCard from "@/components/restaurant-card";
import { useSearchParams } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = 1;

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

        for (const restaurant of data) {
          restaurant.isFavorite = favouriteData.some(
            (favourite) => favourite.id === restaurant.id
          );
        }

        data.sort((a, b) => {
          if (a.isFavorite === b.isFavorite) {
            return 0;
          }
          return a.isFavorite ? -1 : 1;
        });

        setRestaurants(data);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Banner />
      <section className="pt-5">
        <div className="row row-cols-1 g-4">
          {restaurants.map((restaurant) => (
            <div className="col" key={restaurant.id}>
              <RestaurantCard
                name={restaurant.name}
                address={restaurant.address}
                foodType={restaurant.category}
                rating={restaurant.rating}
                id={parcelMachineId ?? ""}
                restaurantId={restaurant.id}
                photoUrl={restaurant.photoUrl}
                isAddedToFavorite={restaurant.isFavorite}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
