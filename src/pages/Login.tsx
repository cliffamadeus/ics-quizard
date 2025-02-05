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
     
      <IonContent className="ion-padding" style={{ }} >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', marginTop: '35%' }}>
          <IonAvatar 
            style={{ 
              boxShadow: '0px 2px 10px rgba(0, 123, 255, 0.5)',  
              width: '30vw',  
              height: '30vw', 
              overflow: 'hidden',
              marginTop:'-4rem'  
            }}
          >
            <img 
              alt="Silhouette of a person's head" 
              src="https://raw.githubusercontent.com/cliffamadeus/ics-quizard/refs/heads/feature/loginAuth/src/img/logo.PNG"
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'cover'  
              }} 
            />
          </IonAvatar>
          </div>
        <br></br>
        <h1 className='ion-text-center'>ICS QUIZARD</h1>
        <h4 className='ion-text-center'>Student Login</h4>
        <IonInput
          type="email"
          labelPlacement="floating" 
          fill="outline"
          label="Institutional Email"
          placeholder="email@nbsc.edu.ph"
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
        />
        <br></br>
        <IonInput
          type="password"
          labelPlacement="floating" 
          fill="outline"
          label="Password"
          placeholder="Enter Password"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
        >
        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
        </IonInput> 

        <br></br>
        <IonButton expand="full" onClick={handleLogin}  shape="round">
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