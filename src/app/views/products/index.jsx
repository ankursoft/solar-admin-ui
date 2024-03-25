import { Box, styled, Button, useTheme } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "app/components/Breadcrumb";
import MaterialReactTable from "material-react-table";
import { useNavigate } from "react-router-dom";
import ResponsiveDialog from "../material-kit/dialog/ResponsiveDialog";
import useMaterialReactTable from "material-react-table";
import { Grid } from "@mui/material";
import AutocompleteCategory from "app/components/autocompletes/category";
import ConfirmDialog from "app/components/Dialog/ConfirmDialog";

import axios from "axios";
// STYLED COMPONENT
const Container = styled("div")(({ theme }) => ({
  margin: 30,
  [theme.breakpoints.down("sm")]: { margin: 16 },
  "& .breadcrumb": { marginBottom: 30, [theme.breakpoints.down("sm")]: { marginBottom: 16 } }
}));

export default function Index() {
  const [selectedSubCategory, setSelectedSubCategory] = useState(0);
  const [records, setRecords] = useState([]);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });

  const navigate = useNavigate();

  const subCatUrl = "http://localhost:5276/SolarB2B/ProductsBySubCategory/";

  const productAPI = (url = "http://localhost:5276/SolarB2B/Products/") => {
    return {
      fetchAll: () => axios.get(subCatUrl + selectedSubCategory),

      create: (newRecord) => axios.post(url, newRecord),
      update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
      delete: (id) => axios.delete(url + "?id=" + id)
    };
  };

  useEffect(() => refreshProductList(), [selectedSubCategory]);

  const refreshProductList = () => {
    if (selectedSubCategory !== 0) {
      productAPI()
        .fetchAll()
        .then((res) => {
          console.log(res.data);
          setRecords(res.data);
        })
        .catch((err) => console.log(err));
    } else setRecords([]);
  };

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });

    productAPI()
      .delete(id)
      .then((res) => refreshProductList())
      .catch((err) => console.log(err));
  };

  const handleEditClick = (id) => {
    navigate("/products/edit?id=" + id);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "description",
      header: "Description"
    },
    {
      id: "image",
      header: "Image",
      columnDefType: "display", //turns off data column features like sorting, filtering, etc.
      enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
      Cell: ({ row }) => (
        <img
          src={"http://localhost:5276/images/" + row.original.productImageMaps[0].imagePath}
          alt={"image"}
          height={"60px"}
          width={"60px"}
          className="w-6rem shadow-2 border-round"
          style={{
            border: "",
            borderRadius: "20%",
            marginBottom: "2em"
          }}
        />
      )
    },
    {
      id: "edit",
      header: "Edit",
      columnDefType: "display", //turns off data column features like sorting, filtering, etc.
      enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
      Cell: ({ row }) => (
        <Button
          style={{ backgroundColor: "lightblue", color: "white" }}
          onClick={() => handleEditClick(row.original.id)}
        >
          Edit
        </Button>
      )
    },

    {
      id: "delete",
      header: "Delete",
      columnDefType: "display", //turns off data column features like sorting, filtering, etc.
      enableColumnOrdering: true, //but you can turn back any of those features on if you want like this
      Cell: ({ row }) => (
        <Button
          onClick={() => {
            setConfirmDialog({
              isOpen: true,
              title: "Are you sure to delete this record?",
              subTitle: "You can't undo this operation",
              onConfirm: () => {
                onDelete(row.original.id);
              }
            });
          }}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Delete
        </Button>
      )
    }
  ];
  function handleAddClick() {
    navigate("/products/add");
  }

  const table = useMaterialReactTable({
    initialState: { pagination: { pageSize: 5, pageIndex: 0 } } //customize the default page size and page index
  });

  const handleSearchData = (subCatId) => {
    setSelectedSubCategory(subCatId);
    productAPI()
      .fetchAll()
      .then((res) => {
        setRecords(res.data);

        console.log(records);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Products", path: "/Products" }]} />
      </Box>

      <Box style={{ marginBottom: "5rem" }}>
        <Button
          type="button"
          style={{ backgroundColor: "green", color: "white", float: "right" }}
          onClick={handleAddClick}
        >
          Add
        </Button>
      </Box>
      <AutocompleteCategory onSearchDataGet={handleSearchData} />
      <MaterialReactTable table={table} columns={columns} data={records} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </Container>
  );
}
