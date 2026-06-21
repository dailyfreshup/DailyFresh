import { useState } from "react";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AdminAnnouncement() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!subject || !message) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      await api.post("/admin/announcement", {
        subject,
        message,
      });

      toast.success("Announcement queued successfully");

      setSubject("");
      setMessage("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Send Announcement</h2>

      <input
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Announcement Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        rows={8}
        className="w-full border rounded-lg p-3 mb-6"
        placeholder="Write announcement..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Announcement"}
      </button>
    </div>
  );
}
