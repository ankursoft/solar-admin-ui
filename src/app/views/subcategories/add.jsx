import { Fragment, useEffect, useState } from "react";
import { Autocomplete, styled, TextField } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  Card,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Radio,
  RadioGroup
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useNavigate } from "react-router-dom";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

// STYLED COMPONENTS
const CardRoot = styled(Card)({
  height: "100%",
  padding: "20px 24px"
});
const TextFieldInfo = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px"
}));
// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));

const CardTitle = styled("div")(({ subtitle }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
  marginBottom: !subtitle && "16px"
}));

const AutoComplete = styled(Autocomplete)(() => ({ width: 300, marginBottom: "16px" }));
// STYLED COMPONENTS

const filter = createFilterOptions();

export default function Add() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([null]);
  const [state, setState] = useState({ date: new Date() });
  const { name, description } = state;

  useEffect(() => {
    fetch("http://localhost:5276/SolarB2B/Categories")
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        console.log(resp);
     
        if (resp != null) {
          setCategories(resp);
        }
        // setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors for both API calls here
        console.error("Error:", error);
      });
  }, []);

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  // Function to handle input change
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setSelectedCategory(value);
  };

  function handleClick() {
    navigate("/subcategories");
  }

  const handleSubmit = (event) => {
    // console.log("submitted");
    // console.log(event);
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log("selectedCategory" + selectedCategory.id);
    console.log("selectedCategory" + name);
    console.log("selectedCategory" + description);
    const subcategoryInfo = {
      categoryID: selectedCategory.id,
      name: name,
      description: description,
      subCategoryIcon:
        "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
    };

    fetch("http://localhost:5276/SolarB2B/SubCategories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(subcategoryInfo)
    })
      .then((res) => {
        navigate("/subcategories");
      })
      .catch((err) => {
        // toast.current.show({ severity: 'info', summary: 'Info', detail: 'Please check your internet connection...', life: 3000 });
        console.log(err.message);
      });
  };
  return (
    <Container>
      <Box style={{ marginBottom: "1rem" }}>
        <Button
          type="button"
          style={{ backgroundColor: "green", color: "white", float: "right" }}
          onClick={handleClick}
        >
          Back
        </Button>

        <label> Add Sub Categories</label>
      </Box>

      <AutoComplete
        options={categories}
        validators={["required"]}
        onChange={(event, newValue) => {
          setSelectedCategory(newValue);
          console.log(newValue);
        }}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Category"
            variant="outlined"
            fullWidth
            onChange={handleCategoryChange}
          />
        )}
      />

      <Box style={{ marginTop: "0rem", width: "100%" }}>
        <ValidatorForm onSubmit={handlesubmit} onError={() => null}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
              <TextFieldInfo
                type="text"
                name="name"
                id="standard-basic"
                value={name || ""}
                onChange={handleChange}
                errorMessages={["this field is required"]}
                label="Name (Min length 4, Max length 50)"
                validators={["required", "minStringLength: 4", "maxStringLength: 50"]}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 1 }}>
              <TextFieldInfo
                type="text"
                name="description"
                label="Description"
                onChange={handleChange}
                value={description || ""}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 1 }}>
              <FormControlLabel control={<Checkbox />} label="Is Soft Deleted" />
            </Grid>
          </Grid>

          <Button color="primary" variant="contained" type="submit">
            <Icon>send</Icon>
            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
          </Button>
        </ValidatorForm>
      </Box>
    </Container>
  );
}
