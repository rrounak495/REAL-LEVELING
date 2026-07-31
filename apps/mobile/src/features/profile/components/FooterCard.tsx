import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { colors, fontFamily } from '@theme';

export function FooterCard() {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Image 
            source={require('../../../../assets/images/footer_logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.appName}>REAL LEVELING</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.statusText} numberOfLines={1} adjustsFontSizeToFit>
          You are up to date
        </Text>
        <CheckCircle2 size={16} color="#22C55E" style={{ flexShrink: 0 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
    padding: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconContainer: {
    marginRight: 12,
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    justifyContent: 'center',
    flexShrink: 1,
  },
  appName: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  version: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: '#9CA3AF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    maxWidth: '40%',
    justifyContent: 'flex-end',
  },
  statusText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 12,
    color: '#22C55E',
    marginRight: 6,
    flexShrink: 1,
  },
});

