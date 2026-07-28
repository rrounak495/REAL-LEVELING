import React from 'react';
import { StyleSheet, ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LegalHeader } from '@/components/legal/LegalHeader';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function ContactScreen() {
  const handleCall = () => {
    Linking.openURL('tel:9309775855');
  };

  const handleEmail1 = () => {
    Linking.openURL('mailto:rrounak495@gmail.com');
  };

  const handleEmail2 = () => {
    Linking.openURL('mailto:reallevling@gmail.com');
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <LegalHeader title="CONTACT US" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.introSection}>
            <Text style={styles.introText}>
              Have questions, feedback, or need support with your hunter progression? Reach out to
              the system administrators.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <Pressable style={styles.contactCard} onPress={handleCall}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📱</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Phone</Text>
                <Text style={styles.cardValue}>9309775855</Text>
              </View>
              <Text style={styles.actionText}>Tap to Call</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <Pressable style={styles.contactCard} onPress={handleEmail1}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(0, 180, 255, 0.1)' }]}>
                <Text style={styles.icon}>✉️</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Email</Text>
                <Text style={styles.cardValue}>rrounak495@gmail.com</Text>
              </View>
              <Text style={styles.actionText}>Tap to Email</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(400)}>
            <Pressable style={styles.contactCard} onPress={handleEmail2}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 106, 193, 0.1)' }]}>
                <Text style={styles.icon}>💼</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Business Email</Text>
                <Text style={styles.cardValue}>reallevling@gmail.com</Text>
              </View>
              <Text style={styles.actionText}>Tap to Email</Text>
            </Pressable>
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
    paddingTop: 32,
    paddingBottom: 60,
  },
  introSection: {
    marginBottom: 40,
  },
  introText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.surface,
    borderRadius: radius.xl,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 60, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 4,
  },
  cardValue: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 16,
    color: colors.text.primary,
  },
  actionText: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.purple[400],
    letterSpacing: 0.5,
  },
});
