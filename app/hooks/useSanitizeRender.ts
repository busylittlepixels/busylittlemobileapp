import React, { useMemo } from 'react';
import { decode } from 'html-entities'; // Use this to decode any HTML entities

function useSanitizeRender(jsonString: any) {

    return useMemo(() => {
        try {
            // Parse the input JSON string
            const parsed = JSON.parse(jsonString);

            // If the parsed content is already a string, no need to stringify again
            let safeString = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);

            // Sanitize the string
            safeString = safeString
                .replace(/\\n/g, "<br>")
                .replace(/\\'/g, "&apos;")
                .replace(/\\"/g, "&quot;")
                .replace(/\\\\/g, "\\"); // Adjusted to handle double backslashes correctly

            // Decode any HTML entities
            return decode(safeString); 
        } catch (error) {
            console.error('Failed to safely render content:', error);
            return jsonString; // Return the original string if parsing fails
        }
    }, [jsonString]);
}

export default useSanitizeRender;
