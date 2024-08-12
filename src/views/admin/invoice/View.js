import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import { useLocation, useParams } from "react-router-dom";
import { getApi } from "services/api";
import { BiError } from "react-icons/bi";

const SingleInvoice = () => {
  const [state, setState] = useState({}); 
  const [isLoding, setIsLoding] = useState(true); 
  const [error404, set404] = useState(false); 
  const {id} = useParams(); 

  const downloadInvoice = () => {
    htmlToImage
      .toPng(document.getElementById("invoice-pdf"), { quality: 1 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-invoice.jpeg";
        const pdf = new jsPDF();
        pdf.addImage(dataUrl, "PNG", 0, 0);
        pdf.save("download.pdf");
      });
  };


  const fetchData = async () => {
    setIsLoding(true);
    let result = await getApi("api/invoices/" + id
      , null, "server2"
    );
    if(result.status !== 404) {
      setState(result.data?.invoice || {});
    }

    if(result.status === 404) {
      set404(true); 
    }
    setIsLoding(false);
  };

  useEffect(() =>{
    fetchData(); 
  }, []); 

  if(error404) {
    return <Box height={400} display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <Text display={"flex"} alignItems={"center"} color={"red"} fontSize={24}><BiError size={25} style={{
        marginRight: 5, 
      }}/> No Invoice Found!</Text>
    </Box>
  }
  return (
    <Box bg="gray.50" p={8}>
      <Flex mb={4} justifyContent={"flex-end"}>
        <Button onClick={downloadInvoice} colorScheme="brand" size="sm">
          Download PDF
        </Button>
      </Flex>
      <Skeleton isLoaded={!isLoding}>
        <VStack id="invoice-pdf" bg="white" p={8} shadow="lg">
          <Box bg="yellow.600" w="100%" textAlign="center" p={4} color="white">
            <Text fontSize="xl" fontWeight="bold">
              Tax Invoice
            </Text>
          </Box>
          <Flex justify="space-between" w="100%">
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                WEAM ELNAGGAR REAL ESTATE
              </Text>
              <Text>
                Office #3102, API World Tower, Sheikh Zayed road, Dubai, UAE
              </Text>
              <Text>Telephone: +971-58-557-7271 | +971-56-115-0747</Text>
              <Text>TRN: 104271009300003</Text>
            </Box>
            <Box textAlign="right">
              <Text fontWeight="bold">Invoice Date:</Text>
              <Text>{new Date(state?.created_at)?.toDateString()}</Text>
              <Text fontWeight="bold" mt={2}>
                Tax Invoice No:
              </Text>
              <Text>{state?.invoice_number}</Text>
            </Box>
          </Flex>
          <Box bg="yellow.600" w="100%" p={4} color="white">
            <Text fontWeight="bold">Invoiced To</Text>
            <Text>{state?.developer?.developer_name || "-"}</Text>
            <Text>{state?.developer?.address || "-"}</Text>
            <Text>TRN: {state?.developer?.trn || "-"}</Text>
          </Box>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>SN</Th>
                <Th>Unit No</Th>
                <Th>Name of Referring Party</Th>
                <Th>Claim Type</Th>
                <Th>Commission %</Th>
                <Th>Unit Price</Th>
                <Th>Total Commission EXCL. vat</Th>
                <Th>Vat %</Th>
                <Th>Vat Amount</Th>
                <Th>Total Commission include vat</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <Tr key={i}>
                  <Td textAlign="center">{i + 1}</Td>
                  <Td>AZIZI VENICE 08B-736</Td>
                  <Td>WEAM ELNAGGAR REAL ESTATE</Td>
                  <Td textAlign="center">FULL</Td>
                  <Td textAlign="center">7%</Td>
                  <Td textAlign="right">647000.00</Td>
                  <Td textAlign="right">45290.00</Td>
                  <Td textAlign="center">5%</Td>
                  <Td textAlign="right">2264.20</Td>
                  <Td textAlign="right">47554.50</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Flex justify="space-between" w="100%">
            <Text fontWeight="bold">Total Commission :</Text>
            <Text>
              Two Hundred Twenty One Thousand Seven Hundred Seventy-Seven and
              Sixty fils.
            </Text>
          </Flex>
          <Box bg="yellow.600" w="100%" p={4} color="white">
            <Text fontWeight="bold">Bank Account Details:</Text>
            <Text>Account Name : {state?.bank_account?.account_holder_name || "-"}</Text>
            <Text>Account Number : {state?.bank_account?.account_number||"-"}</Text>
            <Text>IBAN : {state?.bank_account?.iban||"-"}</Text>
            <Text>Swift Code : {state?.bank_account?.swift_code||"-"}</Text>
            <Text>Bank : {state?.bank_account?.bank_name || "-"}</Text>
            <Text>Bank Address : {state?.bank_account?.branch_address||"-"}</Text>
          </Box>
          <Box
            textAlign="right"
            w="100%"
            p={4}
            borderTop="1px"
            borderColor="gray.200"
          >
            <Text mb={2}>
              <Text as="span" fontWeight="bold">
                Total Commission EXCL. VAT:
              </Text>{" "}
              219,777.60 AED
            </Text>
            <Text mb={2}>
              <Text as="span" fontWeight="bold">
                VAT Amount:
              </Text>{" "}
              21345.60 AED
            </Text>
            <Text fontWeight="bold">
              <Text as="span" fontWeight="bold">
                Total Commission Include VAT:
              </Text>{" "}
              899,777.60 AED
            </Text>
          </Box>
        </VStack>
      </Skeleton>
    </Box>
  );
};

export default SingleInvoice;
