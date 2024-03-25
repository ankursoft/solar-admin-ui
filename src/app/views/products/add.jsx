import { Card, Box, Button, Checkbox, FormControlLabel, Grid, Icon, styled } from "@mui/material";
import { Autocomplete } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useNavigate } from "react-router-dom";

import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import "./product.css";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

// STYLED COMPONENTS
const CardRoot = styled(Card)({
  height: "100%",
  padding: "20px 24px"
});
const TextField = styled(TextValidator)(() => ({
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
const defaultImageSrc = "/assets/images/image_placeholder.png";

const initialFieldValues = {
  name: "",
  productCode: 0,
  description: "",
  hsn: 0,
  sgst: 0,
  igst: 0,
  price: 0,
  cgst: 0,
  imageSrc: defaultImageSrc,
  imageFile: null,
  isFeatured: false,
  isActive: false,
  unitId: 0,
  subCategoryId: 0
};
const AutoComplete = styled(Autocomplete)(() => ({ width: 300, marginBottom: "16px" }));

export default function Add({ children, title, subtitle }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([null]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([null]);

  const [uom, setUom] = useState([]);
  const [state, setState] = useState(initialFieldValues);
  const [imageItems, setImageItems] = useState([]);
  const {
    name,
    productCode,
    description,
    hsn,
    sgst,
    igst,
    price,
    cgst,
    imageSrc,
    isFeatured,
    isActive,
    unitId,
    subCategoryId
  } = state;

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("productCode", state.productCode);
    formData.append("description", state.description);
    formData.append("imageName", state.imageName);
    formData.append("imageFile", state.imageFile);
    formData.append("hsn", state.hsn);
    formData.append("unitId", state.unitId);
    formData.append("sgst", state.sgst);
    formData.append("igst", state.igst);
    formData.append("cgst", state.cgst);
    formData.append("price", state.price);
    formData.append("subCategoryId", selectedSubCategory.id);
    formData.append("isFeatured", state.isFeatured);
    formData.append("isActive", state.isActive);

    console.log(formData);

    fetch("http://localhost:5276/SolarB2B/Products", {
      method: "POST",

      body: formData
    })
      .then((res) => {
        navigate("/products");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetch("http://localhost:5276/SolarB2B/UnitOfMeasurements")
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        if (resp != null) {
          setUom(resp);
        }
        // setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors for both API calls here
        console.error("Error:", error);
      });
  }, []);

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
        }
        // setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors for both API calls here
        console.error("Error:", error);
      });
  }, []);

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
          // Handle errors for both API calls here
          console.error("Error:", error);
        });
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setSelectedCategory(value);
  };

  const handleSubCategoryChange = (e) => {
    const { value } = e.target;
    setSelectedSubCategory(value);
  };
  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };
  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      if (imageFile.size > 500 * 1024) {
        alert("File size must be less than 500 KB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (x) => {
        setState({
          ...state,
          imageFile,
          imageSrc: x.target.result
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setState({
        ...state,
        imageFile: null,
        imageSrc: defaultImageSrc
      });
    }
  };

  const onDelete = (e, id) => {
    e.stopPropagation();
    alert(id);
    //  if (window.confirm("Are you sure to delete this record?"))
    // employeeAPI()
    //   .delete(id)
    //   .then((res) => refreshEmployeeList())
    //   .catch((err) => console.log(err));
  };

  function handleClick() {
    navigate("/products");
  }
  const showRecordDetails = (data) => {
    alert(data);
  };

  const addImage = () => {
    console.log(state.imageSrc);
    setImageItems(...imageItems, state.imageSrc);
  };

  const imageCard = (data) => (
    <div
      className="card"
      onClick={() => {
        showRecordDetails(data);
      }}
    >
      <img src={data.imageSrc} className="card-img-top rounded-circle" />
      <div className="card-body">
        <h5>{data.employeeName}</h5>
        <span>{data.occupation}</span> <br />
        <button
          className="btn btn-light delete-button"
          onClick={(e) => onDelete(e, parseInt(data.employeeID))}
        >
          <i className="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
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

        <label> Add Product</label>
      </Box>

      <Box style={{ marginTop: "5rem" }}>
        <div>
          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Grid container spacing={6}>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
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
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <AutoComplete
                  options={subCategories}
                  validators={["required"]}
                  onChange={(event, newValue) => {
                    setSelectedSubCategory(newValue);
                  }}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select SubCategory"
                      variant="outlined"
                      fullWidth
                      onChange={handleSubCategoryChange}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item lg={5} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <TextField
                  type="text"
                  name="name"
                  value={name || ""}
                  onChange={handleChange}
                  errorMessages={["this field is required"]}
                  label="Product Name (Min length 3, Max length 25)"
                  validators={["required", "minStringLength: 3", "maxStringLength: 25"]}
                />

                <TextField
                  type="text"
                  name="productCode"
                  label="Product Code"
                  onChange={handleChange}
                  value={productCode || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <TextField
                  sx={{ mb: 4 }}
                  type="text"
                  name="description"
                  label="Description"
                  onChange={handleChange}
                  value={description || ""}
                />

                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">UOM</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="unitId"
                    value={unitId}
                    label="UOM"
                    onChange={handleSelectChange}
                  >
                    {uom.map((d) => (
                      <MenuItem value={d.unitId}>{d.unitName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox checked={isFeatured} onChange={handleCheckChange} name="isFeatured" />
                  }
                  label="IsFeatured"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={isActive} onChange={handleCheckChange} name="isActive" />
                  }
                  label="IsActive"
                />
              </Grid>

              <Grid item lg={2} md={3} sm={12} xs={12} sx={{ mt: 2 }}>
                <TextField
                  type="number"
                  name="hsn"
                  label="HSN"
                  onChange={handleChange}
                  value={hsn || "0"}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
                <TextField
                  type="number"
                  name="price"
                  id="standard-basic"
                  value={price || "0"}
                  onChange={handleChange}
                  errorMessages={["this field is required"]}
                  label="Price"
                  validators={["required"]}
                />

                <TextField
                  type="number"
                  name="igst"
                  value={igst || "0"}
                  onChange={handleChange}
                  errorMessages={["this field is required"]}
                  label="IGST"
                  validators={["required"]}
                />
                <TextField
                  type="number"
                  name="cgst"
                  label="CGST"
                  onChange={handleChange}
                  value={cgst || "0"}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <TextField
                  type="number"
                  name="sgst"
                  label="SGST"
                  onChange={handleChange}
                  value={sgst || "0"}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
              </Grid>

              <Grid item lg={5} md={3} sm={12} xs={12} sx={{ mt: 2 }}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader subheader="Upload product images" />
                  <CardMedia component="img" height="194" image={imageSrc} alt="Paella dish" />

                  <CardContent>
                    <input
                      type="file"
                      accept="image/*"
                      className={"form-control-file"}
                      id="image-uploader"
                      onChange={showPreview}
                    />
                    {/* <Button color="primary" variant="contained" onClick={addImage}>
                      <Icon>add</Icon>
                    </Button> */}
                  </CardContent>
                </Card>
                {/* <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                >
                  {
                    //  imageItems.map((item, index) => (
                    //             <div key={index}>
                    //                  <img src={item} />
                    //             </div>
                    //  ))
                  }
                </Stack> */}
              </Grid>
            </Grid>

            <Button color="primary" variant="contained" type="submit">
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
            </Button>
          </ValidatorForm>
        </div>
      </Box>
    </Container>
  );
}
