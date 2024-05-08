import useDimensions from "hook/useDimensions";
import { ThreeDots } from "react-loader-spinner";

const Loading = () => {
  const { height } = useDimensions();

  return (
    <div
      style={{
        width: "100%",
        minHeight: height / 2 + 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#da2a35"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
};
export default Loading;
