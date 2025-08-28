
export const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-6">
              About Studio Arunaseya
            </h2>
            <p className="text-lg text-studio-gray-600 mb-6 leading-relaxed">
              For over a decade, Studio Arunaseya has been the trusted choice for photography 
              services in our community. We specialize in creating lasting memories through 
              our professional photography and printing services.
            </p>
            <p className="text-lg text-studio-gray-600 mb-6 leading-relaxed">
              From urgent passport photos to precious memory restoration, we combine 
              traditional craftsmanship with modern technology to deliver exceptional 
              results every time.
            </p>
            <p className="text-lg text-studio-gray-600 leading-relaxed">
              Our commitment to quality, reasonable pricing, and customer satisfaction 
              has made us the go-to photography studio for individuals, families, and 
              businesses alike.
            </p>
          </div>
          
          <div className="animate-on-scroll">
            <div className="relative">
              <div className="aspect-square bg-studio-gray-100 rounded-lg overflow-hidden">
                <img 
                  src="/arunaseya.png"
                  alt="Studio Arunaseya workspace"
                  className="w-full h-full object-cover hover-lift"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-studio-black text-white p-6 rounded-lg">
                <p className="text-lg font-semibold">10+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
