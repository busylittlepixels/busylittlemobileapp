import React, { useEffect} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Spacer from '@/app/components/Spacer';


const ViewBooking = ({ title, onPress }:any) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#90EE90' : 'green', // Dim the color when pressed
        },
        styles.button,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const EditBooking = ({ title, onPress }:any) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? 'lightgray' : 'gray', // Dim the color when pressed
        },
        styles.button,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};


const CalendarEventScreen = ({ navigation, route }:any) => {

  const wtftitle = route.params?.item.title; 
  const detail = route.params?.item.detail

  console.log('Calendar Event', route.params)

  useEffect(() => {
    navigation.setOptions({ title: wtftitle });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View>
      <Text style={styles.header}>{wtftitle ? wtftitle : 'Screen'}</Text>
      <Text>{detail ? detail : 'TBC'}</Text>
      <Spacer space={'20px'} />
      <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis fuga ex dolorum, quae porro totam perspiciatis corporis labore dolore tenetur id quisquam, voluptas ipsam vel earum. Porro, cum repellat. Explicabo dolor error in quis similique beatae necessitatibus sed eum, autem voluptas itaque mollitia voluptate esse, cumque accusantium eaque et numquam rerum, iure consectetur sint saepe veniam! Iusto voluptatem aut culpa amet, sunt eaque nihil suscipit deserunt ut et labore, corrupti voluptatum nesciunt similique consectetur doloribus.</Text>
      <Spacer space={'20px'} />
      <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis fuga ex dolorum, quae porro totam perspiciatis corporis labore dolore tenetur id quisquam, voluptas ipsam vel earum. Porro, cum repellat. Explicabo dolor error in quis similique beatae necessitatibus sed eum, autem voluptas itaque mollitia voluptate esse, cumque accusantium eaque et numquam rerum, iure consectetur sint saepe veniam! Iusto voluptatem aut culpa amet, sunt eaque nihil suscipit deserunt ut et labore, corrupti voluptatum nesciunt similique consectetur doloribus.</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 4, width:'100%', position:'relative', paddingVertical: 10 }}>
        <ViewBooking title="View Event Details" onPress={() => navigation.navigate('Camera')} />
        <EditBooking title="Edit Details" onPress={() => navigation.navigate('MyQR')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontWeight: 'bold',
    color: 'red', 
    fontSize: 24,
    paddingBottom: 10
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: '50%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  }
});

export default CalendarEventScreen;
