import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">
          ABOUT <span style={{ color: "#057123" }}>US</span>
        </h2>

        <p className="text-gray-500 mt-2 max-w-xl mx-auto text-base sm:text-lg">
          Get to know how Daily Fresh is transforming restaurant supply chains.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <img
          className="w-full max-w-[500px]"
          src={assets.logo}
          alt="About Daily Fresh"
        />

        <div className="flex flex-col gap-6 text-gray-700 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to <strong>Daily Fresh</strong> – a reliable B2B delivery
            platform that supplies fresh vegetables, fruits, dairy, and
            essential kitchen ingredients directly to restaurants and food
            businesses.
          </p>

          <p>
            We help restaurants save time and effort by ensuring timely delivery
            of high-quality ingredients, so they can focus on what they do best
            — serving great food.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Our Vision
            </h3>
            <p>
              To become the most trusted supply partner for restaurants by
              offering fast, consistent, and high-quality delivery of fresh
              ingredients, reducing supply chain delays and improving kitchen
              efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
