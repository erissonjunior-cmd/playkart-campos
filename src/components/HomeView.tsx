import React from 'react';
import HeroSection from './Home/HeroSection';
import BookingWidget from './Home/BookingWidget';
import HallOfFame from './Home/HallOfFame';
import CircuitSection from './Home/CircuitSection';
import GallerySection from './Home/GallerySection';
import CTASection from './Home/CTASection';
import LocationSection from './Home/LocationSection';

export default function HomeView() {
  return (
    <div className="w-full">
      <HeroSection />
      <BookingWidget />
      <HallOfFame />
      <CircuitSection />
      <GallerySection />
      <LocationSection />
      <CTASection />
    </div>
  );
}
