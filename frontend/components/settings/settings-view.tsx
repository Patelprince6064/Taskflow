"use client";

/**
 * Settings page: Profile, Account, Notification and Appearance sections
 * (all UI placeholders) plus a System section with the backend health check
 * and demo-data reset.
 */

import AppearanceSection from "@/components/settings/appearance-section";
import NotificationSection from "@/components/settings/notification-section";
import ProfileSection from "@/components/settings/profile-section";
import AccountSection from "@/components/settings/account-section";
import SystemSection from "@/components/settings/system-section";

export default function SettingsView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-2xl text-sm text-muted">
        These settings are interface previews in Phase 2. They are not tied to
        an account and are not saved anywhere yet.
      </p>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProfileSection />
        <AccountSection />
        <NotificationSection />
        <AppearanceSection />
      </div>

      <SystemSection />
    </div>
  );
}
