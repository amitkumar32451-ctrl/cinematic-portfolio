export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Safe checks for Google Analytics (gtag)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }

  // Safe checks for PostHog (posthog)
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(eventName, properties);
  }

  // Console debug log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event]: ${eventName}`, properties);
  }
}
