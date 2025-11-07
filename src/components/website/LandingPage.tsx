import React from 'react';
import { Building2, Users, Globe, Shield, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onRegisterClick, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                Uncoded
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLoginClick}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={onRegisterClick}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Register with Uncoded
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Partner with Uncoded
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join our global network of partners and unlock new business opportunities. 
              Our comprehensive onboarding platform supports both B2B and B2C business models 
              across multiple regions and brands.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={onRegisterClick}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Uncoded?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides everything you need to successfully onboard and manage 
              your partnership with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Expand your business across multiple countries and regions with our global network.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">B2B & B2C Support</h3>
              <p className="text-gray-600">
                Whether you're B2B or B2C, our platform adapts to your business model.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">
                Real-time validation and compliance checks ensure your data is secure.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Brand</h3>
              <p className="text-gray-600">
                Manage multiple brands and locations from a single, unified platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple Onboarding Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just a few steps with our streamlined onboarding process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration</h3>
              <p className="text-gray-600">
                Complete your company details and business information with real-time validation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Process</h3>
              <p className="text-gray-600">
                Our team reviews your application and sets up your account with appropriate plans.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Go Live</h3>
              <p className="text-gray-600">
                Create user accounts and start using our platform to grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <div className="space-y-4">
                {[
                  'Real-time business ID validation',
                  'Multi-location management',
                  'Flexible payment options',
                  'Comprehensive reporting',
                  'Dedicated support team',
                  'Scalable user management'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-green-100 rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of partners who trust Uncoded for their business growth.
                </p>
                <button
                  onClick={onRegisterClick}
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Register with Uncoded
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-xl font-bold">Uncoded</span>
              </div>
              <p className="text-gray-400">
                Empowering businesses worldwide through innovative partnership solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Partner Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Uncoded. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;