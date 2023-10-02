"use client";

import { useState, FormEvent } from "react";

const Searchbar = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidAmazonURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;

      if (hostname.includes("amazon")) return true;
    } catch (error) {
      console.log(error);
      return false;
    }
    return false;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidLink = isValidAmazonURL(search);

    if (!isValidLink) return alert("Enter valid Amazon Link");

    try {
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Product link"
        className="searchbar-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={isLoading || search === ""}
      >
        Search
      </button>
    </form>
  );
};

export default Searchbar;
