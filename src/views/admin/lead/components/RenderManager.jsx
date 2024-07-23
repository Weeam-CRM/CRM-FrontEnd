import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderManager = ({ value, leadID, fetchData, pageIndex }) => {
  const [ManagerSelected, setManagerSelected] = useState("");
  const tree = useSelector((state) => state.user.tree);

  const handleChangeManager = async (e) => {
    try {
      const dataObj = {
        managerAssigned: e.target.value 
      }

      if(e.target.value === "") {
        dataObj["agentAssigned"] = ""; 
      }

      await putApi(`api/lead/edit/${leadID}`, dataObj);
      toast.success("Manager updated successfuly");
      fetchData(); 
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the manager");
    }
  };

  useEffect(() => {
    setManagerSelected(value);
  }, []);

  return (
    <Select
    style={{
        color: !ManagerSelected ? "grey" : "black"
    }}
      value={ManagerSelected || ""}
      onChange={handleChangeManager}
      placeholder="No Manager"
    >
      {tree && tree?.managers?.map((manager) => (
        <option key = { manager?._id?.toString()} value={manager?._id?.toString()}>
          {manager?.firstName + " " + manager?.lastName}
        </option>
      ))}
    </Select>
  );
};

export default RenderManager;
