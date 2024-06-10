import { SimpleGrid } from "@chakra-ui/react";

const UserViewProperties = ({ usersList }) => {
  return (
    <SimpleGrid columns={{ base: 3 }} gap="20px" mb="20px" mt={"30px"}>
      {usersList?.map((user) => {
        return (
          <div
            style={{
              background: "#eef1fa",
              borderRadius: 8,
              padding: 14,
            }}
          >
            <p style={{ marginBottom: 12 }}>
              {user?.firstName + " " + user?.lastName}
            </p>
            <progress
              className="mini"
              value={100 * (user?.totalRevenue / user?.target)}
              max="100"
            ></progress>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <small>{user?.totalRevenue}</small>
              <small>{user?.target}</small>
            </div>
          </div>
        );
      })}
    </SimpleGrid>
  );
};

export default UserViewProperties;
