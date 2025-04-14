import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryDetailScreen = ({ route }) => {
  const { category, transactions } = route.params;
  const [sortOrder, setSortOrder] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'
  
  // Sort transactions based on current sort order
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      if (sortOrder === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOrder === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOrder === 'amount-desc') {
        return b.amount - a.amount;
      } else if (sortOrder === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, sortOrder]);
  
  // Calculate total amount
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);
  
  // Calculate metrics
  const metrics = useMemo(() => {
    if (transactions.length === 0) return { average: 0, highest: 0, lowest: 0 };
    
    const amounts = transactions.map(t => t.amount);
    return {
      average: amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length,
      highest: Math.max(...amounts),
      lowest: Math.min(...amounts)
    };
  }, [transactions]);
  
  // Handle sorting
  const toggleSort = (sortType) => {
    if (sortOrder === `${sortType}-desc`) {
      setSortOrder(`${sortType}-asc`);
    } else {
      setSortOrder(`${sortType}-desc`);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Render a transaction item
  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
        <Text style={styles.transactionNote}>{item.note || 'No note'}</Text>
      </View>
      <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );
  
  // Empty list component
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No transactions found</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.categoryTitle}>{category} Expenses</Text>
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>${metrics.average.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Average</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>${metrics.highest.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Highest</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>${metrics.lowest.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Lowest</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{transactions.length}</Text>
            <Text style={styles.metricLabel}>Count</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortTitle}>Transactions</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => toggleSort('date')}
          >
            <Text style={styles.sortButtonText}>Date</Text>
            <Ionicons 
              name={sortOrder === 'date-asc' ? 'arrow-up-outline' : 'arrow-down-outline'} 
              size={16} 
              color={sortOrder.startsWith('date') ? '#6200ee' : '#999'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => toggleSort('amount')}
          >
            <Text style={styles.sortButtonText}>Amount</Text>
            <Ionicons 
              name={sortOrder === 'amount-asc' ? 'arrow-up-outline' : 'arrow-down-outline'} 
              size={16} 
              color={sortOrder.startsWith('amount') ? '#6200ee' : '#999'} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={sortedTransactions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    backgroundColor: '#6200ee',
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
  },
  categoryTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 15,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 3,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sortTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    padding: 5,
  },
  sortButtonText: {
    marginRight: 5,
    color: '#555',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  transactionNote: {
    fontSize: 13,
    color: '#888',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
});

export default CategoryDetailScreen;