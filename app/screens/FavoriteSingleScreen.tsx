import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { StyleSheet, Dimensions, Image, Platform, Pressable, Text, View, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import RenderHTML from 'react-native-render-html';

const baseStyles = {
    body: {
      whiteSpace: 'normal',
      color: '#fff',
      padding: 0
    }
};

export default function FavoritedArticleScreen({ navigation, route }:any) {

    console.log('item', route.params.item.article_title)
    
    useEffect(() => {
        navigation.setOptions({ title: route.params.item.article_title });
    }, [navigation]);
    

    // console.log(route.params);
    const { width } = Dimensions.get('window');
    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{route.params.item.article_title}</ThemedText>
        </ThemedView>
            <RenderHTML
              contentWidth={width}
              source={{ html: 'sadfasdf' }}
              // @ts-ignore
              tagsStyles={baseStyles}
            />
             
            <View>
                <Button title="Back to Articles" onPress={() => navigation.navigate('Account')} />
            </View>
       
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  link: {
    color: '#ffffff'
  },
  buttons: {
    display: 'flex',
    left: 0,
  },
});
