// components/Spinners/LogoSpinner.tsx
import React from "react";
import { Box } from "@mui/material";
import { Building2 } from "lucide-react";

const LogoSpinner: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <div className="animate-pulse">
        <Building2 className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 text-blue-600" />
      </div>
    </Box>
  );
};

export default LogoSpinner;
