import "./home.css";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import Mission from "./Mission";
import Announcement from "./Announcement";

const Home = () => {
  
  return (
    <>
      <section className="homePage page">
        <HeroSection />
        <Announcement />
        <Mission />
        <HowItWorks />
      </section>
    </>
  );
};

export default Home;