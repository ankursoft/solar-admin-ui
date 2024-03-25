import { Fragment, useEffect, useState } from "react";
import { Autocomplete, styled ,TextField} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { Card,Box,
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


const categories = [
  { name: "Solar Panels",id: 1 },
  { name: "Inverters",id: 2 },
  { name: "DC/AC Disconnects",id: 3 },
  { name: "Racking and Mounting",id: 4 },
  { name: "Solar Services",id: 5 },
];

const filter = createFilterOptions();

export default function Edit() {
  const navigate = useNavigate();
  const [value, setValue] = useState(null);

  const handleChange = (_, newValue) => {
    if (newValue && newValue.inputValue) {
      setValue({ label: newValue.inputValue });
      return;
    }
    setValue(newValue);
  };

  const filterOptions = (options, params) => {
    const filtered = filter(options, params);
    if (params.inputValue !== "") {
      filtered.push({ inputValue: params.inputValue, label: `Add "${params.inputValue}"` });
    }
    return filtered;
  };
  const handleSubmit = (event) => {
    // console.log("submitted");
    // console.log(event);
  };
  function handleClick() {
    navigate("/subcategories");
  }
  const [state, setState] = useState({ date: new Date() });
  

  const {
    subcategoryname,
    subcategorydescription,
   
  } = state;

  return (
    <Container>
       <Box  style={{marginBottom:'1rem'}}>
        <Button type="button" style={{ backgroundColor:'green',color:'white',float:'right'}} onClick={handleClick}>
        Back
          </Button>
   
    <label> Edit Sub Categories</label>
      </Box>


     
      <Grid container spacing={6}>
          <Grid item lg={3} md={3} sm={12} xs={12} sx={{ mt: 2 }}>
          <AutoComplete
            options={categories}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Select Category" variant="outlined" fullWidth />
            )}
          />
           </Grid>

       <Grid item lg={3} md={3} sm={12} xs={12} sx={{ mt: 2 }}>
        

     
           </Grid>
    </Grid>

      <Box  style={{marginTop:'0rem'}}>
       
         
      <div>
      <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextFieldInfo
              type="text"
              name="subcategoryname"
              id="standard-basic"
              value={subcategoryname || ""}
              onChange={handleChange}
              errorMessages={["this field is required"]}
              label="Sub Category Name (Min length 4, Max length 50)"
              validators={["required", "minStringLength: 4", "maxStringLength: 50"]}
            />

            <TextFieldInfo
              type="text"
              name="subcategorydescription"
              label="Sub Category Description"
              onChange={handleChange}
              value={subcategorydescription || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            
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
