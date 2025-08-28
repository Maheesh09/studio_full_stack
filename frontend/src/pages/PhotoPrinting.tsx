
import { ServicePage } from "@/components/ServicePage";

const PhotoPrinting = () => {
  return (
    <ServicePage 
      title="Photo Printing"
      description="Any size, any format — premium quality guaranteed."
      image="/printing.png"
      details={[
        "At Studio Arunaseya, we offer high-quality photo printing services that bring your digital memories to life with exceptional color accuracy and clarity.",
        "Our state-of-the-art printing equipment ensures that every detail in your images is preserved, from the subtle color gradients to the finest details.",
        "We provide a wide range of printing options, from standard sizes like 4×6, 5×7, and 8×10 to custom dimensions that suit your specific needs.",
        "Our photo printing service uses premium photo paper that resists fading and maintains vibrant colors for decades.",
        "Whether you need one special photo or hundreds of prints for an event, our efficient service ensures quick turnaround without compromising on quality."
      ]}
      pricing="Starting from Rs. 200 for 4×6 prints, with various packages available for bulk orders."
      turnaround="Standard prints ready in 1 hour; specialty sizes and bulk orders within 24-48 hours."
    />
  );
};

export default PhotoPrinting;
