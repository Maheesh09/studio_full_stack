
import { ServicePage } from "@/components/ServicePage";

const CustomFraming = () => {
  return (
    <ServicePage 
      title="Custom Photo Framing"
      description="Elegant frames tailored to your photos."
      image="/frames2.png"
      details={[
        "Transform your precious photos into stunning wall art with our custom framing service at Studio Arunaseya.",
        "We offer a wide selection of frame styles, materials, and colors to complement your photos and interior décor.",
        "Our framing experts help you select the perfect mat board, glass type, and frame design to enhance the visual impact of your images.",
        "Each frame is handcrafted with precision and attention to detail, ensuring durability and aesthetic appeal.",
        "From family portraits to landscape photography, we create custom frames for any size or type of photograph."
      ]}
      pricing="Custom framing starts at Rs. 500, depending on size, materials, and complexity."
      turnaround="2-5 business days, depending on complexity and materials."
    />
  );
};

export default CustomFraming;
