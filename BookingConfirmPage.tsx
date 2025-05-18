import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapWithRoute from './MapGoogleAPi';

interface Booking {
  id: string;
  customer_name: string;
  technician_id: string;
  booking_date: string;
}

export default function ConfirmationPage() {
  const { bookingId } = useLocalSearchParams();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Incomplete' | 'Complete'>('Pending');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const resBooking = await fetch(`http://localhost:8000/booking/${bookingId}`);
        const bookingData = await resBooking.json();

        if (resBooking.ok) {
          setBooking(bookingData);

          const resPayment = await fetch(`http://localhost:8000/payment/status/${bookingId}`);
          const paymentData = await resPayment.json();
          const status = paymentData?.status || 'Pending';
          setPaymentStatus(status);

          if (status === 'Complete') {
            // ensure it moves to the next page after the status has changed
           /// setTimeout(() => router.push('/Components/Success'), 2000);
          } else {
            setTimeout(() => router.push('/Components/Payments'), 3000);
          }
        } else {
          setBooking(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Loading your booking details...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Booking not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconWrapper}>
        <Text style={styles.successIcon}>✅</Text>
      </View>

      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.subtitle}>Redirecting to next step...</Text>
      <Text style={styles.statusBar}>Payment Status: {paymentStatus}</Text>

      <View style={styles.card}>
        <InfoRow label="Booking ID" value={booking.id} />
        <InfoRow label="Customer Name" value={booking.customer_name} />
        <InfoRow label="Technician ID" value={booking.technician_id} />
        <InfoRow label="Booking Date" value={booking.booking_date} />
        <InfoRow
          label="Status"
          value="Technician successfully booked!"
          valueStyle={{ color: '#2ecc71', fontWeight: 'bold' }}
        />
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Route to Technician Location</Text>
      </View>
    </ScrollView>
  );
}

const InfoRow = ({
  label,
  value,
  valueStyle = {},
}: {
  label: string;
  value: string;
  valueStyle?: any;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'linear-gradient(#f0f4f8, #ffffff)',
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  backText: {
    fontSize: 16,
    color: '#1e40af',
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  successIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2ecc71',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  statusBar: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  mapContainer: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
});
