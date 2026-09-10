import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Sparkles,
  Settings as SettingsIcon,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProfileStepper from '../components/profile/ProfileStepper';
import BasicInfoStep from '../components/profile/BasicInfoStep';
import InterestsStep from '../components/profile/InterestsStep';
import LanguagesStep from '../components/profile/LanguagesStep';
import ProfileReviewStep from '../components/profile/ProfileReviewStep';
import EditProfileForm from '../components/profile/EditProfileForm';
import SettingsPanel from '../components/profile/SettingsPanel';

export function Profile({ initialTab = 'overview' }) {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab); // 'overview' | 'wizard' | 'settings'
  const [currentStep, setCurrentStep] = useState(1);

  // Local draft state for wizard setup
  const [draftProfile, setDraftProfile] = useState({
    name: user?.name || 'Ruthvik Reddy',
    country: user?.country || 'India',
    countryCode: user?.countryCode || 'IN',
    flag: user?.flag || '🇮🇳',
    age: user?.age || 19,
    educationLevel: user?.educationLevel || 'College / University',
    institution: user?.institution || 'Delhi Technological University',
    timezone: user?.timezone || 'Asia/Kolkata (IST +5:30)',
    bio: user?.bio || 'I love technology, sports and learning about different cultures and making friends across borders!',
    avatar: user?.avatar || '🧑‍💻',
    interests: user?.interests || ['Technology', 'Science', 'Sports', 'Culture'],
    languages: user?.languages || ['English', 'Hindi'],
  });

  const steps = [
    { id: 'basic', title: '1. Basic Info' },
    { id: 'interests', title: '2. Interests' },
    { id: 'languages', title: '3. Languages' },
    { id: 'review', title: '4. Review' },
  ];

  const handleUpdateDraft = (fieldUpdates) => {
    setDraftProfile((prev) => ({ ...prev, ...fieldUpdates }));
  };

  const handleCompleteWizard = async () => {
    const res = await updateProfile({
      ...draftProfile,
      completionPercentage: 100,
      isProfileComplete: true,
    });
    if (res?.success) {
      setActiveTab('overview');
      navigate('/dashboard');
    }
  };

  const completion = user?.completionPercentage || 80;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content-wrapper">
        <Navbar />

        <main className="page-container">
          {/* Header Banner with Profile Completion */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {activeTab === 'wizard' ? 'Complete Your Profile' : 'Student Profile & Settings'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                  Your Profile. Your Interests. Your Global Community.
                </p>
              </div>

              {/* Tab navigation pills */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#ffffff',
                  padding: '4px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'overview' ? 'var(--primary)' : 'transparent',
                    color: activeTab === 'overview' ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <User size={15} />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('wizard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'wizard' ? 'var(--primary)' : 'transparent',
                    color: activeTab === 'wizard' ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Layers size={15} />
                  <span>Setup Wizard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    backgroundColor: activeTab === 'settings' ? 'var(--primary)' : 'transparent',
                    color: activeTab === 'settings' ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <SettingsIcon size={15} />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Profile Completion Progress Bar Card */}
            {activeTab !== 'settings' && (
              <Card
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
                  border: '1.5px solid var(--primary-subtle)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={18} color="var(--primary)" />
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        Profile Completion: {completion}%
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {completion === 100 ? 'All Set!' : 'Almost there!'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: 8,
                      width: '100%',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${completion}%`,
                        background: 'linear-gradient(90deg, #2563eb, #10b981)',
                        borderRadius: 4,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {activeTab !== 'wizard' && completion < 100 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('wizard')}
                    iconRight={ArrowRight}
                  >
                    Launch Step Wizard
                  </Button>
                )}
              </Card>
            )}
          </div>

          {/* Tab 1: Edit Profile (In-place) */}
          {activeTab === 'overview' && (
            <EditProfileForm
              profile={user}
              onSave={async (updated) => updateProfile(updated)}
              loading={loading}
            />
          )}

          {/* Tab 2: Profile Setup Wizard (4-steps from 2.1 & 2.2) */}
          {activeTab === 'wizard' && (
            <div>
              <ProfileStepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={(step) => setCurrentStep(step)}
              />

              <Card style={{ padding: '2.5rem 2rem' }}>
                {currentStep === 1 && (
                  <BasicInfoStep
                    data={draftProfile}
                    onChange={handleUpdateDraft}
                    onNext={() => setCurrentStep(2)}
                  />
                )}

                {currentStep === 2 && (
                  <InterestsStep
                    selectedInterests={draftProfile.interests}
                    onChange={(newInterests) => handleUpdateDraft({ interests: newInterests })}
                    onBack={() => setCurrentStep(1)}
                    onNext={() => setCurrentStep(3)}
                  />
                )}

                {currentStep === 3 && (
                  <LanguagesStep
                    languages={draftProfile.languages}
                    onChange={(newLanguages) => handleUpdateDraft({ languages: newLanguages })}
                    onBack={() => setCurrentStep(2)}
                    onNext={() => setCurrentStep(4)}
                  />
                )}

                {currentStep === 4 && (
                  <ProfileReviewStep
                    profileData={draftProfile}
                    onBack={() => setCurrentStep(3)}
                    onComplete={handleCompleteWizard}
                    loading={loading}
                  />
                )}
              </Card>
            </div>
          )}

          {/* Tab 3: Settings Panel (from 2.5) */}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

export default Profile;
