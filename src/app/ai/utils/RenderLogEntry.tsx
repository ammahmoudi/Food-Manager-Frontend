interface LogData {
    [key: string]: string | number | boolean | LogData | LogData[];
  }
  
  // Utility function to render a single log entry
  export const renderLogEntry = (logEntry: string) => {
    let parsedLog: LogData | null = null;
  
    try {
      // Try parsing the full log entry
      parsedLog = JSON.parse(logEntry) as LogData;
    } catch (error) {
      // Log the error to the console for debugging purposes
      console.error("Error parsing log entry:", error);
      console.log("Invalid log entry:", logEntry);
  
      // If parsing fails, render each line as a preformatted text
      return (
        <pre className="text-red-500 whitespace-pre-wrap">
          {logEntry.split('\n').map((line, index) => (
            <span key={index}>
              {line || <br />} {/* Show empty lines as <br /> */}
            </span>
          ))}
        </pre>
      );
    }
  
    // Helper function to render data recursively with explicit types
    const renderDataRecursively = (data: LogData | string | number | boolean, keyPrefix = ''): JSX.Element[] | JSX.Element => {
      if (typeof data === 'object' && data !== null) {
        return Object.keys(data).map((key) => {
          const value = data[key];
          const prefixedKey = keyPrefix ? `${keyPrefix}.${key}` : key;
  
          // Recursively render nested objects
          if (typeof value === 'object' && value !== null) {
            return (
              <div key={prefixedKey}>
                <strong>{prefixedKey}:</strong>
                <div className="ml-4">
                  {Array.isArray(value)
                    ? value.map((item, index) => (
                        <div key={`${prefixedKey}[${index}]`}>
                          {renderDataRecursively(item, `${prefixedKey}[${index}]`)}
                        </div>
                      ))
                    : renderDataRecursively(value, prefixedKey)}
                </div>
              </div>
            );
          }
  
          // Render key-value pair for non-object types
          return (
            <div key={prefixedKey}>
              <strong>{prefixedKey}:</strong> {String(value)}
            </div>
          );
        });
      }
  
      // Render primitive types directly
      return <span>{String(data)}</span>;
    };
  
    // Render the parsed JSON data if parsing was successful
    return (
      <div className="p-2 mb-2 bg-gray-50 border border-gray-200 rounded-md">
        {renderDataRecursively(parsedLog)}
      </div>
    );
  };
  