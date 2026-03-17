import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/landing/HeroSection';
import FeatureHighlights from '../components/landing/FeatureHighlights';
import PopularRoadmaps from '../components/landing/PopularRoadmaps';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>TechPath - Navigate Your Tech Career</title>
        <meta
          name="description"
          content="Discover structured roadmaps, explore curated AI tools, and track your learning progress. Navigate your tech career with confidence."
        />
      </Helmet>
      <HeroSection />
      <FeatureHighlights />
      <PopularRoadmaps />
    </>
  );
}
