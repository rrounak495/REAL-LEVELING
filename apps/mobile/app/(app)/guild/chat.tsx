import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, fontFamily, spacing, radius } from '@theme';

export default function GuildChatScreen() {
  const router = useRouter();

  // Foundation for real-time hooks (Supabase channels)
  const messages = [
    {
      id: '1',
      user: 'SungJin',
      role: 'Leader',
      text: 'Focus the new Boss!',
      time: '10:02 AM',
      type: 'announcement',
    },
    {
      id: '2',
      user: 'IronFist',
      role: 'Officer',
      text: 'I just dealt 100k damage.',
      time: '10:15 AM',
      type: 'chat',
    },
    {
      id: '3',
      user: 'You',
      role: 'Member',
      text: 'Logging in now.',
      time: '10:17 AM',
      type: 'chat',
    },
  ];

  return (
    <ScreenContainer>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← GUILD</Text>
        </Pressable>
        <Text style={styles.headerTitle}>GUILD COMMS</Text>
      </View>

      <View style={styles.chatChannels}>
        <Pressable style={styles.channelActive}>
          <Text style={styles.channelTextActive}>GENERAL</Text>
        </Pressable>
        <Pressable style={styles.channelInactive}>
          <Text style={styles.channelTextInactive}>BOSS</Text>
        </Pressable>
        <Pressable style={styles.channelInactive}>
          <Text style={styles.channelTextInactive}>ANNOUNCEMENTS</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {messages.map((msg, idx) => (
          <Animated.View
            key={msg.id}
            entering={FadeInDown.delay(idx * 100).duration(400)}
            style={styles.messageRow}
          >
            {msg.type === 'announcement' ? (
              <GlassCard
                padding={12}
                style={{
                  borderColor: colors.semantic.dangerNeon,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <Text style={styles.announceBadge}>SYSTEM ANNOUNCEMENT</Text>
                <Text style={styles.msgText}>{msg.text}</Text>
              </GlassCard>
            ) : (
              <View
                style={[
                  styles.msgBubble,
                  msg.user === 'You' ? styles.msgBubbleSelf : styles.msgBubbleOther,
                ]}
              >
                {msg.user !== 'You' && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={styles.msgUser}>{msg.user}</Text>
                    <Text style={styles.msgRole}>{msg.role}</Text>
                  </View>
                )}
                <Text style={styles.msgText}>{msg.text}</Text>
                <Text style={styles.msgTime}>{msg.time}</Text>
              </View>
            )}
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Transmit message..."
          placeholderTextColor={colors.text.muted}
          style={styles.input}
        />
        <Pressable style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>SEND</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.void,
    zIndex: 10,
  },
  backButton: { padding: 8, marginLeft: -8, marginRight: 16 },
  backButtonText: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 2,
  },
  headerTitle: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 24,
    color: colors.text.primary,
    letterSpacing: 2,
  },

  chatChannels: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 16,
  },
  channelActive: { borderBottomWidth: 2, borderBottomColor: colors.purple.neon, paddingBottom: 4 },
  channelTextActive: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 12,
    color: colors.purple.neon,
    letterSpacing: 1,
  },
  channelInactive: { paddingBottom: 4 },
  channelTextInactive: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 24,
    paddingBottom: 120,
  },
  messageRow: { marginBottom: 16 },

  announceBadge: {
    fontFamily: fontFamily.mono.semiBold,
    fontSize: 10,
    color: colors.semantic.dangerNeon,
    marginBottom: 8,
    letterSpacing: 1,
  },

  msgBubble: { padding: 12, borderRadius: radius.md, maxWidth: '85%' },
  msgBubbleOther: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  msgBubbleSelf: {
    backgroundColor: 'rgba(139, 60, 247, 0.2)',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: colors.purple[500],
  },

  msgUser: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12,
    color: colors.text.primary,
    marginRight: 8,
  },
  msgRole: { fontFamily: fontFamily.mono.regular, fontSize: 9, color: colors.text.muted },
  msgText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  msgTime: {
    fontFamily: fontFamily.mono.regular,
    fontSize: 9,
    color: colors.text.muted,
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: 16,
    backgroundColor: 'rgba(10, 8, 16, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    color: colors.text.primary,
    fontFamily: fontFamily.inter.regular,
  },
  sendBtn: {
    marginLeft: 12,
    backgroundColor: colors.purple[600],
    paddingHorizontal: 16,
    height: 44,
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  sendBtnText: {
    fontFamily: fontFamily.exo2.bold,
    fontSize: 12,
    color: colors.text.primary,
    letterSpacing: 1,
  },
});
