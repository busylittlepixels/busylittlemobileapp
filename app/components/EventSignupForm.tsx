import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';

const Step1 = ({ nextStep, formData, setFormData }: any) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Step 1: Personal Information</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter your name"
        value={formData.name}
        onChangeText={(value) => setFormData({ ...formData, name: value })}
        placeholderTextColor='#000'
        clearTextOnFocus={true}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter your email"
        value={formData.email}
        onChangeText={(value) => setFormData({ ...formData, email: value })}
        keyboardType="email-address"
        placeholderTextColor='#000'
        clearTextOnFocus={true}
        autoCapitalize="none"
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Step2 = ({ prevStep, nextStep, formData, setFormData, hostcity }: any) => {

  // console.log('step2 formData', formData)
  function capitalizeWords(str: string): string {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }


  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Step 2: Event Details</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder={'City'}
        value={capitalizeWords(formData.city)}
        onChangeText={(value) => setFormData({ ...formData, city: hostcity })}
        placeholderTextColor='#000'
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter event date"
        value={formData.eventDate}
        onChangeText={(value) => setFormData({ ...formData, eventDate: value })}
        placeholderTextColor='#000'
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Completion Estimate"
        value={formData.completionEstimate}
        onChangeText={(value) => setFormData({ ...formData, completionEstimate: value })}
        placeholderTextColor='#000'
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Step3 = ({ prevStep, nextStep, formData }: any) => {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Step 3: Confirm Details</Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>Name: {formData.name}</Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>Email: {formData.email}</Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>Event: {formData.eventName}</Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>Date: {formData.eventDate}</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={nextStep}>
          <Text style={styles.buttonText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Step4 = ({ prevStep, nextStep, formData }: any) => {
  const { confirmPayment, loading } = useConfirmPayment();
  const [cardDetails, setCardDetails] = useState({});
  const amount = 5000;
  const submit = async () => {
    // @ts-ignore
    if (!cardDetails?.complete) {
      Alert.alert('Please enter complete card details');
      return;
    }

    try {
      const response = await fetch('https://blpwebsite-2-0.vercel.app/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Amount in cents (1 Euro)
          email: formData.email,
          name: formData.name,
          city: formData.city
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        Alert.alert('Error', `Error creating payment intent: ${response.status}`);
        return;
      }

      const { clientSecret } = await response.json();

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        // @ts-ignore
        type: 'Card',
        paymentMethodType: 'Card', // Correctly specifying paymentMethodType
        billingDetails: {
          email: formData.email,
          name: formData.name,
          // Add more billing details if needed
        },
      });

      if (error) {
        console.error('Payment error:', error);
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        console.log('Payment successful:', paymentIntent);
        Alert.alert('Payment successful!', 'Thank you for your payment.');
        nextStep({ paymentIntent });
      }
    } catch (e) {
      console.error('Payment failed:', e);
      // @ts-ignore
      Alert.alert('Payment failed', e.message);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.sectionTitle}>Payment</Text>
      <Text style={styles.sectionTitle}>Total Amount Due: €{amount}</Text>
      
      <CardField
        postalCodeEnabled={false}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
        style={{ width: '100%', height: 50 }}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.8 : 1 },
          loading && { backgroundColor: '#ccc' }
        ]}
        onPress={submit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Pay'}</Text>
      </Pressable>
    </View>
  );
};


const Step5 = ({ formData }: any) => {
  const { paymentIntent } = formData;

  return (
    <View style={styles.stepContainer}>
      <Text style={{ color: '#fff', fontSize: 20 }}>Payment Complete!</Text>
      {paymentIntent && (
        <>
          <Text style={{ color: '#fff', marginTop: 10 }}>
            Payment ID: {paymentIntent.id}
          </Text>
          <Text style={{ color: '#fff', marginTop: 10 }}>
            Status: {paymentIntent.status}
          </Text>
        </>
      )}
      <Text style={{ color: '#fff', marginTop: 20 }}>
        Check 'My Entries' tab in your account for more details.
      </Text>
    </View>
  );
};

// In your main component
const EventSignupForm = ({ user, hostcity }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user ? user.user_metadata.full_name : '',
    email: user ? user.email : '',
    eventName: '',
    eventDate: '',
    city: hostcity,
  });

  const nextStep = (data = {}) => {
    setFormData(prevData => ({ ...prevData, ...data }));
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const submitForm = () => {
    console.log('Form submitted:', formData);
    setTimeout(() => {
      nextStep();
    }, 1500);
  };

  switch (step) {
    case 1:
      return <Step1 nextStep={nextStep} formData={formData} setFormData={setFormData} />;
    case 2:
      return <Step2 prevStep={prevStep} nextStep={nextStep} formData={formData} setFormData={setFormData} hostcity={hostcity} />;
    case 3:
      return <Step3 prevStep={prevStep} nextStep={nextStep} formData={formData} />;
    case 4:
      return <Step4 prevStep={prevStep} nextStep={nextStep} formData={formData} setFormData={setFormData} />;
    case 5:
      return <Step5 formData={formData} />;
    default:
      return <Step1 nextStep={nextStep} formData={formData} setFormData={setFormData} />;
  }
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    // padding: 16,
    backgroundColor: '#000', // Example background color
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  inputStyle: {
    marginTop: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    color: '#000',
    padding: 10,
    borderRadius: 3,
    width: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  button: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 2,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default EventSignupForm;
