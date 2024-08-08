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

export default function ArticleScreen({ navigation, route }:any) {

    useEffect(() => {
        navigation.setOptions({ title: route.params.item.title.rendered });
    }, [navigation]);
    

    // console.log(route.params);
    const { width } = Dimensions.get('window');
    return (
        <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{route.params ? route.params.item.title.rendered : 'Title'}</ThemedText>
        </ThemedView>
            <RenderHTML
            contentWidth={width}
            source={{ html: route.params.item.content.rendered }}
            // @ts-ignore
            tagsStyles={baseStyles}
        />
             
            <View>
                <Button title="Back to Articles" onPress={() => navigation.navigate('Account')} />
            </View>
        {/* <Collapsible title="File-based routing">
            <ThemedText>
            This app has two screens:{' '}
            <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
            <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText>
            The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
            sets up the tab navigator.
            </ThemedText>
            <Pressable
            onPress={() => navigation.navigate('Settings')}
            //  @ts-expect-error
            style={styles.link}
            ><Text>Network</Text></Pressable>
        </Collapsible>
        <Collapsible title="Android, iOS, and web support">
            <ThemedText>
            You can open this project on Android, iOS, and the web. To open the web version, press{' '}
            <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
            </ThemedText>
        </Collapsible>
        <Collapsible title="Images">
            <ThemedText>
            For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
            <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
            different screen densities
            </ThemedText>
            <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
            <ExternalLink href="https://reactnative.dev/docs/images">
            <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
        </Collapsible>
        <Collapsible title="Custom fonts">
            <ThemedText>
            Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
            <ThemedText style={{ fontFamily: 'SpaceMono' }}>
                custom fonts such as this one.
            </ThemedText>
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
            <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
        </Collapsible>
        <Collapsible title="Light and dark mode components">
            <ThemedText>
            This template has light and dark mode support. The{' '}
            <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
            what the user's current color scheme is, and so you can adjust UI colors accordingly.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
            <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
        </Collapsible>
        <Collapsible title="Animations">
            <ThemedText>
            This template includes an example of an animated component. The{' '}
            <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
            the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
            to create a waving hand animation.
            </ThemedText>
            {Platform.select({
            ios: (
                <ThemedText>
                The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
                component provides a parallax effect for the header image.
                </ThemedText>
            ),
            })}
        </Collapsible> */}
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
