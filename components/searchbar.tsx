import React, { useState, FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); // Prevent the form from causing a page reload.
    router.push(`/search-results?address=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      <h2 className="text-center mt-3">Znajdź swój Pyszkomat!</h2>
      <Form
        className="form-inline d-flex justify-content-center md-form form-sm my-3 py-2"
        onSubmit={handleSubmit}
      >
        <InputGroup className="w-75">
          <Form.Control
            className="form-control form-control-sm"
            type="text"
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroup.Text
            className="bg-transparent border-0"
            style={{ cursor: "pointer" }}
            onClick={handleSubmit} // No need to handle click here as the form handles it.
          >
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>
      </Form>
    </>
  );
}
