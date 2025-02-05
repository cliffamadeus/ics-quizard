import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonText, IonRouterLink, useIonRouter, IonInputPasswordToggle, IonAvatar, IonCol, IonGrid, IonRow } from '@ionic/react';
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
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }
  
    // Fetch student details from the database
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('first_name, email')
      .eq('email', email)
      .single();
  
    if (studentError || !student) {
      setAlertMessage('User data not found.');
      setShowAlert(true);
      return;
    }
  
    // Store user data in session storage
    sessionStorage.setItem('userFirstName', student.first_name);
    sessionStorage.setItem('userEmail', student.email);
  
    setAlertMessage(`Welcome, ${student.first_name}! You have successfully logged in.`);
    setShowAlert(true);
  
    // Redirect to the app dashboard
    navigation.push('/ics-quizard/app', 'root', 'replace');
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class='ion-text-center'>ICS Quizard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <IonAvatar style={{ 
            border: '1px solid #007bff',   
            boxShadow: '0px 4px 10px rgba(0, 123, 255, 0.5)',  
          }}>
              <img alt="Silhouette of a person's head" src="https://static.vecteezy.com/system/resources/previews/023/783/837/non_2x/wizard-logo-icon-design-vector.jpg" />
            </IonAvatar>
          </div>

        <h3 className='ion-text-center'>Student Login</h3>
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
        >
        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
        </IonInput> 
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