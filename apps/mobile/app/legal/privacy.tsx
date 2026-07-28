import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LegalHeader } from '@/components/legal/LegalHeader';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function PrivacyPolicyScreen() {
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <LegalHeader title="PRIVACY POLICY" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.dateSection}>
            <Text style={styles.dateText}>Effective Date: July 22, 2026</Text>
            <Text style={styles.dateText}>Last Updated: July 27, 2026</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.card}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.bodyText}>
              Welcome to REAL LEVELING. We are committed to protecting your personal information and
              your right to privacy. If you have any questions or concerns about our policy, or our
              practices with regards to your personal information, please contact us.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.card}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.bodyText}>
              We collect personal information that you voluntarily provide to us when you register
              on the app, express an interest in obtaining information about us or our products and
              Services, when you participate in activities on the app or otherwise when you contact
              us. The personal information that we collect depends on the context of your
              interactions with us and the app, the choices you make and the products and features
              you use.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.card}>
            <Text style={styles.sectionTitle}>How We Use Information</Text>
            <Text style={styles.bodyText}>
              We use personal information collected via our app for a variety of business purposes
              described below. We process your personal information for these purposes in reliance
              on our legitimate business interests, in order to enter into or perform a contract
              with you, with your consent, and/or for compliance with our legal obligations.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.card}>
            <Text style={styles.sectionTitle}>Data Storage & Security</Text>
            <Text style={styles.bodyText}>
              We have implemented appropriate technical and organizational security measures
              designed to protect the security of any personal information we process. However,
              despite our safeguards and efforts to secure your information, no electronic
              transmission over the Internet or information storage technology can be guaranteed to
              be 100% secure.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.card}>
            <Text style={styles.sectionTitle}>Cookies & Similar Technologies</Text>
            <Text style={styles.bodyText}>
              We may use cookies and similar tracking technologies (like web beacons and pixels) to
              access or store information. Specific information about how we use such technologies
              and how you can refuse certain cookies is set out in our Cookie Notice.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(450)} style={styles.card}>
            <Text style={styles.sectionTitle}>Third Party Services</Text>
            <Text style={styles.bodyText}>
              We may share your data with third-party vendors, service providers, contractors or
              agents who perform services for us or on our behalf and require access to such
              information to do that work.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.card}>
            <Text style={styles.sectionTitle}>User Rights</Text>
            <Text style={styles.bodyText}>
              In some regions (like the EEA, UK, and Canada), you have certain rights under
              applicable data protection laws. These may include the right (i) to request access and
              obtain a copy of your personal information, (ii) to request rectification or erasure;
              (iii) to restrict the processing of your personal information; and (iv) if applicable,
              to data portability.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(550)} style={styles.card}>
            <Text style={styles.sectionTitle}>Children's Privacy</Text>
            <Text style={styles.bodyText}>
              We do not knowingly solicit data from or market to children under 18 years of age. By
              using the app, you represent that you are at least 18 or that you are the parent or
              guardian of such a minor and consent to such minor dependent's use of the app.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.card}>
            <Text style={styles.sectionTitle}>Changes to this Policy</Text>
            <Text style={styles.bodyText}>
              We may update this privacy notice from time to time. The updated version will be
              indicated by an updated "Revised" date and the updated version will be effective as
              soon as it is accessible.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(650)} style={styles.card}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Text style={styles.bodyText}>
              If you have questions or comments about this notice, you may email us at
              reallevling@gmail.com or contact us via the{' '}
              <Text
                style={[
                  styles.bodyText,
                  { color: colors.purple[400], fontFamily: fontFamily.inter.semiBold },
                ]}
                onPress={() => router.push('/legal/contact')}
              >
                Contact
              </Text>{' '}
              section in the application.
            </Text>
          </Animated.View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.void,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 24,
    paddingBottom: 60,
  },
  dateSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 4,
  },
  card: {
    backgroundColor: colors.bg.surface,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 20,
    color: colors.purple[300],
    letterSpacing: 1,
    marginBottom: 12,
  },
  bodyText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 24,
  },
});
