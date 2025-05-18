import React, { useEffect } from "react";
import OwnerSidebar from "../../components/Owner/Sidebar";
import "../../assets/styles/admin/AdminLayout.css";

const OwnerLayout = ({ children }) => {
  useEffect(() => {
    const adjustSidebarClip = () => {
      const sidebar = document.querySelector(".admin-sidebar");
      const footer = document.querySelector(".footer");
      if (!sidebar || !footer) return;

      const footerRect = footer.getBoundingClientRect();
      const headerHeight = 60; // Chiều cao header
      const windowHeight = window.innerHeight;

      // Tính điểm cắt dưới
      if (footerRect.top < windowHeight) {
        const clipBottom = footerRect.top + window.scrollY - headerHeight;
        const sidebarHeight = windowHeight - headerHeight;
        const clipPercentage = (clipBottom / sidebarHeight) * 100;
        sidebar.style.setProperty("--clip-bottom", `${clipPercentage}%`);
      } else {
        sidebar.style.setProperty("--clip-bottom", "100%");
      }
    };

    adjustSidebarClip();
    window.addEventListener("scroll", adjustSidebarClip);
    window.addEventListener("resize", adjustSidebarClip);

    return () => {
      window.removeEventListener("scroll", adjustSidebarClip);
      window.removeEventListener("resize", adjustSidebarClip);
    };
  }, []);

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <OwnerSidebar />
      </div>
      <div className="admin-content">{children}</div>
    </div>
  );
};

export default OwnerLayout;