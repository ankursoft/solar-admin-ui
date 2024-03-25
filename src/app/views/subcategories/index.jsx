import { Box, styled,Button,Grid, useTheme } from "@mui/material";
import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from "app/components/Breadcrumb";
import SimpleCard from "app/components/SimpleCard";
import { Autocomplete, TextField} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import MaterialReactTable from "material-react-table";
import { useNavigate } from "react-router-dom";
import ResponsiveDialog from "../material-kit/dialog/ResponsiveDialog";
import useMaterialReactTable from "material-react-table";

import axios from 'axios';
// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));
const AutoComplete = styled(Autocomplete)(() => ({ width: 300, marginBottom: "16px" }));
const filter = createFilterOptions();
export default function Index() {
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([null]);
  const navigate = useNavigate();
  const [data, setData] = useState([])
  
// Function to handle input change
const handleCategoryChange = (e) => {
  const { value } = e.target;
  setSelectedCategory(value);
};
useEffect(() => {
  fetch('http://localhost:5276/SolarB2B/Categories').then((res) => {
      return res.json();
  }).then((resp) => {
      console.log(resp);
      console.log(resp);
      if (resp!= null) {
        setCategories(resp);
      }
      // setIsLoading(false);
     
  })
     .catch(error => {
          // Handle errors for both API calls here
          console.error('Error:', error);
      });
}, []);

  

  const columns =  [
    {
        accessorKey: "name",
        header: 'Name',
    },
    {
        accessorKey: "description",
        header: 'Description',
    },
    {
      accessorKey: "category.name",
      header: 'Category',
   },
    {
      id: 'image',
      header: 'Image',
      columnDefType: 'display', //turns off data column features like sorting, filtering, etc.
      enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
      Cell: ({ row }) => (
       
        <img src={(row.original.subCategoryIcon)} alt={"image"} height={"30px"} width={"30px"} className="w-6rem shadow-2 border-round"
            style={{
                border: '',
                borderRadius: '20%',
                marginBottom: '2em',

            }} />
      ),
    },    
    {
      id: 'edit',
      header: 'Edit',
      columnDefType: 'display', //turns off data column features like sorting, filtering, etc.
      enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
      Cell: ({ row }) => (
        <Button style={{ backgroundColor:'lightblue',color:'white'}} onClick={() => handleEditClick(row.original.id)}>Edit</Button>
      ),
    },
    
    {
      id: 'delete',
      header: 'Delete',
      columnDefType: 'display', //turns off data column features like sorting, filtering, etc.
      enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
      Cell: ({ row }) => (
        <Button style={{ backgroundColor:'red',color:'white'}}>Delete</Button>
      ),
    },
    
];
function handleAddClick() {
  navigate("/subcategories/add");
}
function handleSearchClick() {
  const url = 'http://localhost:5276/SolarB2B/SubCategories/'+ selectedCategory.id;
 
    axios.get(url).then((json) => {
        {
            setData(json.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
  
}

const handleEditClick = (id) => {
  
  navigate("/subcategories/edit?id="+ id);
};



const table = useMaterialReactTable({
  
  initialState: { pagination: { pageSize: 5, pageIndex: 0 } }, //customize the default page size and page index
});


  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Sub Categories", path: "/subcategories" }]} />
      </Box>
     
      <Box  style={{marginBottom:'5rem'}}>
         <Button type="button" style={{ backgroundColor:'green',color:'white',float:'right'}} onClick={handleAddClick}>
          Add
      </Button>
    </Box>
    <Box  style={{marginBottom:'1rem'}}>

    <Grid container spacing={2}>
    <Grid item lg={3} md={3} sm={12} xs={12} sx={{ mt: 1 }}>
          <AutoComplete
                  options={categories}
                  validators={["required"]}
                  onChange={(event, newValue) => {
                    setSelectedCategory(newValue);
                  }}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Category" variant="outlined" fullWidth onChange={handleCategoryChange} />
                  )}
                />
            
      </Grid>
      <Grid item lg={3} md={3} sm={12} xs={12} sx={{ mt: 1 }}>
    
         <Button type="button" style={{ backgroundColor:'green',color:'white',float:'left',verticalAlign:'center'}} onClick={handleSearchClick}>
          Search
      </Button>
      </Grid>
    </Grid>
    </Box>
   
     <MaterialReactTable table={table} columns={columns}  data={data} />
    
    </Container>
  );
}
