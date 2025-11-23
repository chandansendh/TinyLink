import React, { useEffect, useState } from "react";
import { getLinks } from "../api/Links";
import LinkTable from "../components/LinkTable";
import Loader from "../components/Loader";
import AddLinkForm from "../components/AddLinkForm";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const baseUrl =
    process.env.REACT_APP_API_BASE;

  const load = async () => {
    setLoading(true);
    try {
      const data = await getLinks();
      setLinks(data);
    } catch (e) {
      alert("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 font-semibold bg-[#34A853] text-white rounded transition duration-300 transform hover:text-[#090a09] hover:scale-105 hover:bg-[#20de53]"
        >
          + Add Link
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <LinkTable
          links={links}
          onDeleted={load}
          baseUrl={baseUrl}
          onRefresh={load}
        />
      )}

      {showForm && (
        <AddLinkForm
          baseUrl={baseUrl}
          onClose={() => setShowForm(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
