import {
  Button,
  CircularProgress,
  Flex,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/CheckTable";
import { postApi } from "services/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { constant } from "constant";
const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.roles[0]?.roleName;
  const [tableColumns,setTableColumns] = useState([
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Name", accessor: "leadName", width: 20 },
    { Header: "Manager", accessor: "managerAssigned" },
    { Header: "Agent", accessor: "agentAssigned" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Lead Approval", accessor: "leadWhatsappNumber" },
    { Header: "Intrest", accessor: "interest" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Action", isSortable: false, center: true },
  ])
  const [tableColumnsManager,setTableColumnsManager] = useState([
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Name", accessor: "leadName", width: 20 },
    { Header: "Manager", accessor: "managerAssigned" },
    { Header: "Agent", accessor: "agentAssigned" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Approval Status", accessor: "leadWhatsappNumber" },
    { Header: "Intrest", accessor: "interest" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Action", isSortable: false, center: true },
  ]);
  const [ tableColumnsAgent, setTableColumnsAgent] = useState( [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Name", accessor: "leadName", width: 20 },
    { Header: "Manager", accessor: "managerAssigned" },
    { Header: "Agent", accessor: "agentAssigned" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Approval Status", accessor: "leadWhatsappNumber" },
    { Header: "Intrest", accessor: "interest" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Action", isSortable: false, center: true },
  ]);
  const roleColumns = {
    Manager: tableColumnsManager,
    Agent: tableColumnsAgent,
  };
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  // 
  const [totalLeads, setTotalLeads] = useState(0); 
  const [pages, setPages] = useState(0); 
  const [approvals,setApprovals] = useState([]);
  const [filteredLeads,setFilteredLeads] = useState([]);
  const [currentState, setCurrentState]=useState("all_leads")
  const tree = useSelector((state) => state.user.tree);
  
  const [dynamicColumns, setDynamicColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [selectedColumns, setSelectedColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [action, setAction] = useState(false);
  const [dateTime, setDateTime] = useState({
    from: "",
    to: "",
  });
  const [autoAssignLoading, setAutoAssignLoading] = useState(false);
  const [columns, setColumns] = useState(roleColumns[role] || tableColumns);
  const { isOpen } = useDisclosure();
  const [permission, emailAccess, callAccess] = HasAccess([
    "Lead",
    "Email",
    "Call",
  ]);
 
  

  async function fetchApprovals(){
    try {
    //  const res = await getApi("api/adminApproval/get","")
     const res = await axios.get(constant["baseUrl"]+"api/adminApproval/get",{
      headers:{
        Authorization:  (localStorage.getItem("token") || sessionStorage.getItem("token"))
      }
     })
     setApprovals(res?.data)
    } catch (error) {
     console.log(error,"error")
    }
   }
  useEffect(()=>{
    

     fetchApprovals();
   },[data])

   useEffect(()=>{

    if(currentState=="Accepted"){
      setTableColumnsManager([
        { Header: "#", accessor: "intID", isSortable: false, width: 10 },
        { Header: "Name", accessor: "leadName", width: 20 },
        { Header: "Manager", accessor: "managerAssigned" },
        { Header: "Agent", accessor: "agentAssigned" },
        { Header: "Status", accessor: "leadStatus" },
        { Header: "Whatsapp Number", accessor: "leadWhatsappNumber" },
        { Header: "Phone Number", accessor: "leadPhoneNumber" },
        { Header: "Date And Time", accessor: "createdDate" },
        { Header: "Timetocall", accessor: "timetocall" },
        { Header: "Nationality", accessor: "nationality" },
        { Header: "Action", isSortable: false, center: true },
      ])
      setTableColumnsAgent([
        { Header: "#", accessor: "intID", isSortable: false, width: 10 },
        { Header: "Name", accessor: "leadName", width: 20 },
        { Header: "Manager", accessor: "managerAssigned" },
        { Header: "Agent", accessor: "agentAssigned" },
        { Header: "Status", accessor: "leadStatus" },
        { Header: "Whatsapp Number", accessor: "leadWhatsappNumber" },
        { Header: "Phone Number", accessor: "leadPhoneNumber" },
        { Header: "Date And Time", accessor: "createdDate" },
        { Header: "Timetocall", accessor: "timetocall" },
        { Header: "Nationality", accessor: "nationality" },
        { Header: "Action", isSortable: false, center: true },
      ])
    }else{
      setTableColumnsManager([
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Name", accessor: "leadName", width: 20 },
    { Header: "Manager", accessor: "managerAssigned" },
    { Header: "Agent", accessor: "agentAssigned" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Approval Status", accessor: "leadWhatsappNumber" },
    { Header: "Intrest", accessor: "interest" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Action", isSortable: false, center: true },
      ])
      setTableColumnsAgent([
        { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Name", accessor: "leadName", width: 20 },
    { Header: "Manager", accessor: "managerAssigned" },
    { Header: "Agent", accessor: "agentAssigned" },
    { Header: "Status", accessor: "leadStatus" },
    { Header: "Approval Status", accessor: "leadWhatsappNumber" },
    { Header: "Intrest", accessor: "interest" },
    { Header: "Nationality", accessor: "nationality" },
    { Header: "Action", isSortable: false, center: true },
      ])
    }

    if(currentState == "all_leads"){
      setFilteredLeads(data)

      return;
    }
   const newFilteredLeads = data?.filter((row)=>{
      return approvals.find(approval=>approval.leadId == row?._id)
      
   })
   console.log(newFilteredLeads , "Requested Lead")
   const leadApprovals = newFilteredLeads?.filter((lead)=>{
    const approval = approvals.find(approval=>lead?._id == approval?.leadId)
    return approval?.approvalStatus == currentState && (approval.managerId == user._id || approval.agentId == user._id)
 })
   setFilteredLeads(leadApprovals);
   },[data,approvals,currentState])

 

  
useEffect(()=>{
  setDynamicColumns(roleColumns[role] || tableColumns)
  setSelectedColumns(roleColumns[role] || tableColumns)
},[tableColumnsManager])

  const dataColumn = dynamicColumns?.filter((item) =>
    selectedColumns?.find((colum) => colum?.Header === item.Header)
  );

  const fetchData = async (pageNo = 1, pageSize = 10) => {
    setIsLoding(true);
    let result = await getApi(
      true
        ? "api/lead/" + "?dateTime=" + dateTime?.from + "|" + dateTime?.to + "&page=" + pageNo + "&pageSize=" + 200
        : `api/lead/?user=${user._id}&role=${
            user.roles[0]?.roleName
          }&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${pageSize}`
    );
    console.log(result?.data,"table data")
    setData(result.data?.result || []);
    setPages(result.data?.totalPages || 0); 
    setTotalLeads(result.data?.totalLeads || 0); 
    setIsLoding(false);
  };
  const fetchSearchedData = async (term="",pageNo = 1, pageSize = 10) => {
    setIsLoding(true);
    let result = await getApi(
      user.role === "superAdmin"
        ? "api/lead/search" + "?term=" +term + "&dateTime=" + dateTime?.from + "|" + dateTime?.to + "&page=" + pageNo + "&pageSize=" + pageSize
        : `api/lead/search?term=${term}&user=${user._id}&role=${
            user.roles[0]?.roleName
          }&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${pageSize}`
    );
    setDisplaySearchData(true);
    setSearchedData(result.data?.result || []); 
    setPages(result.data?.totalPages || 0); 
    setTotalLeads(result.data?.totalLeads || 0); 
    setIsLoding(false);
  };
  const autoAssign = async () => {
    try {
      setAutoAssignLoading(true);
      let agents = [];

      if (tree && tree["managers"]) {
        agents = tree["agents"]["manager-" + user?._id?.toString()];
      }
      await postApi("api/user/autoAssign", { agents });
      setAutoAssignLoading(false);
      toast.success("Auto assignment of agents done!");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  const checkApproval = (id) =>{
    // console.log("Approval Id", id)
    // console.log("Approvalsss...", approvals)
    return approvals.find(approval=> { 
      // console.log("Approval id ,,", approval?.leadId, id)
      return approval?.leadId == id
     }
    );
  }

  useEffect(() => {
    setColumns(tableColumns);
  }, [action]);
console.log(dynamicColumns,"manager")
  return (
    <div>
      <Button  onClick={()=> setCurrentState("all_leads") } sx={{
        backgroundColor:currentState == "all_leads"&&"#B79045",
        color:currentState == "all_leads"&&"white",
        "_hover":{
        backgroundColor:currentState == "all_leads"&&"#B79045",
        }
      }}>All Leads</Button>
      <Button  onClick={()=> setCurrentState("pending") } 
        sx={{
          backgroundColor:currentState == "pending"&&"#B79045",
        color:currentState == "pending"&&"white",
        "_hover":{
        backgroundColor:currentState == "pending"&&"#B79045",
        }
        }}>Pending</Button>
          <Button onClick={()=> setCurrentState("Accepted")} 
            sx={{
              backgroundColor:currentState == "Accepted"&&"#B79045",
        color:currentState == "Accepted"&&"white",
        "_hover":{
        backgroundColor:currentState == "Accepted"&&"#B79045",
        }
            }}>Approved  Leads</Button>
          <Button onClick={()=> setCurrentState("Rejected")}
            sx={{
              backgroundColor:currentState == "Rejected"&&"#B79045",
        color:currentState == "Rejected"&&"white",
        "_hover":{
        backgroundColor:currentState == "Rejected"&&"#B79045",
        }
            }}>Rejected Leads</Button>
      <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
      
        <GridItem colSpan={6}>
        {role === "Manager" && 
            <Flex justifyContent={"flex-end"} mb={4}>
              <Button
                onClick={autoAssign}
                bg={"black"}
                disabled={autoAssignLoading}
                rounded={"full"}
                colorScheme={"white"}
              >
                {autoAssignLoading ? "Assigning.." : "Auto Assign"}
              </Button>
            </Flex>
        }
          {/* <CheckTable
            dateTime={dateTime}
            setDateTime={setDateTime}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
            columnsData={roleColumns[role] || tableColumns}
            // columnsData={[]}
            isOpen={isOpen}
            setAction={setAction}
            // This one fetches the whole data 
            dataColumn={dataColumn}
            // dataColumn={[]}
            action={action}
            setSearchedData={setSearchedData}
            allData={displaySearchData ? searchedData : data}
            //  allData={[]}
            setData={setData}
            displaySearchData={displaySearchData}
             tableData={displaySearchData ? searchedData : data}
            // tableData= {[]}
            fetchData={fetchData}
            setDisplaySearchData={setDisplaySearchData}
            setDynamicColumns={setDynamicColumns}
            dynamicColumns={dynamicColumns}
            selectedColumns={selectedColumns}
            access={permission}
            setSelectedColumns={setSelectedColumns}
            emailAccess={emailAccess}
            callAccess={callAccess}
          /> */}
          
          <CheckTable
           checkApproval = {checkApproval}
            dateTime={dateTime}
            setDateTime={setDateTime}
            totalLeads={filteredLeads?.length}
            isLoding={isLoding}
            setIsLoding={setIsLoding}
            pages={pages}
            columnsData={roleColumns[role] || tableColumns}
            isOpen={isOpen}
            setAction={setAction}
            dataColumn={dataColumn}
            action={action}
            fetchSearchedData={fetchSearchedData}
            setSearchedData={setSearchedData}
            allData={displaySearchData ? searchedData : filteredLeads}
            setData={setFilteredLeads}
            displaySearchData={displaySearchData}
            tableData={displaySearchData ? searchedData : filteredLeads}
            fetchData={fetchData}
            setDisplaySearchData={setDisplaySearchData}
            setDynamicColumns={setDynamicColumns}
            dynamicColumns={dynamicColumns}
            selectedColumns={selectedColumns}
            access={permission}
            setSelectedColumns={setSelectedColumns}
            emailAccess={emailAccess}
            callAccess={callAccess}
          />
        </GridItem>
      </Grid>
    </div>
  );

};

export default Index;
