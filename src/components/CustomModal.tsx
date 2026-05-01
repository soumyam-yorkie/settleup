import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

import { X, Check } from 'lucide-react-native';

import { theme } from '../utils/theme';

interface CustomModalProps {
  visible: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmIcon?: React.ReactNode;
  cancelLabel?: string;
  isDanger?: boolean;
}

export function CustomModal({
  visible,
  title,
  description,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Save',
  confirmIcon = <Check size={16} color={theme.colors.white} />,
  cancelLabel = 'Cancel',
  isDanger = false,
}: CustomModalProps) {
  const screenHeight = Dimensions.get('screen').height;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { height: screenHeight }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          </View>

          {description && (
            <Text style={styles.modalDescription}>{description}</Text>
          )}

          {children && <View style={styles.modalContent}>{children}</View>}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={onClose}
            >
              <Text style={styles.modalCancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
            
            {onConfirm && (
              <TouchableOpacity
                style={[
                  styles.modalConfirmBtn,
                  isDanger && styles.modalDangerBtn
                ]}
                onPress={onConfirm}
              >
                {confirmIcon}
                <Text style={styles.modalConfirmText}>{confirmLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.blackAlpha40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  modalCard: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: theme.spacing.xl,
    ...theme.shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  modalDescription: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  modalContent: {
    marginBottom: theme.spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
  },
  modalCancelBtn: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  modalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
  },
  modalDangerBtn: {
    backgroundColor: theme.colors.danger,
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
