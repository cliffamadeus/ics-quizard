import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonAlert, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonSelect, IonSelectOption, IonItem } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const history = useHistory();

  const handleRegister = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match.');
      setShowAlert(true);
      return;
    }

    // Check if email domain is correct
    if (!email.endsWith('@nbsc.edu.ph')) {
      setAlertMessage('Only @nbsc.edu.ph emails are allowed.');
      setShowAlert(true);
      return;
    }

    // Show the confirmation alert to verify details
    setShowConfirmationAlert(true);
  };

  const confirmRegistration = async () => {
    // Proceed with registration if user confirms details
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
    } else {
      setAlertMessage('Registration successful! Please check your email to confirm your account.');
      setShowAlert(true);
      // Redirect to the login page after successful registration
      history.push('/ics-quizard/login');
    }

    setShowConfirmationAlert(false); // Close confirmation alert
  };

  const cancelRegistration = () => {
    setAlertMessage('Registration canceled.');
    setShowAlert(true);
    setShowConfirmationAlert(false); // Close confirmation alert
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/ics-quizard/login" />
          </IonButtons>
          <IonTitle>Register Student</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonItem>
          <IonInput label="Institutional Email" type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}>
            </IonInput>
        </IonItem>

        <IonItem>
          <IonInput
            label="First Name"
            type="text"
            placeholder="Enter First Name"
            value={firstName}
            onIonChange={(e) => setFirstName(e.detail.value!)}
          />
        </IonItem>
        
        <IonItem>
          <IonInput
            label="Middle Inititial"
            type="text"
            placeholder="Enter Middle Initial"
            value={middleInitial}
            onIonChange={(e) => setMiddleInitial(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Enter Last Name"
            type="text"
            placeholder="Enter Last Name"
            value={lastName}
            onIonChange={(e) => setLastName(e.detail.value!)}
          />
        </IonItem>
        
        <IonItem>
          <IonSelect
            label="Year Level"
            value={yearLevel}
            placeholder="Select Year Level"
            onIonChange={(e) => setYearLevel(e.detail.value!)}
          >
            <IonSelectOption value="1">1st Year</IonSelectOption>
            <IonSelectOption value="2">2nd Year</IonSelectOption>
            <IonSelectOption value="3">3rd Year</IonSelectOption>
            <IonSelectOption value="4">4th Year</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonInput
            label="Password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>
        
        <IonItem>
          <IonInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
          />
        </IonItem>
        
      
        <IonButton expand="full" onClick={handleRegister}>
          Register
        </IonButton>

        {/* Confirmation Alert */}
        <IonAlert
          isOpen={showConfirmationAlert}
          onDidDismiss={() => setShowConfirmationAlert(false)}
          header="Confirm Registration"
          message={`Please confirm your details:
            \nEmail: ${email}
            \nFirst Name: ${firstName}
            \nMiddle Initial: ${middleInitial}
            \nLast Name: ${lastName}
            \nYear Level: ${yearLevel}
            \n\nIs everything correct?`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: cancelRegistration,
            },
            {
              text: 'Confirm',
              handler: confirmRegistration,
            },
          ]}
        />

        {/* Alert for success or errors */}
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

export default Register;
