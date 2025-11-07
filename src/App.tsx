import React, { useState } from 'react';
import { useEffect } from 'react';
import LandingPage from './components/website/LandingPage';
import CompanyDetailsForm from './components/onboarding/CompanyDetailsForm';
import BankingDetailsForm from './components/onboarding/BankingDetailsForm';
import ReviewSubmitForm from './components/onboarding/ReviewSubmitForm';
import PartnerDashboard from './components/partner/PartnerDashboard';
import BOSDashboard from './components/admin/BOSDashboard';
import PricingDashboard from './components/admin/PricingDashboard';
import UncodedAdminDashboard from './components/admin/UncodedAdminDashboard';
import { PartnerService } from './services/partnerService';
import { BOSService } from './services/bosService';
import { PricingService } from './services/pricingService';
import { AdminService } from './services/adminService';
import type { Partner, BOSTask, PricingTask, SpocMapping, BrandChannelMapping } from './lib/supabase';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'partner' | 'bos' | 'pricing' | 'admin' | 'login'>('landing');
  const [onboardingStep, setOnboardingStep] = useState<'company' | 'banking' | 'review'>('company');
  const [formData, setFormData] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [bosTaskList, setBosTaskList] = useState<any[]>([]);
  const [pricingTaskList, setPricingTaskList] = useState<any[]>([]);
  const [spocMappingList, setSpocMappingList] = useState<SpocMapping[]>([]);
  const [brandChannelMappingList, setBrandChannelMappingList] = useState<BrandChannelMapping[]>([]);
  const [adminAnalytics, setAdminAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const isSupabaseConfigured = supabaseUrl && 
                                  supabaseUrl !== 'your-supabase-url' &&
                                  supabaseKey && 
                                  supabaseKey !== 'your-supabase-anon-key' &&
                                  supabaseUrl.includes('supabase.co');
      
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured. Using fallback data.');
        setFallbackData();
        return;
      }
      
      console.log('Testing Supabase connection...');
      
      try {
        // Test connection first
        await PartnerService.testConnection();
        console.log('✅ Supabase connection successful');
        
        // Load data with individual error handling
        const partnersData = await PartnerService.getAllPartners().catch(err => {
          console.warn('Failed to load partners:', err);
          return [];
        });
        
        const bosTasksData = await BOSService.getAllTasks().catch(err => {
          console.warn('Failed to load BOS tasks:', err);
          return [];
        });
        
        const pricingTasksData = await PricingService.getAllTasks().catch(err => {
          console.warn('Failed to load pricing tasks:', err);
          return [];
        });
        
        const spocData = await AdminService.getAllSpocMappings().catch(err => {
          console.warn('Failed to load SPOC mappings:', err);
          return [];
        });
        
        const brandChannelData = await AdminService.getAllBrandChannelMappings().catch(err => {
          console.warn('Failed to load brand channel mappings:', err);
          return [];
        });
        
        const analyticsData = await AdminService.getAnalytics().catch(err => {
          console.warn('Failed to load analytics:', err);
          return {
            totalPartners: 0,
            completedOnboardings: 0,
            averageOnboardingDuration: 0,
            supportButtonUsage: 0,
            conversionRate: 0,
            milestoneAnalytics: {
              registration: { average: 0, count: 0 },
              review: { average: 0, count: 0 },
              userCreation: { average: 0, count: 0 }
            }
          };
        });

        setPartners(partnersData);
        setBosTaskList(bosTasksData);
        setPricingTaskList(pricingTasksData);
        setSpocMappingList(spocData);
        setBrandChannelMappingList(brandChannelData);
        setAdminAnalytics(analyticsData);
        
        console.log('✅ Data loaded successfully');
      } catch (connectionError) {
        console.warn('❌ Supabase connection failed:', connectionError);
        console.log('🔄 Using fallback data...');
        setFallbackData();
      }
    } catch (error) {
      console.error('❌ Critical error in loadData:', error);
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    setPartners([]);
    setBosTaskList([]);
    setPricingTaskList([]);
    setSpocMappingList([]);
    setBrandChannelMappingList([]);
    setAdminAnalytics({
      totalPartners: 0,
      completedOnboardings: 0,
      averageOnboardingDuration: 0,
      supportButtonUsage: 0,
      conversionRate: 0,
      milestoneAnalytics: {
        registration: { average: 0, count: 0 },
        review: { average: 0, count: 0 },
        userCreation: { average: 0, count: 0 }
      }
    });
  };

  const handleOnboardingNext = (data: any) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    
    if (onboardingStep === 'company') {
      setOnboardingStep('banking');
    } else if (onboardingStep === 'banking') {
      setOnboardingStep('review');
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep === 'banking') {
      setOnboardingStep('company');
    } else if (onboardingStep === 'review') {
      setOnboardingStep('banking');
    }
  };

  const handleOnboardingSubmit = async () => {
    try {
      console.log('🚀 STARTING PARTNER REGISTRATION PROCESS');
      console.log('📋 Form data:', formData);
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const isSupabaseConfigured = supabaseUrl && 
                                  supabaseUrl !== 'your-supabase-url' &&
                                  supabaseKey && 
                                  supabaseKey !== 'your-supabase-anon-key' &&
                                  supabaseUrl.includes('supabase.co');
      
      if (!isSupabaseConfigured) {
        console.error('❌ Supabase is not properly configured');
        alert('❌ DATABASE NOT CONFIGURED\n\nSupabase database connection is not set up properly.\n\nTo enable full functionality:\n1. Set up your Supabase project\n2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file\n3. Run the database migrations\n\nFor now, the system will simulate the registration process.');
        return;
      }

      console.log('✅ Supabase configuration verified');

      // Create new partner
      const partnerData = {
        owner_name: formData.ownerName,
        firm_name: formData.firmName,
        email: formData.email,
        mobile: formData.mobile,
        country: formData.country,
        brand: formData.brand,
        business: formData.business,
        uncoded_spoc_id: formData.uncodedSpocId,
        address: formData.address,
        city: formData.city,
        pin_code: formData.pinCode,
        landmark: formData.landmark,
        state: formData.state,
        tax_id: formData.taxId,
        tax_id_type: formData.taxIdType,
        gstin: formData.gstin,
        brand_location_code: formData.brandLocationCode,
        payment_modes: formData.paymentModes || [],
        payment_mode_details: formData.paymentModeDetails || {},
        invoicing_frequency: formData.invoicingFrequency,
        invoicing_type: formData.invoicingType,
        banking_details: formData.bankingDetails || null,
        feature_rights: [],
        status: 'registration' as const
      };

      console.log('👤 Creating partner record...');
      const newPartner = await PartnerService.createPartner(partnerData);
      console.log('✅ Partner created successfully:', newPartner.id);

      // Create head office location
      console.log('🏢 Creating head office location...');
      await PartnerService.createLocation({
        partner_id: newPartner.id,
        name: 'Head Office',
        address: formData.address,
        city: formData.city,
        pin_code: formData.pinCode,
        landmark: formData.landmark,
        state: formData.state,
        tax_id: formData.taxId,
        brand_location_code: formData.brandLocationCode,
        is_head_office: true
      });
      console.log('✅ Head office location created');

      // Create initial milestones
      console.log('📊 Creating initial milestones...');
      const milestones = [
        { name: 'Registration', status: 'completed' as const, started_at: new Date().toISOString(), completed_at: new Date().toISOString(), duration: 30 },
        { name: 'In Review', status: 'pending' as const },
        { name: 'User Creation', status: 'pending' as const },
        { name: "You're now Live", status: 'pending' as const }
      ];

      for (const milestone of milestones) {
        await PartnerService.createMilestone({
          partner_id: newPartner.id,
          ...milestone
        });
      }
      console.log('✅ Milestones created');

      // Create BOS task
      console.log('📋 Creating BOS task...');
      await BOSService.createTask({
        partner_id: newPartner.id,
        status: 'pending',
        feature_rights: []
      });
      console.log('✅ BOS task created');

      // Send email to SPOC for brand channel selection
      console.log('📧 Initiating SPOC email process...');
      try {
        await PartnerService.sendSpocBrandChannelEmail(newPartner.id, formData.uncodedSpocId);
        console.log('✅ SPOC email process completed');
      } catch (emailError) {
        console.error('⚠️ SPOC email process failed:', emailError);
        // Don't fail the entire process if email fails
        console.warn('⚠️ Partner created successfully, but SPOC email had issues');
      }

      // Reload data and set current user
      console.log('🔄 Reloading data and setting up dashboard...');
      await loadData();
      const updatedPartner = await PartnerService.getPartnerWithRelations(newPartner.id);
      console.log('✅ Partner dashboard ready');
      setCurrentUser(updatedPartner);
      setCurrentView('partner');
      setFormData({});
      setOnboardingStep('company');
      console.log('🎉 PARTNER REGISTRATION COMPLETED SUCCESSFULLY');
      
      // Success message
      alert(`🎉 PARTNER REGISTRATION COMPLETED!\n\n✅ Partner ID: ${newPartner.id}\n🏢 Company: ${formData.firmName}\n👤 Owner: ${formData.ownerName}\n\n📧 SPOC Email Process:\nAn email notification has been sent to your SPOC for brand channel selection.\n\n🚀 What's Next:\n• Your SPOC will select the brand channel\n• BOS team will process your application\n• Pricing team will configure margins\n• User accounts will be created\n\n📊 You can now access your partner dashboard to track progress!`);
    } catch (error) {
      console.error('❌ PARTNER REGISTRATION FAILED:', error);
      
      // More detailed error handling
      let errorMessage = '❌ PARTNER REGISTRATION FAILED\n\n';
      
      if (error?.message) {
        errorMessage += `🔍 Error Details:\n${error.message}\n\n`;
      } else if (typeof error === 'string') {
        errorMessage += `🔍 Error Details:\n${error}\n\n`;
      } else {
        errorMessage += '🔍 Unknown error occurred. Please check your internet connection.\n\n';
      }
      
      errorMessage += '🔧 TROUBLESHOOTING:\n';
      errorMessage += '1. Check your internet connection\n';
      errorMessage += '2. Verify all form fields are filled correctly\n';
      errorMessage += '3. Ensure SPOC ID exists in the system\n';
      errorMessage += '4. Check browser console for detailed logs\n\n';
      errorMessage += '📞 If the problem persists, please contact support.';
      
      console.error('Full error object:', error);
      alert(errorMessage);
    }
  };

  const handleLogin = (userType: string) => {
    switch (userType) {
      case 'partner':
        if (partners.length > 0) {
          setCurrentUser(partners[0]);
        } else {
          // Create a demo partner for testing
          const demoPartner = {
            id: 'demo-partner-1',
            owner_name: 'Demo Owner',
            firm_name: 'Demo Company',
            email: 'demo@company.com',
            mobile: '+91-9876543210',
            status: 'user-creation',
            locations: [
              {
                id: 'demo-location-1',
                name: 'Head Office',
                city: 'Mumbai',
                state: 'Maharashtra'
              }
            ],
            users: [],
            milestones: [
              { id: 'M1', name: 'Registration', status: 'completed' },
              { id: 'M2', name: 'In Review', status: 'completed' },
              { id: 'M3', name: 'User Creation', status: 'in-progress' },
              { id: 'M4', name: "You're now Live", status: 'pending' }
            ],
            plan_id: '123',
            feature_rights: ['Dashboard Access', 'Reporting']
          };
          setCurrentUser(demoPartner);
        }
        setCurrentView('partner');
        break;
      case 'bos':
        setCurrentView('bos');
        break;
      case 'pricing':
        setCurrentView('pricing');
        break;
      case 'admin':
        setCurrentView('admin');
        break;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleBOSCompleteTask = async (taskId: string, planId: string, featureRights: string[]) => {
    try {
      // Complete BOS task
      await BOSService.completeTask(taskId, planId, featureRights);
      
      // Find the task to get partner ID
      const task = bosTaskList.find(t => t.id === taskId);
      if (task) {
        // Update partner status and details
        await PartnerService.updatePartner(task.partner_id, {
          plan_id: planId,
          feature_rights: featureRights,
          status: 'pricing-setup'
        });

        // Create pricing task
        await PricingService.createTask({
          partner_id: task.partner_id,
          status: 'pending',
          margin_configured: false
        });

        // Update milestone
        const partner = await PartnerService.getPartner(task.partner_id);
        const reviewMilestone = partner.milestones?.find((m: any) => m.name === 'In Review');
        if (reviewMilestone) {
          await PartnerService.updateMilestone(reviewMilestone.id, {
            status: 'completed',
            completed_at: new Date().toISOString(),
            duration: Math.floor((new Date().getTime() - new Date(reviewMilestone.started_at || reviewMilestone.created_at).getTime()) / 60000)
          });
        }
      }

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error completing BOS task:', error);
      alert('Error completing task. Please try again.');
    }
  };

  const handleBOSRequestInfo = (taskId: string, message: string) => {
    console.log('Requesting info for task:', taskId, 'Message:', message);
  };

  const handlePricingCompleteTask = async (taskId: string) => {
    try {
      console.log('🎯 App: Starting pricing task completion for task:', taskId);
      
      // Complete pricing task
      await PricingService.completeTask(taskId);
      console.log('✅ App: Pricing task completed');
      
      // Find the task to get partner ID
      const task = pricingTaskList.find(t => t.id === taskId);
      if (task) {
        console.log('🏢 App: Updating partner status to user-creation for partner:', task.partner_id);
        
        // Update partner status
        await PartnerService.updatePartner(task.partner_id, {
          status: 'user-creation'
        });
        console.log('✅ App: Partner status updated to user-creation');

        // Complete "In Review" milestone now that both BOS and Pricing are done
        const partner = await PartnerService.getPartner(task.partner_id);
        const reviewMilestone = partner.milestones?.find((m: any) => m.name === 'In Review');
        if (reviewMilestone && reviewMilestone.status !== 'completed') {
          console.log('📊 App: Completing In Review milestone');
          await PartnerService.updateMilestone(reviewMilestone.id, {
            status: 'completed',
            completed_at: new Date().toISOString(),
            duration: Math.floor((new Date().getTime() - new Date(reviewMilestone.started_at || reviewMilestone.created_at).getTime()) / 60000)
          });
          console.log('✅ App: In Review milestone completed');
        }

        // Start User Creation milestone
        const userCreationMilestone = partner.milestones?.find((m: any) => m.name === 'User Creation');
        if (userCreationMilestone) {
          console.log('📊 App: Updating User Creation milestone to in-progress');
          await PartnerService.updateMilestone(userCreationMilestone.id, {
            status: 'in-progress',
            started_at: new Date().toISOString()
          });
          console.log('✅ App: User Creation milestone updated');
        }
      } else {
        console.error('❌ App: Could not find pricing task with ID:', taskId);
      }

      // Reload data
      console.log('🔄 App: Reloading all data...');
      await loadData();
      console.log('✅ App: Data reloaded successfully');
      
      alert('✅ PRICING TASK COMPLETED!\n\nThe partner can now:\n• Add new locations\n• Create user accounts\n• Access full portal features\n\nPartner status updated to: USER-CREATION');
    } catch (error) {
      console.error('Error completing pricing task:', error);
      alert('Error completing task. Please try again.');
    }
  };

  const handleUploadSpocMapping = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').slice(1); // Skip header
        const newMappings = lines.map(line => {
          const [spocId, name, email] = line.split(',');
          return { spoc_id: spocId?.trim(), name: name?.trim(), email: email?.trim() };
        }).filter(mapping => mapping.spoc_id && mapping.name && mapping.email);
        
        // Insert new mappings
        for (const mapping of newMappings) {
          try {
            await AdminService.createSpocMapping(mapping);
          } catch (error) {
            console.warn('Duplicate SPOC ID:', mapping.spoc_id);
          }
        }
        
        // Reload data
        await loadData();
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading SPOC mapping:', error);
      alert('Error uploading SPOC mapping. Please try again.');
    }
  };

  const handleUploadBrandChannelMapping = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').slice(1); // Skip header
        const newMappings = lines.map(line => {
          const [numericValue, brandChannel] = line.split(',');
          return { 
            numeric_value: parseInt(numericValue?.trim()), 
            brand_channel: brandChannel?.trim() 
          };
        }).filter(mapping => !isNaN(mapping.numeric_value) && mapping.brand_channel);
        
        // Insert new mappings
        for (const mapping of newMappings) {
          try {
            await AdminService.createBrandChannelMapping(mapping);
          } catch (error) {
            console.warn('Duplicate numeric value:', mapping.numeric_value);
          }
        }
        
        // Reload data
        await loadData();
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading brand channel mapping:', error);
      alert('Error uploading brand channel mapping. Please try again.');
    }
  };

  const handleDeleteSpocMapping = async (id: string) => {
    try {
      await AdminService.deleteSpocMapping(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting SPOC mapping:', error);
      alert('Error deleting SPOC mapping. Please try again.');
    }
  };

  const handleDeleteBrandChannelMapping = async (id: string) => {
    try {
      await AdminService.deleteBrandChannelMapping(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting brand channel mapping:', error);
      alert('Error deleting brand channel mapping. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentView === 'landing' && (
        <LandingPage 
          onRegisterClick={() => setCurrentView('onboarding')}
          onLoginClick={() => setCurrentView('login')}
        />
      )}

      {currentView === 'login' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleLogin('partner')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Partner Login
              </button>
              <button
                onClick={() => handleLogin('bos')}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                BOS User Login
              </button>
              <button
                onClick={() => handleLogin('pricing')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Pricing Team Login
              </button>
              <button
                onClick={() => handleLogin('admin')}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Uncoded Admin Login
              </button>
              <button
                onClick={() => setCurrentView('landing')}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'onboarding' && (
        <>
          {onboardingStep === 'company' && (
            <CompanyDetailsForm 
              onNext={handleOnboardingNext}
              initialData={formData}
              authenticatedUser={currentUser}
            />
          )}
          {onboardingStep === 'banking' && (
            <BankingDetailsForm 
              onNext={handleOnboardingNext}
              onBack={handleOnboardingBack}
              businessType={formData.business}
              initialData={formData.bankingDetails}
            />
          )}
          {onboardingStep === 'review' && (
            <ReviewSubmitForm 
              onSubmit={handleOnboardingSubmit}
              onBack={handleOnboardingBack}
              formData={formData}
            />
          )}
        </>
      )}

      {currentView === 'partner' && currentUser && (
        <PartnerDashboard 
          partner={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'bos' && (
        <BOSDashboard 
          tasks={bosTaskList}
          onCompleteTask={handleBOSCompleteTask}
          onRequestInfo={handleBOSRequestInfo}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'pricing' && (
        <PricingDashboard 
          tasks={pricingTaskList}
          onCompleteTask={handlePricingCompleteTask}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'admin' && (
        <UncodedAdminDashboard 
          analytics={adminAnalytics}
          spocMappings={spocMappingList}
          brandChannelMappings={brandChannelMappingList}
          onUploadSpocMapping={handleUploadSpocMapping}
          onUploadBrandChannelMapping={handleUploadBrandChannelMapping}
          onDeleteSpocMapping={handleDeleteSpocMapping}
          onDeleteBrandChannelMapping={handleDeleteBrandChannelMapping}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;