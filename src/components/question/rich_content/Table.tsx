import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { RichContentProps, TableContent } from './rich_content.type';

export const Table = ({ richContent, richContentAnim }: RichContentProps) => {
  if (!richContent?.data || !richContent?.head) return null;
  
  const tableContent = richContent as TableContent;
  const columnCount = tableContent.head.length;
  
  return (
    <Animated.View style={{ opacity: richContentAnim }}>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          {tableContent.head.map((header, index) => (
            <View 
              key={index} 
              style={[
                styles.columnContainer,
                { flex: 1 }
              ]}
            >
              <Text style={styles.tableHeaderText}>
                {header}
              </Text>
            </View>
          ))}
        </View>
        {tableContent.data.map((row, rowIndex) => (
          <View 
            key={rowIndex} 
            style={[
              styles.tableRow,
              rowIndex === tableContent.data.length - 1 && styles.lastRow
            ]}
          >
            {row.map((cell, colIndex) => (
              <View 
                key={colIndex}
                style={[
                  styles.columnContainer,
                  { flex: 1 }
                ]}
              >
                <Text 
                  style={[
                    styles.tableCell,
                    !isNaN(Number(cell)) && styles.numberCell
                  ]}
                >
                  {!isNaN(Number(cell)) ? Number(cell).toLocaleString() : cell}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      {richContent.title && (
        <Text style={styles.title}>
          {richContent.title}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f3f5',
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffd43b',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  columnContainer: {
    padding: 16,
    justifyContent: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  numberCell: {
    fontVariant: ['tabular-nums'],
    color: '#000',
    fontWeight: '600',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
});
