import React from 'react';
import HeroSection from './Home/HeroSection';
import BookingWidget from './Home/BookingWidget';
import HallOfFame from './Home/HallOfFame';
import GallerySection from './Home/GallerySection';
import CTASection from './Home/CTASection';

export default function HomeView() {
  return (
    <div className="w-full">
      <HeroSection />
      <BookingWidget />
      <HallOfFame />
      <GallerySection />
      <CTASection />
    </div>
  );
}
