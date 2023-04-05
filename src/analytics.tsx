import ReactGA from "react-ga4";

const measurementId = "G-T7NNXD3KP2";

// Initialize Google Analytics
ReactGA.initialize(measurementId);

// Function to track page views
export const trackPageView = (url: string): void => {
  ReactGA.send({ hitType: "pageview", page: url });
};

// Function to track events
export const trackEvent = (action: string, params?: any): void => {
  ReactGA.event({ action, ...params });
};
