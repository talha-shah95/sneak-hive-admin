import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AuthLayoutSkeleton = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "1rem",
      width: "100%",
      maxWidth: 400,
      margin: "0 auto",
      padding: "1rem",
    }}
  >
    <Skeleton height={50} width="100%" borderRadius={6} />
    <Skeleton height={40} width="100%" borderRadius={6} />
    <Skeleton height={40} width="100%" borderRadius={6} />
  </div>
);

export default AuthLayoutSkeleton;
