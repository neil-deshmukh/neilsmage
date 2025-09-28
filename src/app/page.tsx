import Link from "next/link";
import React from "react";
import { HiUpload, HiLightningBolt, HiGlobeAlt } from "react-icons/hi";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="text-2xl font-bold text-gray-900">ImageVault</div>
        <div className="flex items-center space-x-4">
          <Link href="/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Store, optimize, and deliver images at
          <span className="text-blue-600"> lightning speed</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The complete image storage solution for developers. Upload, transform,
          and serve your images globally with our powerful CDN.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors">
            Start Free Trial
          </Link>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg hover:border-gray-400 transition-colors">
            View Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need for image management
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <HiUpload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Upload
              </h3>
              <p className="text-gray-600">
                Drag and drop your images or use our API for seamless uploads.
                Support for all major formats.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <HiLightningBolt className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Optimization
              </h3>
              <p className="text-gray-600">
                Automatically compress and resize images for perfect performance
                across all devices.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <HiGlobeAlt className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Global CDN
              </h3>
              <p className="text-gray-600">
                Deliver images from the nearest edge location for blazing fast
                load times worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to transform your image workflow?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who trust ImageVault for their image
            storage needs.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors">
            Get Started for Free
          </button>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 10GB free storage
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 mb-4 md:mb-0">
            © 2025 ImageVault. All rights reserved.
          </div>
          <div className="flex space-x-6 text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
