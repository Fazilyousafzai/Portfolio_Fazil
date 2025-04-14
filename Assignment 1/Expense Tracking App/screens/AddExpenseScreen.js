import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Predefined categories
const expenseCategories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 
  'Entertainment', 'Shopping', 'Health', 'Education', 
  'Travel', 'Personal', 'Other'
];

const incomeCategories = [
  'Salary', 'Bonus', 'Freelance', 'Investments', 
  'Gifts', 'Refunds', 'Other'
];

const AddExpenseScreen = ({ addTransaction }) => {
  const navigation = useNavigation();
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(transactionType === 'expense' ? 'Food' : 'Salary');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  // Update category when transaction type changes
  React.useEffect(() => {
    setCategory(transactionType === 'expense' ? 'Food' : 'Salary');
  }, [transactionType]);

  // Format date for display
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Validate form
  const validateForm = () => {
    let formErrors = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      formErrors.amount = 'Please enter a valid amount';
    }
    
    if (!category) {
      formErrors.category = 'Please select a category';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const newTransaction = {
        type: transactionType,
        amount: parseFloat(amount),
        category,
        date: formatDate(date),
        note
      };
      
      addTransaction(newTransaction);
      
      // Reset form
      setAmount('');
      setCategory(transactionType === 'expense' ? 'Food' : 'Salary');
      setDate(new Date());
      setNote('');
      
      // Navigate back to dashboard
      navigation.navigate('Dashboard');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView>
        {/* Transaction Type Toggle */}
        <View style={styles.card}>
          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[
                styles.segmentedControlOption,
                transactionType === 'expense' && styles.activeSegment
              ]}
              onPress={() => setTransactionType('expense')}
            >
              <Ionicons 
                name="arrow-down-circle-outline" 
                size={18} 
                color={transactionType === 'expense' ? '#fff' : '#6200ee'}
              />
              <Text 
                style={[
                  styles.segmentedControlText,
                  transactionType === 'expense' && styles.activeSegmentText
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.segmentedControlOption,
                transactionType === 'income' && styles.activeSegment
              ]}
              onPress={() => setTransactionType('income')}
            >
              <Ionicons 
                name="arrow-up-circle-outline" 
                size={18} 
                color={transactionType === 'income' ? '#fff' : '#6200ee'}
              />
              <Text 
                style={[
                  styles.segmentedControlText,
                  transactionType === 'income' && styles.activeSegmentText
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Amount Input */}
        <View style={styles.card}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>
        
        {/* Category Picker */}
        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              {(transactionType === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>
        
        {/* Date Picker */}
        <View style={styles.card}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Ionicons name="calendar-outline" size={24} color="#6200ee" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
        
        {/* Note Input */}
        <View style={styles.card}>
          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note..."
            multiline
          />
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSubmit}
        >
          <Text style={styles.addButtonText}>
            {transactionType === 'expense' ? 'Add Expense' : 'Add Income'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentedControlOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeSegment: {
    backgroundColor: '#6200ee',
  },
  segmentedControlText: {
    marginLeft: 5,
    fontWeight: '500',
    color: '#6200ee',
  },
  activeSegmentText: {
    color: '#fff',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  currencySymbol: {
    fontSize: 24,
    marginRight: 5,
    color: '#444',
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    paddingVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    minHeight: 100,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#6200ee',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
    marginTop: 5,
  },
});

export default AddExpenseScreen;