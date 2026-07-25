import Hero from "../components/Hero";
import FilterBar from "../components/FilterBar";
import JobsGrid from "../components/JobsGrid";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F7FF" }}>
      <Hero />
      <div id="jobs-section">
        <FilterBar />
        <JobsGrid />
      </div>
    </main>
  );
}
