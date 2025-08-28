
import { ServicePage } from "@/components/ServicePage";

const VisaPhotos = () => {
  return (
    <ServicePage 
      title="Visa Photos for Any Country"
      description="Get visa-ready in minutes."
      image="/visa_photos.png"
      details={[
        "Studio Arunaseya specializes in visa photos that meet the specific requirements of embassies and consulates around the world.",
        "Our experts stay updated with the latest visa photo specifications for countries like the USA, UK, Canada, Australia, Schengen countries, and many more.",
        "We provide precise dimensions, correct background colors, and proper lighting as required by each country's visa application process.",
        "Digital copies are available for online application submissions, and physical prints are provided in the exact size needed.",
        "Our service includes verification to ensure your photos will be accepted by visa processing centers."
      ]}
      pricing="Visa photo packages start at Rs. 300 for a set of photos. Digital copy included."
      turnaround="Ready in 15 minutes."
    />
  );
};

export default VisaPhotos;
