import React from 'react';
import { Calendar, MapPin, Users, Mail, Phone } from 'lucide-react';

interface WelcomeSectionProps {
  userProfile: {
    firstName: string;
    lastName: string;
    position: string;
    department: string;
    startDate: string;
    manager: string;
    email: string;
    phone: string;
  };
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userProfile }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome to MGX, {userProfile.firstName}! 🎉
          </h1>
          <p className="text-indigo-100 text-lg mb-6">
            We're excited to have you join our team. Let's get you set up for success.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-medium">Position</span>
              </div>
              <p className="text-indigo-100">{userProfile.position}</p>
              <p className="text-indigo-200 text-sm">{userProfile.department}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-medium">Start Date</span>
              </div>
              <p className="text-indigo-100">
                {new Date(userProfile.startDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-medium">Reporting Manager</span>
              </div>
              <p className="text-indigo-100">{userProfile.manager}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 mr-2" />
                <span className="font-medium">Contact</span>
              </div>
              <p className="text-indigo-100 text-sm">{userProfile.email}</p>
              <p className="text-indigo-200 text-sm">{userProfile.phone}</p>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-16 h-16 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;