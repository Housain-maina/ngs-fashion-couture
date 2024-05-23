import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2022-03-07",
  useCdn: true, // Enable the Content Delivery Network (CDN) for faster responses
  token: process.env.EXPO_PUBLIC_SANITY_AUTH_TOKEN,
});

export default client;
