import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import { useEffect, useState } from "react";
import { getApi } from "services/api";

const LeadsSummary = ({ user, dateTime }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchLeads = async () => {
    setLoading(true); 
    let lead;
    if (user.role === "superAdmin") {
      lead = await getApi("api/lead");
    } else {
      lead = await getApi(
        `api/lead/?role=${user?.roles[0]?.roleName}&user=${user._id}&dateTime=${
          dateTime?.from + "|" + dateTime?.to
        }`
      );
    }

    const leadData = lead.data;
    setData({
      "Total Leads": {
        count: leadData?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
      "Interested Leads": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "active")?.length ||
          0,
        primary: "#eaf9e6",
        secondary: "#43882f",
      },
      "Not-Interested Leads": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "pending")?.length ||
          0,
        primary: "#fbf4dd",
        secondary: "#a37f08",
      },
      "Sold Leads": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "sold")?.length || 0,
        primary: "#ffeeeb",
        secondary: "#d6401d",
      },
      "New Leads": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "new")?.length || 0,
        primary: "#ebf5ff",
        secondary: "#1f7eeb",
      },
      Unreachable: {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "unreachable")
            ?.length || 0,
        primary: "#ffeeeb",
        secondary: "#d6401d",
      },
      "No Answer": {
        count:
          leadData?.filter((lead) => lead?.leadStatus === "no_answer")
            ?.length || 0,
        primary: "#ffeeeb",
        secondary: "#d6401d",
      },
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [dateTime]);

  return (
    <>
      <div
        style={{
          padding: 20,
        }}
      >
        {loading ? (
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            width="100%"
            height={"100%"}
          >
            <Spinner />
          </Flex>
        ) : (
          <Grid templateColumns="repeat(12, 1fr)" gap={2}>
            {Object.keys(data)?.map((key) => (
              <GridItem colSpan={{ base: 2 }}>
                <Box
                  backgroundColor={data[key]["primary"]}
                  borderRadius={"10px"}
                  p={2}
                  m={1}
                  textAlign={"center"}
                >
                  <Heading size="sm" pb={3} color={data[key]["secondary"]}>
                    {key}
                  </Heading>
                  <Text fontWeight={600} color={data[key]["secondary"]}>
                    <CountUpComponent targetNumber={data[key]["count"] || 0} />{" "}
                  </Text>
                </Box>
              </GridItem>
            ))}
          </Grid>
        )}
      </div>
    </>
  );
};

export default LeadsSummary;
