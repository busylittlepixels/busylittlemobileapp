// @ts-nocheck
import React from 'react';
import { Text, View } from 'react-native';
import { Hero } from './blocks/Hero'; // Ensure the path is correct
import { VerticalSpace } from './blocks/VerticalSpace';
import { TextBlock } from './blocks/TextBlock';
import { Columns } from './blocks/Columns';

type RenderBlocksProps = {
  content: Array<{
    type: string;
    props: any;
  }>;
};

// Define the RenderBlocks component
export const RenderBlocks = ({ content }: RenderBlocksProps) => {
  // Mapping of block types to components
  const components: { [key: string]: React.ComponentType<any> } = {
    Hero, // Ensure this matches the 'type' field in your content
    VerticalSpace,
    // Columns
  };

  // Iterate over the content array to dynamically render components
  const pageBlocks = content?.map((blockContent, index) => {
    console.log('blockContent:', blockContent); // Log the block content for debugging

    // Get the component based on blockContent.type
    const BlockComponent = components[blockContent.type];

    console.log('BlockComponent:', BlockComponent); // Log the BlockComponent to ensure it's correct

    if (BlockComponent) {
      // Render the component if it exists
      return <BlockComponent key={index} {...blockContent.props} />;
    }

    // Fallback for when the component doesn't exist
    return (
      <View key={index}>
        <Text>{blockContent.type} Not Found. Please check that the component exists.</Text>
        <Text>{JSON.stringify(blockContent, null, 2)}</Text>
      </View>
    );
  });

  return (
    <>
      {pageBlocks}
    </>
  );
};

export default RenderBlocks;
