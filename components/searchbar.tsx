import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  suggestions: string[]; // Street suggestions from LandingPage
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  suggestions,
}: SearchBarProps) {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setSearchTerm(input);

    // Filter suggestions based on input
    if (input) {
      const filtered = suggestions.filter((street) =>
        street.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (street: string) => {
    setSearchTerm(street);
    setFilteredSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="search-container" style={{ position: "relative" }}>
      <h2 className="text-center mt-3">Znajdź swój Pyszkomat!</h2>
      <Form className="form-inline d-flex justify-content-center md-form form-sm my-3 py-2">
        <InputGroup className="w-75">
          <Form.Control
            className="form-control form-control-sm"
            type="text"
            placeholder="Wpisz nazwę ulicy, np. Kamienna"
            aria-label="Search"
            value={searchTerm}
            onChange={handleChange}
          />
          <InputGroup.Text className="bg-transparent border-0">
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>
      </Form>

      {/* Suggestions List */}
      {filteredSuggestions.length > 0 && (
        <ListGroup
        className="autocomplete-list"
        style={{
          position: "absolute",
          top: "100%", // Below the input field
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999, // Higher z-index to ensure visibility over the map
          width: "75%",
          maxHeight: "200px",
          overflowY: "auto",
          backgroundColor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "5px",
        }}
      >
          {filteredSuggestions.map((street, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handleSuggestionClick(street)}
            >
              {street}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
