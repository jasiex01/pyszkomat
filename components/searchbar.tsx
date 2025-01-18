import React, { FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <h2 className="text-center mt-3">Znajdź swój Pyszkomat!</h2>
      <Form className="form-inline d-flex justify-content-center md-form form-sm my-3 py-2">
        <InputGroup className="w-75">
          <Form.Control
            className="form-control form-control-sm"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={handleChange}
          />
          <InputGroup.Text className="bg-transparent border-0">
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>
      </Form>
    </>
  );
}
