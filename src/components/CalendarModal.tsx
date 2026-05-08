import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Dimensions
} from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

interface CalendarModalProps {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

export const CalendarModal = ({ visible, initialDate, onClose, onSelect }: CalendarModalProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onSelect(selectedDate);
    onClose();
  };

  const renderDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    // Fill empty slots for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayBox} />);
    }

    // Fill days of the current month
    for (let d = 1; d <= totalDays; d++) {
      const isSelected = 
        selectedDate.getDate() === d && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;
      
      const isToday = 
        new Date().getDate() === d && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;

      days.push(
        <TouchableOpacity 
          key={d} 
          style={[styles.dayBox, isSelected && styles.selectedDay]}
          onPress={() => handleDateSelect(d)}
        >
          <Text style={[
            styles.dayText, 
            isSelected && styles.selectedDayText,
            isToday && !isSelected && styles.todayText
          ]}>
            {d}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
              <ChevronLeft size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <ChevronRight size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDaysRow}>
            {weekDays.map(d => (
              <Text key={d} style={styles.weekDayText}>{d}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {renderDays()}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Select Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.9,
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: 20,
    ...theme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDayText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.outline,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayBox: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  selectedDay: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
  },
  selectedDayText: {
    color: theme.colors.white,
    fontWeight: '800',
  },
  todayText: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  footer: {
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
