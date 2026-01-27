// app/admin/layout.js
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function checkAdminAccess() {
  // Method 1: Check if request is from Shopify admin
  const headersList = await headers();
  const referer = headersList.get("referer");

  // Check if coming from Shopify admin context
  if (referer && referer.includes("admin.shopify.com")) {
    return true;
  }

  return false;
}

export default async function AdminLayout({ children }) {
  const hasAccess = await checkAdminAccess();

  if (!hasAccess) {
    redirect("/");
  }

  return <div>{children}</div>;
}
