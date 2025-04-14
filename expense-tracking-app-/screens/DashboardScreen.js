// screens/DashboardScreen.js
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation, transactions }) => {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const balance = totalIncome - totalExpense;

  // Group transactions by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {});

  // Sort categories by amount spent
  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 categories

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // Latest 5 transactions

  return (
    <ScrollView style={styles.container}>
      {/* Balance Summary Card */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>Total Balance</Text>
          <Text style={styles.balance}>
            ${balance.toFixed(2)}
          </Text>
          <View style={styles.incomeExpenseRow}>
            <View style={styles.incomeContainer}>
              <Ionicons name="arrow-up-circle" size={20} color="green" />
              <Text style={styles.incomeText}>Income</Text>
              <Text style={styles.incomeAmount}>${totalIncome.toFixed(2)}</Text>
            </View>
            <View style={styles.expenseContainer}>
              <Ionicons name="arrow-down-circle" size={20} color="red" />
              <Text style={styles.expenseText}>Expenses</Text>
              <Text style={styles.expenseAmount}>${totalExpense.toFixed(2)}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Top Spending Categories */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Top Spending Categories</Text>
        {sortedCategories.map(([category, amount]) => (
          <TouchableOpacity 
            key={category}
            onPress={() => navigation.navigate('CategoryDetail', { category, transactions })}
          >
            <Card style={styles.categoryCard}>
              <Card.Content style={styles.categoryCardContent}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Transactions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.map((transaction) => (
          <Card key={transaction.id} style={styles.transactionCard}>
            <Card.Content style={styles.transactionCardContent}>
              <View style={styles.transactionLeft}>
                <Ionicons 
                  name={transaction.type === 'income' ? 'arrow-up-circle' : 'arrow-down-circle'} 
                  size={24} 
                  color={transaction.type === 'income' ? 'green' : 'red'} 
                />
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
              <Text 
                style={[
                  styles.transactionAmount, 
                  { color: transaction.type === 'income' ? 'green' : 'red' }
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#757575',
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  incomeExpenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeText: {
    marginLeft: 4,
    marginRight: 8,
    color: '#757575',
  },
  expenseText: {
    marginLeft: 4,
    marginRight: 8,
    color: '#757575',
  },
  incomeAmount: {
    color: 'green',
    fontWeight: 'bold',
  },
  expenseAmount: {
    color: 'red',
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  transactionCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDetails: {
    marginLeft: 12,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#757575',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;