import Banner from "../components/banner";
import Featured from "../components/featured";
import FilterableCards from "../components/filterableCards";
import Gatweays from "../components/gateways";
import KeyFeatures from "../components/keyFeatures";
import QuickDonate from "../components/quick-donate";
import SingleFilter from "../components/singleFilter";
import Stat from "../components/stat";
// import Filter from "../components/filter";

export default function Home() {
  return (
    <div className="homepage">
      <QuickDonate />
      <Banner />
      <FilterableCards />
      <Stat />
      <Featured />
      <SingleFilter />
      <Gatweays />
      <KeyFeatures />
    </div>
  );
}
