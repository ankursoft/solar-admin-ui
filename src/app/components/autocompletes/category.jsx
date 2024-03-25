import React from "react";
import { Grid, Autocomplete, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

function AutocompleteCategory({ onSearchDataGet }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleSearch = () => {
    
    onSearchDataGet(selectedSubCategory.id);
  };

  useEffect(() => {
    if (selectedCategory != null) {
      fetch("http://localhost:5276/SolarB2B/SubCategories/" + selectedCategory.id)
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          if (resp != null) {
            var result = resp.map((cat) => ({ id: cat.id, name: cat.name }));
            setSubCategories(result);
          }
          // setIsLoading(false);
        })
        .catch((error) => {
          setSubCategories([]);
          console.error("Error:", error);
        });
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetch("http://localhost:5276/SolarB2B/Categories")
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        if (resp != null) {
          var result = resp.map((cat) => ({ id: cat.id, name: cat.name }));
          setCategories(result);
          setSubCategories(null);
          setSelectedSubCategory(null);
        }
        // setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors for both API calls here
        setCategories([]);
        console.error("Error:", error);
      });
  }, []);

  return (
    <Grid container spacing={3} columns={12}>
      <Grid item xs={4}>
        <Autocomplete
          options={categories}
          value={selectedCategory}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Select Category" />}
          onChange={(event, newValue) => {
            setSelectedCategory(newValue);
            setSelectedSubCategory(null);
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <Autocomplete
          options={subCategories}
          value={selectedSubCategory}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Select Sub Category" />}
          onChange={(event, newValue) => {
            setSelectedSubCategory(newValue);
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <Button
          onClick={handleSearch}
          style={{ backgroundColor: "green", color: "white", float: "left" }}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
}

export default AutocompleteCategory;
