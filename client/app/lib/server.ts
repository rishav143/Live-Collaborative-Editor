declare const process: any;
export function getServerUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SERVER_URL;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.replace(/\/$/, "");
  // Fallback for production demo
  return "https://live-collaborative-editor-hrt4.onrender.com";
}


