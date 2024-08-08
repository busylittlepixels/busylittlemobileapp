import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Pressable, ActivityIndicator } from 'react-native';
// import { supabase } from '../../supabase'; // Assume supabase is set up

const UserArticles = ({ navigation, filters }:any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const data = await response.json();
      
      // Apply filters if any
      const filteredData = filters ? data.filter((article: { [x: string]: any; }) => {
        // Replace with your filter logic
        return Object.keys(filters).every(key => article[key] === filters[key]);
      }) : data;

      setArticles(filteredData);
    } catch (err) {
        // @ts-ignore
      setError(err.message);
    }
    setLoading(false);
  };

  return (
   
    <View style={styles.articleList}>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <>
        <Text style={styles.innerContainer}>Articles:</Text>
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Pressable onPress={() => navigation.navigate('Article', { item })}>
                <Text style={styles.title}>{item.title}</Text>
              </Pressable>
            </View>
          )}
        />

        </>
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  articleList: {
    marginTop: 10,
  },
  innerContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 24
  },
  item: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10, 
    alignItems: 'center',
    gap: 4,
    padding: 16
  },
  inputStyle: {
    marginTop: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    color: '#000',
    padding: 10
  }
});

export default UserArticles;
