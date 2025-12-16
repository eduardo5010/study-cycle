import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors, borderRadius } from '@studycycle/ui';
import { Button } from './ui/button';

const { width: screenWidth } = Dimensions.get('window');

interface User {
  id: string;
  name: string;
  email: string;
  isTeacher?: boolean;
  isAdmin?: boolean;
}

interface HeaderProps {
  user?: User | null;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
  currentStreak?: number;
  unreadNotifications?: number;
  onNavigate?: (screen: string) => void;
  currentScreen?: string;
}

export default function Header({
  user,
  onLogin,
  onRegister,
  onLogout,
  currentStreak = 0,
  unreadNotifications = 0,
  onNavigate,
  currentScreen,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const styles = StyleSheet.create({
    header: {
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
      shadowColor: colors.neutral[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 56,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logo: {
      width: 32,
      height: 32,
      backgroundColor: colors.primary[600],
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    logoIcon: {
      fontSize: 16,
      color: '#ffffff',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.neutral[900],
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warning[100],
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      gap: 4,
    },
    streakText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.warning[700],
    },
    notificationButton: {
      position: 'relative',
      padding: 8,
    },
    notificationBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 8,
      height: 8,
      backgroundColor: colors.error[500],
      borderRadius: 4,
    },
    menuButton: {
      padding: 8,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: Math.min(screenWidth * 0.8, 300),
      backgroundColor: '#ffffff',
      shadowColor: colors.neutral[900],
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.neutral[900],
    },
    modalBody: {
      flex: 1,
      padding: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: borderRadius.md,
      marginBottom: 4,
      gap: 12,
    },
    menuItemActive: {
      backgroundColor: colors.primary[50],
    },
    menuItemText: {
      fontSize: 16,
      color: colors.neutral[900],
    },
    menuItemTextActive: {
      color: colors.primary[600],
      fontWeight: '600',
    },
    menuIcon: {
      width: 20,
      height: 20,
      color: colors.neutral[600],
    },
    menuIconActive: {
      color: colors.primary[600],
    },
    userSection: {
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    userAvatar: {
      width: 40,
      height: 40,
      backgroundColor: colors.primary[100],
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.neutral[900],
    },
    userEmail: {
      fontSize: 12,
      color: colors.neutral[600],
    },
    authButtons: {
      gap: 12,
    },
  });

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '🏠', screen: 'home' },
    { id: 'subjects', label: 'Matérias', icon: '📚', screen: 'subjects' },
    { id: 'search', label: 'Buscar', icon: '🔍', screen: 'search' },
    { id: 'settings', label: 'Configurações', icon: '⚙️', screen: 'settings' },
  ];

  const handleNavigate = (screen: string) => {
    setIsMenuOpen(false);
    onNavigate?.(screen);
  };

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const isActive = currentScreen === item.screen;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.menuItem,
          isActive && styles.menuItemActive,
        ]}
        onPress={() => handleNavigate(item.screen)}
      >
        <Text style={{ fontSize: 20 }}>{item.icon}</Text>
        <Text
          style={[
            styles.menuItemText,
            isActive && styles.menuItemTextActive,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={() => handleNavigate('home')}
          >
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🎓</Text>
            </View>
            <Text style={styles.title}>StudyCycle</Text>
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            {user && currentStreak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={{ color: colors.warning[600] }}>🔥</Text>
                <Text style={styles.streakText}>{currentStreak}</Text>
              </View>
            )}

            {user && (
              <TouchableOpacity style={styles.notificationButton}>
                <Text style={{ fontSize: 20 }}>🔔</Text>
                {unreadNotifications > 0 && <View style={styles.notificationBadge} />}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setIsMenuOpen(true)}
            >
              <Text style={{ fontSize: 20 }}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Menu</Text>
              <TouchableOpacity
                onPress={() => setIsMenuOpen(false)}
                style={styles.menuButton}
              >
                <Text style={{ fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {user ? (
                <View style={styles.userSection}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary[700] }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.userSection}>
                  <View style={styles.authButtons}>
                    <Button onPress={() => { setIsMenuOpen(false); onLogin?.(); }}>
                      Entrar
                    </Button>
                    <Button variant="outline" onPress={() => { setIsMenuOpen(false); onRegister?.(); }}>
                      Registrar
                    </Button>
                  </View>
                </View>
              )}

              {user && (
                <View>
                  {menuItems.map(renderMenuItem)}
                </View>
              )}

              {user && (
                <TouchableOpacity
                  style={[styles.menuItem, { marginTop: 24 }]}
                  onPress={() => {
                    setIsMenuOpen(false);
                    onLogout?.();
                  }}
                >
                  <Text style={{ fontSize: 20 }}>🚪</Text>
                  <Text style={[styles.menuItemText, { color: colors.error[600] }]}>
                    Sair
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
