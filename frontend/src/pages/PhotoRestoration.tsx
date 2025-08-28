
import { ServicePage } from "@/components/ServicePage";

const PhotoRestoration = () => {
  return (
    <ServicePage 
      title="Photo Restoration"
      description="Old memories, digitally brought back to life."
      image="/restoration.jpg"
      details={[
        "Our photo restoration service breathes new life into damaged, faded, or deteriorating photographs that hold precious memories.",
        "Our skilled technicians use advanced digital tools to repair various types of damage including tears, creases, stains, fading, and color deterioration.",
        "We can restore black and white photos, sepia-toned images, and color photographs from any era.",
        "The restoration process includes digital scanning of your original photo, professional retouching, color correction, and printing on archival-quality paper.",
        "We take special care to preserve the authentic character and historical value of your images while enhancing their clarity and visual appeal.",
        "All original photos are handled with extreme care and returned to you along with the restored versions."
      ]}
      pricing="Basic restorations start at Rs. 400. Complex restorations are priced based on required work."
      turnaround="3-7 business days, depending on complexity."
    />
  );
};

export default PhotoRestoration;
