import { AdminPanel } from "@/modules/admin-module/frontend/components/AdminPanel";
import { fetchModels } from "@/modules/admin-module/frontend/lib/api-server";

export default async function AdminPage() {
    // Fetch initial data on server (SSR)
    // This eliminates the loading state on initial page load
    const initialModels = await fetchModels();

    return <AdminPanel initialModels={initialModels} />;
}
