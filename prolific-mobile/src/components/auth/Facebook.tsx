import { StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";
import { authStyles } from "./styles";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  
  // Check for code parameter first
  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    return data.session;
  }

  // Fallback to token handling
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      scopes: 'email,public_profile'
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};

export default function FacebookAuth() {
  // Handle linking into app from email app.
  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  return (
    <Button 
      title="Continue with Facebook"
      onPress={performOAuth}
      buttonStyle={[authStyles.button, styles.facebookButton]}
      titleStyle={styles.facebookButtonText}
      icon={{
        name: 'facebook',
        type: 'font-awesome',
        size: 18,
        color: 'white',
        style: { marginRight: 10 }
      }}
    />
  );
}

const styles = StyleSheet.create({
  facebookButton: {
    backgroundColor: '#1877F2',
    marginTop: 10,
  },
  facebookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});