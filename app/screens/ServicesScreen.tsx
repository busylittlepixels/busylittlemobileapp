import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import RenderBlocks from '../components/RenderBlocks';

type DataContent = {
  blockType: string;
  props: any;
  readOnly?: any;
};

type Data = {
  content: DataContent[];
  root?: any;
  zones?: any;
};

const ServicesScreen = ({ navigation }: any) => {
  const [data, setData] = useState<Data | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/data/home');

      if (!response.ok) {
        console.error('Error fetching data:', response.status);
        return;
      }

      const data: Data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data?.content ? (
        // @ts-ignore
        <RenderBlocks content={data.content} />
      ) : (
        <Text>Loading data...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 16,
  },
  articleContainer: {
    marginBottom: 16,
  },
  articleText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ServicesScreen;
