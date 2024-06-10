import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderStatus = ({ id, cellValue, setUpdatedStatuses }) => {
  const [value, setValue] = useState("");

  const setStatusData = async (e) => {
    try {
      const data = {
        leadStatus: e.target.value,
      };
      let response = await putApi(`api/lead/changeStatus/${id}`, data);
      if (response.status === 200) {
        setValue(data.leadStatus);
        setUpdatedStatuses((prev) => [...prev, {
            id, status: data?.leadStatus || "new"
        }])
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    } finally {
    }
  };

  const changeStatus = (value) => {
    switch (value) {
      case "pending":
        return "pending";
      case "active":
        return "completed";
      case "sold":
        return "onHold";
      default:
        return "completed";
    }
  };

  useEffect(() => {
    setValue(cellValue || "new");
  }, [id]);

  return (
    <>
      <Select
        defaultValue={"new"}
        className={changeStatus(value)}
        onChange={setStatusData}
        height={7}
        width={130}
        value={value || "new"}
        style={{ fontSize: "14px" }}
      >
        <option value="active">Interested</option>
        <option value="sold">Sold</option>
        <option value="pending">Not interested</option>
        <option value="new">New</option>
        <option value="no_answer">No Answer</option>
        <option value="unreachable">Unreachable</option>
      </Select>
    </>
  );
};

export default RenderStatus;
