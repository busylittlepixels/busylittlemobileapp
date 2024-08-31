import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Alert } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';


const Step1 = ({ nextStep, formData, setFormData }:any) => {

  return (
    <View style={{ display: 'flex', flex: 1}}>
      <Text style={styles.sectionTitle}>Step 1: Personal Information</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter your name"
        value={formData.name}
        onChangeText={(value) => setFormData({ ...formData, name: value })}
        placeholderTextColor='#000'
        // @ts-ignore
        placeholderPadding="5px"
        clearTextOnFocus={true}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter your email"
        value={formData.email}
        onChangeText={(value) => setFormData({ ...formData, email: value })}
        keyboardType="email-address"
        placeholderTextColor='#000'
        // @ts-ignore
        placeholderPadding="5px"
        clearTextOnFocus={true}
        autoCapitalize={"none"}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={({ pressed }) => [
            styles.button, 
            { opacity: pressed ? 0.8 : 1 } // Visual feedback on press
          ]} 
          onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Step2 = ({ prevStep, nextStep, formData, setFormData }:any) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Step 2: Event Details</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder="City"
        value={formData.city}
        onChangeText={(value) => setFormData({ ...formData, city: value })}
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
        <Pressable style={({ pressed }) => [
            styles.button, 
            { opacity: pressed ? 0.8 : 1 } // Visual feedback on press
          ]} 
          onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [
            styles.button, 
            { opacity: pressed ? 0.8 : 1 } // Visual feedback on press
          ]} 
          onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

// const Step3 = ({ prevStep, nextStep, formData, setFormData }:any) => {
//   return (
//     <View>
//       <Text>Step 3: Third Step</Text>
//       <TextInput
//         style={styles.inputStyle}
//         placeholder="City"
//         value={formData.city}
//         onChangeText={(value) => setFormData({ ...formData, city: value })}
//       />
//       <TextInput
//         style={styles.inputStyle}
//         placeholder="Enter event name"
//         value={formData.eventName}
//         onChangeText={(value) => setFormData({ ...formData, eventName: value })}
//       />
//       <TextInput
//         style={styles.inputStyle}
//         placeholder="Enter event date"
//         value={formData.eventDate}
//         onChangeText={(value) => setFormData({ ...formData, eventDate: value })}
//       />
//       <TextInput
//         style={styles.inputStyle}
//         placeholder="Completion Estimate"
//         value={formData.eventDate}
//         onChangeText={(value) => setFormData({ ...formData, eventDate: value })}
//       />
//       {/* <Button title="Back" onPress={prevStep} />
//       <Button title="Next" onPress={nextStep} /> */}

//       <View style={styles.buttonContainer}>
//         <Pressable style={({ pressed }) => [
//             styles.button, 
//             { opacity: pressed ? 0.8 : 1 } // Visual feedback on press
//           ]} 
//           onPress={prevStep}>
//           <Text style={styles.buttonText}>Back</Text>
//         </Pressable>
//         <Pressable style={({ pressed }) => [
//             styles.button, 
//             { opacity: pressed ? 0.8 : 1 } // Visual feedback on press
//           ]} 
//           onPress={nextStep}>
//           <Text style={styles.buttonText}>Next</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

const Step3 = ({ prevStep, nextStep, formData }:any) => {
  return (
    <View>
      <View style={{ display: 'flex', backgroundColor: '#fff', padding: 10}}>
        <Text>Step 4: Confirm Details</Text>
        <Text>Name: {formData.name}</Text>
        <Text>Email: {formData.email}</Text>
        <Text>Event: {formData.eventName}</Text>
        <Text>Date: {formData.eventDate}</Text>
      </View> 
      <View style={styles.buttonContainer}>
        <Pressable style={({ pressed }) => [
            styles.button, 
            { opacity: pressed ? 0.8 : 1 } // Visual feedback on press
          ]} 
          onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [
            styles.button, 
            { opacity: pressed ? 0.8 : 1 } // Visual feedback on press
          ]} 
          onPress={nextStep}>
          <Text style={styles.buttonText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Step4 = ({ submitForm, formData }:any) => {
  const { confirmPayment, loading } = useConfirmPayment();
  const [cardDetails, setCardDetails] = useState(null);

    // This function will handle the payment process
    const submit = async () => {
      console.log('test')
      // @ts-ignore
      if (!cardDetails?.complete) {
        Alert.alert('Please enter complete card details');
        return;
      }
  
      try {
        // Make a request to your Next.js API route to create a payment intent
        const response = await fetch('https://blpwebsite-2-0.vercel.app/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 100, // Amount in cents (1 Euro)
          }),
        });
  
        const { clientSecret } = await response.json();
  
        // Confirm the payment with the client secret from the backend
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          //  @ts-ignore
          type: 'Card',
          billingDetails: {
            email: 'test@busylittlepixels.com',
          },
        });
  
        if (error) {
          Alert.alert(`Payment failed: ${error.message}`);
        } else if (paymentIntent) {
          Alert.alert('Payment successful!');
        }
      } catch (e) {
        // @ts-ignore
        Alert.alert(`Payment failed: ${e.message}`);
      }
  };

  return (
    <View style={{ flexDirection: "column"}}>
      <Text>Payment Screen</Text>
        <CardField
          postalCodeEnabled={false}
          onCardChange={(cardDetails):any => {
            console.log('card details', cardDetails);
            // @ts-ignore
            setCardDetails(cardDetails);
          }}
          style={{ width: '100%', height: 50 }}
        />
        <Pressable style={({ pressed }) => [
            styles.button, 
            { opacity: pressed ? 0.8 : 1 } // Visual feedback on press
          ]} 
          onPress={submit}>
          <Text style={styles.buttonText}>Pay</Text>
        </Pressable>
      
    </View>
  );
};

const Step5 = ({ formData }:any) => {
  return (
    <View>
      <Text>Payment Complete! Check 'My Entries' tab in your account</Text>
    </View>
  );
};

// In your main component
const EventSignupForm = ({ user }:any) => {
  // console.log('event form user', user.user_metadata.full_name)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user ? user.user_metadata.full_name : '',
    email: user ? user.email : '',
    eventName: '',
    eventDate: '',
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const submitForm = () => {
    console.log('Form submitted:', formData);
    setTimeout(() => {
      nextStep();
    }, 1500);
   
    // You can add form submission logic here, such as sending the data to a server
  };

  switch (step) {
    case 1:
      return <Step1 nextStep={nextStep} formData={formData} setFormData={setFormData} />;
    case 2:
      return <Step2 prevStep={prevStep} nextStep={nextStep} formData={formData} setFormData={setFormData} />;
    case 3:
      return <Step3 prevStep={prevStep} nextStep={nextStep} formData={formData} setFormData={setFormData} />;
    case 4:
        return <Step4 prevStep={prevStep} nextStep={nextStep} formData={formData} setFormData={setFormData} />;
    case 5:
      return <Step5 formData={formData} />;
    default:
      return <Step1 nextStep={nextStep} formData={formData} setFormData={setFormData} />;
  }
};


const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  label:{
    paddingTop: 10,
    fontWeight: 'bold'
  },
  formContainer:{
    flex: 3,
    marginTop: 20
  },
  innerContainer: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 10,
  },
  inputStyle: {
    marginTop: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    color: '#000',
    padding: 10,
    borderRadius:3, 
    width: '100%'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
	  marginBottom: 10,
    color: '#fff'
  },
  selectedCity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  }, 
  title: {
    fontWeight: 'bold',
    marginVertical: 5,
    fontSize: 18
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    borderWidth: 2, // Border thickness
    borderColor: 'green', // Border color
    borderRadius: 2, // Border radius
    paddingVertical: 10, // Vertical padding for better touch target
    alignItems: 'center', // Center text horizontally
    marginHorizontal: 5, // Space between buttons
  },
  buttonText: {
    color: 'green', // Text color
    fontWeight: 'bold',
  },
});


export default EventSignupForm;
