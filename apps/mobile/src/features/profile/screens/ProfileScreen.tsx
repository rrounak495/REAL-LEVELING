import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { 
  TrendingUp, 
  Award,
  Backpack, 
  Bell, 
  Paintbrush, 
  Globe, 
  Headset, 
  ShieldCheck, 
  FileText 
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useBottomTabBarPadding } from '@/components/navigation/FloatingTabBar';
import { ProfileHeader } from '../components/ProfileHeader';
import { HeroCard } from '../components/HeroCard';
import { MenuCard } from '../components/MenuCard';
import { MenuItem } from '../components/MenuItem';
import { FooterCard } from '../components/FooterCard';
import { LogoutButton } from '../components/LogoutButton';
import { colors } from '@theme';

export function ProfileScreen() {
  const bottomPadding = useBottomTabBarPadding();
  console.log('[ProfileScreen] Runtime bottom padding:', bottomPadding);

  return (
    <ScreenContainer>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />
        <HeroCard />

        {/* Group 1: Progression */}
        <MenuCard>
          <MenuItem 
            icon={<TrendingUp size={20} color="#A855F7" />}
            iconBgColor="rgba(168, 85, 247, 0.1)"
            title="Your Progress"
            subtitle="Stats, Analytics & History"
          />
          <MenuItem 
            icon={<Award size={20} color="#A855F7" />}
            iconBgColor="rgba(168, 85, 247, 0.1)"
            title="Achievements"
            subtitle="Badges, Milestones & Rewards"
          />
          <MenuItem 
            icon={<Backpack size={20} color="#A855F7" />}
            iconBgColor="rgba(168, 85, 247, 0.1)"
            title="Inventory"
            subtitle="Equipment, Titles & Skins"
            showDivider={false}
          />
        </MenuCard>

        {/* Group 2: App Settings */}
        <MenuCard>
          <MenuItem 
            icon={<Bell size={20} color="#3B82F6" />}
            iconBgColor="rgba(59, 130, 246, 0.1)"
            title="Notifications"
            subtitle="Manage Alerts & Reminders"
          />
          <MenuItem 
            icon={<Paintbrush size={20} color="#3B82F6" />}
            iconBgColor="rgba(59, 130, 246, 0.1)"
            title="Appearance"
            subtitle="Theme, Dark Mode & Customization"
          />
          <MenuItem 
            icon={<Globe size={20} color="#3B82F6" />}
            iconBgColor="rgba(59, 130, 246, 0.1)"
            title="Language"
            subtitle="Change App Language"
            showDivider={false}
          />
        </MenuCard>

        {/* Group 3: Support & Legal */}
        <MenuCard>
          <MenuItem 
            icon={<Headset size={20} color="#22C55E" />}
            iconBgColor="rgba(34, 197, 94, 0.1)"
            title="Help & Support"
            subtitle="FAQs, Contact & Support"
          />
          <MenuItem 
            icon={<ShieldCheck size={20} color="#22C55E" />}
            iconBgColor="rgba(34, 197, 94, 0.1)"
            title="Privacy Policy"
            subtitle="How we protect your data"
          />
          <MenuItem 
            icon={<FileText size={20} color="#22C55E" />}
            iconBgColor="rgba(34, 197, 94, 0.1)"
            title="Terms & Conditions"
            subtitle="Rules and guidelines"
            showDivider={false}
          />
        </MenuCard>

        <FooterCard />
        <LogoutButton />

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.void,
  },
  scrollContent: {
    paddingTop: 12,
  }
});

