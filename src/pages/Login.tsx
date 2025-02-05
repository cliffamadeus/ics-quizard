import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonText, IonRouterLink, useIonRouter } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useIonRouter();

  const handleLogin = async () => {
    if (!email.endsWith('@nbsc.edu.ph')) {
      setAlertMessage('Only @nbsc.edu.ph emails are allowed.');
      setShowAlert(true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
    } else {
      setAlertMessage('Login successful!');
      setShowAlert(true);
      // Redirect to another page or perform additional actions
      //history.push('/dashboard'); // Example: Redirect to a dashboard page
      navigation.push('/ics-quizard/app','root','replace');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Login</h1>
        <IonInput
          type="email"
          placeholder="Email"
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
        />
        <IonInput
          type="password"
          placeholder="Password"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
        <IonButton expand="full" onClick={handleLogin}>
          Login
        </IonButton>

        <IonText>
          <p>Don't have an account? <IonRouterLink routerLink="/ics-quizard/register">Register here</IonRouterLink></p>
        </IonText>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;