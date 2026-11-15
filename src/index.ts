console.log("Christchurch training log starting");

const clientID = process.env.STRAVA_CLIENT_ID;

if (!clientID) {
  throw new Error("STRAVA_CLIENT_ID is not defined");
}
console.log("ClientID:", clientID);

const clientSecret = process.env.STRAVA_CLIENT_SECRET;

if (!clientSecret) {
  throw new Error("STRAVA_CLIENT_SECRET is not defined");
}

const link = new URL("https://www.strava.com/oauth/authorize");
link.searchParams.set("client_id", clientID);
link.searchParams.set("redirect_uri", "http://localhost:3000/callback");
link.searchParams.set("response_type", "code");
link.searchParams.set("scope", "activity:read_all");
link.searchParams.set("approval_prompt", "force");
console.log("Authorization link:", link.toString());
