// Chakra imports
// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
  background,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import CountUpComponent from "components/countUpComponent/countUpComponent";
// Custom icons
import React from "react";

export default function Default(props) {
  const { startContent, endContent, name, growth, value, active } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";

  return (
    <Card
      style={
        active
          ? {
              background: "#422afb",
            }
          : {}
      }
      cursor={"pointer"}
      py="25px"
      pb="80px"
      onClick={props.onClick}
    >
      <Flex
        my="auto"
        h="100%"
        direction={"column"}
        align={{ base: "start" }}
        justify={{ base: "center", xl: "center" }}
      >
        {startContent}

        <Stat my="auto" mt={3}>
          <StatNumber
            color={active ? "white" : textColor}
            fontSize={{
              base: "2xl",
            }}
          >
            <CountUpComponent targetNumber={value} />
            {/* {value} */}
          </StatNumber>
          <StatLabel
            lineHeight="100%"
            color={active ? "white" : textColorSecondary}
            fontSize={{
              base: props.fontsize ? props.fontsize : "md",
            }}
          >
            {name}
          </StatLabel>

          {growth ? (
            <Flex align="center">
              <Text color="green.500" fontSize="xs" fontWeight="700" me="5px">
                {growth}
              </Text>
              <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
                since last month
              </Text>
            </Flex>
          ) : null}
        </Stat>
        <Flex ms="auto" w="max-content">
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
