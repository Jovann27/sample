import "./navbar.css"; 

const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
        zIndex: 9999,
      }}
    >
      <div className="chaotic-orbit"></div>
    </div>
  );
};

export default Loading;
