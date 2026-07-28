import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LegalHeader } from '@/components/legal/LegalHeader';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function TermsAndConditionsScreen() {
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <LegalHeader title="TERMS & CONDITIONS" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            style={styles.noticeContainer}
          >
            <Text style={styles.noticeIcon}>⏳</Text>
            <Text style={styles.noticeTitle}>DOCUMENT PENDING</Text>
            <Text style={styles.noticeText}>
              Official Terms & Conditions will be added before production release.
            </Text>
          </Animated.View>

          {/* Placeholder Architecture for future content */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.card}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <View style={styles.placeholderLines}>
              <View style={[styles.placeholderLine, { width: '100%' }]} />
              <View style={[styles.placeholderLine, { width: '85%' }]} />
              <View style={[styles.placeholderLine, { width: '90%' }]} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.card}>
            <Text style={styles.sectionTitle}>2. User Accounts</Text>
            <View style={styles.placeholderLines}>
              <View style={[styles.placeholderLine, { width: '95%' }]} />
              <View style={[styles.placeholderLine, { width: '80%' }]} />
              <View style={[styles.placeholderLine, { width: '92%' }]} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.card}>
            <Text style={styles.sectionTitle}>3. User Conduct</Text>
            <View style={styles.placeholderLines}>
              <View style={[styles.placeholderLine, { width: '100%' }]} />
              <View style={[styles.placeholderLine, { width: '88%' }]} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.card}>
            <Text style={styles.sectionTitle}>4. Disclaimer of Warranties</Text>
            <View style={styles.placeholderLines}>
              <View style={[styles.placeholderLine, { width: '92%' }]} />
              <View style={[styles.placeholderLine, { width: '85%' }]} />
              <View style={[styles.placeholderLine, { width: '97%' }]} />
            </View>
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
  noticeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    borderStyle: 'dashed',
    marginBottom: 32,
  },
  noticeIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  noticeTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 22,
    color: '#FFD700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  noticeText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
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
    marginBottom: 16,
  },
  placeholderLines: {
    gap: 12,
  },
  placeholderLine: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
});
