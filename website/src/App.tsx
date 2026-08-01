/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Architecture } from "./components/Architecture";
import { Configuration } from "./components/Configuration";
import { Installation } from "./components/Installation";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen text-white selection:bg-neon-cyan selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Architecture />
        <Configuration />
        <Installation />
      </main>
      <Footer />
    </div>
  );
}
