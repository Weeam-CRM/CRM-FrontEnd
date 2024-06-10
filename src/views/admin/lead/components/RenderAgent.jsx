import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { putApi } from "services/api";

const RenderAgent = ({ value, managerAssigned, leadID, fetchData }) => {
  const [AgentSelected, setAgentSelected] = useState("");
  const [agents, setAgents] = useState([]);
  const tree = useSelector((state) => state.user.tree);

  useEffect(() => {
    if(tree && tree["managers"]) {
      const agentsList = tree?.agents["manager-" + managerAssigned];
      setAgents(agentsList || []);
      setAgentSelected(value);
    }
  }, [managerAssigned, value, tree]);

  const handleChangeAgent = async (e) => {
    try {
      await putApi(`api/lead/edit/${leadID}`, {
        agentAssigned: e.target.value,
      });
      toast.success("Agent updated successfuly");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the agent");
    }
  };


  if (agents?.length) {
    return (
      <Select
        placeholder="No Agent"
        onInput={handleChangeAgent}
        value={AgentSelected === null ? "" : AgentSelected}
          style={{
        color: !AgentSelected ? "grey" : "black"
    }}
      >
        {agents?.map((agent) => (
          <option key={agent?._id?.toString()} value={agent?._id?.toString()}>
            {agent?.firstName + " " + agent?.lastName}
          </option>
        ))}
      </Select>
    );
  } else {
    return <p style={{ textAlign: "center" }}>No agents</p>;
  }
};

export default RenderAgent;
