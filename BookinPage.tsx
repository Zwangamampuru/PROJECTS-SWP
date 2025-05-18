import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Alert, StyleSheet, Image, ScrollView, TouchableOpacity, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
export default function BookingPage() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  const [introMessage, setIntroMessage] = useState('');
  const [technicians, setTechnicians] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    customer_name: '',
    technician_id: '',
    booking_date: today,
    email: '',
  });

  useEffect(() => {
    setIntroMessage('👋 Welcome! Start your technician booking below.');
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('http://localhost:8000/technicians');
      const data = await response.json();
      setTechnicians(data);
    } catch (err) {
      console.error('Failed to fetch technicians:', err);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { customer_name, email, technician_id, booking_date } = formData;
    if (!customer_name || !email || !technician_id || !booking_date) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8000/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Booking Confirmed', 'Your technician has been booked!', [
          {
            text: 'View Confirmation',
            onPress: () => router.push(`./Components/BookingConfirmPage${data.id}`),
          },
        ]);
      } else {
        Alert.alert('❌ Booking failed', data.detail || 'Unknown error');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Something went wrong while booking.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.intro}>{introMessage}</Text>

      <Image
        source={{ uri: 'https://picsum.photos/200?grayscale&random=plumbing' }}
        style={styles.image}
      />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="👤 Customer Name"
          value={formData.customer_name}
          onChangeText={(text) => handleChange('customer_name', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="📧 Email"
          value={formData.email}
          keyboardType="email-address"
          onChangeText={(text) => handleChange('email', text)}
        />

        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>🛠 Select Technician</Text>
          <Picker
            selectedValue={formData.technician_id}
            onValueChange={(value) => handleChange('technician_id', value)}
            style={Platform.OS === 'android' ? styles.pickerAndroid : undefined}
          >
            <Picker.Item label="-- Choose Technician --" value="" />
            {technicians.map((tech) => (
              <Picker.Item key={tech.id} label={tech.name} value={tech.id} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="📅 Booking Date (YYYY-MM-DD)"
          value={formData.booking_date}
          onChangeText={(text) => handleChange('booking_date', text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>📨 Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  intro: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
    color: '#333',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
    marginBottom: 28,
    borderWidth: 3,
    borderColor: '#4F46E5',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
  },
  pickerLabel: {
    padding: 12,
    fontSize: 16,
    color: '#555',
  },
  pickerAndroid: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
