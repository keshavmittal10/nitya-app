export default function Test() {
  return (
    <div style={{padding:20,fontFamily:'monospace',fontSize:14,background:'black',color:'lime',minHeight:'100vh'}}>
      <h2>Env Check</h2>
      <p>API_KEY: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'NOT SET'}</p>
      <p>AUTH_DOMAIN: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'NOT SET'}</p>
      <p>PROJECT_ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT SET'}</p>
    </div>
  );
}
