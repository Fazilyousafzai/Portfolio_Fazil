import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const ReportsScreen = ({ transactions }) => {
  const [timeFilter, setTimeFilter] = useState('thisMonth');
  const [chartType, setChartType] = useState('pie');
  const navigation = useNavigation();
  
  // Get screen width for responsive charts
  const screenWidth = Dimensions.get('window').width - 40;
  
  // Filter transactions based on selected time period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(transaction => {
      if (transaction.type !== 'expense') return false;
      
      const transactionDate = new Date(transaction.date);
      
      switch (timeFilter) {
        case 'thisMonth':
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        case 'lastMonth':
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return transactionDate.getMonth() === lastMonth && 
                 transactionDate.getFullYear() === lastMonthYear;
        case 'last3Months':
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(currentMonth - 3);
          return transactionDate >= threeMonthsAgo;
        case 'thisYear':
          return transactionDate.getFullYear() === currentYear;
        default:
          return true;
      }
    });
  }, [transactions, timeFilter]);
  
  // Calculate spending by category
  const spendingByCategory = useMemo(() => {
    const categories = {};
    
    filteredTransactions.forEach(transaction => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = 0;
      }
      categories[transaction.category] += transaction.amount;
    });
    
    // Sort categories by amount (highest first)
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({ category, amount }));
  }, [filteredTransactions]);
  
  // Calculate total spending
  const totalSpending = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [filteredTransactions]);
  
  // Generate chart data
  const chartData = useMemo(() => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC54B', '#FF5733', '#33FFF7', '#F033FF'
    ];
    
    // For pie chart
    const pieData = spendingByCategory.map((item, index) => ({
      name: item.category,
      amount: item.amount,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));
    
    // For bar chart
    const barData = {
      labels: spendingByCategory.slice(0, 5).map(item => item.category),
      datasets: [{
        data: spendingByCategory.slice(0, 5).map(item => item.amount)
      }]
    };
    
    // For line chart (daily spending)
    const dailySpending = {};
    filteredTransactions.forEach(transaction => {
      if (!dailySpending[transaction.date]) {
        dailySpending[transaction.date] = 0;
      }
      dailySpending[transaction.date] += transaction.amount;
    });
    
    const sortedDates = Object.keys(dailySpending).sort();
    const lineData = {
      labels: sortedDates.slice(-7).map(date => {
        const shortDate = new Date(date).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric'
        });
        return shortDate;
      }),
      datasets: [{
        data: sortedDates.slice(-7).map(date => dailySpending[date])
      }]
    };
    
    return { pieData, barData, lineData };
  }, [spendingByCategory, filteredTransactions]);
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };
  
  // Handle category press to navigate to detail
  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetail', { 
      category,
      transactions: filteredTransactions.filter(t => t.category === category)
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.label}>Time Period:</Text>
        <Picker
          selectedValue={timeFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setTimeFilter(itemValue)}
        >
          <Picker.Item label="This Month" value="thisMonth" />
          <Picker.Item label="Last Month" value="lastMonth" />
          <Picker.Item label="Last 3 Months" value="last3Months" />
          <Picker.Item label="This Year" value="thisYear" />
          <Picker.Item label="All Time" value="allTime" />
        </Picker>
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Spending</Text>
        <Text style={styles.summaryAmount}>${totalSpending.toFixed(2)}</Text>
      </View>
      
      <View style={styles.chartTypeContainer}>
        <TouchableOpacity 
          style={[styles.chartTypeButton, chartType === 'pie' && styles.activeChartType]} 
          onPress={() => setChartType('pie')}
        >
          <Text style={styles.chartTypeText}>Pie</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.chartTypeButton, chartType === 'bar' && styles.activeChartType]} 
          onPress={() => setChartType('bar')}
        >
          <Text style={styles.chartTypeText}>Bar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.chartTypeButton, chartType === 'line' && styles.activeChartType]} 
          onPress={() => setChartType('line')}
        >
          <Text style={styles.chartTypeText}>Line</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        {chartType === 'pie' && spendingByCategory.length > 0 ? (
          <PieChart
            data={chartData.pieData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : chartType === 'bar' && spendingByCategory.length > 0 ? (
          <BarChart
            data={chartData.barData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
          />
        ) : chartType === 'line' ? (
          <LineChart
            data={chartData.lineData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        ) : (
          <Text style={styles.noDataText}>No expense data available</Text>
        )}
      </View>
      
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Spending by Category</Text>
        
        {spendingByCategory.length > 0 ? (
          spendingByCategory.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(item.category)}
            >
              <View style={styles.categoryInfo}>
                <View 
                  style={[
                    styles.categoryColor, 
                    { backgroundColor: chartData.pieData[index % chartData.pieData.length].color }
                  ]} 
                />
                <Text style={styles.categoryName}>{item.category}</Text>
              </View>
              <View style={styles.categoryAmountContainer}>
                <Text style={styles.categoryAmount}>${item.amount.toFixed(2)}</Text>
                <Text style={styles.categoryPercentage}>
                  {((item.amount / totalSpending) * 100).toFixed(1)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No expense data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  summaryContainer: {
    backgroundColor: '#6200ee',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  chartTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  chartTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#eee',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeChartType: {
    backgroundColor: '#6200ee',
  },
  chartTypeText: {
    fontWeight: '500',
    color: '#555',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
    elevation: 2,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  categoryAmountContainer: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#888',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    padding: 20,
  },
});

export default ReportsScreen;