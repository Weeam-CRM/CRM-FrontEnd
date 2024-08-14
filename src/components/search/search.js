import React, { useRef } from "react";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const CustomSearchInput = ({
  searchbox,
  pageSize,
  fetchSearch,
}) => {
  const handleInputChange = async (e) => {
    if (e.key === "Enter") {
      fetchSearch();
    }
  };

  return (
    <InputGroup
      width={{ sm: "100%", md: "30%" }}
      mx={{ sm: 0, md: 3 }}
      my={{ sm: "8px", md: "0" }}
    >
      <InputRightElement
        size="sm"
        top="-3px"
        pointerEvents="none"
        zIndex="0"
        children={
          <SearchIcon cursor={"pointer"} color="black" borderRadius="16px" />
        }
      />
      <Input
        type="text"
        size="sm"
        ref={searchbox}
        fontSize="sm"
        onKeyUp={handleInputChange}
        fontWeight="500"
        placeholder="Search..."
        borderRadius="16px"
      />
    </InputGroup>
  );
};

export default CustomSearchInput;
