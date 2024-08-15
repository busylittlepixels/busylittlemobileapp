// /* eslint-disable @next/next/no-img-element */
// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Image,
//   StatusBar,
//   ScrollView,
//   View,
//   Text, 
//   Pressable,
// } from 'react-native';
// import { ComponentConfig } from "@measured/puck";
// import Section from "../../Section";
// import { quotes } from "../../../quotes";


// export type HeroProps = {
//   quote?: { index: number; label: string };
//   title: string;
//   description: string;
//   align?: string;
//   padding: string;
//   image?: {
//     mode?: "inline" | "background";
//     url?: string;
//   };
//   buttons: {
//     label: string;
//     href: string;
//     variant?: "primary" | "secondary";
//     more?: { text: string }[];
//   }[];
// };

// export const Hero: ComponentConfig<HeroProps> = {
//   fields: {
//     quote: {
//       type: "external",
//       placeholder: "Select a quote",
//       showSearch: true,
//       filterFields: {
//         author: {
//           type: "select",
//           options: [
//             { value: "", label: "Select an author" },
//             { value: "Danger Ro", label: "Danger Fuckin' Ro"},
//             { value: "Jurgen Klopp", label: "Jurgen Klopp" },
//             { value: "Mark Twain", label: "Mark Twain" },
//             { value: "Henry Ford", label: "Henry Ford" },
//             { value: "Kurt Vonnegut", label: "Kurt Vonnegut" },
//             { value: "Andrew Carnegie", label: "Andrew Carnegie" },
//             { value: "C. S. Lewis", label: "C. S. Lewis" },
//             { value: "Confucius", label: "Confucius" },
//             { value: "Eleanor Roosevelt", label: "Eleanor Roosevelt" },
//             { value: "Samuel Ullman", label: "Samuel Ullman" },
//           ],
//         },
//       },
//       fetchList: async ({ query, filters }:any) => {
//         // Simulate delay
//         await new Promise((res) => setTimeout(res, 500));

//         return quotes
//           .map((quote, idx) => ({
//             index: idx,
//             title: quote.author,
//             description: quote.content,
//           }))
//           .filter((item) => {
//             if (filters?.author && item.title !== filters?.author) {
//               return false;
//             }

//             if (!query) return true;

//             const queryLowercase = query.toLowerCase();

//             if (item.title.toLowerCase().indexOf(queryLowercase) > -1) {
//               return true;
//             }

//             if (item.description.toLowerCase().indexOf(queryLowercase) > -1) {
//               return true;
//             }
//           });
//       },
//       mapRow: (item: { title: any; description: any; }) => ({ title: item.title, description: item.description }),
//       mapProp: (result: { index: any; description: any; }) => {
//         return { index: result.index, label: result.description };
//       },
//       getItemSummary: (item: { label: any; }) => item.label,
//     },
//     title: { type: "text" },
//     description: { type: "textarea" },
//     buttons: {
//       type: "array",
//       min: 1,
//       max: 4,
//       getItemSummary: (item: { label: any; }) => item.label || "Button",
//       arrayFields: {
//         label: { type: "text" },
//         href: { type: "text" },
//         variant: {
//           type: "select",
//           options: [
//             { label: "primary", value: "primary" },
//             { label: "secondary", value: "secondary" },
//           ],
//         },
//       },
//       defaultItemProps: {
//         label: "Button",
//         href: "#",
//       },
//     },
//     align: {
//       type: "radio",
//       options: [
//         { label: "Left", value: "left" },
//         { label: "Center", value: "center" },
//         { label: "Right", value: "right" },
//       ],
//     },
//     image: {
//       type: "object",
//       objectFields: {
//         url: { type: "text" },
//         mode: {
//           type: "radio",
//           options: [
//             { label: "inline", value: "inline" },
//             { label: "background", value: "background" },
//           ],
//         },
//       },
//     },
//     padding: { type: "text" },
//   },
//   defaultProps: {
//     title: "Hero",
//     align: "left",
//     description: "Description",
//     buttons: [{ label: "Learn more", href: "#" }],
//     padding: "64px",
//   },
//   /**
//    * The resolveData method allows us to modify component data after being
//    * set by the user.
//    *
//    * It is called after the page data is changed, but before a component
//    * is rendered. This allows us to make dynamic changes to the props
//    * without storing the data in Puck.
//    *
//    * For example, requesting a third-party API for the latest content.
//    */
//   resolveData: async ({ props }:any, { changed }:any) => {
//     if (!props.quote)
//       return { props, readOnly: { title: false, description: false } };

//     if (!changed.quote) {
//       return { props };
//     }

//     // Simulate a delay
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     return {
//       props: {
//         title: quotes[props.quote.index].author,
//         description: quotes[props.quote.index].content,
//       },
//       readOnly: { title: true, description: true },
//     };
//   },
//   //   @ts-ignore
//   resolveFields: async (data, { fields }) => {
//     if (data.props.align === "center") {
//       return {
//         ...fields,
//         image: undefined,
//       };
//     }

//     return fields;
//   },
//   render: ({ align, title, description, buttons, padding, image }:any) => {
//     // Empty state allows us to test that components support hooks
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const [_] = useState(0);

//     const additionalClasses = align;

//     return (
//       <Section
//         padding={padding}
//         className={`Hero`}
//       >
//         {image?.mode === "background" && (
//           <>
//             <div
//               className={"image"}
//               style={{
//                 backgroundImage: `url("${image?.url}")`,
//               }}
//             ></div>

//             <div className={"imageOverlay"}></div>
//           </>
//         )}

//         <div className={`inner ${additionalClasses}`}>

          
//           <div className={"flex flex-col gap-2 w-full"}>
//             <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">{title}</h1>
//             <p className={"subtitle"}>{description}</p>
//             <div className={"actions"}>
             
//               {/* {buttons.map(({button, i}:any) => (
//                 <Pressable
//                   key={id}
//                   onPress={() => !isCitySelected && handleCityToggle(city.name)} // Disable press if already selected
//                   disabled={isCitySelected} // Disable pressable for already selected cities
//                 >
//                   href={button.href}
//                 </Pressable>
//                 <Pressable
//                   key={id}
//                   onPress={() => !isCitySelected && handleCityToggle(city.name)} // Disable press if already selected
//                   disabled={isCitySelected} // Disable pressable for already selected cities
//                 >
//                   variant={button.variant}
//                   size="large"
//                   // @ts-ignore
//                   className="flex"
//                 >
//                   {button.label}
//                 </Pressable>
                
//               ))} */}
//             </div>
//           </div>

//           {align !== "center" && image?.mode !== "background" && image?.url && (
//             <div
//               style={{
//                 backgroundImage: `url('${image?.url}')`,
//                 backgroundSize: "cover",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center",
//                 borderRadius: 24,
//                 height: 356,
//                 marginLeft: "auto",
//                 width: "100%",
//               }}
//             />
//           )}
//         </div>
//       </Section>
//     );
//   },
// };

// // blocks/Hero.tsx
import React from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  View,
  Text, 
  Pressable,
} from 'react-native';
import { ComponentConfig } from "@measured/puck";

const Hero = ({ title, description }: { title: string; description: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <Text>{title}</Text>
        <Text>{description}</Text>
      </View>
    </View>
  );
};

export { Hero };

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes full height of the screen
    flexDirection: 'row',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#f8f8f8', // Background color (optional)
  },
  // Centered view inside the container
  centeredView: {
    width: '100%', // Full width of the parent container
    backgroundColor: 'green', // Background color for the centered view
    padding: 20, // Padding inside the view
    // borderRadius: 8, // Optional: Rounded corners
    shadowColor: '#000', // Shadow color (optional for iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (optional for iOS)
    shadowOpacity: 0.2, // Shadow opacity (optional for iOS)
    shadowRadius: 4, // Shadow radius (optional for iOS)
    elevation: 5, // Shadow elevation (optional for Android)
  },
  // Text inside the centered view
  text: {
    textAlign: 'center', // Center text horizontally
    fontSize: 16, // Font size
    color: '#333', // Text color
  },
});