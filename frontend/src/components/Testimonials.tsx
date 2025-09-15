import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Isindu Pehelitha",
    text: "Very helpful owner , and very efficient , we can get a job done within 10 to 15 minutes, best studio within kelaniya temple area",
    rating: 5,
    location: ""
  },
  {
    name: "Lankan Explore",
    text: "Fast and friendly service in Kelaniya. Highly recommend!",
    rating: 5,
    location: ""
  },
  {
    name: "Jerome Dilshan Gomes",
    text: "Quick service for all your photo graph Requirement. Highly recommend Studio Arunaseya",
    rating: 5,
    location: ""
  },
  {
    name: "Mithila Kavsika",
    text: "One of the best studios in the area. Friendly, fast and efficient service.",
    rating: 5,
    location: ""
  },
  {
    name: "M.M.A Musni",
    text: "Perfect studio. Even these days passport software is not working, he managed to get my photo during the night time. Such a great person with great dedication",
    rating: 5,
    location: ""
  }
];

export const Testimonials = () => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    // Auto-scroll functionality
    const autoScroll = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        // Loop back to the first slide
        api.scrollTo(0);
      }
    }, 4000); // Auto-scroll every 4 seconds

    // Clean up interval on component unmount
    return () => clearInterval(autoScroll);
  }, [api]);

  return (
    <section className="py-20 bg-white" aria-label="Customer testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-studio-gray-600 max-w-3xl mx-auto text-balance">
            Don't just take our word for it - hear from our satisfied customers across India who trust Studio Arunaseya for their photography needs
          </p>
        </div>
        
        <Carousel
          setApi={setApi}
          className="max-w-4xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <article className="bg-studio-gray-50 p-8 rounded-lg h-full hover-lift animate-on-scroll flex flex-col">
                  <div className="flex mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl" aria-hidden="true">★</span>
                    ))}
                  </div>
                  <blockquote className="text-studio-gray-600 mb-6 leading-relaxed italic flex-grow">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="border-t border-studio-gray-200 pt-4 mt-auto">
                    <cite className="font-semibold text-studio-black not-italic block">
                      {testimonial.name}
                    </cite>
                    <p className="text-sm text-studio-gray-500 mt-1">{testimonial.location}</p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
