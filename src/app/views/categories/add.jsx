import {
  Card,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Radio,
  RadioGroup,
  styled
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

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

export default function Add({ children, title, subtitle }) {
  const navigate = useNavigate();
  const defaultImageSrc = "/assets/images/image_placeholder.png";

  const handlesubmit = (e) => {
    e.preventDefault();

    const categoryInfo = {
      name: name,
      description: description,
      categoryIcon:
        "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
      imageSrc: imageSrc
    };

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("imageFile", state.imageFile);
    formData.append("imageSrc", state.imageSrc);

    fetch("http://localhost:5276/SolarB2B/Categories", {
      method: "POST",

      body: formData
    })
      .then((res) => {
        navigate("/categories");
      })
      .catch((err) => {
        // toast.current.show({ severity: 'info', summary: 'Info', detail: 'Please check your internet connection...', life: 3000 });
        console.log(err.message);
      });
  };
  const initialFieldValues = {
    name: "",
    description: "",
    imageSrc: defaultImageSrc,
    imageFile: null
  };

  const [state, setState] = useState(initialFieldValues);

  const handleSubmit = (event) => {
    // console.log("submitted");
    // console.log(event);
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { name, description, imageSrc } = state;

  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      if (imageFile.size > 200 * 1024) {
        alert("File size must be less than 200 KB.");
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

  function handleClick() {
    navigate("/categories");
  }

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

        <label> Add Categories</label>
      </Box>

      <Box style={{ marginTop: "5rem" }}>
        <div>
          <ValidatorForm onSubmit={handlesubmit} onError={() => null}>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
                <TextField
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
                <TextField
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
                  </CardContent>
                </Card>
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
