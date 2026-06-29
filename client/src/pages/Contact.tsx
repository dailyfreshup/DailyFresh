import { Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/api";

const Contact = () => {
  const { user } = useAuth();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();

    if (!subject || !message) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      await api.post("/contact", {
        subject,
        message,
      });

      toast.success("Message sent successfully");

      setSubject("");
      setMessage("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <span className="text-[#057123] uppercase tracking-[3px] font-semibold text-sm">
            Contact Us
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
            Get In <span className="text-[#057123]">Touch</span>
          </h1>

          <p className="mt-5 text-gray-500 max-w-2xl mx-auto text-lg leading-7">
            We'd love to hear from you. Whether you have a question, feedback,
            or need assistance, we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-start gap-5 hover:shadow-lg transition">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="text-[#057123]" />
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800">Email</h3>
                <p className="text-gray-500 mt-1">dailyfreshadmin@gmail.com</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-start gap-5 hover:shadow-lg transition">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <Phone className="text-[#057123]" />
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800">Phone</h3>
                <p className="text-gray-500 mt-1">+91 7348702447</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-start gap-5 hover:shadow-lg transition">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <MapPin className="text-[#057123]" />
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-800">Address</h3>

                <p className="text-gray-500 mt-1 leading-7">
                  Daily Fresh
                  <br />
                  Ghazipur, Uttar Pradesh
                  <br />
                  India
                </p>
              </div>
            </div>
          </div>

          {user ? (
            <form
              onSubmit={submit}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                Send us a Message
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Subject
                  </label>

                  <input
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#057123] focus:ring-2 focus:ring-green-100 transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Message
                  </label>

                  <textarea
                    rows={7}
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 resize-none outline-none focus:border-[#057123] focus:ring-2 focus:ring-green-100 transition"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-[#057123] text-white py-3 rounded-xl font-medium hover:bg-[#04611d] transition disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Login Required
              </h2>

              <p className="text-gray-500 mt-3 mb-8 max-w-sm">
                Please login to your account before sending us a message.
              </p>

              <Link
                to="/login"
                className="bg-[#057123] hover:bg-[#04611d] text-white px-8 py-3 rounded-xl transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
