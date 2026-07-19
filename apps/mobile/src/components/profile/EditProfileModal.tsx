import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { colors, fontFamily, radius, spacing } from '@theme';

export interface ProfileData {
  name: string;
  bio: string;
  height: string;
  currentWeight: string;
  targetWeight: string;
  age: string;
  goal: string;
}

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData: ProfileData;
}

export function EditProfileModal({ visible, onClose, onSave, initialData }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    bio: initialData.bio || '',
    height: initialData.height || '',
    currentWeight: initialData.currentWeight || '',
    targetWeight: initialData.targetWeight || '',
    age: initialData.age || '',
    goal: initialData.goal || '',
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View
        entering={SlideInDown.springify()}
        exiting={SlideOutDown}
        style={styles.modalContainer}
      >
        <GlassCard style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>EDIT PROFILE</Text>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Hunter Name"
              placeholderTextColor={colors.text.muted}
              style={styles.textInput}
              value={formData.name}
              onChangeText={(t) => setFormData({ ...formData, name: t })}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              multiline
              placeholder="Your hunter creed..."
              placeholderTextColor={colors.text.muted}
              style={[styles.textInput, { minHeight: 80, textAlignVertical: 'top' }]}
              value={formData.bio}
              onChangeText={(t) => setFormData({ ...formData, bio: t })}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="175"
                  placeholderTextColor={colors.text.muted}
                  style={styles.textInput}
                  value={formData.height}
                  onChangeText={(t) => setFormData({ ...formData, height: t })}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="24"
                  placeholderTextColor={colors.text.muted}
                  style={styles.textInput}
                  value={formData.age}
                  onChangeText={(t) => setFormData({ ...formData, age: t })}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Current Weight (kg)</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="70"
                  placeholderTextColor={colors.text.muted}
                  style={styles.textInput}
                  value={formData.currentWeight}
                  onChangeText={(t) => setFormData({ ...formData, currentWeight: t })}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Target Weight (kg)</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="75"
                  placeholderTextColor={colors.text.muted}
                  style={styles.textInput}
                  value={formData.targetWeight}
                  onChangeText={(t) => setFormData({ ...formData, targetWeight: t })}
                />
              </View>
            </View>

            <Text style={styles.label}>Primary Goal</Text>
            <TextInput
              placeholder="e.g. Muscle Gain, Weight Loss"
              placeholderTextColor={colors.text.muted}
              style={styles.textInput}
              value={formData.goal}
              onChangeText={(t) => setFormData({ ...formData, goal: t })}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button size="lg" onPress={handleSave}>
              Save Changes
            </Button>
          </View>
        </GlassCard>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 9, 14, 0.95)',
  },
  backdropPressable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
  },
  card: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.screenHorizontal,
    backgroundColor: colors.bg.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.componentMd,
  },
  title: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 22,
    color: colors.text.primary,
    letterSpacing: 1.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontFamily: fontFamily.inter.bold,
  },
  content: {
    maxHeight: 500,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
    padding: 14,
    color: colors.text.primary,
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    marginBottom: 16,
  },
  footer: {
    marginTop: 16,
  },
});
