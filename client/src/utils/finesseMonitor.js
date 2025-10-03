/**
 * Cisco Finesse Monitoring Utility
 * 
 * This utility monitors the Cisco Finesse interface for wrong number dialing
 * and sends notifications when detected.
 */

// Configuration
const CISCO_DOMAIN = process.env.REACT_APP_CISCO_FINESSE_DOMAIN || '10.190.221.36';
const CHECK_INTERVAL = 2000; // Check every 2 seconds

// Regular expressions for validating phone numbers
const VALID_US_NUMBER_REGEX = /^\+?1[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/;
const VALID_INTL_NUMBER_REGEX = /^\+(?:[0-9] ?){6,14}[0-9]$/;

/**
 * Initialize Finesse monitoring
 * @param {Object} config - Configuration object
 * @param {string} config.agentId - Agent ID
 * @param {Object} config.socket - Socket.io connection
 * @param {Function} config.onWrongNumber - Callback for wrong number detection
 */
export const initFinesseMonitoring = (config) => {
  const { agentId, socket, onWrongNumber } = config;
  
  console.log('Starting Cisco Finesse monitoring...');
  
  // Function to check for dialed numbers
  const checkDialedNumbers = () => {
    try {
      // In a real implementation, this would use browser APIs to monitor the Finesse interface
      // For this demo, we'll simulate by monitoring DOM elements that would contain dialed numbers
      
      // This is a placeholder for the actual DOM monitoring code
      // In a real implementation, you would use MutationObserver or similar to watch for changes
      
      // Example of how the real implementation might work:
      const dialPadElements = document.querySelectorAll('.finesse-dialpad-input, .finesse-outbound-call');
      
      dialPadElements.forEach(element => {
        // Extract the dialed number from the element
        const dialedNumber = element.textContent || element.value;
        
        if (dialedNumber && dialedNumber.length > 5) {
          // Check if it's a valid number format
          const isValidUS = VALID_US_NUMBER_REGEX.test(dialedNumber);
          const isValidIntl = VALID_INTL_NUMBER_REGEX.test(dialedNumber);
          
          // If it's not a valid format, report it
          if (!isValidUS && !isValidIntl) {
            let reason = 'Invalid number format';
            
            // Check specifically for missing US country code
            if (dialedNumber.match(/^\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/)) {
              reason = 'Missing country code (US)';
            }
            
            console.log(`Wrong number detected: ${dialedNumber}, Reason: ${reason}`);
            
            // Call the callback with the wrong number details
            onWrongNumber(dialedNumber, reason);
          }
        }
      });
    } catch (error) {
      console.error('Error monitoring Finesse:', error);
    }
  };
  
  // Set up interval to check regularly
  const monitoringInterval = setInterval(checkDialedNumbers, CHECK_INTERVAL);
  
  // Set up event listeners for Finesse interface interactions
  const setupEventListeners = () => {
    // This is a placeholder for real event listeners
    // In a real implementation, you would add listeners to the Finesse interface elements
    
    // Example:
    document.addEventListener('click', (e) => {
      // Check if the click was on a dial button or similar
      if (e.target.matches('.finesse-dial-button, .finesse-make-call-button')) {
        // Get the associated number input
        const numberInput = e.target.closest('.finesse-call-container').querySelector('input');
        if (numberInput) {
          const dialedNumber = numberInput.value;
          
          // Check if it's a valid number format
          const isValidUS = VALID_US_NUMBER_REGEX.test(dialedNumber);
          const isValidIntl = VALID_INTL_NUMBER_REGEX.test(dialedNumber);
          
          if (!isValidUS && !isValidIntl) {
            let reason = 'Invalid number format';
            
            // Check specifically for missing US country code
            if (dialedNumber.match(/^\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/)) {
              reason = 'Missing country code (US)';
            }
            
            console.log(`Wrong number detected: ${dialedNumber}, Reason: ${reason}`);
            
            // Call the callback with the wrong number details
            onWrongNumber(dialedNumber, reason);
          }
        }
      }
    });
  };
  
  // Set up MutationObserver to detect changes in the Finesse interface
  const setupMutationObserver = () => {
    // This is a placeholder for a real MutationObserver
    // In a real implementation, you would observe changes to the Finesse interface
    
    // Example:
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Check if the change involves a dialed number
          checkDialedNumbers();
        }
      }
    });
    
    // Start observing the Finesse interface
    const finesseInterface = document.querySelector('#finesse-container');
    if (finesseInterface) {
      observer.observe(finesseInterface, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        characterData: true
      });
    }
    
    return observer;
  };
  
  // Initialize event listeners and observers
  setupEventListeners();
  const observer = setupMutationObserver();
  
  // Return a cleanup function
  return () => {
    clearInterval(monitoringInterval);
    if (observer) observer.disconnect();
    // Remove any event listeners here
  };
};