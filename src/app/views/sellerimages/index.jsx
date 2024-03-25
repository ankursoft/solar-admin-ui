import { Box, styled,Button, useTheme } from "@mui/material";
import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from "app/components/Breadcrumb";
import SimpleCard from "app/components/SimpleCard";

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

export default function Index() {
  const navigate = useNavigate();
  const [data, setData] = useState([])
  const url = 'http://localhost:5276/SolarB2B/Categories';


  useEffect(() => {
    axios.get(url).then((json) => {
        {
            setData(json.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
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
      id: 'image',
      header: 'Image',
      columnDefType: 'display', //turns off data column features like sorting, filtering, etc.
      enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
      Cell: ({ row }) => (
       
        <img src={(row.original.categoryIcon)} alt={"image"} height={"30px"} width={"30px"} className="w-6rem shadow-2 border-round"
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
  navigate("/categories/add");
}


const handleEditClick = (id) => {
  
  navigate("/categories/edit?id="+ id);
};

const table = useMaterialReactTable({
  
  initialState: { pagination: { pageSize: 5, pageIndex: 0 } }, //customize the default page size and page index
});


  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Categories", path: "/categories" }]} />
      </Box>
     
      <Box  style={{marginBottom:'5rem'}}>
         <Button type="button" style={{ backgroundColor:'green',color:'white',float:'right'}} onClick={handleAddClick}>
          Add
      </Button>
    </Box>
     <MaterialReactTable table={table} columns={columns}  data={data} />
    
    </Container>
  );
}
