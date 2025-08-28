
import { ServicePage } from "@/components/ServicePage";

const PassportPhotos = () => {
  return (
    <ServicePage 
      title="Online Passport & ID Photos"
      description="Instant compliant digital ID solutions."
      image="/passport.jpg"
      details={[
        "Getting the perfect passport or ID photo has never been easier. At Studio Arunaseya, we specialize in creating compliant photos for all official documents.",
        "Our experts understand the specific requirements for various document types including passports, driving licenses, voter IDs, PAN cards, and more.",
        "We ensure proper lighting, correct background color, appropriate head position, and exact dimensions as per government specifications.",
        "Digital copies are provided instantly for online applications, and physical prints are available in multiple sizes and quantities.",
        "Our digital retouching services ensure you look your best while still meeting all compliance requirements."
      ]}
      pricing="Single set of 4 passport-sized photos: Rs. 300. Digital copy included on request."
      turnaround="Ready in 10 minutes or less."
    />
  );
};

export default PassportPhotos;
