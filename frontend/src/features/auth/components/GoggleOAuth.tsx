"use client";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Divider } from "@/shared/ui/custom/divider";

const GoggleOAuth = () => {
  return (
    <div className="grid gap-4 w-full">
      <Divider>
        <span className="px-3 font-medium">Or continue with</span>
      </Divider>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_OAUTH2_CLIENT_ID}>
        <GoogleLogin
          theme="outline"
          size="large"
          shape="circle"
          text="signup_with"
          onSuccess={() => {}}
          onError={() => {}}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoggleOAuth;
