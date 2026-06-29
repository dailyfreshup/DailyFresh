import { assets } from "../assets/assets";
import { Leaf, Truck, Handshake } from "lucide-react";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-green-50/40 via-white to-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-center mb-16">
          <span className="text-[#057123] font-semibold uppercase tracking-[3px] text-sm">
            Welcome to
          </span>
          <div className="flex justify-center mt-4">
            <div className="h-16 md:h-20 overflow-hidden flex items-center">
              <img
                src={assets.logo_text}
                alt="Daily Fresh"
                className="max-w-xs sm:max-w-sm md:max-w-md w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-5 max-w-2xl mx-auto text-gray-500 leading-7 text-lg">
            Get to know how Daily Fresh is transforming restaurant supply
            chains.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <img
              src={assets.logo}
              alt="Daily Fresh"
              className="w-full max-w-[380px] object-contain"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 lg:p-10 flex flex-col gap-6">
            <p className="text-gray-600 leading-8">
              Welcome to <strong>Daily Fresh</strong> – a reliable B2B delivery
              platform that supplies fresh vegetables, fruits, dairy, and
              essential kitchen ingredients directly to restaurants and food
              businesses.
            </p>

            <p className="text-gray-600 leading-8">
              We help restaurants save time and effort by ensuring timely
              delivery of high-quality ingredients, so they can focus on what
              they do best — serving great food.
            </p>

            <div className="bg-green-50 rounded-2xl border-l-4 border-[#057123] p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Our Vision
              </h3>

              <p className="text-gray-600 leading-7">
                To become the most trusted supply partner for restaurants by
                offering fast, consistent, and high-quality delivery of fresh
                ingredients, reducing supply chain delays and improving kitchen
                efficiency.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-14">
            <span className="text-[#057123] font-semibold uppercase tracking-[3px] text-sm">
              Our Strengths
            </span>

            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Why Choose Us
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Leaf size={28} className="text-[#057123]" />
              </div>

              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Fresh Quality
              </h4>

              <p className="text-gray-600 leading-7">
                We source premium-quality fruits, vegetables, dairy, and kitchen
                essentials to ensure your restaurant always serves fresh and
                delicious meals.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Truck size={28} className="text-[#057123]" />
              </div>

              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                On-Time Delivery
              </h4>

              <p className="text-gray-600 leading-7">
                Our efficient delivery network ensures your orders arrive on
                time, helping your kitchen operate smoothly without supply
                delays.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Handshake size={28} className="text-[#057123]" />
              </div>

              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                Trusted Partnership
              </h4>

              <p className="text-gray-600 leading-7">
                We build long-term relationships with restaurants by providing
                reliable service, consistent quality, and dedicated customer
                support every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
