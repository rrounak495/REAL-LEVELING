import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { colors, fontFamily, radius, spacing } from '@theme';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (post: { imageUri: string | null; caption: string; tag: string }) => void;
}

const TAGS = ['Workout Complete', 'Level Up', 'Boss Defeated', 'Achievement Unlocked'];

export function CreatePostModal({ visible, onClose, onSubmit }: CreatePostModalProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState(TAGS[0]!);

  const pickImage = async (useCamera: boolean) => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0]?.uri ?? null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleSubmit = () => {
    onSubmit({ imageUri, caption, tag: selectedTag });
    // Reset state after submit
    setImageUri(null);
    setCaption('');
    setSelectedTag(TAGS[0]!);
    onClose();
  };

  const handleClose = () => {
    setImageUri(null);
    setCaption('');
    setSelectedTag(TAGS[0]!);
    onClose();
  };

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={handleClose}>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
        <Pressable style={styles.backdropPressable} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        entering={SlideInDown.springify()}
        exiting={SlideOutDown}
        style={styles.modalContainer}
      >
        <GlassCard style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>UPLOAD LEVELING</Text>
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            {/* Image Selection */}
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <Pressable style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
                  <Text style={styles.removeImageText}>✕ Remove</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.imagePickerRow}>
                <Pressable style={styles.pickerBtn} onPress={() => pickImage(false)}>
                  <Text style={styles.pickerEmoji}>🖼️</Text>
                  <Text style={styles.pickerText}>Gallery</Text>
                </Pressable>
                <Pressable style={styles.pickerBtn} onPress={() => pickImage(true)}>
                  <Text style={styles.pickerEmoji}>📷</Text>
                  <Text style={styles.pickerText}>Camera</Text>
                </Pressable>
              </View>
            )}

            {/* Caption */}
            <Text style={styles.label}>Caption</Text>
            <TextInput
              multiline
              maxLength={280}
              placeholder="What did you conquer today?"
              placeholderTextColor={colors.text.muted}
              style={styles.textInput}
              value={caption}
              onChangeText={setCaption}
            />

            {/* Tags */}
            <Text style={styles.label}>Tag</Text>
            <View style={styles.tagsContainer}>
              {TAGS.map((tag) => (
                <Pressable
                  key={tag}
                  style={[styles.tagPill, selectedTag === tag && styles.tagPillActive]}
                  onPress={() => setSelectedTag(tag)}
                >
                  <Text style={[styles.tagText, selectedTag === tag && styles.tagTextActive]}>
                    {tag}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button disabled={!imageUri && caption.length === 0} size="lg" onPress={handleSubmit}>
              Post to Feed
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
  imagePickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  pickerBtn: {
    flex: 1,
    backgroundColor: 'rgba(139, 60, 247, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 60, 247, 0.3)',
    borderRadius: radius.lg,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  pickerText: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 14,
    color: colors.purple[300],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  removeImageText: {
    color: colors.semantic.danger,
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
  },
  label: {
    fontFamily: fontFamily.exo2.semiBold,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
    padding: 16,
    color: colors.text.primary,
    fontFamily: fontFamily.inter.regular,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  tagPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagPillActive: {
    backgroundColor: 'rgba(139, 60, 247, 0.2)',
    borderColor: colors.purple[500],
  },
  input: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 16,
    color: colors.text.secondary,
  },
  tagText: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  tagTextActive: {
    color: colors.purple[300],
  },
  footer: {
    marginTop: 16,
  },
});
