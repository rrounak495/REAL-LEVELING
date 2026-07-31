import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Image } from 'react-native';
import { Pencil, Flame, Zap, Trophy, Diamond, BadgeCheck, ChevronRight } from 'lucide-react-native';
import { colors, fontFamily } from '@theme';

export function HeroCard() {
  return (
    <View style={styles.cardContainer}>
      <ImageBackground
        source={require('../../../../assets/images/hero_artwork.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          
          {/* Top Section: Avatar & Info */}
          <View style={styles.topRow}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Image 
                  source={require('../../../../assets/images/avatar.png')} 
                  style={styles.avatarImage} 
                  resizeMode="cover"
                />
              </View>
              <View style={styles.editButton}>
                <Pencil size={12} color="#FFFFFF" />
              </View>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.username}>Rounak Rathod</Text>
                <BadgeCheck size={20} color="#FFFFFF" fill="#A855F7" style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.levelText}>
                <Text style={{ color: '#9CA3AF' }}>Level </Text>
                <Text style={{ color: '#A855F7' }}>24 </Text>
                <Text style={{ color: '#9CA3AF' }}>Hunter</Text>
              </Text>

              {/* XP Progress Bar Row */}
              <View style={styles.xpRow}>
                <View style={styles.xpBarTrack}>
                  <View style={[styles.xpBarFill, { width: '70%' }]} />
                </View>
                <Text style={styles.xpText}>8,450 / 12,000 XP</Text>
              </View>
            </View>
          </View>

          {/* Rank Card */}
          <View style={styles.rankCard}>
            <View style={styles.rankLeft}>
              <Image 
                source={require('../../../../assets/images/rank_silver.png')} 
                style={{ width: 44, height: 44 }} 
                resizeMode="contain"
              />
              <View style={styles.rankTextContainer}>
                <Text style={styles.rankLabel}>Current Rank</Text>
                <Text style={styles.rankValue}>SILVER HUNTER</Text>
              </View>
            </View>
            <View style={styles.rankRight}>
              <Text style={styles.rankPercent}>Top 13%</Text>
              <ChevronRight size={16} color="#A855F7" />
            </View>
          </View>

          {/* Statistics Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Flame size={20} color="#F97316" style={styles.statIcon} />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>12</Text>
                <Text style={styles.statLabel} numberOfLines={1}>Day Streak</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Zap size={20} color="#EAB308" style={styles.statIcon} />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>2,450</Text>
                <Text style={styles.statLabel} numberOfLines={1}>Total XP</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Trophy size={20} color="#EAB308" style={styles.statIcon} />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>#138</Text>
                <Text style={styles.statLabel} numberOfLines={1}>Global Rank</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Diamond size={20} color="#3B82F6" style={styles.statIcon} />
              <View style={styles.statTextCol}>
                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>PREMIUM</Text>
                <Text style={styles.statLabel} numberOfLines={1}>Member</Text>
              </View>
            </View>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#130C1C',
    marginBottom: 16,
  },
  background: {
    width: '100%',
  },
  backgroundImage: {
    opacity: 0.4,
  },
  overlay: {
    padding: 16,
    backgroundColor: 'rgba(15, 10, 25, 0.5)',
  },
  
  // Top Row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
    flexShrink: 0,
  },
  avatarBorder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#9333EA',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  editButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#1F1533',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  levelText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 14,
    marginBottom: 12,
  },

  // XP Row
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xpBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#A855F7',
    borderRadius: 3,
  },
  xpText: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 10,
    color: '#9CA3AF',
  },

  // Rank Card
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rankTextContainer: {
    marginLeft: 12,
    flexShrink: 1,
  },
  rankLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  rankValue: {
    fontFamily: fontFamily.rajdhani.bold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  rankRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 8,
  },
  rankPercent: {
    fontFamily: fontFamily.inter.semiBold,
    fontSize: 13,
    color: '#A855F7',
    marginRight: 4,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statIcon: {
    marginRight: 6,
  },
  statTextCol: {
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  statValue: {
    fontFamily: fontFamily.inter.bold,
    fontSize: 12, // Reduced slightly to ensure it fits "PREMIUM"
    color: '#FFFFFF',
    marginBottom: 2,
    textAlign: 'left',
  },
  statLabel: {
    fontFamily: fontFamily.inter.regular,
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'left',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});


