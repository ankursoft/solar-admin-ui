
import { Card,Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Radio,
  RadioGroup,
  styled
} from "@mui/material";
import { useNavigate,useParams,useLocation } from "react-router-dom";

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

export default function Edit({ children, title, subtitle }) {
 
  
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSoftDeleted, setIsSoftDeleted] = useState(false); 
  const [state, setState] = useState({   });
  const {
    name,
    description
   
  } = state;

  const handleCheckboxChange = (event) => {
    setIsSoftDeleted(event.target.checked);
  };
  useEffect(() => {
    console.log(id);
    fetch('http://localhost:5276/SolarB2B/Categories/' + id).then((res) => {
        return res.json();
    }).then((resp) => {
         console.log(resp); 

         const datavalue= {
          name: resp.name,
          description: resp.description
        } ;
        setState(datavalue);       
        setIsSoftDeleted(resp.isSoftDeleted);
         //setIsLoading(false);
         //activechange(resp.isactive);
    }).catch((err) => {

        // toast.current.show({ severity: 'info', summary: 'Info', detail: 'Please check your internet connection..' });
        console.log(err.message);
    })
}, []);

  const handlesubmit = (e) => {
    e.preventDefault();
   
    const categoryInfo = {
        "name": name,       
        "description": description,
        "categoryIcon": 'https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI',
        "isSoftDeleted": isSoftDeleted==1?true:false
    }

    fetch('http://localhost:5276/SolarB2B/Categories/'+ id, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(categoryInfo)
    }).then((res) => {            
        navigate('/categories');
    }).catch((err) => {
        // toast.current.show({ severity: 'info', summary: 'Info', detail: 'Please check your internet connection...', life: 3000 });
        console.log(err.message)
    })

}

const handleChange = (event) => {
  event.persist();
  setState({ ...state, [event.target.name]: event.target.value });
};

  
  function handleClick() {
    navigate("/categories");
  }
  
  return (
    <Container>
      <Box  style={{marginBottom:'1rem'}}>
        <Button type="button" style={{ backgroundColor:'green',color:'white',float:'right'}} onClick={handleClick}>
        Back
          </Button>
   
    <label> Edit Categories</label>
      </Box>

      <Box  style={{marginTop:'5rem'}}>
       
         
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
          <FormControlLabel
        control={<Checkbox checked={isSoftDeleted} onChange={handleCheckboxChange} />}
        label="Is Soft Deleted"
      />
          </Grid>

        <Button color="primary" variant="contained" type="submit">
          <Icon>send</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
        </Button>
        </Grid>
      </ValidatorForm>
    </div>
    
      </Box>
      
  </Container>
   
  );
}
