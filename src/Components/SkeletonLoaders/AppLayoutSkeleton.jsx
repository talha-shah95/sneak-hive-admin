import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AppLayoutSkeleton = () => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    {/* Sidebar skeleton */}
    <div style={{ width: 250, padding: 10 }}>
      <Skeleton height={50} style={{ marginBottom: 12 }} />
      <Skeleton height={40} count={5} style={{ marginBottom: 8 }} />
    </div>

    {/* Main content skeleton */}
    <main style={{ flex: 1, padding: 20 }}>
      <Skeleton height={40} width="60%" style={{ marginBottom: 20 }} />
      <Skeleton height={200} borderRadius={6} />
      <Skeleton height={100} borderRadius={6} style={{ marginTop: 20 }} />
    </main>
  </div>
);

export default AppLayoutSkeleton;
