"use client";
import Banner from "@/components/banner";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

const SearchResults: React.FC = () => {
  const [sortedMachines, setSortedMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const customerId = 1;

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch("/api/frontend/parcel_machines");
        if (!response.ok) {
          throw new Error("Failed to fetch parcel machines");
        }
        const data = await response.json();

        const favoritesResponse = await fetch(
          `http://localhost:8080/api/frontend/favourite/parcel_machines/${customerId}`
        );
        if (!favoritesResponse.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const favoritesData = await favoritesResponse.json();

        const favoriteIds = new Set(favoritesData.map((fav: any) => fav.id));

        // Filter the machines based on the search term (address)
        const filteredMachines = data.filter((machine: any) =>
          machine.address.toLowerCase().includes(address?.toLowerCase() || "")
        );

        // Combine and sort the machines
        const sortedMachines = filteredMachines.map((machine: any) => ({
          ...machine,
          isFavorite: favoriteIds.has(machine.id),
        }));

        sortedMachines.sort(
          (a: { isFavorite: any }, b: { isFavorite: any }) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return 0;
          }
        );

        setSortedMachines(sortedMachines);
      } catch (error) {
        console.error("Error fetching parcel machines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, [address]); // Re-run when the `address` query parameter changes

  const toggleFavorite = async (id: string) => {
    try {
      // Update favorite status locally
      setSortedMachines((prevMachines) =>
        prevMachines.map((machine) =>
          machine.id === id
            ? { ...machine, isFavorite: !machine.isFavorite }
            : machine
        )
      );

      // Make API call to persist the change
      const machine = sortedMachines.find((machine) => machine.id === id);
      if (!machine) return;

      const response = await fetch(
        `http://localhost:8080/api/frontend/favourite/parcel_machines/${customerId}/${id}`,
        {
          method: machine.isFavorite ? "DELETE" : "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <main>
      <Banner />
      <section className="pt-5">
        {sortedMachines.length === 0 ? (
          <div className="text-center">
            <h3>Nie znaleziono podanej ulicy: "{address}"</h3>
            <Button variant="secondary" href="/" className="mt-3">
              Powrót na stronę główną
            </Button>
          </div>
        ) : (
          <div className="row row-cols-1 g-4">
            {sortedMachines.map((machine: any) => (
              <div className="col" key={machine.id}>
                <Card border="light" bg="dark" text="light">
                  <Card.Header
                    as="h2"
                    className="d-flex justify-content-between align-items-center"
                  >
                    {machine.id}
                    <FaHeart
                      onClick={() => toggleFavorite(machine.id)}
                      color={machine.isFavorite ? "red" : "gray"}
                      size={24}
                      style={{ cursor: "pointer" }}
                      title={
                        machine.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    />
                  </Card.Header>
                  <Card.Body>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Card.Text>{machine.address}</Card.Text>
                      <Button
                        variant="dark"
                        size="lg"
                        href={`/restaurants?id=${machine.id}`}
                        className="text-light border-light"
                      >
                        Wybierz
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default SearchResults;
