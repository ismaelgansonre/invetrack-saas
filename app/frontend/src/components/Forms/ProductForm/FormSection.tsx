//components/Forms/ProductForm/FormSection.jsx

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Controller } from "react-hook-form";
import FormField from "./FormField";

/**
 * Form Section component
 *
 * This component renders a section of the form fields.
 * It can be displayed in an accordion layout for mobile devices
 * or in a grid layout for desktop devices.
 *
 * @param {Object} section - The section object containing the title and fields
 * @param {Object} control - The form control object from react-hook-form
 * @param {Object} errors - The form errors object from react-hook-form
 * @param {Boolean} isMobile - A boolean value to determine the layout of the form
 *
 */

const FormSection = ({ section, control, errors, isMobile }) => {
  return isMobile ? (
    // Accordion layout for mobile
    <Accordion defaultExpanded={true} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{section.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {section.fields.map((field) => (
            <Grid item xs={12} key={field.name}>
              {/* Category field */}
              {field.name === "category_id" ? (
                <Controller
                  name="category_id"
                  control={control}
                  rules={field.rules}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.category_id}
                    >
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value={1}>Service</MenuItem>
                        <MenuItem value={2}>Retail</MenuItem>
                      </Select>
                      {errors.category_id && (
                        <Typography variant="caption" color="error">
                          {errors.category_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              ) : field.name === "supplier_id" ? (
                // Supplier field
                <Controller
                  name="supplier_id"
                  control={control}
                  rules={field.rules}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.supplier_id}
                    >
                      <InputLabel>Supplier</InputLabel>
                      <Select {...field} label="Supplier">
                        {/* Placeholder for the supplier field */}
                      </Select>
                      {errors.supplier_id && (
                        <Typography variant="caption" color="error">
                          {errors.supplier_id.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              ) : (
                // Other form fields
                <FormField
                  name={field.name}
                  label={field.label}
                  rules={field.rules}
                  type={field.type}
                  control={control}
                  errors={errors}
                  options={field.options}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  ) : (
    // Grid layout for desktop
    <React.Fragment>
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "bold", mt: 4 }}
        >
          {section.title}
        </Typography>
      </Grid>
      {section.fields.map((field) => (
        <Grid item xs={6} key={field.name}>
          {/* Handle Category field */}
          {field.name === "category_id" ? (
            <Controller
              name="category_id"
              control={control}
              rules={field.rules}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors.category_id}
                >
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category">
                    <MenuItem value={1}>Service</MenuItem>
                    <MenuItem value={2}>Retail</MenuItem>
                  </Select>
                  {errors.category_id && (
                    <Typography variant="caption" color="error">
                      {errors.category_id.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          ) : field.name === "supplier_id" ? (
            // Handle Supplier field
            <Controller
              name="supplier_id"
              control={control}
              rules={field.rules}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors.supplier_id}
                >
                  <InputLabel>Supplier</InputLabel>
                  <Select {...field} label="Supplier">
                    {/* Placeholder for the supplier field */}
                  </Select>
                  {errors.supplier_id && (
                    <Typography variant="caption" color="error">
                      {errors.supplier_id.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          ) : (
            // Render other fields
            <FormField
              name={field.name}
              label={field.label}
              rules={field.rules}
              type={field.type}
              control={control}
              errors={errors}
              options={field.options}
            />
          )}
        </Grid>
      ))}
    </React.Fragment>
  );
};

export default FormSection;
