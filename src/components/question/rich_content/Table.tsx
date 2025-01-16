import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface TableProps {
  richContent: any;
  richContentAnim: Animated.Value;
}

export const Table = ({ richContent, richContentAnim }: TableProps) => {
  if (!richContent?.table) return null;
  
  return (
    <Animated.View style={{ opacity: richContentAnim }}>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          {Object.keys(richContent.table[0]).map((header, index) => (
            <Text 
              key={index} 
              style={[
                styles.tableCell, 
                styles.tableHeaderText,
                index === Object.keys(richContent.table[0]).length - 1 && styles.lastCell
              ]}
            >
              {header.charAt(0).toUpperCase() + header.slice(1)}
            </Text>
          ))}
        </View>
        {richContent.table.map((row: any, rowIndex: number) => (
          <View 
            key={rowIndex} 
            style={[
              styles.tableRow,
              rowIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
            ]}
          >
            {Object.values(row).map((value: any, colIndex: number) => (
              <Text 
                key={colIndex} 
                style={[
                  styles.tableCell,
                  colIndex === Object.values(row).length - 1 && styles.lastCell,
                  typeof value === 'number' && styles.numberCell
                ]}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#495057',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#fff',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
  },
  lastCell: {
    textAlign: 'right',
  },
  numberCell: {
    fontVariant: ['tabular-nums'],
  },
});
