import { Tag } from "antd";

const TagQc = ({ status }) => {
  let obj =
    status === "Y"
      ? { title: "PASS", color: "green" }
      : { title: "WAITING", color: "#eb9e19" };
  return <Tag color={obj?.color}>{obj?.title}</Tag>;
};

export default TagQc;
