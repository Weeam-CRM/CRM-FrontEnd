import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableContainer,
  Tr,
  Th,
  Tbody,
  Thead,
  Td,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { getApi } from "services/api";
import { toast } from "react-toastify";
import DataNotFound from "components/notFoundData";

const LeadNotes = ({ lid, noteAdded }) => {
  const [notesLoading, setNotesLoading] = useState(true);
  const [allNotes, setAllNotes] = useState([]);

  const textColor = useColorModeValue("gray.500", "white");

  const fetchLeadNotes = async (lid) => {
    try {
      setNotesLoading(true);
      const leadNotes = await getApi("api/leadnote/" + lid);
      setAllNotes(leadNotes.data || []);
      setNotesLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Couldn't fetch lead notes");
    }
  };

  useEffect(() => {
    if (lid) {
      fetchLeadNotes(lid);
    }
  }, [lid, noteAdded]);

  return (
    <div>
      {notesLoading ? (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={200}
        >
          <Spinner />
        </Box>
      ) : (
        <VStack mt={4} alignItems="flex-start">
          {allNotes.length === 0 && (
            <Text
              textAlign={"center"}
              width="100%"
              color={textColor}
              fontSize="sm"
              fontWeight="700"
            >
              <DataNotFound />
            </Text>
          )}
          {allNotes.length > 0 && (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Note</Th>
                    <Th>Added by</Th>
                    <Td>Created at</Td>
                    {/* <Th>Actions</Th> */}
                  </Tr>
                </Thead>
                <Tbody>
                  {allNotes.map((note) => {
                    return (
                      <Tr>
                        <Td color={"brand.800"}>{note.note}</Td>
                        <Td>
                          {note.addedBy?.firstName +
                            " " +
                            note.addedBy?.lastName}
                        </Td>
                        <Td>
                          <small>
                            {new Date(note.createdAt).toLocaleString("en-GB", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })}
                          </small>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </VStack>
      )}
    </div>
  );
};

export default LeadNotes;
