// components/Inventory/ProductCard/ProductCard.jsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Typography,
  Box,
  Card,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FormSection from "./FormSection";
import FormActions from "./FormActions";
import NotificationSnackbar from "@/components/Notifications/NotificationSnackbar";

/**
 * ProductForm Component
 *
 * This component renders the product form with multiple sections.
 * It uses the react-hook-form library to manage the form state.
 * It displays a notification snackbar for success/error messages.
 * It also handles form submission and closing the snackbar.
 * The form is divided into multiple sections for better organization.
 * The form sections are rendered using the FormSection component.
 * The form actions are rendered using the FormActions component.
 * The notification snackbar is rendered using the NotificationSnackbar component.
 * The form data is passed as props to the component.
 * The form submission and cancel handlers are also passed as props.
 * The isNewProduct flag is used to determine if the product is new or existing.
 * The form sections are defined as an array of objects with title and fields.
 * Each field object contains the name, label, rules, and type of the field.
 * The form sections are rendered using the FormSection component.
 *
 * Features:
 * - Form sections with multiple fields
 * - Accordion layout for mobile devices
 * - Grid layout for desktop devices
 * - Notification snackbar for success/error messages
 * - Form submission and cancel handlers
 * - Validation rules for form fields
 * - Custom form field component
 * - Custom form actions component
 *
 *
 * @param {Object} initialData - The initial data for the form fields
 * @param {Function} onSubmit - The form submission handler
 * @param {Function} onCancel - The form cancel handler
 * @param {Boolean} isNewProduct - A boolean value to determine if the product is new
 *
 */

const ProductForm = ({ initialData, onSubmit, onCancel, isNewProduct }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...Object.fromEntries(
        Object.entries(initialData || {}).map(([key, value]) => [
          key,
          value === null ? "" : value,
        ])
      ),
      category_id: initialData?.category_id || "",
      supplier_id: initialData?.supplier_id || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  }); // State for managing the notification

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle form submission
  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    // setNotification({ open: false, message: "", severity: "success" });
    try {
      await onSubmit(data, (errorObj) => {
        if (errorObj && errorObj.message) {
          setNotification({
            open: true,
            message: errorObj.message,
            severity: "error",
          });
        }
      });
      setNotification({
        open: true,
        message: "Product saved successfully!",
        severity: "success",
      }); // Show success notification
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification({
        open: true,
        message: error.message || "An error occurred while saving the product.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setNotification({ ...notification, open: false });
  };

  const formSections = [
    {
      title: "Informations sur le produit",
      fields: [
        {
          name: "name",
          label: "Nom du produit",
          rules: { required: "Le nom du produit est requis" },
        },
        {
          name: "description",
          label: "Description",
          rules: {},
          options: { multiline: true, rows: 3 },
        },
        {
          name: "price",
          label: "Prix",
          rules: { 
            required: "Le prix est requis",
            valueAsNumber: true, 
            min: { value: 0, message: "Le prix doit être positif" } 
          },
          type: "number",
        },
        {
          name: "quantity",
          label: "Quantité",
          rules: { 
            required: "La quantité est requise",
            valueAsNumber: true,
            min: { value: 0, message: "La quantité doit être positive" } 
          },
          type: "number",
        },
        {
          name: "min_quantity",
          label: "Quantité minimale (seuil d'alerte)",
          rules: { 
            required: "La quantité minimale est requise",
            valueAsNumber: true,
            min: { value: 0, message: "La quantité minimale doit être positive" } 
          },
          type: "number",
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        paddingX: 0.5,
        paddingY: 4,
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            p: 3,
            flexGrow: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
            {isNewProduct ? "Add New Product" : "Edit Product"}
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Render form sections */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {formSections.map((section, index) => (
                  <FormSection
                    key={index}
                    section={section}
                    control={control}
                    errors={errors}
                    isMobile={isMobile}
                  />
                ))}
              </Grid>

              {/* Form action buttons */}
              <FormActions
                onCancel={onCancel}
                isSubmitting={isSubmitting}
                isNewProduct={isNewProduct}
              />
            </Box>
          </form>
        </Box>
      </Card>

      {/* Notification snackbar for success/error messages */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default ProductForm;
