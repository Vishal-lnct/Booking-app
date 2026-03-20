import Hero          from "../components/Hero";
import FeaturedRooms from "../components/FeaturedRooms";
import Locations     from "../components/Locations";
import WhyChooseUs   from "../components/WhyChooseUs";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedRooms />
      <Locations />
      <WhyChooseUs />
    </div>
  );
};

export default Home;