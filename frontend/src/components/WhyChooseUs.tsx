
import { Check, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Check,
    title: "Reasonable Pricing",
    description: "Quality services at competitive rates that fit your budget"
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Quick service delivery without compromising on quality"
  },
  {
    icon: Users,
    title: "100% Quality Assurance",
    description: "Every photo meets our high standards of excellence"
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-6">
            Why Choose Us
          </h2>
          <p className="text-xl text-studio-gray-600 max-w-3xl mx-auto text-balance">
            We're committed to providing exceptional service that exceeds your expectations
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center animate-on-scroll group">
              <div className="bg-studio-black p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-studio-black mb-4">
                {feature.title}
              </h3>
              <p className="text-lg text-studio-gray-600 leading-relaxed max-w-sm mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
